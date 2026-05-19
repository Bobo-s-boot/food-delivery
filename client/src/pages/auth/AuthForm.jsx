import { useTranslation } from "react-i18next";
import { AuthInput } from "./AuthInput";
import "./Auth.scss";

export function AuthForm({
  isLogin,
  formData,
  error,
  isLoading,
  showPassword,
  onChange,
  onSubmit,
  onTogglePassword,
}) {
  const { t } = useTranslation();

  return (
    <div className="auth-form">
      <h1 className="auth-form__title">
        {isLogin ? t("auth.welcomeBack") : t("auth.createAccount")}
      </h1>

      {error && <div className="auth-form__error">{error}</div>}

      <form onSubmit={onSubmit} className="auth-form__body">
        {!isLogin && (
          <AuthInput
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            placeholder={t("auth.fullName")}
          />
        )}

        <AuthInput
          type="email"
          name="username"
          value={formData.username}
          onChange={onChange}
          placeholder={t("auth.username")}
        />

        <AuthInput
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={onChange}
          placeholder={t("auth.password")}
          showPasswordToggle
          onTogglePassword={onTogglePassword}
        />

        {!isLogin && (
          <AuthInput
            type={showPassword ? "text" : "password"}
            name="retryPassword"
            value={formData.retryPassword}
            onChange={onChange}
            placeholder={t("auth.retryPassword")}
          />
        )}

        {isLogin && (
          <div className="auth-form__forgot-wrapper">
            <a href="#" className="auth-form__forgot-link">
              {t("auth.forgotPassword")}
            </a>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="auth-form__submit-btn"
        >
          {isLoading
            ? t("auth.loading")
            : isLogin
              ? t("auth.login")
              : t("auth.register")}
        </button>
      </form>
    </div>
  );
}
