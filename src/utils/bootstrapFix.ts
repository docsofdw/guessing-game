/**
 * This utility provides fixes for Bootstrap-related issues in Next.js
 * It mocks the domQueryService that Bootstrap's legacy code expects
 */

// Declare the domQueryService type
declare global {
  interface Window {
    domQueryService?: {
      checkPageContainsShadowDom: () => boolean;
    };
  }
}

/**
 * Initializes fixes for Bootstrap in a Next.js environment
 * Call this function in your app's entry point or layout
 */
export function initBootstrapFixes(): void {
  if (typeof window !== 'undefined') {
    // Create a mock domQueryService if it doesn't exist
    window.domQueryService = {
      checkPageContainsShadowDom: () => false
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
    
    console.log('Bootstrap compatibility fixes initialized');
  }
} 