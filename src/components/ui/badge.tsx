import { cva, type VariantProps } from 'class-variance-authority';
import { type ComponentProps } from 'react';
import { cn } from '../../lib/cn';

const badgeVariants = cva(
    'inline-flex items-center rounded-[var(--radius-sm)] px-2.5 py-0.5 text-xs font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-accent-500/10 text-accent-600',
                secondary: 'bg-[var(--color-surface-elevated)] text-[var(--color-muted)]',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

interface BadgeProps extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
    return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
