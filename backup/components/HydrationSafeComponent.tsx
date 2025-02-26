'use client';
import { useState, useEffect, ReactNode, useRef } from 'react';

interface HydrationSafeComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

/**
 * A component that renders its children only on the client side to avoid hydration mismatches.
 * This is useful for components that use browser-specific APIs or have dynamic content that
 * might cause hydration mismatches.
 */
export function HydrationSafeComponent({ 
  children, 
  fallback = null,
  className = ''
}: HydrationSafeComponentProps) {
  const [isClient, setIsClient] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  // Set up hydration detection
  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);
    
    // Use requestAnimationFrame to ensure we're fully hydrated
    requestAnimationFrame(() => {
      setIsHydrated(true);
    });
    
    // Set up mutation observer to handle any injected elements
    if (componentRef.current) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeName === 'SCRIPT' || 
                  (node.nodeType === 1 && 
                   node instanceof Element && 
                   node.hasAttribute('data-is-priority'))) {
                node.parentNode?.removeChild(node);
              }
            });
          }
        });
      });
      
      observer.observe(componentRef.current, { childList: true, subtree: true });
      
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  // On the server or during hydration, render the fallback
  if (!isClient || !isHydrated) {
    return <div className={`hydration-safe-wrapper ${className}`} ref={componentRef}>{fallback}</div>;
  }

  // On the client, after hydration, render the actual children
  return <div className={`hydration-safe-wrapper ${className}`} ref={componentRef}>{children}</div>;
} 