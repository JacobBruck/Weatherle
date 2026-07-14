import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Standard dialog keyboard behavior, shared by every modal in the app: focuses the
 * dialog on open, traps Tab/Shift+Tab within it (otherwise Tab order follows raw DOM
 * position, not visual stacking, and can walk straight past the modal into the page
 * behind it), closes on Escape, and restores focus to whatever triggered it on close.
 * `onClose` is optional because the first-run setup wizard is intentionally
 * non-dismissable until a choice is made.
 */
export function useModalFocusTrap<T extends HTMLElement>(onClose?: () => void) {
  const containerRef = useRef<T>(null);
  // Kept current via a ref (rather than an effect dep) so the mount-only effect below
  // never has to tear down and re-run just because a parent re-render handed it a new
  // inline onClose closure.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    function focusableElements(): HTMLElement[] {
      return Array.from(container!.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    }

    focusableElements()[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && onCloseRef.current) {
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusableElements();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    // Multi-step dialogs (the setup wizard) swap their focused button out for a
    // different one on each step without unmounting the dialog itself — when that
    // happens the browser drops focus to nowhere. Pull it back to the dialog's new
    // first focusable element whenever focus would otherwise leave the container.
    function handleFocusOut() {
      requestAnimationFrame(() => {
        if (container && !container.contains(document.activeElement)) {
          focusableElements()[0]?.focus();
        }
      });
    }

    document.addEventListener('keydown', handleKeyDown);
    container.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('focusout', handleFocusOut);
      previouslyFocused?.focus?.();
    };
  }, []);

  return containerRef;
}
