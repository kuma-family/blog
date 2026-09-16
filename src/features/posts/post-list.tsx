import { getAllPosts } from '../../lib/posts';
import { PostCard } from './post-card';

export default function PostListPage() {
    const posts = getAllPosts();

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)]">All Posts</h2>
            {posts.length === 0 ? (
                <p className="text-[var(--color-muted)]">No posts yet.</p>
            ) : (
                <div className="grid gap-4">
                    {posts.map((post) => (
                        <PostCard key={post.slug} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}
