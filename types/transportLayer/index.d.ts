export declare const msgTopicPrefix = "MSG";
export declare const clientId = "DESKTOP";
/**
 * 当前连接状态
 */
export type IConnectStatus = "CONNECTING" | "CONNECTED" | "RECONNECTING" | "DISCONNECTED";
/**
 * 断开类型
 */
export declare enum EDisconnectType {
    UNKNOWN = 0,// 未知原因断开
    NORMAL = 1,// 正常断开
    HEARTBEAT_TIMEOUT = 2,// 心跳超时
    WS_ERROR = 3,
    WS_CLOSE = 4
}
/**
 * 连接参数
 */
export type IConnectOpts = {
    brokerUrl: string;
};
/**
 * 连接层所有的事件名称
 * */
export declare const ETransportLayerEventName: Readonly<{
    /**
     * 连接中
     * */
    CONNECTING: "CONNECTING";
    /**
     * 已连接
     * */
    CONNECTED: "CONNECTED";
    /**
     * 断开连接
     * */
    DISCONNECTED: "DISCONNECTED";
    /**
     * 接收到消息
     * */
    MESSAGE_RECEIVED: "MESSAGE_RECEIVED";
}>;
export type ITransportLayerEventNameKey = keyof typeof ETransportLayerEventName;
/**
 * 连接层所有的事件
 */
export interface ITransportLayerEvent {
    [ETransportLayerEventName.CONNECTING]: () => void;
    [ETransportLayerEventName.CONNECTED]: () => void;
    [ETransportLayerEventName.DISCONNECTED]: (type: EDisconnectType, reason?: unknown) => void;
    [ETransportLayerEventName.MESSAGE_RECEIVED]: (data: Uint8Array) => void;
}
/**
 * 所有事件名称
 * */
export type TransportLayerEventName = keyof ITransportLayerEvent;
/**
 * 连接层S抽象类
 * */
export declare abstract class ATransportLayer {
    /**
     * 发起一次连接
     * @param opt
     */
    abstract connect(): Promise<boolean>;
    /**
     * 断开连接
     */
    abstract disconnect(): void;
    /**
     * 发送数据
     * @param topic
     * @param data
     */
    abstract send(data: Uint8Array): void;
    /**
     * 监听事件
     * @param name
     * @param handle
     */
    abstract addEventListener<K extends TransportLayerEventName>(name: K, handle: ITransportLayerEvent[K]): () => void;
    /**
     * 销毁
     */
    abstract destroy(): void;
    /**
     * 获取连接状态
     * */
    abstract getConnectStatus(): IConnectStatus;
}
