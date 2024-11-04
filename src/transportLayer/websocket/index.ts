import EventBus from "@/utils/eventBus";
import type {
  ATransportLayer,
  IConnectOpts,
  IConnectStatus,
  ITransportLayerEvent,
  TransportLayerEventName,
} from "../index";

export class WS implements ATransportLayer {
  #opts: IConnectOpts; // 连接配置
  #_connectStatus: IConnectStatus; // 连接状态
  #wsInstance: WebSocket | undefined; // 连接实例
  #stayConnected: boolean; // 保持连接
  #connectMicrotasks: Array<
    [
      (value: boolean | PromiseLike<boolean>) => void,
      (reason?: unknown) => void
    ]
  > = []; // 连接任务
  #lastConnectErr: unknown;
  #eventbus: EventBus<ITransportLayerEvent>;
  #destroyReconnectTask: undefined | (() => void);

  constructor(o: IConnectOpts) {
    this.#opts = o;

    this.#_connectStatus = "DISCONNECTED";
    this.#stayConnected = false;
    this.#connectMicrotasks = [];
    this.#eventbus = new EventBus<ITransportLayerEvent>();
  }

  get #connectStatus() {
    return this.#_connectStatus;
  }
  set #connectStatus(v: IConnectStatus) {
    if (this.#_connectStatus !== v) {
      this.#_connectStatus = v;

      switch (v) {
        case "CONNECTED":
          this.#connectMicrotasks.forEach(([resolve]) => {
            resolve(true);
          });
          this.#connectMicrotasks = [];
          break;

        case "DISCONNECTED":
          this.#connectMicrotasks.forEach(([, reject]) => {
            reject(this.#lastConnectErr);
          });
          this.#connectMicrotasks = [];
          break;

        case "RECONNECTING":
          this.#reconnectTask();
          break;

        default:
          break;
      }
    }
  }

  /**
   * 连接任务
   * */
  #connectTask() {
    return new Promise((resolve, reject) => {
      this.#wsInstance = new WebSocket(this.#opts?.brokerUrl || "");

      this.#wsInstance.binaryType = "arraybuffer";

      this.#wsInstance.onopen = () => {
        resolve(true);
        this.#connectStatus = "CONNECTED";
      };

      const connectFailed = (ev: unknown) => {
        reject(ev);
        this.#lastConnectErr = ev;

        if (this.#stayConnected) {
          this.#connectStatus = "RECONNECTING";
        } else {
          this.#connectStatus = "DISCONNECTED";
        }
      };

      this.#wsInstance.onclose = (ev) => {
        connectFailed(ev);

        console.info(
          `[ws][connectTask] onclose, code = ${ev.code}, reason = ${ev.reason}`
        );
      };

      this.#wsInstance.onerror = (ev) => {
        connectFailed(ev);

        console.info(`[ws][connectTask] onerror, err = ${JSON.stringify(ev)}`);
      };

      this.#wsInstance.onmessage = (ev) => {
        console.log(ev);
      };
    });
  }

  /**
   * 发起一次连接
   * @param opt
   */
  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.#connectStatus === "CONNECTED") {
        // 已连接成功
        return resolve(true);
      } else if (
        this.#connectStatus === "CONNECTING" ||
        this.#connectStatus === "RECONNECTING"
      ) {
        // 正在连接中，等待连接成功
        this.#connectMicrotasks.push([resolve, reject]);
      } else {
        this.#stayConnected = true;
        this.#connectStatus = "CONNECTING";
        this.#connectTask()
          .then(() => {
            resolve(true);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }

  /**
   * 重连任务
   * */
  #reconnectTask() {
    this.#destroyReconnectTask?.();

    const timer = setTimeout(() => {
      this.#connectTask().catch(() => {
        // 连接任务失败，继续重连
        this.#reconnectTask();
      });
    }, 5000);

    this.#destroyReconnectTask = () => {
      this.#destroyReconnectTask = undefined;
      clearTimeout(timer);
    };
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    this.#stayConnected = false;
    this.#lastConnectErr = undefined;
    this.#connectStatus = "DISCONNECTED";
    this.destroy();
  }

  /**
   * 发送数据
   * @param topic
   * @param data
   */
  send(data: Uint8Array) {
    this.#wsInstance?.send(data);
  }

  /**
   * 监听事件
   * @param name
   * @param handle
   */
  addEventListener<K extends TransportLayerEventName>(
    name: K,
    handle: ITransportLayerEvent[K]
  ) {
    return this.#eventbus.on(name, handle);
  }

  /**
   * 销毁
   */
  destroy() {
    // 销毁ws实例
    if (this.#wsInstance) {
      this.#wsInstance.onopen = null;
      this.#wsInstance.onclose = null;
      this.#wsInstance.onerror = null;
      this.#wsInstance.onmessage = null;
      this.#wsInstance.close();
      this.#wsInstance = undefined;
    }

    this.#destroyReconnectTask?.();
  }

  /**
   * 获取连接状态
   * */
  getConnectStatus(): IConnectStatus {
    return this.#connectStatus;
  }
}

export default WS;
