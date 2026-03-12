import { analyzeProject } from "../dist/analyzeProject.js"

async function run() {
  const results = await analyzeProject()

  console.log(results)
}

run()