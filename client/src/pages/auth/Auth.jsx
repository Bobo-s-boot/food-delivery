import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loginUser, registerUser } from "../../api/authService";
import { INITIAL_FORM_DATA, SOCIAL_PROVIDERS } from "./const";
import { SocialLoginButton } from "./SocialLoginButton";
import { AuthForm } from "./AuthForm";

import "./Auth.scss";

export function Auth({ onLogin }) {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userParam = params.get("user");
    const errorParam = params.get("error");

    if (userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        if (onLogin) onLogin(user);
        localStorage.setItem("user", JSON.stringify(user));

        if (user?.role === "admin") {
          navigate(`/${user.username}/admin`, { replace: true });
        } else {
          navigate(`/${user.username}`, { replace: true });
        }
      } catch {
        setError(t("auth.oauthParseError"));
      }
    } else if (errorParam) {
      setError(decodeURIComponent(errorParam));
      navigate("/auth", { replace: true });
    }
  }, [location, navigate, onLogin, t]);

  const handleSocialLogin = (provider) => {
    window.location.href = `http://127.0.0.1:5000/api/auth/${provider}`;
  };

  const toggleMode = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
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

      if (response.user?.role === "admin") {
        navigate(`/${response.user.username}/admin`, { replace: true });
      } else {
        navigate(`/${response.user.username}`, { replace: true });
      }
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
        className={`auth-card ${isLogin ? "auth-card--login" : "auth-card--register"}`}
      >
        <img
          src={
            isLogin ? "/img/login_background.jpg" : "/img/singup_background.png"
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
            <AuthForm
              isLogin={isLogin}
              formData={formData}
              error={error}
              isLoading={isLoading}
              showPassword={showPassword}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onTogglePassword={() => setShowPassword(!showPassword)}
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
                {isLogin ? t("auth.switchToRegister") : t("auth.switchToLogin")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
