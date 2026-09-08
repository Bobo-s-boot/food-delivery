import { useCallback, useEffect, useState } from "react";
import { studentVerificationService } from "./studentVerificationService";

export function useStudentVerification(ownerId) {
  const [verification, setVerification] = useState({ status: "not_verified" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    studentVerificationService
      .getVerification(ownerId)
      .then((value) => {
        if (isActive) setVerification(value);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [ownerId]);

  const submitVerification = useCallback(async (payload) => {
    const nextVerification = await studentVerificationService.submitVerification(
      ownerId,
      payload,
    );
    setVerification(nextVerification);
    return nextVerification;
  }, [ownerId]);

  const updateVerification = useCallback(async (payload) => {
    const nextVerification = await studentVerificationService.updateVerification(
      ownerId,
      payload,
    );
    setVerification(nextVerification);
    return nextVerification;
  }, [ownerId]);

  const resetVerification = useCallback(async () => {
    const nextVerification = await studentVerificationService.resetVerification(ownerId);
    setVerification(nextVerification);
    return nextVerification;
  }, [ownerId]);

  const loadDevelopmentFixture = useCallback(async (status) => {
    const nextVerification = await studentVerificationService.setDevelopmentFixture(
      ownerId,
      status,
    );
    setVerification(nextVerification);
    return nextVerification;
  }, [ownerId]);

  return {
    verification,
    isLoading,
    submitVerification,
    updateVerification,
    resetVerification,
    loadDevelopmentFixture,
  };
}
