import { IProtocolLayerEvent, IProtocolOpts } from "@/protocolLayer";
/**
 * API所有的事件名称
 * */
export declare const ChatEventName: Readonly<{
    CONVERSATION_LIST_UPDATED: "CONVERSATION_LIST_UPDATED";
    MESSAGE_RECEIVED: "MESSAGE_RECEIVED";
    CONNECTING: "CONNECTING";
    CONNECTED: "CONNECTED";
    DISCONNECTED: "DISCONNECTED";
}>;
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
export declare class ChatSDK {
    #private;
    constructor(o: Options);
    /**
     * 登录
     * @param loginInfo
     */
    login(params: ILoginParams): Promise<boolean>;
    /**
     * 退出登录
     * @returns
     */
    logout(): void;
    /**
     * 监听事件
     * @param name
     * @param handle
     * @returns Function
     */
    on<K extends keyof ChatEvent>(name: K, handle: ChatEvent[K]): () => void;
}
export default ChatSDK;
