import { execSync } from "child_process"

// Run a global search for any remaining references to the lib directory
try {
  console.log("Searching for remaining references to lib directory...")
  const result = execSync('grep -r --include="*.ts" --include="*.tsx" "@/lib" .').toString()

  if (result) {
    console.log("Found remaining references to lib directory:")
    console.log(result)
  } else {
    console.log("No remaining references to lib directory found.")
  }
} catch (error) {
  console.log("No remaining references to lib directory found.")
}

// Check for relative imports
try {
  console.log("\nSearching for relative imports to lib directory...")
  const result = execSync('grep -r --include="*.ts" --include="*.tsx" "from \\"\\.\\.\\./lib" .').toString()

  if (result) {
    console.log("Found relative imports to lib directory:")
    console.log(result)
  } else {
    console.log("No relative imports to lib directory found.")
  }
} catch (error) {
  console.log("No relative imports to lib directory found.")
}

