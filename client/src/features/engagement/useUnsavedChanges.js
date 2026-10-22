import { useEffect } from "react";

export function initializeNavigationGuard() {
  if (window.__defiliciousNavigationGuard)
    return window.__defiliciousNavigationGuard;
  const guard = { pop: new Set(), hash: new Set() };
  // Register before HashRouter mounts: its pop listener can synchronously unmount a form.
  for (const [eventName, handlers] of [
    ["popstate", guard.pop],
    ["hashchange", guard.hash],
  ]) {
    window.addEventListener(
      eventName,
      (event) => {
        for (const handler of handlers) {
          handler(event);
          if (event.cancelBubble) break;
        }
      },
      true,
    );
  }
  window.__defiliciousNavigationGuard = guard;
  return guard;
}

export function useUnsavedChanges(dirty, message = "Есть несохранённые изменения. Покинуть страницу без сохранения?") {
  useEffect(() => {
    if (!dirty) return;
    const guard = initializeNavigationGuard();
    const savedIndex = window.history.state?.idx;
    const savedState = window.history.state;
    const savedUrl = window.location.href;
    let restoring = false;
    let suppressHash = false;
    const beforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const beforeNavigate = (event) => {
      const target = event.target.closest("a[href], [data-admin-navigation]");
      if (
        !target ||
        target.target === "_blank" ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey
      )
        return;
      if (
        !window.confirm(
          message,
        )
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    const beforeBack = (event) => {
      if (restoring) {
        restoring = false;
        return;
      }
      const currentIndex = event.state?.idx;
      if (window.location.href === savedUrl) return;
      if (
        !window.confirm(
          message,
        )
      ) {
        event.stopImmediatePropagation();
        if (Number.isInteger(savedIndex) && Number.isInteger(currentIndex)) {
          restoring = true;
          window.history.go(savedIndex - currentIndex);
        } else {
          // Manually entered hashes can create entries without Router's idx.
          // Restore the address while retaining the mounted form and its draft.
          suppressHash = true;
          window.history.pushState(
            { ...savedState, idx: Number.isInteger(savedIndex) ? savedIndex : 0 },
            "",
            savedUrl,
          );
        }
      }
    };
    const beforeHash = (event) => {
      if (restoring || suppressHash) {
        event.stopImmediatePropagation();
        suppressHash = false;
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    window.addEventListener("click", beforeNavigate, true);
    guard.pop.add(beforeBack);
    guard.hash.add(beforeHash);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("click", beforeNavigate, true);
      guard.pop.delete(beforeBack);
      guard.hash.delete(beforeHash);
    };
  }, [dirty, message]);
}
