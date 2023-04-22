"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viteResctrectedVariable = void 0;
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils");
const TransformLeak_1 = require("../streams/TransformLeak");
function viteResctrectedVariable() {
    return {
        name: "vite-resctrected-variable",
        configResolved(config) {
            const { root } = config;
            const files = (0, utils_1.getFiles)(root + "/src", []).filter((x) => x !== __filename);
            const promises = files.map((file) => {
                return new Promise((res, _) => {
                    const rs = fs_1.default.createReadStream(file, "utf8");
                    rs.pipe(new TransformLeak_1.TransformLeak({
                        restricted: {
                            type: "array",
                            values: ["html", "body"],
                            logLevel: "error",
                        },
                        file: file,
                    }));
                    res(true);
                });
            });
            Promise.all([...promises]);
        },
    };
}
exports.viteResctrectedVariable = viteResctrectedVariable;
