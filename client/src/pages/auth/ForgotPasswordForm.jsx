import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { forgotPassword, resetPassword } from "../../api/authService";
import { AuthInput } from "./AuthInput";
import "./Auth.scss";

export function ForgotPasswordForm({
  initialUsername = "",
  onBackToLogin,
  onResetSuccess,
}) {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState(initialUsername);
  const [maskedEmail, setMaskedEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleRequestCode = async (e) => {
    if (e) e.preventDefault();
    const cleanUsername = username.trim();

    if (!cleanUsername) {
      setError(
        t("auth.usernameRequired") || "Please enter your email or username",
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await forgotPassword(
        cleanUsername,
        i18n?.language || "uk",
      );
      setStep(2);
      setMaskedEmail(response.maskedEmail || cleanUsername);
      setResendCountdown(60);
    } catch (err) {
      setError(
        typeof err === "string" ? err : err.message || t("auth.genericError"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    const cleanUsername = username.trim();
    const cleanCode = resetCode.trim();

    if (!cleanCode) {
      setError(t("auth.enterResetCode"));
      return;
    }

    if (newPassword.length < 4) {
      setError(
        t("auth.passwordTooShort") || "Password must be at least 4 characters",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("auth.passwordsDoNotMatch"));
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword({
        username: cleanUsername,
        resetCode: cleanCode,
        newPassword,
      });

      if (onResetSuccess) {
        onResetSuccess(cleanUsername);
      }
    } catch (err) {
      setError(
        typeof err === "string" ? err : err.message || t("auth.genericError"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h1 className="auth-form__title">{t("auth.forgotPasswordTitle")}</h1>

      <p className="auth-form__subtitle">
        {step === 1
          ? t("auth.forgotPasswordSubtitle")
          : t("auth.enterCodeSubtitle")}
      </p>

      {error && <div className="auth-form__error">{error}</div>}

      {step === 2 && (
        <div className="auth-form__success">
          <div>
            {t("auth.codeSentToEmail", { email: maskedEmail || username })}
          </div>
          <div>
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError("");
              }}
              className="auth-form__edit-email-btn"
            >
              {t("auth.changeEmail")}
            </button>
          </div>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestCode} className="auth-form__body" noValidate>
          <AuthInput
            type="email"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            placeholder={t("auth.emailOrUsername") || t("auth.username")}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="auth-form__submit-btn"
          >
            {isLoading ? t("auth.loading") : t("auth.sendResetCode")}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="auth-form__body" noValidate>
          <AuthInput
            type="text"
            name="resetCode"
            value={resetCode}
            onChange={(e) => {
              setResetCode(e.target.value);
              setError("");
            }}
            placeholder={t("auth.enterResetCode")}
          />

          <div className="auth-form__resend-wrapper">
            <button
              type="button"
              disabled={isLoading || resendCountdown > 0}
              onClick={handleRequestCode}
              className="auth-form__resend-btn"
            >
              {resendCountdown > 0
                ? t("auth.resendCodeCountdown", { count: resendCountdown })
                : t("auth.resendCode")}
            </button>
          </div>

          <AuthInput
            type={showPassword ? "text" : "password"}
            name="newPassword"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError("");
            }}
            placeholder={t("auth.newPassword")}
            showPasswordToggle
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          <AuthInput
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
            placeholder={t("auth.confirmNewPassword")}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="auth-form__submit-btn"
          >
            {isLoading ? t("auth.loading") : t("auth.resetPasswordSubmit")}
          </button>
        </form>
      )}

      <div
        className="auth-panel__toggle-wrapper"
        style={{ marginTop: "1.25rem" }}
      >
        <button
          type="button"
          onClick={onBackToLogin}
          className="auth-panel__toggle-link"
          style={{ background: "none", border: "none" }}
        >
          {t("auth.backToLogin")}
        </button>
      </div>
    </div>
  );
}
