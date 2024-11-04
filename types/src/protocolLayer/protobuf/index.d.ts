import { AProtocolLayer, IProtocolOpts, LoginReq } from "../index";
declare class ProtocolLayer implements AProtocolLayer {
    #private;
    constructor(o: IProtocolOpts);
    /**
     * 开始登陆
     * @param info
     */
    login(info: LoginReq): Promise<boolean>;
    /**
     * 退出登陆
     */
    logout(): void;
    /**
     * 销毁
     */
    destroy(): void;
}
export default ProtocolLayer;
