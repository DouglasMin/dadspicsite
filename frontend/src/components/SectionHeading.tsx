import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  /** Editorial index — "01", "02"… Anchors the reader in a long page. */
  index?: string;
  /** Small Latin label set opposite the index. */
  kicker?: string;
  title: string;
  className?: string;
}

/** Rule line with an index and a Latin label, then the heading beneath it. */
export function SectionHeading({
  index,
  kicker,
  title,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn('w-full', className)}>
      <div className="flex items-center gap-4">
        {index && <span className="index-num shrink-0">{index}</span>}
        <span className="h-px flex-1 bg-rule" aria-hidden="true" />
        {kicker && (
          <span className="label-sm shrink-0 text-right">{kicker}</span>
        )}
      </div>

      <h2 className="font-serif text-h2 mt-5 font-normal text-ink">{title}</h2>
    </header>
  );
}

interface PageMastheadProps {
  /** Large Latin display word — "Gallery", "Exhibitions", "Contact". */
  title: string;
  /** Korean standfirst under the rule. */
  children?: ReactNode;
  /** Right-hand column, e.g. a work count. */
  aside?: ReactNode;
}

/** Full-width editorial masthead used at the top of each listing page. */
export function PageMasthead({ title, children, aside }: PageMastheadProps) {
  return (
    <header className="shell pt-[calc(var(--space-section)*0.72)] pb-[var(--space-block)]">
      <h1 className="font-serif text-display font-light tracking-[-0.02em] text-ink">
        {title}
      </h1>

      <div className="mt-8 h-px w-full bg-rule" aria-hidden="true" />

      <div className="mt-7 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-12">
        {children && (
          <p className="text-body max-w-xl text-ink-soft">{children}</p>
        )}
        {aside && <div className="md:text-right">{aside}</div>}
      </div>
    </header>
  );
}
