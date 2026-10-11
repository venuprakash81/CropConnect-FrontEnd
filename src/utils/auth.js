const SESSION_KEY = "cropconnectUser";

export const saveLogin = (role, user) => {
  const session = {
    role: role.toLowerCase(),
    user,
    loggedIn: true,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getLogin = () => {
  try {
    const session = JSON.parse(
      localStorage.getItem(SESSION_KEY) || "null"
    );

    if (
      session?.loggedIn &&
      ["farmer", "buyer", "warehouse"].includes(session.role) &&
      session.user
    ) {
      return session;
    }

    return null;
  } catch {
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getUserEmail = (session) => {
  const user = session?.user;

  return (
    user?.email ||
    user?.buyerEmail ||
    user?.farmerEmail ||
    user?.warehouseEmail ||
    ""
  );
};