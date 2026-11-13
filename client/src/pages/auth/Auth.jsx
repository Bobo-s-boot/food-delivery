import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loginUser, registerUser } from "../../api/authService";
import { INITIAL_FORM_DATA, SOCIAL_PROVIDERS } from "./const";
import { SocialLoginButton } from "./SocialLoginButton";
import { AuthForm } from "./AuthForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import {
  buildPostAuthPath,
  clearAccountIntent,
  readAccountIntent,
} from "../account/accountIntent";

import "./Auth.scss";

export function Auth({ onLogin }) {
  const { t } = useTranslation();
  const location = useLocation();
  const [authMode, setAuthMode] = useState(
    () => (location.state?.authMode === "register" ? "register" : "login"),
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = authMode === "login";
  const isForgot = authMode === "forgot";

  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userParam = params.get("user");
    const errorParam = params.get("error");

    if (userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        if (onLogin) onLogin(user);
        localStorage.setItem("user", JSON.stringify(user));

        const accountIntent = readAccountIntent(location.state);
        clearAccountIntent();
        navigate(buildPostAuthPath(user, accountIntent), { replace: true });
      } catch {
        setError(t("auth.oauthParseError"));
      }
    } else if (errorParam) {
      setError(decodeURIComponent(errorParam));
      navigate("/auth", { replace: true });
    }
  }, [location, navigate, onLogin, t]);

  const handleSocialLogin = (provider) => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
    window.location.href = `${apiBaseUrl}/auth/${provider}`;
  };

  const switchMode = (targetMode) => {
    setIsAnimating(true);
    setTimeout(() => {
      setAuthMode(targetMode);
      setError("");
      setSuccessMessage("");
      setIsAnimating(false);
    }, 300);
  };

  const toggleMode = () => {
    switchMode(isLogin ? "register" : "login");
  };

  const handleForgotPassword = () => {
    switchMode("forgot");
  };

  const handleResetSuccess = (updatedUsername) => {
    setFormData((prev) => ({
      ...prev,
      username: updatedUsername,
      password: "",
      retryPassword: "",
    }));
    setSuccessMessage(t("auth.passwordResetSuccess"));
    setIsAnimating(true);
    setTimeout(() => {
      setAuthMode("login");
      setError("");
      setIsAnimating(false);
    }, 300);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!isLogin && formData.password !== formData.retryPassword) {
      setError(t("auth.passwordsDoNotMatch"));
      setIsLoading(false);
      return;
    }

    try {
      let response;

      if (isLogin) {
        response = await loginUser({
          username: formData.username,
          password: formData.password,
        });
      } else {
        response = await registerUser({
          username: formData.username,
          password: formData.password,
        });
      }

      if (onLogin) onLogin(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));

      const accountIntent = readAccountIntent(location.state);
      clearAccountIntent();
      navigate(buildPostAuthPath(response.user, accountIntent), { replace: true });
    } catch (error) {
      setError(
        typeof error === "string"
          ? error
          : error.message || t("auth.genericError"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Управляем направлением сторон карточки через BEM-модификатор */}
      <div
        className={`auth-card ${authMode === "register" ? "auth-card--register" : "auth-card--login"}`}
      >
        <img
          src={
            authMode === "register"
              ? "/img/singup_background.png"
              : "/img/login_background.jpg"
          }
          alt="background"
          className="auth-card__bg"
        />

        <div className="auth-card__spacer"></div>

        <div className="auth-panel">
          {/* Управляем состоянием анимации через модификаторы */}
          <div
            className={`auth-panel__animated-wrap ${
              isAnimating
                ? "auth-panel__animated-wrap--animating"
                : "auth-panel__animated-wrap--visible"
            }`}
          >
            {isForgot ? (
              <ForgotPasswordForm
                initialUsername={formData.username}
                onBackToLogin={() => switchMode("login")}
                onResetSuccess={handleResetSuccess}
              />
            ) : (
              <>
                <AuthForm
                  isLogin={isLogin}
                  formData={formData}
                  error={error}
                  successMessage={successMessage}
                  isLoading={isLoading}
                  showPassword={showPassword}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  onForgotPassword={handleForgotPassword}
                />

                {/* Блок соцсетей */}
                <div className="auth-panel__socials">
                  {SOCIAL_PROVIDERS.map((socialProvider) => (
                    <SocialLoginButton
                      key={socialProvider.provider}
                      {...socialProvider}
                      label={
                        socialProvider.labelKey
                          ? t(socialProvider.labelKey)
                          : socialProvider.label
                      }
                      onLogin={handleSocialLogin}
                    />
                  ))}
                </div>

                {/* Ссылка-переключатель */}
                <div className="auth-panel__toggle-wrapper">
                  <p className="auth-panel__toggle-link" onClick={toggleMode}>
                    {isLogin
                      ? t("auth.switchToRegister")
                      : t("auth.switchToLogin")}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
