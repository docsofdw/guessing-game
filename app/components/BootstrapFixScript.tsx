'use client';

import Script from 'next/script';

export function BootstrapFixScript() {
  return (
    <Script id="bootstrap-fix-script" strategy="afterInteractive">
      {`
        // Fix for Bootstrap domQueryService error
        if (typeof window !== 'undefined') {
          // Define the domQueryService globally
          window.domQueryService = {
            checkPageContainsShadowDom: function() {
              try {
                return false;
              } catch (e) {
                return false;
              }
            }
          };
          
          // Patch any existing methods that might be causing errors
          const originalCheckPageContainsShadowDom = 
            window.domQueryService.checkPageContainsShadowDom;
          
          // Override the method to ensure it never throws errors
          window.domQueryService.checkPageContainsShadowDom = function() {
            try {
              if (typeof originalCheckPageContainsShadowDom === 'function') {
                return originalCheckPageContainsShadowDom.apply(this);
              }
              return false;
            } catch (e) {
              console.warn('Error in checkPageContainsShadowDom, returning false', e);
              return false;
            }
          };
          
          console.log('Early Bootstrap compatibility fixes initialized');
        }
      `}
    </Script>
  );
} 