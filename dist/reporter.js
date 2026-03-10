"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.report = report;
function report(results) {
    console.log("Next Component Analyzer\n");
    for (const r of results) {
        if (!r)
            continue; // Skip non-component files
        console.log(`${r.filePath}`);
        console.log(`→ ${r.classification}`);
        if (r.detected.length)
            console.log(`Detected: ${r.detected.join(", ")}`);
        console.log("");
    }
}
