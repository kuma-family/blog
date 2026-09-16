import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostBySlug, getPostContent } from '../../lib/posts';
import { imageUrlMap } from '../../lib/images';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

export default function PostDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [result, setResult] = useState<{
        slug: string;
        content: string | null;
        error: string | null;
    } | null>(null);
    const loading = result?.slug !== slug;
    const content = loading ? null : result?.content;
    const error = loading ? null : result?.error;

    const post = slug ? getPostBySlug(slug) : undefined;

    useEffect(() => {
        if (!slug) return;
        let active = true;
        getPostContent(slug).then(
            (content) => {
                if (active) setResult({ slug, content, error: null });
            },
            (err: Error) => {
                if (active) setResult({ slug, content: null, error: err.message });
            },
        );
        return () => {
            active = false;
        };
    }, [slug]);

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-[var(--color-muted)]">Post not found.</p>
                <Link
                    to="/posts"
                    className="mt-4 text-accent-600 hover:text-accent-500 transition-colors"
                >
                    Back to posts
                </Link>
            </div>
        );
    }

    return (
        <article className="mx-auto max-w-3xl">
            <Link
                to="/posts"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)] mb-8 transition-colors"
            >
                <ArrowLeft className="size-4" />
                Back to posts
            </Link>

            <Card>
                <CardHeader>
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
                        {post.title}
                    </h1>
                    <time className="text-sm text-[var(--color-muted)]">{post.date}</time>
                    {post.author && (
                        <p className="text-sm text-[var(--color-muted)]">By {post.author}</p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Badge key={tag}>{tag}</Badge>
                            ))}
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/6" />
                        </div>
                    ) : error ? (
                        <p className="text-red-500">Failed to load post: {error}</p>
                    ) : content ? (
                        <div
                            className="prose dark:prose-invert max-w-none
                prose-a:text-accent-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-[var(--radius-lg)]
                prose-code:rounded-[var(--radius-sm)] prose-code:bg-[var(--color-surface-elevated)] prose-code:px-1.5 prose-code:py-0.5
                prose-pre:rounded-[var(--radius-lg)] prose-pre:bg-[var(--color-surface-elevated)]"
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                urlTransform={(url) => {
                                    if (imageUrlMap.has(url)) return imageUrlMap.get(url)!;
                                    return url;
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </article>
    );
}
