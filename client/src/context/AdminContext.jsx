import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../utils/api.js";

const AdminContext = createContext({ authed: false, login: async () => {}, logout: async () => {} });

export const AdminProvider = ({ children }) => {
  const [authed, setAuthed] = useState(api.hasAdminToken());

  /* Re-check on mount (in case sessionStorage changed) */
  useEffect(() => {
    setAuthed(api.hasAdminToken());
  }, []);

  const login = async (secret) => {
    try {
      await api.adminLogin(secret);
      setAuthed(true);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    await api.adminLogout();
    setAuthed(false);
  };

  return (
    <AdminContext.Provider value={{ authed, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);

export default AdminContext;
