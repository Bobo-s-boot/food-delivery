import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../api/authService";

export function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    retryPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Функция для плавного переключения
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
      setError("Passwords do not match!");
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
      setError(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-start pt-0 pb-6 px-4 lg:px-[39px] font-['Inter']">
      {/* Контейнер карточки с плавным переходом сторон (transition-all) */}
      <div
        className={`relative w-full max-w-[1841px] h-[calc(100vh-90px)] min-h-[850px] max-h-[900px] rounded-[32px] lg:rounded-[64px] shadow-[0px_20px_40px_rgba(0,0,0,0.1)] overflow-hidden flex transition-all duration-700 ${isLogin ? "flex-row" : "flex-row-reverse"}`}
      >
        {/* Фоновое изображение */}
        <img
          src={
            isLogin ? "/img/login_background.jpg" : "/img/singup_background.png"
          }
          alt="background"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        />

        <div className="hidden lg:block w-1/2 relative z-10 h-full"></div>

        {/* Стеклянная панель */}
        <div className="relative z-20 w-full lg:w-1/2 h-full bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] rounded-[32px] lg:rounded-[64px] border border-white/10 flex flex-col items-center justify-center px-4 py-8 gap-[40px] lg:gap-[64px]">
          {/* Контент с анимацией прозрачности */}
          <div
            className={`w-full flex flex-col items-center gap-[40px] lg:gap-[64px] transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
          >
            {/* Увеличенная ширина до 410px для заголовока */}
            <div className="w-full max-w-[410px]">
              <h1 className="text-white text-[36px] lg:text-[48px] font-medium leading-[120%] tracking-[-0.02em] w-full text-left mb-[24px] lg:mb-[32px] whitespace-nowrap">
                {isLogin ? "Welcome back!" : "Create an account"}
              </h1>

              {error && (
                <div className="w-full mb-[16px] p-3 bg-red-500/20 border border-red-500 text-white rounded-[16px] text-center text-[14px]">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-[16px]"
              >
                {!isLogin && (
                  <div className="w-full h-[54px]">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Full Name"
                      className="w-full h-full bg-[#EFEFF1] rounded-[100px] px-[24px] text-[16px] lg:text-[18px] text-[#0F1316] placeholder:text-[rgba(15,19,22,0.5)] tracking-[-0.04em] focus:outline-none focus:ring-2 focus:ring-[#0D1A2D]"
                    />
                  </div>
                )}

                <div className="w-full h-[54px]">
                  <input
                    type="email"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Email"
                    className="w-full h-full bg-[#EFEFF1] rounded-[100px] px-[24px] text-[16px] lg:text-[18px] text-[#0F1316] placeholder:text-[rgba(15,19,22,0.5)] tracking-[-0.04em] focus:outline-none focus:ring-2 focus:ring-[#0D1A2D]"
                  />
                </div>

                <div className="relative w-full h-[54px]">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Password"
                    className="w-full h-full bg-[#EFEFF1] rounded-[100px] px-[24px] text-[16px] lg:text-[18px] text-[#0F1316] placeholder:text-[rgba(15,19,22,0.5)] tracking-[-0.04em] focus:outline-none focus:ring-2 focus:ring-[#0D1A2D]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[24px] top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    <svg
                      className="w-[20px] h-[20px]"
                      fill="none"
                      stroke="#0F1316"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      ></path>
                    </svg>
                  </button>
                </div>

                {!isLogin && (
                  <div className="relative w-full h-[54px]">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="retryPassword"
                      value={formData.retryPassword}
                      onChange={handleChange}
                      required
                      placeholder="Retry password"
                      className="w-full h-full bg-[#EFEFF1] rounded-[100px] px-[24px] text-[16px] lg:text-[18px] text-[#0F1316] placeholder:text-[rgba(15,19,22,0.5)] tracking-[-0.04em] focus:outline-none focus:ring-2 focus:ring-[#0D1A2D]"
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="w-full text-left">
                    <a
                      href="#"
                      className="text-white text-[12px] font-medium leading-[130%] tracking-[0.02em] !underline decoration-solid decoration-1 underline-offset-2 hover:text-gray-200 transition-colors"
                    >
                      Forgot password? Click here
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[57px] mt-[16px] lg:mt-[32px] bg-[#0D1A2D] rounded-[100px] text-white text-[20px] lg:text-[24px] font-normal leading-[29px] tracking-[-0.04em] hover:bg-opacity-90 transition-all disabled:opacity-70 flex items-center justify-center"
                >
                  {isLoading ? "Wait..." : isLogin ? "Log In" : "Sign Up"}
                </button>
              </form>
            </div>

            {/* Соцсети */}
            <div className="w-full max-w-[602px] flex flex-wrap gap-y-[16px] gap-x-[24px] justify-center lg:justify-between px-2 lg:px-0">
              <button
                type="button"
                className="w-[47%] lg:w-[289px] h-[48px] box-border rounded-[100px] border-[2px] border-white flex items-center justify-start px-[12px] lg:px-[24px] gap-[8px] hover:bg-white/10 transition-colors whitespace-nowrap overflow-hidden"
              >
                <img
                  src="/img/google.png"
                  alt="Google"
                  className="w-[20px] h-[20px] object-contain shrink-0"
                />
                <span className="text-white text-[14px] lg:text-[20px] font-normal leading-[24px] tracking-[-0.04em] overflow-hidden text-ellipsis">
                  Continue with Google
                </span>
              </button>

              <button
                type="button"
                className="w-[47%] lg:w-[289px] h-[48px] box-border rounded-[100px] border-[2px] border-white flex items-center justify-start px-[12px] lg:px-[24px] gap-[8px] hover:bg-white/10 transition-colors whitespace-nowrap overflow-hidden"
              >
                <img
                  src="/img/apple.png"
                  alt="Apple"
                  className="w-[20px] h-[20px] object-contain shrink-0"
                />
                <span className="text-white text-[14px] lg:text-[20px] font-normal leading-[24px] tracking-[-0.04em] overflow-hidden text-ellipsis">
                  Continue with Apple
                </span>
              </button>

              <button
                type="button"
                className="w-[47%] lg:w-[289px] h-[48px] box-border rounded-[100px] border-[2px] border-white flex items-center justify-start px-[12px] lg:px-[24px] gap-[8px] hover:bg-white/10 transition-colors whitespace-nowrap overflow-hidden"
              >
                <img
                  src="/img/facebook.png"
                  alt="Facebook"
                  className="w-[20px] h-[20px] object-contain shrink-0"
                />
                <span className="text-white text-[14px] lg:text-[20px] font-normal leading-[24px] tracking-[-0.04em] overflow-hidden text-ellipsis">
                  Continue with Facebook
                </span>
              </button>

              <button
                type="button"
                className="w-[47%] lg:w-[289px] h-[48px] box-border rounded-[100px] border-[2px] border-white flex items-center justify-start px-[12px] lg:px-[24px] gap-[8px] hover:bg-white/10 transition-colors whitespace-nowrap overflow-hidden"
              >
                <img
                  src="/img/xcom.png"
                  alt="X"
                  className="w-[20px] h-[20px] object-contain shrink-0"
                />
                <span className="text-white text-[14px] lg:text-[20px] font-normal leading-[24px] tracking-[-0.04em] overflow-hidden text-ellipsis">
                  Continue with X
                </span>
              </button>
            </div>

            {/* Нижняя ссылка */}
            <div className="pb-4">
              <p className="text-white text-[14px] lg:text-[16px] font-normal leading-[140%]">
                {isLogin ? "New to Defilicious?" : "Already have an account?"}
                <button
                  onClick={toggleMode}
                  className="!underline decoration-solid decoration-1 underline-offset-2 hover:text-gray-300 ml-1 font-medium"
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
