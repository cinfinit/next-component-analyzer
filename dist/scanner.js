"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanFiles = scanFiles;
const fast_glob_1 = __importDefault(require("fast-glob"));
async function scanFiles() {
    return (0, fast_glob_1.default)(["**/*.{tsx,jsx,ts,js}"], {
        ignore: ["node_modules", ".next", "dist", "build"]
    });
}
