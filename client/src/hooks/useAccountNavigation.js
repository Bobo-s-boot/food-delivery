import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken, getStoredUser } from "../api/authConfig";
import { saveAccountIntent } from "../pages/account/accountIntent";

export function useAccountNavigation() {
  const navigate = useNavigate();

  const openAccountSection = useCallback(
    (section, options = {}) => {
      const user = getStoredUser();
      const accountTab = options.tab || "";

      if (!getAuthToken() || !user?.username) {
        saveAccountIntent(section, accountTab);
        navigate("/auth", {
          state: { accountSection: section, accountTab },
        });
        return;
      }

      const searchParams = new URLSearchParams({ section });
      if (accountTab) searchParams.set("tab", accountTab);
      navigate(
        `/${encodeURIComponent(user.username)}/profile?${searchParams.toString()}`,
      );
    },
    [navigate],
  );

  const openOrderTracking = useCallback(
    () => openAccountSection("orders"),
    [openAccountSection],
  );
  const openStudentDiscounts = useCallback(
    () => openAccountSection("payments", { tab: "student-discount" }),
    [openAccountSection],
  );

  return {
    openAccountSection,
    openOrderTracking,
    openStudentDiscounts,
  };
}
