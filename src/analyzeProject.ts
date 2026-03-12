import { scanFiles } from "./scanner"
import { analyzeFile } from "./analyzer"

export async function analyzeProject() {
    const files = await scanFiles()
    const results = []
  
    for (const file of files) {
      const result = analyzeFile(file)
      if (result) results.push(result)
    }
  
    return results
  }