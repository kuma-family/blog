import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { ThemeToggle } from './theme-toggle';
import { Separator } from './separator';

export function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col glass border-r border-[var(--color-border)]">
            <div className="flex h-16 items-center px-6">
                <h1 className="text-lg font-semibold text-[var(--color-foreground)]">Kuma Blog</h1>
            </div>
            <Separator />
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                <SidebarLink to="/" end>
                    Home
                </SidebarLink>
                <SidebarLink to="/posts">Posts</SidebarLink>
            </nav>
            <Separator />
            <div className="p-3">
                <ThemeToggle />
            </div>
        </aside>
    );
}

function SidebarLink({
    to,
    end,
    children,
}: {
    to: string;
    end?: boolean;
    children: React.ReactNode;
}) {
    return (
        <NavLink
            to={to}
            {...(end !== undefined ? { end } : {})}
            className={({ isActive }) =>
                cn(
                    'flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors',
                    isActive
                        ? 'bg-accent-500/10 text-accent-600 font-medium'
                        : 'text-[var(--color-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-elevated)]',
                )
            }
        >
            {children}
        </NavLink>
    );
}
