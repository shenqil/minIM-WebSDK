import { IConnectOpts, ITransportLayerEvent } from "../transportLayer/index";
import { LoginReq } from "./protobuf/proto/messages";
export * from "./protobuf/proto/messages";
/**
 * 协议层所有的事件名称
 * */
export declare const EProtocolLayerEventName: Readonly<{
    MESSAGE_RECEIVED: "MESSAGE_RECEIVED";
    CONNECTING: "CONNECTING";
    CONNECTED: "CONNECTED";
    DISCONNECTED: "DISCONNECTED";
}>;
/**
 * 协议层所有的事件
 * */
export interface IProtocolLayerEvent extends Omit<ITransportLayerEvent, "MESSAGE_RECEIVED"> {
    [EProtocolLayerEventName.MESSAGE_RECEIVED]: () => void;
}
/**
 * 所有事件名称
 * */
export type ProtocolLayerEventName = keyof IProtocolLayerEvent;
/**
 * 登录参数
 */
export type IProtocolOpts = IConnectOpts;
/**
 * 协议层抽象类
 * */
export declare abstract class AProtocolLayer {
    /**
     * 开始登陆
     * @param info
     */
    abstract login(info: LoginReq): Promise<boolean>;
    /**
     * 退出登陆
     */
    abstract logout(): void;
    /**
     * 销毁
     */
    abstract destroy(): void;
}
