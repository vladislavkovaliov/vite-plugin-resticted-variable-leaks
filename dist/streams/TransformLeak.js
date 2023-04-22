"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformLeak = void 0;
const stream_1 = require("stream");
const readline_1 = __importDefault(require("readline"));
const stream_2 = __importDefault(require("stream"));
class TransformLeak extends stream_1.Transform {
    restricted;
    counter = 1;
    file;
    constructor({ restricted, file }) {
        super({ decodeStrings: false });
        // TODO: throw error and make obtain if the arguments is empty
        // Examples:
        //      1. Just setting empty array if not array at all
        //      2. Do not call _transform
        this.restricted = restricted;
        this.file = file;
    }
    buildRegexFromArray(array) {
        const str = array.join("|");
        const regex = new RegExp(str, "ig");
        return regex;
    }
    proceedArrayType(chunk) {
        // TODO: make it with compose()
        const regex = this.buildRegexFromArray(this.restricted.values);
        const matches = chunk.match(regex);
        if (matches) {
            const rl = readline_1.default.createInterface({
                input: stream_2.default.Readable.from(chunk),
            });
            rl.on("line", (strLine) => {
                const foundMatch = strLine.match(regex);
                if (strLine && foundMatch) {
                    console.log(foundMatch, this.file + ":" + this.counter);
                }
                this.counter++;
            });
        }
    }
    proceedStringType(chunk) {
        const str = this.restricted.values[0];
        const matches = chunk.match(str);
        if (matches) {
            const rl = readline_1.default.createInterface({
                input: stream_2.default.Readable.from(chunk),
            });
            rl.on("line", (strLine) => {
                const foundMatch = strLine.match(new RegExp(str));
                if (strLine && foundMatch) {
                    console.log(foundMatch, this.file + ":" + this.counter);
                }
                this.counter++;
            });
        }
    }
    proceedRegexType(chunk) {
        const arg = this.restricted.values[0];
        const matches = chunk.match(arg);
        if (matches) {
            const rl = readline_1.default.createInterface({
                input: stream_2.default.Readable.from(chunk),
            });
            rl.on("line", (strLine) => {
                const foundMatch = strLine.match(arg);
                if (strLine && foundMatch) {
                    console.log(foundMatch, this.file + ":" + this.counter);
                }
                this.counter++;
            });
        }
    }
    _transform(chunk, encoding, callback) {
        switch (this.restricted.type) {
            case "array": {
                this.proceedArrayType(chunk);
                break;
            }
            case "string": {
                this.proceedStringType(chunk);
                break;
            }
            case "regex": {
                this.proceedRegexType(chunk);
                break;
            }
            default: {
                break;
            }
        }
        callback();
    }
}
exports.TransformLeak = TransformLeak;
