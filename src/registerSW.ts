export const registerSW = async (): Promise<void> => {
  // Check specifically for StackBlitz environment first
  if (window.navigator.userAgent.includes('StackBlitz')) {
    console.log('Service Workers are not supported in StackBlitz');
    return;
  }

  // Check other unsupported environments
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('Service Workers are not supported in this environment');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      import.meta.env.MODE === 'development' 
        ? '/dev-sw.js?dev-sw' 
        : '/sw.js'
    );
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  } catch (error) {
    console.error('ServiceWorker registration failed: ', error);
  }
};

export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
};