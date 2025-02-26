// Global type declarations for the application

// Extend the Window interface to include our custom properties
interface Window {
  domQueryService?: {
    checkPageContainsShadowDom: () => boolean;
    getDocument: () => Document;
    querySelector: (selector: string) => Element | null;
    querySelectorAll: (selector: string) => NodeListOf<Element>;
    [key: string]: any;
  };
  checkPageContainsShadowDom?: () => boolean;
} 