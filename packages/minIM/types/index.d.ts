import ChatSDK, { Options } from './api';
export * from './api';
export * from './protocolLayer';
export * from './transportLayer';
/**
 * @desc 创建实例
 * */
export declare function create(opts: Options): ChatSDK;
declare const _default: {
    create: typeof create;
};
export default _default;
