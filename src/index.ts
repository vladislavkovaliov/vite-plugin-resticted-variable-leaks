import fs from "fs";

import { TransformLeak } from "./streams/TransformLeak";

const file = "./text.txt";

async function main() {
  const rs = fs.createReadStream(file, "utf8");

  rs.pipe(
    new TransformLeak({
      restricted: {
        type: "array",
        values: ["html", "body"],
        logLevel: "error",
      },
      file: file,
    })
  );
}

main().catch(console.error);
