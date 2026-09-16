import { cn } from '../../lib/cn';
import { Separator as RadixSeparator } from '@radix-ui/react-separator';
import type { ComponentProps } from 'react';

export function Separator({
    className,
    orientation = 'horizontal',
    ...props
}: ComponentProps<typeof RadixSeparator>) {
    return (
        <RadixSeparator
            orientation={orientation}
            className={cn(
                'bg-[var(--color-border)]',
                orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
                className,
            )}
            {...props}
        />
    );
}
