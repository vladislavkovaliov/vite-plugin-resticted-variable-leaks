import { Transform, TransformCallback } from "stream";
import readline from "readline";
import stream from "stream";

export interface ITransformLeakOptions {
  restricted: {
    type: string;
    values: string[];
    logLevel: string;
  };
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

  public constructor({ restricted }: ITransformLeakOptions) {
    super({ decodeStrings: false });

    // TODO: throw error and make obtain if the arguments is empty
    // Examples:
    //      1. Just setting empty array if not array at all
    //      2. Do not call _transform
    this.restricted = restricted;
  }

  buildRegexFromArray(array: string[]) {
    const str = array.join("|");
    const regex = new RegExp(str, "ig");

    return regex;
  }

  _transform(
    chunk: any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    switch (this.restricted.type) {
      case "array": {
        // TODO: make it with compose()
        const regex = this.buildRegexFromArray(this.restricted.values);
        const matches = chunk.match(regex);

        if (matches) {
          const rl = readline.createInterface({
            input: stream.Readable.from(chunk),
          });

          rl.on("line", (strLine) => {
            if (strLine && strLine.match(regex)) {
              console.log("line", this.counter, strLine.match(regex));
            }

            this.counter++;
          });
        }

        break;
      }
      default: {
        break;
      }
    }

    callback();
  }
}
