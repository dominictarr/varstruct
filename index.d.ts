declare module 'varstruct' {
    import { Buffer as NodeBuffer } from 'buffer';

    // https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings
    export type Encoding =
        | 'ascii'
        | 'utf8'
        | 'utf16le'
        | 'ucs2'
        | 'base64'
        | 'latin1'
        | 'binary'
        | 'hex';

    export interface Codec<T> {
        encode (object: T, buffer?: NodeBuffer, offset?: number): NodeBuffer;
        decode (buffer: NodeBuffer, offset?: number): NodeBuffer;
        encodingLength (object: T): number;
    }

    export interface ItemStruct<T> {
        name: string;
        type: Codec<T>;
    }

    export type ItemTuple<T> = [string, Codec<T>];

    export type Item<T> = ItemStruct<T> | ItemTuple<T>;

    export const Byte: Codec<number>;
    export const Int8: Codec<number>;
    export const UInt8: Codec<number>;
    export const Int16BE: Codec<number>;
    export const Int16LE: Codec<number>;
    export const UInt16BE: Codec<number>;
    export const UInt16LE: Codec<number>;
    export const Int32BE: Codec<number>;
    export const Int32LE: Codec<number>;
    export const UInt32BE: Codec<number>;
    export const UInt32LE: Codec<number>;
    export const Int64BE: Codec<number>;
    export const Int64LE: Codec<number>;
    export const UInt64BE: Codec<number>;
    export const UInt64LE: Codec<number>;
    export const FloatBE: Codec<number>;
    export const FloatLE: Codec<number>;
    export const DoubleBE: Codec<number>;
    export const DoubleLE: Codec<number>;

    export function Array <T> (length: number, itemCodec: Codec<T>): Codec<T>;
    export function VarArray <T> (lengthCodec: Codec<T>, itemCodec: Codec<T>): Codec<T>;
    export function Sequence <T> (itemCodecs: Codec<T>[]): Codec<T>;
    export function Buffer <T> (length: number): Codec<T>;
    export function VarBuffer <T> (lengthCodec: Codec<T>): Codec<T>;
    export function VarMap <T> (lengthCodec: Codec<T>, keyCodec: Codec<T>, valueCodec: Codec<T>): Codec<T>;
    export function String <T> (length: number, encoding?: Encoding): Codec<T>;
    export function VarString <T> (lengthCodec: Codec<T>, encoding?: Encoding): Codec<T>;
    export function Bound <T> (itemCodec: Codec<T>, checkValue: (value: T) => any): Codec<T>;
    export function Value <T> (itemCodec: Codec<T>, value: T): Codec<T>;

    export default function VarStruct <T> (items: Item<T>[]): Codec<T>;
}
