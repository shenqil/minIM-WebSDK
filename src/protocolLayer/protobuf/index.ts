/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-05-11 16:48:46
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-20 20:29:27
 * @FilePath: \PeachyTalk-IM-SDK\lib\protocolLayer\protobuf\index.ts
 * @Description: 协议层实现
 */

import EventBus from "../../utils/eventBus";
import {
  AProtocolLayer,
  EProtocolLayerEventName,
  IProtocolLayerEvent,
  IProtocolOpts,
  LoginPack,
  ResponsePack,
  PackData,
  PackType,
} from "../index";
import {
  ATransportLayer,
  ETransportLayerEventName,
  ITransportLayerEvent,
  ITransportLayerEventNameKey,
} from "../../transportLayer/index";
import TransportLayer from "../../transportLayer/websocket/index";
import log from "../../utils/log";
import { getCMsgId } from "../../utils/common";

class ProtocolLayer implements AProtocolLayer {
  #opts: IProtocolOpts; // 协议层配置

  #fromId: number;

  #transportInstance: ATransportLayer;
  // 事件
  #eventBus: EventBus<IProtocolLayerEvent> =
    new EventBus<IProtocolLayerEvent>();

  // 内部事件
  #internalEvents: EventBus<{ [key: string]: (...args: unknown[]) => void }> =
    new EventBus();

  constructor(o: IProtocolOpts) {
    this.#opts = o;

    this.#fromId = 0;

    this.#transportInstance = new TransportLayer(this.#opts);

    this.#transportInstance.addEventListener(
      ETransportLayerEventName.MESSAGE_RECEIVED,
      (data) => {
        const packData = PackData.fromBinary(data);

        switch (packData.type) {
          case PackType.RESPONSE:
            const response = ResponsePack.fromBinary(packData.payload);
            this.#internalEvents.emit(packData.id, response);
            break;

          default:
            log.info(
              `[protobuf][constructor] 未处理消息, type = ${packData.type}`
            );
            break;
        }
      }
    );

    // 抛出内部所有事件
    Object.keys(ETransportLayerEventName).forEach((key) => {
      const name =
        EProtocolLayerEventName[key as unknown as ITransportLayerEventNameKey];

      if (name !== "MESSAGE_RECEIVED") {
        this.#transportInstance.addEventListener(
          name,
          (...args: Parameters<ITransportLayerEvent[typeof name]>) => {
            this.#eventBus.emit(name, ...args);
          }
        );
      }
    });
  }

  #sendData(type: PackType, payload: Uint8Array) {
    const msg = PackData.create({
      id: getCMsgId(),
      from: this.#fromId,
      type,
      payload,
      timestamp: BigInt(Date.now()),
    });

    this.#transportInstance.send(PackData.toBinary(msg));
  }

  async #invoke(
    type: PackType,
    payload: Uint8Array,
    waitTime = 3000
  ): Promise<ResponsePack> {
    return new Promise((resolve, reject) => {
      let cancelFn: undefined | (() => void) = undefined;

      const msg = PackData.create({
        id: type === PackType.MESSAGE ? getCMsgId() : type.toString(),
        from: this.#fromId,
        type,
        payload,
        timestamp: BigInt(Date.now()),
      });

      this.#transportInstance.send(PackData.toBinary(msg));
      const offFn = this.#internalEvents.once(msg.id, (res) => {
        cancelFn?.();
        resolve(res as ResponsePack);
      });

      if (waitTime) {
        const timer = setTimeout(() => {
          cancelFn?.();
          reject("timeout");
        }, waitTime);

        cancelFn = () => {
          clearTimeout(timer);
          offFn();
        };
      }
    });
  }

  /**
   * 开始登陆
   * @param info
   */
  async login(info: LoginPack): Promise<boolean> {
    this.#fromId = info.uid;

    await this.#transportInstance.connect();

    const res = await this.#invoke(PackType.LOGIN, LoginPack.toBinary(info));
    if (res.code) {
      throw new Error(res.payload);
    }

    return true;
  }

  /**
   * 退出登陆
   */
  async logout(): Promise<boolean> {
    try {
      await this.#invoke(PackType.LOGOUT, new Uint8Array(), 1500);
    } catch (error) {
      throw error;
    } finally {
      this.#transportInstance.disconnect();
    }

    return true;
  }

  // /**
  //  * 发送消息
  //  * @param msg
  //  */
  // async sendMsg(msg: Message): Promise<boolean> {
  //   const topic = `${msgTopicPrefix}/${msg.to}/${msg.from}`;
  //   log.info(`[protobuf][sendMsg] topic=${topic}, msg=`, msg);
  //   await this.#transportInstance.send(topic, Message.toBinary(msg));
  //   return true;
  // }

  // /**
  //  * 监听事件
  //  * @param name
  //  * @param handle
  //  */
  // addEventListener<K extends ProtocolLayerEventName>(
  //   name: K,
  //   handle: IProtocolLayerEvent[K],
  // ): Function {
  //   return this.#eventBus.on(name, handle as any);
  // }

  /**
   * 销毁
   */
  destroy() {
    log.debug("[protobuf][destroy]");
    this.#eventBus.clear();
    this.#transportInstance.destroy();
  }
}

export default ProtocolLayer;
