import fs from 'node:fs'
import path from 'node:path'
import rehypePrettyCode from 'rehype-pretty-code'
import { defineCollection, defineConfig, s } from 'velite'
import { extractWikilinks, remarkWikilinks, toSlug } from './src/lib/garden/wikilinks'

const GARDEN_DIR = path.join(process.cwd(), 'content', 'garden')
const NOTE_FILE = /\.mdx?$/
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
// `next build` sets NODE_ENV=production before this config loads; dev and plain `velite` keep drafts
const isProd = process.env.NODE_ENV === 'production'

// Slugs the wikilink plugin may link to, read once per Velite build (reset in `prepare`, so new notes resolve in watch mode)
let known: Set<string> | null = null
const knownSlugs = () =>
    (known ??= new Set(
        fs
            .readdirSync(GARDEN_DIR)
            .filter((f) => NOTE_FILE.test(f))
            // shortcut: reads `draft: true` from the frontmatter with a regex, not a YAML parser; write it on its own line
            .filter((f) => !(isProd && /^draft:\s*true\b/im.test(fs.readFileSync(path.join(GARDEN_DIR, f), 'utf8').split(/^---\s*$/m)[1] ?? '')))
            .map((f) => toSlug(f.replace(NOTE_FILE, ''))),
    ))

const notes = defineCollection({
    name: 'Note',
    // shortcut: flat folder only (one atomic note per file); add subfolder support to knownSlugs if notes get folders
    pattern: 'garden/*.{md,mdx}',
    schema: s.object({
        slug: s
            .path()
            .transform((p) => p.replace(/^garden\//, ''))
            .pipe(s.string().regex(SLUG, 'File name must be lowercase-hyphen, e.g. focus-trap.md')),
        title: s.string(),
        description: s.string(),
        tags: s.array(s.string().regex(SLUG, 'Tags must be lowercase-hyphen, e.g. a11y or screen-readers')).default([]),
        stage: s.enum(['seedling', 'budding', 'evergreen']).default('seedling'),
        created: s.isodate(),
        updated: s.isodate().optional(),
        draft: s.boolean().default(false),
        links: s.raw().transform(extractWikilinks),
        body: s.mdx(),
    }),
})

export default defineConfig({
    root: 'content',
    strict: true, // invalid frontmatter fails the build instead of only warning
    collections: { notes },
    mdx: {
        remarkPlugins: [[remarkWikilinks, { base: '/garden', known: knownSlugs }]],
        // github-light fails AA contrast (3.5:1 on parameters); the high-contrast variant passes
        rehypePlugins: [[rehypePrettyCode, { theme: { light: 'github-light-high-contrast', dark: 'github-dark' } }]],
    },
    prepare: (data) => {
        known = null
        if (isProd) data.notes = data.notes.filter((n) => !n.draft)
    },
})
