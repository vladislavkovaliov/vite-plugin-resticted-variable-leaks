"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiles = void 0;
const fs_1 = __importDefault(require("fs"));
function getFiles(dir, arr = []) {
    arr = arr || [];
    const files = fs_1.default.readdirSync(dir);
    for (const x in files) {
        const name = dir + "/" + files[x];
        if (fs_1.default.statSync(name).isDirectory()) {
            getFiles(name, arr);
        }
        else {
            arr.push(name);
        }
    }
    return arr;
}
exports.getFiles = getFiles;
