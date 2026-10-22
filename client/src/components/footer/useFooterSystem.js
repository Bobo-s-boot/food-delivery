import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useAccountNavigation } from "../../hooks/useAccountNavigation";
import { useSupport } from "../../features/support/useSupport";
import { useEngagement } from "../../features/engagement/useEngagement";
import { visibleFooterEntries } from "../../../../shared/engagement.mjs";
import { footerCopy } from "./footerCopy";

export function useFooterSystem() {
  const { t, i18n } = useTranslation();
  const copy = footerCopy[i18n.resolvedLanguage] || footerCopy.en;
  const { userBasePath } = useCurrentUser();
  const { openOrderTracking, openStudentDiscounts } = useAccountNavigation();
  const { openSupport } = useSupport();
  const { settings, hasLoaded } = useEngagement();
  const location = useLocation();
  const home = userBasePath || "/";
  const route = (path) => `${userBasePath}${path}`;
  const link = (key, to) => ({ key, label: t(`footer.links.${key}`), to: route(to) });
  const faqTo = { pathname: home, hash: "#faq" };
  const onFaq = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    // HomeFaq owns cross-page, first-load, reload and history hash changes.
    // Handle a repeated click on the same hash without changing that section.
    if (document.getElementById("faq") && location.hash === "#faq") {
      if (location.pathname === home) event.preventDefault();
      // Optional username routes can reuse Home without changing its hash.
      requestAnimationFrame(() => document.getElementById("faq")?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      }));
    }
  };
  const groups = [
    { key: "explore", title: copy.explore, items: [
      link("restaurants", "/catalog"), link("menu", "/menu"), link("specials", "/specials"),
      { key: "studentDiscounts", label: t("footer.links.studentDiscounts"), action: openStudentDiscounts },
    ] },
    { key: "help", title: copy.help, items: [
      { key: "trackOrder", label: t("footer.links.trackOrder"), action: openOrderTracking },
      link("delivery", "/delivery"),
      { key: "faq", label: t("footer.links.faq"), to: faqTo, onClick: onFaq },
      { key: "support", label: copy.support, action: () => openSupport() },
    ] },
    { key: "company", title: copy.company, items: [
      link("aboutUs", "/about"),
      ...(hasLoaded ? visibleFooterEntries(settings.navigation).map((item) => link(item.key, item.to)) : []),
    ] },
  ];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("empty");
  const [error, setError] = useState("");
  // The development-only response fixture replaces the old visible test controls.
  // No API is called. Normal subscription/duplicate behavior also runs in production.
  const responseMode = import.meta.env.DEV
    ? new URLSearchParams(window.location.search).get("newsletterResponse")
    : null;
  const inputRef = useRef(null);
  const subscribed = useRef(new Set());
  const pendingRef = useRef(false);
  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []);
  const onEmailChange = (value) => {
    setEmail(value);
    setStatus(value ? "typing" : "empty");
    setError("");
  };
  const onSubscribe = (event) => {
    event.preventDefault();
    if (pendingRef.current) return;
    const address = email.trim();
    if (!address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) || inputRef.current?.validity.typeMismatch) {
      setError(address ? "invalid" : "empty");
      setStatus("invalid");
      inputRef.current?.focus();
      return;
    }
    pendingRef.current = true;
    setEmail(address);
    setStatus("submitting");
    setError("");
    // Local simulated response: no request, coupon, confirmation email or API implied.
    timerRef.current = window.setTimeout(() => {
      const normalized = address.toLowerCase();
      if (responseMode === "network" || !navigator.onLine) setStatus("network");
      else if (responseMode === "already" || subscribed.current.has(normalized)) setStatus("already");
      else {
        subscribed.current.add(normalized);
        setStatus("success");
      }
      pendingRef.current = false;
    }, 1000);
  };
  const messageKey = status === "invalid" ? error : status === "submitting" ? "pending" : status;
  const message = ["empty", "typing"].includes(status) ? "" : copy[messageKey];
  return {
    copy, t, home, groups, privacyTo: route("/privacy-policy"),
    newsletter: { email, status, message, inputRef, onEmailChange, onSubscribe },
  };
}
