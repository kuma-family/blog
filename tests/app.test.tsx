import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '@/App';
import { getAllPosts, getPostBySlug, getPostContent } from '@/lib/posts';

vi.mock('@/lib/posts', () => ({
    getAllPosts: vi.fn(),
    getPostBySlug: vi.fn(),
    getPostContent: vi.fn(),
}));

const post = {
    slug: 'example',
    title: 'Example article',
    author: 'Example Author',
    date: '2026-09-17',
    excerpt: 'An example excerpt',
    tags: ['technology'],
};

beforeEach(() => {
    vi.resetAllMocks();
    const storage = new Map<string, string>();
    vi.stubGlobal('localStorage', {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
    });
    document.documentElement.classList.remove('dark');
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }));
    window.history.replaceState(null, '', '/');
    vi.mocked(getAllPosts).mockReturnValue([post]);
    vi.mocked(getPostBySlug).mockImplementation((slug) => (slug === post.slug ? post : undefined));
    vi.mocked(getPostContent).mockResolvedValue('Article body with [a link](https://example.com).');
});

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

describe('blog navigation', () => {
    it('shows the author on cards and articles and loads article content', async () => {
        const user = userEvent.setup();
        render(<App />);
        expect(await screen.findByText('By Example Author')).toBeVisible();
        await user.click(screen.getByRole('link', { name: /View all/ }));
        expect(await screen.findByRole('heading', { name: 'All Posts' })).toBeVisible();
        await user.click(screen.getByRole('link', { name: /Example article/ }));
        expect(await screen.findByRole('heading', { name: post.title })).toBeVisible();
        expect(screen.getByText('By Example Author')).toBeVisible();
        expect(await screen.findByRole('link', { name: 'a link' })).toHaveAttribute(
            'href',
            'https://example.com',
        );
        await user.click(screen.getByRole('link', { name: 'Back to posts' }));
        expect(await screen.findByRole('heading', { name: 'All Posts' })).toBeVisible();
    });

    it('handles an empty blog', async () => {
        vi.mocked(getAllPosts).mockReturnValue([]);
        const user = userEvent.setup();
        render(<App />);
        await screen.findByRole('heading', { name: 'Hello.' });
        expect(screen.queryByText('Recent Posts')).not.toBeInTheDocument();
        await user.click(screen.getByRole('link', { name: 'Posts' }));
        expect(await screen.findByText('No posts yet.')).toBeVisible();
    });

    it('shows a missing-post message', async () => {
        window.history.replaceState(null, '', '/posts/missing');
        render(<App />);
        expect(await screen.findByText('Post not found.')).toBeVisible();
    });

    it('shows content-loading failures', async () => {
        window.history.replaceState(null, '', '/posts/example');
        vi.mocked(getPostContent).mockRejectedValue(new Error('Unavailable'));
        render(<App />);
        expect(await screen.findByText('Failed to load post: Unavailable')).toBeVisible();
    });

    it('does not show a late article response after leaving the article', async () => {
        let resolveContent!: (value: string) => void;
        vi.mocked(getPostContent).mockReturnValue(
            new Promise((resolve) => {
                resolveContent = resolve;
            }),
        );
        window.history.replaceState(null, '', '/posts/example');
        const user = userEvent.setup();
        render(<App />);
        await screen.findByRole('heading', { name: post.title });
        await user.click(screen.getByRole('link', { name: 'Back to posts' }));
        await act(async () => resolveContent('Stale article body'));
        expect(await screen.findByRole('heading', { name: 'All Posts' })).toBeVisible();
        expect(screen.queryByText('Stale article body')).not.toBeInTheDocument();
    });

    it('toggles and persists the selected theme', async () => {
        const user = userEvent.setup();
        render(<App />);
        await screen.findByRole('heading', { name: 'Hello.' });
        await user.click(screen.getByRole('button', { name: 'Switch to dark mode' }));
        expect(document.documentElement).toHaveClass('dark');
        expect(localStorage.getItem('theme')).toBe('dark');
        await user.click(screen.getByRole('button', { name: 'Switch to light mode' }));
        expect(document.documentElement).not.toHaveClass('dark');
        expect(localStorage.getItem('theme')).toBe('light');
    });

    it('restores a saved dark theme', async () => {
        localStorage.setItem('theme', 'dark');
        render(<App />);
        expect(await screen.findByRole('button', { name: 'Switch to light mode' })).toBeVisible();
        expect(document.documentElement).toHaveClass('dark');
    });
});
