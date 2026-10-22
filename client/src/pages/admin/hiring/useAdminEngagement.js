import { useCallback, useEffect, useState } from "react";
import {
  engagementError,
  getAdminEngagement,
  getAdminHiringEngagement,
} from "../../../api/engagementService";
import { adminMessage } from "./engagementLabels";
export function useAdminEngagement(hiring = false) {
  const fetchData = hiring ? getAdminHiringEngagement : getAdminEngagement;
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [generation, setGeneration] = useState(0);
  const reload = useCallback(async () => {
    try {
      setData(await fetchData());
      setError("");
      setGeneration((value) => value + 1);
    } catch (err) {
      setError(
        adminMessage(
          engagementError(
            err,
            "Unable to load the workspace. Please try again.",
          ),
          "Unable to load the workspace. Please try again.",
        ),
      );
    }
  }, [fetchData]);
  useEffect(() => {
    let active = true;
    const fetch = () => fetchData()
      .then((value) => {
        if (active) {
          setData(value);
          setError("");
        }
      })
      .catch((err) => {
        if (active)
          setError(
            adminMessage(
              engagementError(
                err,
                "Unable to load the workspace. Please try again.",
              ),
              "Unable to load the workspace. Please try again.",
            ),
          );
      });
    fetch();
    if (hiring) {
      window.addEventListener("hiring:updated", fetch);
      window.addEventListener("storage", fetch);
      window.addEventListener("focus", fetch);
    }
    return () => {
      active = false;
      window.removeEventListener("hiring:updated", fetch);
      window.removeEventListener("storage", fetch);
      window.removeEventListener("focus", fetch);
    };
  }, [fetchData, hiring]);
  return { data, error, reload, setData, generation };
}
