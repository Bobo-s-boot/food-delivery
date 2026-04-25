import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loginUser, registerUser } from "../../api/authService";
import { INITIAL_FORM_DATA, SOCIAL_PROVIDERS } from "./const";
import { SocialLoginButton } from "./SocialLoginButton";
import { AuthForm } from "./AuthForm";

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
        navigate("/");
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
      navigate("/");
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
    <div className="w-full flex flex-col items-center pt-0 pb-14 font-['Inter']">
      <div className="w-full flex justify-center px-4 lg:px-9.75">
        <div
          className={`relative w-full max-w-460.25 h-[calc(100vh-90px)] min-h-212.5 max-h-225 rounded-4xl lg:rounded-[64px] shadow-[0px_20px_40px_rgba(0,0,0,0.1)] overflow-hidden flex transition-all duration-700 ${isLogin ? "flex-row" : "flex-row-reverse"}`}
        >
          <img
            src={
              isLogin
                ? "/img/login_background.jpg"
                : "/img/singup_background.png"
            }
            alt="background"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
          />

          <div className="hidden lg:block w-1/2 relative z-10 h-full"></div>

          <div className="relative z-20 w-full lg:w-1/2 h-full bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] rounded-4xl lg:rounded-[64px] border border-white/10 flex flex-col items-center justify-center px-4 py-8 gap-10 lg:gap-16">
            <div
              className={`w-full flex flex-col items-center gap-10 lg:gap-16 transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
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

              <div className="w-full max-w-150.5 flex flex-wrap gap-y-4 gap-x-6 justify-center lg:justify-between px-2 lg:px-0">
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

              <div className="pb-4">
                <p
                  className="text-white text-[14px] lg:text-[16px] font-normal leading-[140%] cursor-pointer hover:text-gray-300 transition-colors"
                  onClick={toggleMode}
                >
                  {isLogin
                    ? t("auth.switchToRegister")
                    : t("auth.switchToLogin")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
