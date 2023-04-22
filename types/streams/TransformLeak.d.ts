/// <reference types="node" />
/// <reference types="node" />
import { Transform, TransformCallback } from "stream";
export interface ITransformLeakOptions {
    restricted: {
        type: string;
        values: string[] | RegExp[];
        logLevel: string;
    };
    file: string;
    customLogger?: {
        error: () => void;
        info: () => void;
        log: () => void;
        debug: () => void;
    };
}
export declare class TransformLeak extends Transform {
    private restricted;
    private counter;
    private file;
    constructor({ restricted, file }: ITransformLeakOptions);
    buildRegexFromArray(array: string[]): RegExp;
    proceedArrayType(chunk: any): void;
    proceedStringType(chunk: any): void;
    proceedRegexType(chunk: any): void;
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void;
}
