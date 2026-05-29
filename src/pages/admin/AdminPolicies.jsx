import React, { useEffect, useState } from "react";
import { PolicyList } from "../../components/DataViews";
import { TextInput } from "../../components/Forms";
import { Shell } from "../../components/Layout";
import { api } from "../../services/api";

export default function AdminPolicies({ app }) {
  const [policies, setPolicies] = useState([]);
  const [lookupId, setLookupId] = useState("1");
  const [form, setForm] = useState({
    policy_number: `POL-${Date.now().toString().slice(-5)}`,
    customer_id: "2",
    type: "Health",
    premium_amount: "12000",
    coverage_amount: "250000",
    start_date: "2026-06-01",
    end_date: "2027-06-01"
  });

  const update = (field, value) => setForm({ ...form, [field]: value });

  async function load() {
    try {
      const data = await api.get("/admin/policies");
      setPolicies(data.policies || []);
    } catch (error) {
      app.handleError(error);
    }
  }

  async function create(event) {
    event.preventDefault();
    try {
      const data = await api.post("/policies", form);
      app.showMessage(data.message || "Policy created.");
      await load();
    } catch (error) {
      app.handleError(error);
    }
  }

  async function getPolicy() {
    try {
      const data = await api.get(`/policies/${lookupId}`);
      app.showMessage(`Loaded ${data.policy.policy_number}`);
    } catch (error) {
      app.handleError(error);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <Shell app={app} role="admin" title="Policies" subtitle="Create and review insurance policies.">
      <div className="two-column">
        <form className="panel stack compact-stack" onSubmit={create}>
          <h2>Create policy</h2>
          <TextInput label="Policy number" value={form.policy_number} onChange={(value) => update("policy_number", value)} />
          <TextInput label="Customer ID" value={form.customer_id} onChange={(value) => update("customer_id", value)} />
          <TextInput label="Type" value={form.type} onChange={(value) => update("type", value)} />
          <TextInput label="Premium amount" value={form.premium_amount} onChange={(value) => update("premium_amount", value)} />
          <TextInput label="Coverage amount" value={form.coverage_amount} onChange={(value) => update("coverage_amount", value)} />
          <TextInput label="Start date" type="date" value={form.start_date} onChange={(value) => update("start_date", value)} />
          <TextInput label="End date" type="date" value={form.end_date} onChange={(value) => update("end_date", value)} />
          <button className="primary">Create policy</button>
        </form>
        <section className="panel">
          <div className="section-head">
            <h2>Policy records</h2>
            <button className="ghost" onClick={load}>Refresh</button>
          </div>
          <div className="row-actions lookup-row">
            <input value={lookupId} onChange={(event) => setLookupId(event.target.value)} aria-label="Policy ID" />
            <button className="ghost" onClick={getPolicy}>Get by ID</button>
          </div>
          <PolicyList policies={policies} />
        </section>
      </div>
    </Shell>
  );
}
