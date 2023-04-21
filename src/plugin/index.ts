import fs from "fs";
import path from "path";

import { getFiles } from "../utils";

import { TransformLeak } from "../streams/TransformLeak";

export default function () {
  return {
    name: "custom-plugin",
    configResolved(config) {
      const { root } = config;

      console.log(root);
      console.log(getFiles(root + "/src", []));

      const files = getFiles(root + "/src", []).filter((x) => x !== __filename);
      const promises = files.map((file) => {
        return new Promise((res, _) => {
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

          res(true);
        });
      });

      Promise.all([...promises]);
    },
  };
}
