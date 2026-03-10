"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeFile = analyzeFile;
const ts_morph_1 = require("ts-morph");
const rules_1 = require("./rules");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Determine tsconfig path in the current working directory
const tsconfigPath = path_1.default.join(process.cwd(), "tsconfig.json");
// Initialize ts-morph Project safely
const project = fs_1.default.existsSync(tsconfigPath)
    ? new ts_morph_1.Project({ tsConfigFilePath: tsconfigPath })
    : new ts_morph_1.Project({
        compilerOptions: {
            allowJs: true,
            jsx: ts_morph_1.ts.JsxEmit.ReactJSX
        }
    });
// If no tsconfig.json, manually add all source files
if (!fs_1.default.existsSync(tsconfigPath)) {
    console.log("⚠️  No tsconfig.json found. Using default compiler options and including all source files.");
    project.addSourceFilesAtPaths("**/*.{ts,tsx,js,jsx}");
}
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
