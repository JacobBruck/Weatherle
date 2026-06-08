declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a custom Google Analytics (GA4) event. Page views/hits are tracked automatically
 * by the gtag snippet in index.html — this is only for the extra "what did they play"
 * signal, so the GA dashboard can break plays down by mode/difficulty, geography, and time range.
 */
export function trackEvent(name: string, params?: Record<string, string>): void {
  window.gtag?.('event', name, params);
}
