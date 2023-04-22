import { Transform, TransformCallback } from "stream";
import readline from "readline";
import stream from "stream";

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

export class TransformLeak extends Transform {
  private restricted: ITransformLeakOptions["restricted"];
  private counter: number = 1;
  private file: ITransformLeakOptions["file"];

  public constructor({ restricted, file }: ITransformLeakOptions) {
    super({ decodeStrings: false });

    // TODO: throw error and make obtain if the arguments is empty
    // Examples:
    //      1. Just setting empty array if not array at all
    //      2. Do not call _transform
    this.restricted = restricted;

    this.file = file;
  }

  buildRegexFromArray(array: string[]): RegExp {
    const str = array.join("|");
    const regex = new RegExp(str, "ig");

    return regex;
  }

  proceedArrayType(chunk: any): void {
    // TODO: make it with compose()
    const regex = this.buildRegexFromArray(this.restricted.values as string[]);
    const matches = chunk.match(regex);

    if (matches) {
      const rl = readline.createInterface({
        input: stream.Readable.from(chunk),
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

  proceedStringType(chunk: any): void {
    const str = this.restricted.values[0];
    const matches = chunk.match(str);

    if (matches) {
      const rl = readline.createInterface({
        input: stream.Readable.from(chunk),
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

  proceedRegexType(chunk: any) {
    const arg = this.restricted.values[0] as RegExp;
    const matches = chunk.match(arg);

    if (matches) {
      const rl = readline.createInterface({
        input: stream.Readable.from(chunk),
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

  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
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
