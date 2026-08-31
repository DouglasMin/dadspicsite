import { useEffect, useRef } from 'react';

/**
 * Scroll-entry reveal.
 *
 * One shared IntersectionObserver flips `data-revealed="true"` on an element the
 * first time it enters the viewport, then stops watching it. All of the actual
 * motion lives in `index.css` (`.reveal`), so a CSS animation runs it off the
 * main thread and `prefers-reduced-motion` can swap it for a plain fade.
 */

let sharedObserver: IntersectionObserver | null = null;

function getRevealObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === 'undefined') return null;

  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-revealed', 'true');
          sharedObserver?.unobserve(entry.target);
        }
      },
      // Trigger a little before the element is fully on screen so the motion
      // finishes as it settles rather than starting once it is already read.
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 }
    );
  }

  return sharedObserver;
}

export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = getRevealObserver();

    // No IntersectionObserver (or a non-browser render): show the content
    // rather than leaving it stuck at opacity 0.
    if (!observer) {
      node.setAttribute('data-revealed', 'true');
      return;
    }

    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  return ref;
}
