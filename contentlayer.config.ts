import { defineDocumentType, ComputedFields, makeSource } from 'contentlayer/source-files'
import { writeFileSync, readFileSync, readdirSync, statSync } from 'fs'
import readingTime from 'reading-time'
import { slug } from 'github-slugger'
import path from 'path'
// Remark packages
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import {
  remarkExtractFrontmatter,
  remarkCodeTitles,
  remarkImgToJsx,
  extractTocHeadings,
} from 'pliny/mdx-plugins/index.js'
// Rehype packages
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'
import siteMetadata from './data/siteMetadata'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer.js'

const root = process.cwd()
const isProduction = process.env.NODE_ENV === 'production'

const computedFields: ComputedFields = {
  readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.replace(/^.+?(\/)/, ''),
  },
  path: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath,
  },
  filePath: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFilePath,
  },
  toc: { type: 'string', resolve: (doc) => extractTocHeadings(doc.body.raw) },
}

/**
 * Count the occurrences of all tags across blog posts and write to json file
 */
function createTagCount(allBlogs) {
  const tagCount: Record<string, number> = {}
  allBlogs.forEach((file) => {
    if (file.tags && (!isProduction || file.draft !== true)) {
      file.tags.forEach((tag) => {
        const formattedTag = slug(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })
  writeFileSync('./app/tag-data.json', JSON.stringify(tagCount))
}

function createSearchIndex(allBlogs) {
  if (
    siteMetadata?.search?.provider === 'kbar' &&
    siteMetadata.search.kbarConfig.searchDocumentsPath
  ) {
    writeFileSync(
      `public/${siteMetadata.search.kbarConfig.searchDocumentsPath}`,
      JSON.stringify(allCoreContent(sortPosts(allBlogs)))
    )
    console.log('Local search index generated...')
  }
}

/**
 * Fix contentlayer generated files that use assert { type: 'json' } syntax
 * which is not supported in Vercel's Node.js version
 */
function findMjsFiles(dir: string, fileList: string[] = []): string[] {
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

function fixMjsFile(filePath: string) {
  try {
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
        // Resolve the JSON file path relative to the mjs file's directory
        const absoluteJsonPath = path.resolve(dir, jsonPath)
        const relativeJsonPath = path.relative(process.cwd(), absoluteJsonPath)
        return `const ${varName} = JSON.parse(readFileSync('${relativeJsonPath.replace(/\\/g, '/')}', 'utf-8'))`
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
      return true
    }
    return false
  } catch (fileError) {
    console.warn(`Warning: Could not fix ${filePath}:`, fileError)
    return false
  }
}

function fixContentlayerImports() {
  const generatedDir = path.join(process.cwd(), '.contentlayer', 'generated')
  
  try {
    // Fix all _index.mjs files in subdirectories
    const mjsFiles = findMjsFiles(generatedDir)
    for (const filePath of mjsFiles) {
      fixMjsFile(filePath)
    }

    // Also fix the main index.mjs file
    const mainIndexPath = path.join(generatedDir, 'index.mjs')
    try {
      if (statSync(mainIndexPath).isFile()) {
        fixMjsFile(mainIndexPath)
      }
    } catch {
      // File might not exist yet, that's okay
    }
  } catch (error) {
    // If .contentlayer/generated doesn't exist yet, that's okay
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.warn('Warning: Could not fix contentlayer imports:', error)
    }
  }
}

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    lastmod: { type: 'date' },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    images: { type: 'json' },
    authors: { type: 'list', of: { type: 'string' } },
    layout: { type: 'string' },
    bibliography: { type: 'string' },
    canonicalUrl: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.lastmod || doc.date,
        description: doc.summary,
        image: doc.images ? doc.images[0] : siteMetadata.socialBanner,
        url: `${siteMetadata.siteUrl}/${doc._raw.flattenedPath}`,
      }),
    },
  },
}))

export const Authors = defineDocumentType(() => ({
  name: 'Authors',
  filePathPattern: 'authors/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string' },
    occupation: { type: 'string' },
    company: { type: 'string' },
    email: { type: 'string' },
    twitter: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
    layout: { type: 'string' },
  },
  computedFields,
}))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Blog, Authors],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadings,
      rehypeKatex,
      [rehypeCitation, { path: path.join(root, 'data') }],
      [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
      rehypePresetMinify,
    ],
  },
  onSuccess: async (importData) => {
    // Fix assert syntax in generated files BEFORE importing them
    // This must happen immediately after generation, before any imports
    fixContentlayerImports()
    
    // Now we can safely import the fixed files
    const { allBlogs } = await importData()
    createTagCount(allBlogs)
    createSearchIndex(allBlogs)
  },
})
