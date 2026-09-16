const imageModules = import.meta.glob('/posts/*/img/*', {
    eager: true,
    query: '?url',
    import: 'default',
}) as Record<string, string>;

function buildImageMap(): Map<string, string> {
    const map = new Map<string, string>();
    for (const [path, url] of Object.entries(imageModules)) {
        const parts = path.split('/');
        const filename = parts.slice(4).join('/');
        const relativePath = `./img/${filename}`;
        map.set(relativePath, url);
    }
    return map;
}

export const imageUrlMap = buildImageMap();
