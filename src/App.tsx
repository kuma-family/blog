import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/use-theme';
import { Sidebar } from './components/ui/sidebar';
import { Skeleton } from './components/ui/skeleton';

const HomePage = lazy(() => import('./features/home/home-page'));
const PostListPage = lazy(() => import('./features/posts/post-list'));
const PostDetailPage = lazy(() => import('./features/posts/post-detail'));

function PageFallback() {
    return (
        <div className="space-y-4 p-8">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
        </div>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-[var(--color-surface)]">
                    <Sidebar />
                    <main className="ml-64 min-h-screen p-8">
                        <Suspense fallback={<PageFallback />}>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/posts" element={<PostListPage />} />
                                <Route path="/posts/:slug" element={<PostDetailPage />} />
                            </Routes>
                        </Suspense>
                    </main>
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
}
