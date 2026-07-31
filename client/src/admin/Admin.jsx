import { useAdmin } from "../context/AdminContext.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminDashboard from "./AdminDashboard.jsx";

/* Wrapper: if not authed, show login; else show dashboard. */
export default function Admin({ onExit }) {
  const { authed } = useAdmin();
  if (!authed) {
    return <AdminLogin onCancel={onExit} />;
  }
  return <AdminDashboard onExit={onExit} />;
}
