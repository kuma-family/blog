import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

describe('posts', () => {
    it('loads posts from the filesystem', () => {
        const posts = getAllPosts();
        expect(posts.length).toBeGreaterThan(0);
    });

    it('finds a post by slug', () => {
        const expected = getAllPosts()[0]!;
        const post = getPostBySlug(expected.slug);
        expect(post).toBeDefined();
        expect(post).toEqual(expected);
    });

    it('does not include drafts', () => {
        const posts = getAllPosts();
        const drafts = posts.filter((p) => p.draft);
        expect(drafts).toHaveLength(0);
    });
});
