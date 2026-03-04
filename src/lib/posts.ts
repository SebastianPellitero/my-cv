import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");

export type PostMeta = {
    slug: string;
    title: string;
    date: string;
    description?: string;
    tags?: string[];
    readingMinutes: number;
};

export type Post = PostMeta & { content: string };

function ensurePostsDir() {
    // If you prefer “fail fast”, remove this and just throw.
    if (!fs.existsSync(POSTS_DIR)) {
        return false;
    }
    return true;
}

export function getAllPostsMeta(): PostMeta[] {
    if (!ensurePostsDir()) return [];


    const files = fs
        .readdirSync(POSTS_DIR)
        .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

    const posts = files.map((file) => {
        const slug = file.replace(/\.mdx?$/, "");
        const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
        const { data, content } = matter(raw);

        const rt = readingTime(content);

        return {
            slug,
            title: String(data.title ?? slug),
            date: String(data.date ?? ""),
            description: data.description ? String(data.description) : undefined,
            tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
            readingMinutes: Math.max(1, Math.round(rt.minutes)),
        };
    });

    return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post {
    const mdxPath = path.join(POSTS_DIR, `${slug}.mdx`);
    const mdPath = path.join(POSTS_DIR, `${slug}.md`);

    const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;
    if (!fs.existsSync(filePath)) throw new Error(`Post not found: ${slug}`);

    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const rt = readingTime(content);

    return {
        slug,
        title: String(data.title ?? slug),
        date: String(data.date ?? ""),
        description: data.description ? String(data.description) : undefined,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
        readingMinutes: Math.max(1, Math.round(rt.minutes)),
        content,
    };
}