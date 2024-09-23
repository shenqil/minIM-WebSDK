export declare function getCMsgId(): string;
/**
 * 返回时间戳
 * @returns
 */
export declare function getTimestamp(): bigint;
/**
 * 节流函数
 * @param func
 * @param wait
 * @returns
 */
export declare function throttle(func: (...args: any[]) => void, wait?: number): (...args: any[]) => void;
