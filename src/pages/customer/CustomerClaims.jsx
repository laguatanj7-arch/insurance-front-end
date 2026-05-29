import React, { useState } from "react";
import { ClaimList } from "../../components/DataViews";
import { TextArea, TextInput } from "../../components/Forms";
import { Shell } from "../../components/Layout";
import { api } from "../../services/api";

export default function CustomerClaims({ app }) {
  const [claims, setClaims] = useState([]);
  const [claimId, setClaimId] = useState("1");
  const [form, setForm] = useState({
    policy_id: "1",
    incident_date: "2026-05-29",
    claim_amount: "5000",
    incident_location: "Quezon City",
    incident_description: "Minor vehicle damage after heavy rain."
  });

  const update = (field, value) => setForm({ ...form, [field]: value });

  async function submit(event) {
    event.preventDefault();
    try {
      const data = await api.post("/claims", form);
      app.showMessage(data.message || "Claim submitted.");
      setClaimId(String(data.claim_id || claimId));
    } catch (error) {
      app.handleError(error);
    }
  }

  async function getClaim() {
    try {
      const data = await api.get(`/claims/${claimId}`);
      setClaims([data.claim]);
      app.showMessage(`Loaded claim #${data.claim.id}`);
    } catch (error) {
      app.handleError(error);
    }
  }

  return (
    <Shell app={app} role="customer" title="My claims" subtitle="Submit and view claims for your policies.">
      <div className="two-column">
        <form className="panel stack compact-stack" onSubmit={submit}>
          <h2>Submit claim</h2>
          <TextInput label="Policy ID" value={form.policy_id} onChange={(value) => update("policy_id", value)} />
          <TextInput label="Incident date" type="date" value={form.incident_date} onChange={(value) => update("incident_date", value)} />
          <TextInput label="Claim amount" value={form.claim_amount} onChange={(value) => update("claim_amount", value)} />
          <TextInput label="Incident location" value={form.incident_location} onChange={(value) => update("incident_location", value)} />
          <TextArea label="Incident description" value={form.incident_description} onChange={(value) => update("incident_description", value)} />
          <button className="primary">Submit claim</button>
        </form>
        <section className="panel">
          <h2>Find claim</h2>
          <div className="row-actions lookup-row">
            <input value={claimId} onChange={(event) => setClaimId(event.target.value)} aria-label="Claim ID" />
            <button className="ghost" onClick={getClaim}>Get by ID</button>
          </div>
          <ClaimList claims={claims} />
        </section>
      </div>
    </Shell>
  );
}
