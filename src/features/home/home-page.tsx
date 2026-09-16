import { Link } from 'react-router-dom';
import { getAllPosts } from '../../lib/posts';
import { PostCard } from '../posts/post-card';

export default function HomePage() {
    const posts = getAllPosts().slice(0, 5);

    return (
        <div className="space-y-8">
            <section>
                <h2 className="text-3xl font-bold text-[var(--color-foreground)]">Hello.</h2>
                <p className="mt-4 text-[var(--color-muted)] leading-relaxed">
                    Welcome to the blog. Thoughts, notes, and experiments.
                </p>
            </section>

            {posts.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                            Recent Posts
                        </h3>
                        <Link
                            to="/posts"
                            className="text-sm text-accent-600 hover:text-accent-500 transition-colors"
                        >
                            View all &rarr;
                        </Link>
                    </div>
                    <div className="grid gap-4">
                        {posts.map((post) => (
                            <PostCard key={post.slug} post={post} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
