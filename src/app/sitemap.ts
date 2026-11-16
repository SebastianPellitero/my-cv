import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { allNotes, allTags, isIndexableTag, lastTouched } from "@/lib/garden";

export default function sitemap(): MetadataRoute.Sitemap {
    const pages = ["", "/about", "/projects", "/contact", "/garden"].map((path) => ({ url: `${SITE_URL}${path}` }));
    const notes = allNotes.map((n) => ({ url: `${SITE_URL}/garden/${n.slug}`, lastModified: lastTouched(n) }));
    const tags = allTags.filter(isIndexableTag).map((t) => ({ url: `${SITE_URL}/garden/tags/${t}` }));
    return [...pages, ...notes, ...tags];
}
