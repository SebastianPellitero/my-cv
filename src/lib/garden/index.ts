import { notes, type Note } from '#site/content'

export type { Note }

export const STAGES = ['seedling', 'budding', 'evergreen'] as const satisfies readonly Note['stage'][]

export const lastTouched = (n: Note) => n.updated ?? n.created

// Newest first. Drafts are already removed from production output by velite.config.ts
export const allNotes: Note[] = [...notes].sort((a, b) => lastTouched(b).localeCompare(lastTouched(a)))

export const allTags: string[] = [...new Set(allNotes.flatMap((n) => n.tags))].sort()

// A tag page with a note or two is too thin for search engines: it stays out of their index and out of
// the sitemap until the tag has this many notes. The page itself still works for visitors.
export const isIndexableTag = (tag: string) => allNotes.filter((n) => n.tags.includes(tag)).length >= 3

// The preview card drawn by app/garden/opengraph-image.tsx. /garden gets it automatically;
// note and tag pages set their own sharing tags, which drops it, so they name it themselves.
export const GARDEN_PREVIEW = {
    url: '/garden/opengraph-image',
    width: 1200,
    height: 630,
    alt: 'My Zettelkasten garden: small, linked notes by Sebastian Pellitero',
}

export const getNote = (slug: string) => allNotes.find((n) => n.slug === slug)

// Runs while the static pages are generated, so backlinks are fixed at build time
export const backlinksFor = (slug: string) => allNotes.filter((n) => n.slug !== slug && n.links.includes(slug))

export const relatedByTag = (note: Note, limit = 3) =>
    allNotes
        .filter((n) => n.slug !== note.slug && n.tags.some((t) => note.tags.includes(t)))
        .slice(0, limit)
