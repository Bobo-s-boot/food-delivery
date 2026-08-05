import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAuthToken, getStoredUser } from "../../api/authConfig";
import { AppToast } from "../../components/toast/AppToast";
import { SupportModal } from "./SupportModal";
import { SupportContext } from "./supportContext";
import { normalizeSupportContext } from "./support.utils";
import "./Support.scss";

const SUPPORT_INTENT_KEY = "defilicious_support_intent";

export function SupportProvider({ children }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const openerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [supportContext, setSupportContext] = useState({});
  const [toast, setToast] = useState(null);
  const isAuthenticated = Boolean(getAuthToken());

  const openSupport = useCallback((context = {}) => {
    openerRef.current = document.activeElement;
    setSupportContext(normalizeSupportContext(context));
    setIsOpen(true);
  }, []);

  const closeSupport = useCallback(() => {
    setIsOpen(false);
    const opener = openerRef.current;
    requestAnimationFrame(() => {
      if (opener instanceof HTMLElement && document.contains(opener)) opener.focus();
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated || location.pathname === "/auth") return;

    let isActive = true;
    try {
      const rawIntent = sessionStorage.getItem(SUPPORT_INTENT_KEY);
      if (!rawIntent) return;
      const intent = JSON.parse(rawIntent);
      const intentTimer = setTimeout(() => {
        if (!isActive) return;
        sessionStorage.removeItem(SUPPORT_INTENT_KEY);
        setSupportContext(normalizeSupportContext(intent.context));
        setIsOpen(true);
      }, 0);

      return () => {
        isActive = false;
        clearTimeout(intentTimer);
      };
    } catch {
      sessionStorage.removeItem(SUPPORT_INTENT_KEY);
    }

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, location.pathname]);

  const handleAuthenticate = useCallback(
    (mode) => {
      sessionStorage.setItem(
        SUPPORT_INTENT_KEY,
        JSON.stringify({ context: supportContext, createdAt: Date.now() }),
      );
      setIsOpen(false);
      navigate("/auth", {
        state: { authMode: mode, supportIntent: true },
      });
    },
    [navigate, supportContext],
  );

  const handleViewFaq = useCallback(() => {
    setIsOpen(false);
    navigate({ pathname: "/", hash: "#faq" });
  }, [navigate]);

  const handleOpenAccountSettings = useCallback(() => {
    const user = getStoredUser();
    setIsOpen(false);
    if (!user?.username) {
      navigate("/auth", { state: { accountSection: "settings" } });
      return;
    }
    navigate(`/${encodeURIComponent(user.username)}/profile?section=settings`);
  }, [navigate]);

  const handleSuccess = useCallback(
    (result) => {
      setIsOpen(false);
      setToast({ ticketId: result?.ticketId || "" });
      const opener = openerRef.current;
      requestAnimationFrame(() => {
        if (opener instanceof HTMLElement && document.contains(opener)) opener.focus();
      });
    },
    [],
  );

  const value = useMemo(
    () => ({ isOpen, openSupport, closeSupport }),
    [closeSupport, isOpen, openSupport],
  );

  return (
    <SupportContext.Provider value={value}>
      {children}
      <SupportModal
        isOpen={isOpen}
        isAuthenticated={isAuthenticated}
        context={supportContext}
        onClose={closeSupport}
        onAuthenticate={handleAuthenticate}
        onOpenAccountSettings={handleOpenAccountSettings}
        onSuccess={handleSuccess}
        onViewFaq={handleViewFaq}
      />
      <AppToast
        notification={
          toast
            ? {
                tone: "success",
                status: t("support.toast.status"),
                title: t("support.toast.title"),
                description: t("support.toast.description"),
                meta: toast.ticketId
                  ? t("support.toast.ticket", { ticketNumber: toast.ticketId })
                  : "",
                closeLabel: t("support.toast.close"),
              }
            : null
        }
        onDismiss={() => setToast(null)}
      />
    </SupportContext.Provider>
  );
}
