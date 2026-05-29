import React from "react";

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="brand-strip">
          <span className="brand-mark">IP</span>
          <span>
            <strong>Insurance Policy</strong>
            <small>Management System</small>
          </span>
        </div>
        <div className="form-card">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
          {children}
        </div>
      </section>
    </main>
  );
}
