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
    <div className="w-full flex justify-center items-start pb-6 px-4 lg:px-10 font-sans">
      <div
        className={`relative w-full max-w-[460.25px] h-[calc(100vh-90px)] min-h-[212.5px] max-h-56.25 rounded-4xl lg:rounded-[64px] shadow-[0px_20px_40px_rgba(0,0,0,0.1)] overflow-hidden flex transition-all duration-700 ${isLogin ? "flex-row" : "flex-row-reverse"}`}
      >
        <img
          src={
            isLogin ? "/img/login_background.jpg" : "/img/singup_background.png"
          }
          alt="background"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        />

        <div className="hidden lg:block w-1/2 relative z-10 h-full"></div>

        <div className="relative z-20 w-full lg:w-1/2 h-full bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] rounded-4xl lg:rounded-[64px] border border-white/10 flex flex-col items-center justify-center px-4 py-8 gap-10 lg:gap-16">
          <div
            className={`w-full flex flex-col items-center gap-10 lg:gap-16 transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
          >
            <div className="w-full max-w-102.5">
              <h1 className="text-white text-4xl lg:text-5xl font-medium leading-[1.2] tracking-[-0.02em] w-full text-left mb-6 lg:mb-8 whitespace-nowrap">
                {isLogin ? "Welcome back!" : "Create an account"}
              </h1>

              {error && (
                <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500 text-white rounded-2xl text-center text-sm">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col gap-4"
              >
                {!isLogin && (
                  <div className="w-full h-14">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Full Name"
                      className="w-full h-full bg-[#EFEFF1] rounded-full px-6 text-base lg:text-lg text-[#0F1316] placeholder:text-[#0F1316]/50 tracking-[-0.04em] focus:outline-none focus:ring-2 focus:ring-[#0D1A2D]"
                    />
                  </div>
                )}

                <div className="w-full h-14">
                  <input
                    type="email"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Email"
                    className="w-full h-full bg-[#EFEFF1] rounded-full px-6 text-base lg:text-lg text-[#0F1316] placeholder:text-[#0F1316]/50 tracking-[-0.04em] focus:outline-none focus:ring-2 focus:ring-[#0D1A2D]"
                  />
                </div>

                <div className="relative w-full h-14">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Password"
                    className="w-full h-full bg-[#EFEFF1] rounded-full px-6 text-base lg:text-lg text-[#0F1316] placeholder:text-[#0F1316]/50 tracking-[-0.04em] focus:outline-none focus:ring-2 focus:ring-[#0D1A2D]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    <svg
                      className="w-5 h-5"
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
                  <div className="relative w-full h-14">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="retryPassword"
                      value={formData.retryPassword}
                      onChange={handleChange}
                      required
                      placeholder="Retry password"
                      className="w-full h-full bg-[#EFEFF1] rounded-full px-6 text-base lg:text-lg text-[#0F1316] placeholder:text-[#0F1316]/50 tracking-[-0.04em] focus:outline-none focus:ring-2 focus:ring-[#0D1A2D]"
                    />
                  </div>
                )}

                {isLogin && (
                  <div className="w-full text-left">
                    <a
                      href="#"
                      className="text-white text-xs lg:text-sm font-medium leading-[130%] tracking-[0.02em] underline decoration-white decoration-1 underline-offset-2 hover:text-gray-200 transition-colors"
                    >
                      Forgot password? Click here
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 mt-4 lg:mt-8 bg-[#0D1A2D] rounded-full text-white text-xl lg:text-2xl font-normal leading-7 tracking-[-0.04em] hover:bg-opacity-90 transition-all disabled:opacity-70 flex items-center justify-center"
                >
                  {isLoading ? "Wait..." : isLogin ? "Log In" : "Sign Up"}
                </button>
              </form>
            </div>

            <div className="w-full max-w-150.5 flex flex-wrap gap-y-4 gap-x-6 justify-center lg:justify-between px-2 lg:px-0">
              <button
                type="button"
                className="w-[47%] lg:w-72.25 h-12 rounded-full border-2 border-white flex items-center justify-start px-3 lg:px-6 gap-2 hover:bg-white/10 transition-colors whitespace-nowrap overflow-hidden"
              >
                <img
                  src="/img/google.png"
                  alt="Google"
                  className="w-5 h-5 object-contain shrink-0"
                />
                <span className="text-white text-sm lg:text-xl font-normal leading-6 tracking-[-0.04em] overflow-hidden text-ellipsis">
                  Continue with Google
                </span>
              </button>

              <button
                type="button"
                className="w-[47%] lg:w-72.25 h-12 rounded-full border-2 border-white flex items-center justify-start px-3 lg:px-6 gap-2 hover:bg-white/10 transition-colors whitespace-nowrap overflow-hidden"
              >
                <img
                  src="/img/apple.png"
                  alt="Apple"
                  className="w-5 h-5 object-contain shrink-0"
                />
                <span className="text-white text-sm lg:text-xl font-normal leading-6 tracking-[-0.04em] overflow-hidden text-ellipsis">
                  Continue with Apple
                </span>
              </button>

              <button
                type="button"
                className="w-[47%] lg:w-72.25 h-12 rounded-full border-2 border-white flex items-center justify-start px-3 lg:px-6 gap-2 hover:bg-white/10 transition-colors whitespace-nowrap overflow-hidden"
              >
                <img
                  src="/img/facebook.png"
                  alt="Facebook"
                  className="w-5 h-5 object-contain shrink-0"
                />
                <span className="text-white text-sm lg:text-xl font-normal leading-6 tracking-[-0.04em] overflow-hidden text-ellipsis">
                  Continue with Facebook
                </span>
              </button>

              <button
                type="button"
                className="w-[47%] lg:w-72.25 h-12 rounded-full border-2 border-white flex items-center justify-start px-3 lg:px-6 gap-2 hover:bg-white/10 transition-colors whitespace-nowrap overflow-hidden"
              >
                <img
                  src="/img/xcom.png"
                  alt="X"
                  className="w-5 h-5 object-contain shrink-0"
                />
                <span className="text-white text-sm lg:text-xl font-normal leading-6 tracking-[-0.04em] overflow-hidden text-ellipsis">
                  Continue with X
                </span>
              </button>
            </div>

            <div className="pb-4">
              <p className="text-white text-sm lg:text-base font-normal leading-[140%]">
                {isLogin ? "New to Defilicious?" : "Already have an account?"}
                <button
                  onClick={toggleMode}
                  className="underline decoration-white decoration-1 underline-offset-2 hover:text-gray-300 ml-1 font-medium"
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
