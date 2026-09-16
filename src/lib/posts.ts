import { parse as parseYaml } from 'yaml';
import * as z from 'zod';
import type { PostMeta } from '../types/post';

const PostConfigSchema = z.strictObject({
    title: z.string(),
    date: z.string(),
    author: z.string().optional(),
    excerpt: z.string(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
});

const confModules = import.meta.glob('/posts/*/conf.yaml', {
    eager: true,
    query: '?raw',
    import: 'default',
}) as Record<string, string>;

const postModules = import.meta.glob('/posts/*/post.md', {
    query: '?raw',
    import: 'default',
}) as Record<string, () => Promise<string>>;

function extractSlug(path: string): string {
    return path.split('/')[2]!;
}

const allPosts: PostMeta[] = Object.entries(confModules)
    .map(([path, raw]) => {
        const slug = extractSlug(path);
        const parsed = PostConfigSchema.parse(parseYaml(raw));
        return { ...parsed, slug } as PostMeta;
    })
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));

export function getAllPosts(): PostMeta[] {
    return allPosts;
}

export function getPostBySlug(slug: string): PostMeta | undefined {
    return allPosts.find((p) => p.slug === slug);
}

export async function getPostContent(slug: string): Promise<string> {
    const key = `/posts/${slug}/post.md`;
    const loader = postModules[key];
    if (!loader) throw new Error(`Post not found: ${slug}`);
    return loader();
}
