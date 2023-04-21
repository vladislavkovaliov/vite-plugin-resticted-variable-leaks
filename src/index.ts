import fs from "fs";

import { TransformLeak } from "./streams/TransformLeak";

async function main() {
  const rs = fs.createReadStream("./text.txt", "utf8");

  rs.pipe(
    new TransformLeak({
      restricted: {
        type: "array",
        values: ["html", "body"],
        logLevel: "error",
      },
    })
  );
}

main().catch(console.error);
