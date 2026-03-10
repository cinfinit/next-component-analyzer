#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scanner_1 = require("./scanner");
const analyzer_1 = require("./analyzer");
const reporter_1 = require("./reporter");
async function main() {
    const files = await (0, scanner_1.scanFiles)();
    const results = [];
    for (const file of files) {
        const result = (0, analyzer_1.analyzeFile)(file);
        if (result)
            results.push(result);
    }
    (0, reporter_1.report)(results);
}
main();
