export interface PostConfig {
    title: string;
    date: string;
    author?: string;
    excerpt: string;
    tags?: string[];
    draft?: boolean;
}

export interface PostMeta extends PostConfig {
    slug: string;
}
