import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as React from 'react';

import { cn } from 'lib/utils';

const ScrollArea = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
    <ScrollAreaPrimitive.Root ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
        {children}
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollViewport = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.Viewport>,
    React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>
>(({ className, children, ...props }, ref) => (
    <ScrollAreaPrimitive.Viewport ref={ref} className={cn('h-full w-full rounded-[inherit]', className)} {...props}>
        {children}
    </ScrollAreaPrimitive.Viewport>
));
ScrollViewport.displayName = ScrollAreaPrimitive.Viewport.displayName;

const ScrollBar = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
    React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
        ref={ref}
        orientation={orientation}
        className={cn(
            'flex touch-none select-none transition-colors',
            orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
            orientation === 'horizontal' && 'h-2.5 border-t border-t-transparent p-[1px]',
            className
        )}
        {...props}
    >
        <ScrollThumb />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

const ScrollThumb = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.Thumb>,
    React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Thumb>
>(({ className, ...props }, ref) => (
    <ScrollAreaPrimitive.Thumb
        ref={ref}
        className={cn('relative flex-1 rounded-full bg-border', className)}
        {...props}
    />
));
ScrollThumb.displayName = ScrollAreaPrimitive.Thumb.displayName;

export { ScrollArea, ScrollBar, ScrollThumb, ScrollViewport };
