export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const getAuthToken = () => getStoredUser()?.token || "";

export const createAuthConfig = () => {
  const token = getAuthToken();

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};
