import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * *
 * 一包数据
 *
 * @generated from protobuf message im.PackData
 */
export interface PackData {
    /**
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * @generated from protobuf field: uint32 from = 2;
     */
    from: number;
    /**
     * @generated from protobuf field: uint32 to = 3;
     */
    to: number;
    /**
     * @generated from protobuf field: im.PackType type = 4;
     */
    type: PackType;
    /**
     * @generated from protobuf field: bytes payload = 5;
     */
    payload: Uint8Array;
    /**
     * @generated from protobuf field: uint32 timestamp = 6;
     */
    timestamp: number;
}
/**
 * *
 * 登陆请求体
 *
 * @generated from protobuf message im.LoginReq
 */
export interface LoginReq {
    /**
     * @generated from protobuf field: uint32 uid = 1;
     */
    uid: number;
    /**
     * @generated from protobuf field: string password = 2;
     */
    password: string;
}
/**
 * @generated from protobuf message im.LoginRes
 */
export interface LoginRes {
    /**
     * @generated from protobuf field: uint32 code = 1;
     */
    code: number;
    /**
     * @generated from protobuf field: string reason = 2;
     */
    reason: string;
}
/**
 * *
 * 数据类型
 *
 * @generated from protobuf enum im.PackType
 */
export declare enum PackType {
    /**
     * *
     * 登陆
     *
     * @generated from protobuf enum value: LOGIN_REQ = 0;
     */
    LOGIN_REQ = 0,
    /**
     * @generated from protobuf enum value: LOGIN_RES = 1;
     */
    LOGIN_RES = 1,
    /**
     * *
     * 退出
     *
     * @generated from protobuf enum value: LOGOUT_REQ = 2;
     */
    LOGOUT_REQ = 2,
    /**
     * @generated from protobuf enum value: LOGOUT_RES = 3;
     */
    LOGOUT_RES = 3,
    /**
     * *
     * 文本
     *
     * @generated from protobuf enum value: TEXT = 4;
     */
    TEXT = 4,
    /**
     * *
     * 图片
     *
     * @generated from protobuf enum value: IMAGE = 5;
     */
    IMAGE = 5,
    /**
     * *
     * 语音
     *
     * @generated from protobuf enum value: AUDIO = 6;
     */
    AUDIO = 6,
    /**
     * *
     * 视频
     *
     * @generated from protobuf enum value: VEDIO = 7;
     */
    VEDIO = 7,
    /**
     * *
     * 视频
     *
     * @generated from protobuf enum value: CUSTOM = 8;
     */
    CUSTOM = 8
}
/**
 * *
 * 聊天类型
 *
 * @generated from protobuf enum im.ChatType
 */
export declare enum ChatType {
    /**
     * *
     * 单聊消息
     *
     * @generated from protobuf enum value: CHAT = 0;
     */
    CHAT = 0,
    /**
     * *
     * 群聊消息
     *
     * @generated from protobuf enum value: GROUP_CHAT = 1;
     */
    GROUP_CHAT = 1,
    /**
     * *
     * 系统消息
     *
     * @generated from protobuf enum value: SYSTEM = 2;
     */
    SYSTEM = 2
}
declare class PackData$Type extends MessageType<PackData> {
    constructor();
    create(value?: PartialMessage<PackData>): PackData;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: PackData): PackData;
    internalBinaryWrite(message: PackData, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message im.PackData
 */
export declare const PackData: PackData$Type;
declare class LoginReq$Type extends MessageType<LoginReq> {
    constructor();
    create(value?: PartialMessage<LoginReq>): LoginReq;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LoginReq): LoginReq;
    internalBinaryWrite(message: LoginReq, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message im.LoginReq
 */
export declare const LoginReq: LoginReq$Type;
declare class LoginRes$Type extends MessageType<LoginRes> {
    constructor();
    create(value?: PartialMessage<LoginRes>): LoginRes;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: LoginRes): LoginRes;
    internalBinaryWrite(message: LoginRes, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message im.LoginRes
 */
export declare const LoginRes: LoginRes$Type;
export {};
