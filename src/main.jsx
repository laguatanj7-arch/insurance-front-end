import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { api, ApiError } from "./services/api";
import { clearStoredSession, getStoredSession, storeSession } from "./services/auth";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPolicies from "./pages/admin/AdminPolicies";
import AdminClaims from "./pages/admin/AdminClaims";
import AdminReports from "./pages/admin/AdminReports";
import AdminProfile from "./pages/admin/AdminProfile";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerPolicies from "./pages/customer/CustomerPolicies";
import CustomerClaims from "./pages/customer/CustomerClaims";
import CustomerProfile from "./pages/customer/CustomerProfile";

const routes = {
  "/login": LoginPage,
  "/register": RegisterPage,
  "/admin": AdminDashboard,
  "/admin/policies": AdminPolicies,
  "/admin/claims": AdminClaims,
  "/admin/reports": AdminReports,
  "/admin/profile": AdminProfile,
  "/customer": CustomerDashboard,
  "/customer/policies": CustomerPolicies,
  "/customer/claims": CustomerClaims,
  "/customer/profile": CustomerProfile
};

function normalizePath() {
  const path = window.location.hash.replace("#", "") || "/login";
  return routes[path] ? path : "/login";
}

function App() {
  const [path, setPath] = useState(normalizePath);
  const [session, setSession] = useState(getStoredSession);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const onHashChange = () => setPath(normalizePath());
    window.addEventListener("hashchange", onHashChange);
    if (!window.location.hash) window.location.hash = "#/login";
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const auth = useMemo(() => {
    const login = async (credentials) => {
      const data = await api.post("/auth/login", credentials);
      const nextSession = { token: data.token, user: data.user, role: data.user?.role };
      storeSession(nextSession);
      setSession(nextSession);
      window.location.hash = data.user?.role === "admin" ? "#/admin" : "#/customer";
    };

    const logout = () => {
      clearStoredSession();
      setSession(null);
      window.location.hash = "#/login";
    };

    return { session, login, logout };
  }, [session]);

  useEffect(() => {
    const publicPage = path === "/login" || path === "/register";
    if (!session && !publicPage) window.location.hash = "#/login";
    if (session?.role === "admin" && path.startsWith("/customer")) window.location.hash = "#/admin";
    if (session?.role === "customer" && path.startsWith("/admin")) window.location.hash = "#/customer";
  }, [path, session]);

  const showMessage = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };

  const app = {
    auth,
    session,
    showMessage,
    handleError(error) {
      const message = error instanceof ApiError ? error.message : "Something went wrong.";
      showMessage(message);
    }
  };

  const Page = routes[path] || LoginPage;

  return (
    <>
      <Page app={app} />
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
