import type { PhrasingContent, Root, Text } from 'mdast'
import { expect, test, vi } from 'vitest'
import { extractWikilinks, remarkWikilinks } from './wikilinks'

const text = (value: string): Text => ({ type: 'text', value })
const run = (children: PhrasingContent[], known = ['focus-trap', 'roving-tabindex']) => {
    const paragraph = { type: 'paragraph' as const, children }
    const tree: Root = { type: 'root', children: [paragraph] }
    remarkWikilinks({ base: '/garden', known: () => new Set(known) })(tree, { path: 'test.md' })
    return paragraph.children
}

test('resolves plain, aliased and #heading links', () => {
    const out = run([text('See [[focus-trap]], [[roving-tabindex|roving]] and [[Focus Trap#why]].')])
    expect(out.filter((n) => n.type === 'link')).toMatchObject([
        { url: '/garden/focus-trap', children: [{ value: 'focus-trap' }] },
        { url: '/garden/roving-tabindex', children: [{ value: 'roving' }] },
        { url: '/garden/focus-trap', children: [{ value: 'Focus Trap' }] },
    ])
    expect(out[0]).toEqual(text('See '))
    expect(out.at(-1)).toEqual(text('.'))
})

test('unknown target becomes marked text with a screen-reader hint and a warning, never a link', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const out = run([text('Broken: [[does-not-exist]]')])
    expect(out[1]).toMatchObject({
        data: { hName: 'span', hProperties: { className: ['wikilink-unresolved'] } },
        children: [{ value: 'does-not-exist' }, { children: [{ value: ' (unresolved link)' }] }],
    })
    expect(out.some((n) => n.type === 'link')).toBe(false)
    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0][0]).toMatch(/test\.md: unresolved link \[\[does-not-exist\]\]/)
    warn.mockRestore()
})

test('leaves code and existing links untouched', () => {
    const code: PhrasingContent = { type: 'inlineCode', value: '[[focus-trap]]' }
    const link: PhrasingContent = { type: 'link', url: 'https://x.dev', children: [text('[[focus-trap]]')] }
    expect(run([code, link])).toEqual([code, link])
})

test('extractWikilinks dedupes, normalises and skips code', () => {
    const raw = 'A [[focus-trap]] and [[Focus Trap|again]].\n\n```md\n[[roving-tabindex]]\n```\n~~~\n[[tilde-fence]]\n~~~\n`[[nope]]` and [[welcome#top]]'
    expect(extractWikilinks(raw)).toEqual(['focus-trap', 'welcome'])
})
