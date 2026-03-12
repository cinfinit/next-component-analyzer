#!/usr/bin/env node

import { report } from "./reporter"
import { analyzeProject } from "./analyzeProject"

async function main() {
  const results = await analyzeProject()
  report(results)
}

main()