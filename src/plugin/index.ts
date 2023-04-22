import fs from "fs";

import { getFiles } from "../utils";

import { TransformLeak } from "../streams/TransformLeak";

export function viteResctrectedVariable() {
  return {
    name: "vite-resctrected-variable",
    configResolved(config: any) {
      const { root } = config;
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
