import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import type { PostMeta } from '../../types/post';

interface PostCardProps {
    post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
    return (
        <Link to={`/posts/${post.slug}`}>
            <Card variant="interactive">
                <CardHeader>
                    <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                        {post.title}
                    </h3>
                    <time className="text-sm text-[var(--color-muted)]">{post.date}</time>
                    {post.author && (
                        <p className="text-sm text-[var(--color-muted)]">By {post.author}</p>
                    )}
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-[var(--color-muted)]">{post.excerpt}</p>
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
