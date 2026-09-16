import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ComponentProps } from 'react';
import { cn } from '../../lib/cn';

const cardVariants = cva(
    'rounded-[var(--radius-lg)] border border-[var(--color-border)] glass transition-shadow hover:shadow-lg',
    {
        variants: {
            variant: {
                default: '',
                interactive: 'cursor-pointer hover:border-accent-500/50',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

interface CardProps extends ComponentProps<'article'>, VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLElement, CardProps>(({ className, variant, ...props }, ref) => (
    <article ref={ref} className={cn(cardVariants({ variant, className }))} {...props} />
));
Card.displayName = 'Card';

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
    return <div className={cn('p-6 pb-0', className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
    return <div className={cn('p-6', className)} {...props} />;
}
