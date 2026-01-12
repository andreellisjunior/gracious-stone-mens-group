import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Fix contentlayer generated files that use assert { type: 'json' } syntax
 * which is not supported in Vercel's Node.js version
 */
function findMjsFiles(dir, fileList = []) {
  const files = readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = statSync(filePath)

    if (stat.isDirectory()) {
      findMjsFiles(filePath, fileList)
    } else if (file === '_index.mjs') {
      fileList.push(filePath)
    }
  }

  return fileList
}

function fixContentlayerImports() {
  const generatedDir = path.join(process.cwd(), '.contentlayer', 'generated')
  const mjsFiles = findMjsFiles(generatedDir)

  for (const filePath of mjsFiles) {
    let content = readFileSync(filePath, 'utf-8')

    // Check if file contains assert syntax
    if (content.includes('assert { type: \'json\' }')) {
      const dir = path.dirname(filePath)

      // Replace: import x from './file.json' assert { type: 'json' }
      // With: const x = JSON.parse(readFileSync('./file.json', 'utf-8'))
      const importRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+\.json)['"]\s+assert\s+\{\s*type:\s*['"]json['"]\s*\}/g

      // Check if we need to add the fs import
      const needsFsImport = !content.includes("import { readFileSync } from 'fs'")

      // Replace all assert imports
      content = content.replace(importRegex, (match, varName, jsonPath) => {
        // Keep the path relative to the mjs file's directory (as it was in the original import)
        // readFileSync will resolve relative to process.cwd(), so we need to make it absolute
        // or use a path relative to process.cwd()
        const absoluteJsonPath = path.resolve(dir, jsonPath)
        const relativeToCwd = path.relative(process.cwd(), absoluteJsonPath)
        // Use path.join to ensure proper path formatting
        return `const ${varName} = JSON.parse(readFileSync('${relativeToCwd.replace(/\\/g, '/')}', 'utf-8'))`
      })

      // Add fs import at the top if needed
      if (needsFsImport) {
        // Find where to insert (after the NOTE comment if present, or at the beginning)
        const noteCommentEnd = content.indexOf('// NOTE')
        const insertIndex = noteCommentEnd !== -1 
          ? content.indexOf('\n', noteCommentEnd) + 1
          : 0
        
        content = content.slice(0, insertIndex) + "import { readFileSync } from 'fs'\n" + content.slice(insertIndex)
      }

      writeFileSync(filePath, content, 'utf-8')
      console.log(`Fixed imports in ${path.relative(process.cwd(), filePath)}`)
    }
  }
}

fixContentlayerImports()

