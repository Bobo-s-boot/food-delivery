import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, CircleAlert, X } from "lucide-react";
import "./AppToast.scss";

export function AppToast({ notification, onDismiss }) {
  const [isVisible, setIsVisible] = useState(false);
  const dismissTimerRef = useRef(null);
  const exitTimerRef = useRef(null);

  const dismiss = useCallback(() => {
    clearTimeout(dismissTimerRef.current);
    setIsVisible(false);
    exitTimerRef.current = setTimeout(onDismiss, 240);
  }, [onDismiss]);

  const startTimer = useCallback(() => {
    clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(dismiss, 5000);
  }, [dismiss]);

  useEffect(() => {
    if (!notification) return undefined;
    const frame = requestAnimationFrame(() => setIsVisible(true));
    startTimer();

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(dismissTimerRef.current);
      clearTimeout(exitTimerRef.current);
    };
  }, [notification, startTimer]);

  if (!notification) return null;

  const Icon = notification.tone === "error" ? CircleAlert : CheckCircle2;

  return createPortal(
    <div
      className={`app-toast app-toast--${notification.tone || "success"} ${
        isVisible ? "app-toast--visible" : ""
      }`}
      role={notification.tone === "error" ? "alert" : "status"}
      aria-live={notification.tone === "error" ? "assertive" : "polite"}
      onMouseEnter={() => clearTimeout(dismissTimerRef.current)}
      onMouseLeave={startTimer}
    >
      <Icon className="app-toast__icon" aria-hidden="true" />
      <div className="app-toast__copy">
        {notification.status && <span>{notification.status}</span>}
        <strong>{notification.title}</strong>
        <p>{notification.description}</p>
        {notification.meta && <small>{notification.meta}</small>}
      </div>
      <button
        type="button"
        className="app-toast__close"
        aria-label={notification.closeLabel}
        onClick={dismiss}
      >
        <X aria-hidden="true" size={17} />
      </button>
    </div>,
    document.body,
  );
}
