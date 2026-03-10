import fg from "fast-glob"

export async function scanFiles(): Promise<string[]> {
  return fg(
    ["**/*.{tsx,jsx,ts,js}"],
    {
      ignore: ["node_modules", ".next", "dist", "build"]
    }
  )
}