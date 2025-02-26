import Script from 'next/script';

export function BootstrapFixInlineScript() {
  // This is a server component that renders an inline script
  return (
    <Script id="bootstrap-fix-inline" strategy="beforeInteractive">
      {`
        // Fix for Bootstrap domQueryService error
        window.domQueryService = {
          checkPageContainsShadowDom: function() {
            return false;
          }
        };
        console.log('Bootstrap fix injected via inline script');
      `}
    </Script>
  );
} 