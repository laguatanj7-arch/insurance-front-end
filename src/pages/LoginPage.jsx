import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { TextInput } from "../components/Forms";

export default function LoginPage({ app }) {
  const [form, setForm] = useState({ email: "admin@insurance.test", password: "password123" });
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await app.auth.login(form);
    } catch (error) {
      app.handleError(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthLayout eyebrow="Welcome back" title="Insurance login" subtitle="Sign in as admin or customer to continue.">
      <form className="stack" onSubmit={submit}>
        <TextInput label="Email" value={form.email} onChange={(email) => setForm({ ...form, email })} />
        <TextInput label="Password" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} />
        <button className="primary" disabled={saving}>{saving ? "Signing in..." : "Sign in"}</button>
        <p className="switch-link">No customer account yet? <a href="#/register">Create one</a></p>
        <p className="muted">Admin demo: admin@insurance.test / password123</p>
      </form>
    </AuthLayout>
  );
}
