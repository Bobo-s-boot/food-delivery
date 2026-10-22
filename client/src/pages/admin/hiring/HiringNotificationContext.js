import { createContext, useContext } from "react";

export const HiringNotificationContext = createContext(null);
export const useHiringNotification = () => useContext(HiringNotificationContext);
