import { useContext } from "react";
import { SupportContext } from "./supportContext";

export function useSupport() {
  const context = useContext(SupportContext);

  if (!context) {
    throw new Error("useSupport must be used within SupportProvider");
  }

  return context;
}
