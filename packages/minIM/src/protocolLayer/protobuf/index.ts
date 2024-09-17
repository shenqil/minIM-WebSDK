/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-05-11 16:48:46
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-20 20:29:27
 * @FilePath: \PeachyTalk-IM-SDK\lib\protocolLayer\protobuf\index.ts
 * @Description: 协议层实现
 */

import EventBus from '@/utils/eventBus';
import {
  AProtocolLayer,
  EProtocolLayerEventName,
  IProtocolLayerEvent,
  LoginReq,
  LoginRes,
  PackData,
  PackType,
} from '../index';
import {
  ATransportLayer,
  ETransportLayerEventName,
} from '@/transportLayer/index';
import TransportLayer from '@/transportLayer/websocket/index';
import log from '@/utils/log';
import { getCMsgId } from '@/utils/common';

class ProtocolLayer implements AProtocolLayer {
  #fromId: number;

  #transportInstance: ATransportLayer;
  // 事件
  #eventBus: EventBus<IProtocolLayerEvent> =
    new EventBus<IProtocolLayerEvent>();

  // 内部事件
  #internalEvents: EventBus<any> = new EventBus<any>();

  constructor() {
    this.#fromId = 0;

    this.#transportInstance = new TransportLayer();

    this.#transportInstance.addEventListener(
      ETransportLayerEventName.MESSAGE_RECEIVED,
      (data) => {
        // 接收到消息
        this.#internalEvents.emit(
          EProtocolLayerEventName.MESSAGE_RECEIVED,
          PackData.fromBinary(data),
        );
      },
    );

    // 抛出内部所有事件
    Object.keys(ETransportLayerEventName).forEach((key) => {
      const name = (EProtocolLayerEventName as any)[key];
      name &&
        this.#transportInstance.addEventListener(name, (...args: any) => {
          this.#eventBus.emit(name, ...args);
        });
    });
  }

  #sendData(type: PackType, payload: Uint8Array) {
    const msg = PackData.create({
      id: getCMsgId(),
      from: this.#fromId,
      type,
      payload,
      timestamp: Date.now(),
    });

    this.#transportInstance.send(PackData.toBinary(msg));
  }

  async #invoke(
    type: PackType,
    payload: Uint8Array,
    waitTime = 3000,
  ): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      let cancelFn: undefined | (() => void) = undefined;

      const msg = PackData.create({
        id: getCMsgId(),
        from: this.#fromId,
        type,
        payload,
        timestamp: Date.now(),
      });

      this.#transportInstance.send(PackData.toBinary(msg));
      const offFn = this.#internalEvents.once(
        msg.id.toString(),
        (res: PackData) => {
          cancelFn?.();

          resolve(res.payload);
        },
      );

      if (waitTime) {
        const timer = setTimeout(() => {
          cancelFn?.();
          reject('timeout');
        }, waitTime);

        cancelFn = () => {
          clearTimeout(timer);
          offFn();
        };
      }
    });
  }

  /**
   * 开始连接
   * @param
   */
  connect(url: string) {
    return this.#transportInstance.connect({ brokerUrl: url });
  }

  /**
   * 开始登陆
   * @param info
   */
  async login(info: LoginReq): Promise<boolean> {
    this.#fromId = info.uid;

    const resBuf = await this.#invoke(
      PackType.LOGIN_REQ,
      LoginReq.toBinary(info),
    );

    const res = LoginRes.fromBinary(resBuf);
    if (res.code) {
      throw new Error(res.reason);
    }

    return true;
  }

  /**
   * 退出登陆
   */
  logout(): void {
    this.#sendData(PackType.LOGOUT_REQ, new Uint8Array());
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
    log.debug('[protobuf][destroy]');
    this.#eventBus.clear();
    this.#transportInstance.destroy();
  }
}

export default ProtocolLayer;
