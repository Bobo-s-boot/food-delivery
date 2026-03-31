import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../api/authService";

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let response;

      if (isLogin) {
        response = await loginUser(formData);
      } else {
        response = await registerUser(formData);
      }

      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/");
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-20">
      <div className="w-full max-w-md p-8 border border-green-200 rounded-2xl shadow-sm bg-white">
        <h2 className="text-3xl font-bold text-center mb-6">
          {isLogin ? "Вхід в акаунт" : "Реєстрація"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Ім'я користувача</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Введіть ваш логін..."
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none text-black"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none text-black"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 mt-4 text-white rounded-xl font-bold transition-colors ${
              isLoading ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isLoading
              ? "Зачекайте..."
              : isLogin
                ? "Увійти"
                : "Створити акаунт"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            {isLogin ? "Ще немає акаунта?" : "Вже є акаунт?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-green-600 font-bold hover:underline"
            >
              {isLogin ? "Зареєструватися" : "Увійти"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
