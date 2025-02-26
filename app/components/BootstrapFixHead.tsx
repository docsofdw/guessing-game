'use client';

import Script from 'next/script';

// Define the type for window.domQueryService
declare global {
  interface Window {
    domQueryService?: {
      checkPageContainsShadowDom: () => boolean;
    };
  }
}

export function BootstrapFixHead() {
  return (
    <Script id="bootstrap-fix-head" strategy="afterInteractive">
      {`
        // Fix for Bootstrap domQueryService error
        window.domQueryService = {
          checkPageContainsShadowDom: function() {
            return false;
          }
        };
        console.log('Bootstrap fix injected via script tag');
      `}
    </Script>
  );
} 