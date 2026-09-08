import { useEffect, useRef } from "react";

export function useFinanceDialogFocus(isOpen, onClose) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const panel = panelRef.current;
    const previousFocus = document.activeElement;
    const focusableSelector =
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';
    const focusable = () => Array.from(panel?.querySelectorAll(focusableSelector) || []);

    focusable()[0]?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [isOpen, onClose]);

  return panelRef;
}
