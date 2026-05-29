import React from "react";

const adminNav = [
  ["#/admin", "Dashboard"],
  ["#/admin/policies", "Policies"],
  ["#/admin/claims", "Claims"],
  ["#/admin/reports", "Reports"],
  ["#/admin/profile", "Profile"]
];

const customerNav = [
  ["#/customer", "Dashboard"],
  ["#/customer/policies", "My Policies"],
  ["#/customer/claims", "My Claims"],
  ["#/customer/profile", "Profile"]
];

export function Shell({ app, role, title, subtitle, children }) {
  const user = app.session?.user || {};
  const nav = role === "admin" ? adminNav : customerNav;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="account-sidebar-card" href={role === "admin" ? "#/admin" : "#/customer"}>
          <span className="brand-mark small">IP</span>
          <span>
            <strong>{user.name || "User"}</strong>
            <small>{role === "admin" ? "Admin panel" : "Customer portal"}</small>
          </span>
        </a>
        <nav className="nav-list" aria-label={`${role} navigation`}>
          {nav.map(([href, label]) => (
            <a key={href} className={window.location.hash === href ? "active" : ""} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <button className="ghost full-width" type="button" onClick={app.auth.logout}>Sign out</button>
      </aside>
      <main className="main-panel">
        <header className="page-header">
          <div>
            <p className="eyebrow">{role === "admin" ? "Management" : "Insurance access"}</p>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="user-pill">
            <span>{user.name || "User"}</span>
            <strong>{role}</strong>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

export function EmptyState({ title, message }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  );
}
