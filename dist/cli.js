#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reporter_1 = require("./reporter");
const analyzeProject_1 = require("./analyzeProject");
async function main() {
    const results = await (0, analyzeProject_1.analyzeProject)();
    (0, reporter_1.report)(results);
}
main();
