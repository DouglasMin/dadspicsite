import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useRevealOnScroll } from '@/hooks/useReveal';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset in ms. Keep between 30 and 80 per sibling. */
  delay?: number;
  as?: ElementType;
}

/**
 * Wraps content so it arrives on scroll instead of already being there.
 * Renders a plain element — safe to drop straight into a grid or flex parent.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRevealOnScroll<HTMLElement>();

  return (
    <Tag
      ref={ref}
      className={cn('reveal', className)}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
