/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-04-28 19:07:29
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-20 20:56:42
 * @FilePath: \PeachyTalk-IM-SDK\lib\api\index.ts
 * @Description: 对外暴露的所有API
 */
import ProtocolLayer from "../protocolLayer/protobuf";
import {
  AProtocolLayer,
  EProtocolLayerEventName,
  IProtocolLayerEvent,
  IProtocolOpts,
} from "../protocolLayer";
import EventBus from "../utils/eventBus";
import log from "../utils/log";

/**
 * API所有的事件名称
 * */
export const ChatEventName = Object.freeze({
  ...EProtocolLayerEventName,
  CONVERSATION_LIST_UPDATED: "CONVERSATION_LIST_UPDATED",
});

/**
 * API所有的事件
 * */
export type ChatEvent = IProtocolLayerEvent;

/**
 * 登陆参数
 */
export interface ILoginParams {
  userId: number;
  token: string;
}

/**
 * 创建实例参数
 */
export type Options = IProtocolOpts;

export class ChatSDK {
  // 协议层
  #protocolInstance: AProtocolLayer;
  // 事件
  #eventBus: EventBus<ChatEvent> = new EventBus<ChatEvent>();
  // 配置
  #opts: Options;
  constructor(o: Options) {
    this.#opts = Object.freeze(o);

    this.#protocolInstance = new ProtocolLayer(this.#opts);
  }

  /**
   * 登录
   * @param loginInfo
   */
  async login(params: ILoginParams) {
    log.info("[api][login] loginInfo", params);

    const res = await this.#protocolInstance.login({
      uid: params.userId,
      password: params.token,
    });

    return res;
  }

  /**
   * 退出登录
   * @returns
   */
  logout() {
    log.info("[api][login] logout");
    return this.#protocolInstance.logout();
  }

  // /**
  //  * 发送消息
  //  * @param msg
  //  * @returns
  //  */
  // async sendMsg(msg: ISendMsg) {
  //   const userId = getUserInfo()?.userId;

  //   if (!userId) {
  //     throw new Error('用户未登陆');
  //   }

  //   log.info(`[api][sendMsg] msg=`, msg);

  //   let payload = '';
  //   switch (msg.type) {
  //     case MessageType.TEXT:
  //     case MessageType.CUSTOM:
  //       payload = msg.payload;
  //       break;

  //     case MessageType.IMAGE:
  //     case MessageType.VEDIO:
  //     case MessageType.IMAGE:
  //       await httpApi.uploadFile({ file: msg.file });
  //       break;

  //     default:
  //       break;
  //   }

  //   const msgId = getCMsgId();

  //   const data = Message.create({
  //     id: msgId,
  //     from: userId,
  //     to: msg.to,
  //     chatType: msg.chatType,
  //     type: msg.type,
  //     payload,
  //     timestamp: getTimestamp(),
  //     clientExtension: msg.clientExtension,
  //     serverExtension: msg.serverExtension,
  //   });

  //   this.#conversationStore.updateConversationByMsg(msg.to, data);

  //   return await this.#protocolInstance.sendMsg(data);
  // }

  /**
   * 监听事件
   * @param name
   * @param handle
   * @returns Function
   */
  on<K extends keyof ChatEvent>(name: K, handle: ChatEvent[K]): () => void {
    return this.#eventBus.on(name, handle);
  }
}

export default ChatSDK;
