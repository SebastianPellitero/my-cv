import type { Parent, PhrasingContent, Root, RootContent, Text } from 'mdast'

// Obsidian syntax: [[target]], [[target|label]], [[target#heading]] (the heading part is dropped)
const WIKILINK = /\[\[([^[\]|#]+)(?:#[^[\]|]*)?(?:\|([^[\]]+))?\]\]/g

// File names are slugs; this also lets [[Focus Trap]] resolve to focus-trap.md
export const toSlug = (target: string) => target.trim().toLowerCase().replace(/\s+/g, '-')

// Targets linked from a note's raw markdown; code is skipped so `[[x]]` in examples isn't a backlink
export function extractWikilinks(raw: string): string[] {
    const prose = raw.replace(/(```|~~~)[\s\S]*?\1/g, '').replace(/`[^`\n]*`/g, '')
    return [...new Set([...prose.matchAll(WIKILINK)].map((m) => toSlug(m[1])))]
}

type Options = {
    base: string
    // Called once per file; a function so the set can be rebuilt between Velite builds
    known: () => ReadonlySet<string>
}

export function remarkWikilinks({ base, known }: Options) {
    return (tree: Root, file: { path?: string }) => {
        const slugs = known()

        const walk = (node: Parent) => {
            // Only text nodes are rewritten: code / inlineCode keep [[...]] literally, and text already inside a link is left alone
            node.children = node.children.flatMap((child): RootContent[] => {
                if (child.type === 'text') return split(child)
                if (child.type !== 'link' && child.type !== 'linkReference' && 'children' in child) walk(child)
                return [child]
            }) as Parent['children']
        }

        const split = (node: Text): PhrasingContent[] => {
            const out: PhrasingContent[] = []
            let last = 0
            for (const m of node.value.matchAll(WIKILINK)) {
                const [whole, target, alias] = m
                const slug = toSlug(target)
                const label = (alias ?? target).trim()
                if (m.index > last) out.push({ type: 'text', value: node.value.slice(last, m.index) })
                if (slugs.has(slug)) {
                    out.push({ type: 'link', url: `${base}/${slug}`, children: [{ type: 'text', value: label }] })
                } else {
                    console.warn(`[garden] ${file.path ?? 'unknown file'}: unresolved link [[${target.trim()}]]`)
                    out.push(unresolved(label))
                }
                last = m.index + whole.length
            }
            if (last === 0) return [node]
            if (last < node.value.length) out.push({ type: 'text', value: node.value.slice(last) })
            return out
        }

        walk(tree)
    }
}

// Rendered as <span class="wikilink-unresolved">label<span class="sr-only"> (unresolved link)</span></span>
function unresolved(label: string): PhrasingContent {
    const span = { hName: 'span', hProperties: { className: ['wikilink-unresolved'] } }
    const srOnly = { hName: 'span', hProperties: { className: ['sr-only'] } }
    return {
        type: 'emphasis',
        data: span,
        children: [
            { type: 'text', value: label },
            { type: 'emphasis', data: srOnly, children: [{ type: 'text', value: ' (unresolved link)' }] },
        ],
    }
}
