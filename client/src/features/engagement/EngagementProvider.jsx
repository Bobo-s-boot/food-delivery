import { useCallback, useEffect, useRef, useState } from "react";
import {
  getPublicEngagement,
  engagementError,
} from "../../api/engagementService";
import { defaultSettings } from "../../../../shared/engagement.mjs";
import { EngagementContext } from "./EngagementContext";

export function EngagementProvider({ children }) {
  const [data, setData] = useState({
    settings: defaultSettings,
    vacancies: [],
    intakeReady: false,
    demo: false,
  });
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState("");
  const sequence = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++sequence.current;
    try {
      const result = await getPublicEngagement();
      if (request !== sequence.current) return;
      setData(result);
      setHasLoaded(true);
      setError("");
    } catch (err) {
      if (request !== sequence.current) return;
      setError(
        engagementError(
          err,
          "Не удалось загрузить данные. Попробуйте ещё раз.",
        ),
      );
    } finally {
      if (request === sequence.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    let active = true;
    const update = () => {
      if (active) refresh();
    };
    update();
    window.addEventListener("engagement:updated", update);
    window.addEventListener("focus", update);
    window.addEventListener("storage", update);
    const timer = window.setInterval(update, 30000);
    return () => {
      active = false;
      sequence.current += 1;
      clearInterval(timer);
      window.removeEventListener("engagement:updated", update);
      window.removeEventListener("focus", update);
      window.removeEventListener("storage", update);
    };
  }, [refresh]);
  return (
    <EngagementContext.Provider
      value={{ ...data, loading, hasLoaded, error, refresh }}
    >
      {children}
    </EngagementContext.Provider>
  );
}
