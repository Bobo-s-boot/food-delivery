import { useTranslation } from "react-i18next";
import { AuthInput } from "./AuthInput";

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
    <div className="w-full max-w-102.5">
      <h1 className="text-white text-[36px] lg:text-[48px] font-medium leading-[120%] tracking-[-0.02em] w-full text-left mb-6 lg:mb-8 whitespace-nowrap">
        {isLogin ? t("auth.welcomeBack") : t("auth.createAccount")}
      </h1>

      {error && (
        <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500 text-white rounded-2xl text-center text-[14px]">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="w-full flex flex-col gap-4">
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
          <div className="w-full text-left">
            <a
              href="#"
              className="text-white text-[12px] font-medium leading-[130%] tracking-[0.02em] underline! decoration-solid decoration-1 underline-offset-2 hover:text-gray-200 transition-colors"
            >
              {t("auth.forgotPassword")}
            </a>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14.25 mt-4 lg:mt-8 bg-[#0D1A2D] rounded-[100px] text-white text-[20px] lg:text-[24px] font-normal leading-7.25 tracking-[-0.04em] hover:bg-opacity-90 transition-all disabled:opacity-70 flex items-center justify-center"
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
