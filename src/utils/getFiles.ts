import fs from "fs";

export function getFiles(dir: string, arr: string[] = []): string[] {
  arr = arr || [];

  const files = fs.readdirSync(dir);

  for (const x in files) {
    const name = dir + "/" + files[x];

    if (fs.statSync(name).isDirectory()) {
      getFiles(name, arr);
    } else {
      arr.push(name);
    }
  }
  return arr;
}
