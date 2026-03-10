import { ts,Project, Node, SyntaxKind, FunctionDeclaration, VariableDeclaration } from "ts-morph"
import { clientHooks, nextHooks, browserAPIs, eventHandlers } from "./rules"
import fs from "fs"
import path from "path"

// Determine tsconfig path in the current working directory
const tsconfigPath = path.join(process.cwd(), "tsconfig.json");

// Initialize ts-morph Project safely
const project = fs.existsSync(tsconfigPath)
  ? new Project({ tsConfigFilePath: tsconfigPath })
  : new Project({
      compilerOptions: {
        allowJs: true,
        jsx: ts.JsxEmit.ReactJSX
      }
    });

// If no tsconfig.json, manually add all source files
if (!fs.existsSync(tsconfigPath)) {
  console.log("⚠️  No tsconfig.json found. Using default compiler options and including all source files.");
  project.addSourceFilesAtPaths("**/*.{ts,tsx,js,jsx}");
}

export function analyzeFile(filePath: string) {
  const sourceFile = project.addSourceFileAtPath(filePath)
  const text = sourceFile.getFullText()
  const hasUseClient = text.includes('"use client"') || text.includes("'use client'")

  const components = detectComponents(sourceFile)
  if (components.length === 0) return null

  const detected: string[] = []

  // Detect hooks
  sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression).forEach((node) => {
    const name = node.getExpression().getText()
    if (clientHooks.includes(name) || nextHooks.includes(name)) detected.push(name)
  })

  // Browser APIs
  sourceFile.getDescendantsOfKind(SyntaxKind.Identifier).forEach((node) => {
    const name = node.getText()
    if (browserAPIs.includes(name)) detected.push(name)
  })

  // JSX event handlers
  sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute).forEach((node) => {
    const name = node.getName()
    if (eventHandlers.includes(name)) detected.push(name)
  })

  // Classification
  let classification: string
  if (detected.length && hasUseClient) classification = "Client Component (correct)"
  else if (detected.length && !hasUseClient) classification = "Suggested: Client Component"
  else if (!detected.length && !hasUseClient) classification = "Suggested: Server Component"
  else classification = "Could be Server Component (unnecessary client)"

  return {
    filePath,
    hasUseClient,
    detected: [...new Set(detected)],
    classification
  }
}

// Component detection
function detectComponents(sourceFile: any) {
  const components: (FunctionDeclaration | VariableDeclaration)[] = []

  // Function components
  sourceFile.getFunctions().forEach((fn: FunctionDeclaration) => {
    if (!fn.isExported() && !fn.isDefaultExport()) return
    if (containsJSX(fn)) components.push(fn)
  })

  // Arrow / function expressions
  sourceFile.getVariableDeclarations().forEach((v: VariableDeclaration) => {
    const init = v.getInitializer()
    if (!init) return
    if (Node.isArrowFunction(init) || Node.isFunctionExpression(init)) {
      if (containsJSX(init)) components.push(v)
    }
  })

  return components
}

// JSX detection
function containsJSX(node: Node) {
  return node.getDescendants().some((d: Node) =>
    d.getKind() === SyntaxKind.JsxElement ||
    d.getKind() === SyntaxKind.JsxSelfClosingElement
  )
}