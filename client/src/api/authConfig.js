export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const getAuthToken = () => {
  const data = getStoredUser();

  const token = data?.token || data?.user?.token || "";

  return token;
};

export const createAuthConfig = () => {
  const token = getAuthToken();

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};
