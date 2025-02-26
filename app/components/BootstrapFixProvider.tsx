'use client';

import Script from 'next/script';

export function BootstrapFixProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script id="bootstrap-fix-provider" strategy="afterInteractive">
        {`
          // Initialize Bootstrap fixes
          if (typeof window !== 'undefined') {
            // Ensure domQueryService exists
            window.domQueryService = window.domQueryService || {
              checkPageContainsShadowDom: function() {
                return false;
              }
            };
            
            console.log('Bootstrap fixes initialized from provider');
          }
        `}
      </Script>
      {children}
    </>
  );
} 