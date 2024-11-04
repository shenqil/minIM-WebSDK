import type { ATransportLayer, IConnectOpts, IConnectStatus, ITransportLayerEvent, TransportLayerEventName } from '../index';
export declare class WS implements ATransportLayer {
    #private;
    constructor(o: IConnectOpts);
    /**
     * 发起一次连接
     * @param opt
     */
    connect(): Promise<boolean>;
    /**
     * 断开连接
     */
    disconnect(): void;
    /**
     * 发送数据
     * @param topic
     * @param data
     */
    send(data: Uint8Array): void;
    /**
     * 监听事件
     * @param name
     * @param handle
     */
    addEventListener<K extends TransportLayerEventName>(name: K, handle: ITransportLayerEvent[K]): () => void;
    /**
     * 销毁
     */
    destroy(): void;
    /**
     * 获取连接状态
     * */
    getConnectStatus(): IConnectStatus;
}
export default WS;
