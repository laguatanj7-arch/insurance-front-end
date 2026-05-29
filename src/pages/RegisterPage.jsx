import React, { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { TextInput } from "../components/Forms";
import { api } from "../services/api";

export default function RegisterPage({ app }) {
  const [form, setForm] = useState({
    name: "Juan Dela Cruz",
    email: "juan@example.com",
    password: "password123",
    phone: "09171234567",
    address: "Manila City"
  });
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api.post("/auth/register", form);
      app.showMessage("Customer account created. You can now sign in.");
      window.location.hash = "#/login";
    } catch (error) {
      app.handleError(error);
    } finally {
      setSaving(false);
    }
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

  return (
    <AuthLayout eyebrow="Customer access" title="Create account" subtitle="Personal data is stored encrypted in the backend database.">
      <form className="stack" onSubmit={submit}>
        <TextInput label="Name" value={form.name} onChange={(value) => update("name", value)} />
        <TextInput label="Email" value={form.email} onChange={(value) => update("email", value)} />
        <TextInput label="Password" type="password" value={form.password} onChange={(value) => update("password", value)} />
        <TextInput label="Phone" value={form.phone} onChange={(value) => update("phone", value)} />
        <TextInput label="Address" value={form.address} onChange={(value) => update("address", value)} />
        <button className="primary" disabled={saving}>{saving ? "Creating..." : "Create account"}</button>
        <p className="switch-link">Already registered? <a href="#/login">Sign in</a></p>
      </form>
    </AuthLayout>
  );
}
