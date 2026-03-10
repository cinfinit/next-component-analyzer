#!/usr/bin/env node

import { scanFiles } from "./scanner"
import { analyzeFile } from "./analyzer"
import { report } from "./reporter"

async function main() {
  const files = await scanFiles()
  const results = []

  for (const file of files) {
    const result = analyzeFile(file)
    if (result) results.push(result)
  }

  report(results)
}

main()