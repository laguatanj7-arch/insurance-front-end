import React, { useEffect, useState } from "react";
import { TextInput } from "../../components/Forms";
import { Shell } from "../../components/Layout";
import { api } from "../../services/api";

export default function CustomerProfile({ app, forcedRole }) {
  const role = forcedRole || "customer";
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  const update = (field, value) => setForm({ ...form, [field]: value });

  async function load() {
    try {
      const data = await api.get("/users/profile");
      setProfile(data);
      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || ""
      });
    } catch (error) {
      app.handleError(error);
    }
  }

  async function save(event) {
    event.preventDefault();
    try {
      const data = await api.put("/users/profile", form);
      app.showMessage(data.message || "Profile updated.");
      await load();
    } catch (error) {
      app.handleError(error);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <Shell app={app} role={role} title="Profile" subtitle="Read and update encrypted personal information.">
      <div className="profile-page">
        <section className="profile-hero-panel">
          <div className="profile-hero">
            <span className="profile-avatar">{(profile?.name || "U").slice(0, 1).toUpperCase()}</span>
            <div>
              <h2>{profile?.name || "Loading..."}</h2>
              <p className="muted">{profile?.role || role}</p>
            </div>
          </div>
          <div className="profile-detail-list">
            <div><small>Email</small><strong>{profile?.email || "..."}</strong></div>
            <div><small>Phone</small><strong>{profile?.phone || "..."}</strong></div>
            <div><small>Address</small><strong>{profile?.address || "..."}</strong></div>
          </div>
        </section>
        <form className="panel stack compact-stack" onSubmit={save}>
          <h2>Update profile</h2>
          <TextInput label="Name" value={form.name} onChange={(value) => update("name", value)} />
          <TextInput label="Email" value={form.email} onChange={(value) => update("email", value)} />
          <TextInput label="Phone" value={form.phone} onChange={(value) => update("phone", value)} />
          <TextInput label="Address" value={form.address} onChange={(value) => update("address", value)} />
          <button className="primary">Save profile</button>
        </form>
      </div>
    </Shell>
  );
}
