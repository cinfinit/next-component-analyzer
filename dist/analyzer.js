"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeFile = analyzeFile;
const ts_morph_1 = require("ts-morph");
const rules_1 = require("./rules");
const project = new ts_morph_1.Project({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: { allowJs: true, jsx: 2 }
});
function analyzeFile(filePath) {
    const sourceFile = project.addSourceFileAtPath(filePath);
    const text = sourceFile.getFullText();
    const hasUseClient = text.includes('"use client"') || text.includes("'use client'");
    const components = detectComponents(sourceFile);
    if (components.length === 0)
        return null;
    const detected = [];
    // Detect hooks
    sourceFile.getDescendantsOfKind(ts_morph_1.SyntaxKind.CallExpression).forEach((node) => {
        const name = node.getExpression().getText();
        if (rules_1.clientHooks.includes(name) || rules_1.nextHooks.includes(name))
            detected.push(name);
    });
    // Browser APIs
    sourceFile.getDescendantsOfKind(ts_morph_1.SyntaxKind.Identifier).forEach((node) => {
        const name = node.getText();
        if (rules_1.browserAPIs.includes(name))
            detected.push(name);
    });
    // JSX event handlers
    sourceFile.getDescendantsOfKind(ts_morph_1.SyntaxKind.JsxAttribute).forEach((node) => {
        const name = node.getName();
        if (rules_1.eventHandlers.includes(name))
            detected.push(name);
    });
    // Classification
    let classification;
    if (detected.length && hasUseClient)
        classification = "Client Component (correct)";
    else if (detected.length && !hasUseClient)
        classification = "Suggested: Client Component";
    else if (!detected.length && !hasUseClient)
        classification = "Suggested: Server Component";
    else
        classification = "Could be Server Component (unnecessary client)";
    return {
        filePath,
        hasUseClient,
        detected: [...new Set(detected)],
        classification
    };
}
// Component detection
function detectComponents(sourceFile) {
    const components = [];
    // Function components
    sourceFile.getFunctions().forEach((fn) => {
        if (!fn.isExported() && !fn.isDefaultExport())
            return;
        if (containsJSX(fn))
            components.push(fn);
    });
    // Arrow / function expressions
    sourceFile.getVariableDeclarations().forEach((v) => {
        const init = v.getInitializer();
        if (!init)
            return;
        if (ts_morph_1.Node.isArrowFunction(init) || ts_morph_1.Node.isFunctionExpression(init)) {
            if (containsJSX(init))
                components.push(v);
        }
    });
    return components;
}
// JSX detection
function containsJSX(node) {
    return node.getDescendants().some((d) => d.getKind() === ts_morph_1.SyntaxKind.JsxElement ||
        d.getKind() === ts_morph_1.SyntaxKind.JsxSelfClosingElement);
}
