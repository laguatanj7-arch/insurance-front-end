import React, { useEffect, useState } from "react";
import { PolicyList } from "../../components/DataViews";
import { Shell } from "../../components/Layout";
import { api } from "../../services/api";

export default function CustomerPolicies({ app }) {
  const [policies, setPolicies] = useState([]);
  const [policyId, setPolicyId] = useState("1");

  async function load() {
    try {
      const data = await api.get("/policies");
      setPolicies(data.policies || []);
    } catch (error) {
      app.handleError(error);
    }
  }

  async function getPolicy() {
    try {
      const data = await api.get(`/policies/${policyId}`);
      app.showMessage(`Loaded ${data.policy.policy_number}`);
    } catch (error) {
      app.handleError(error);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <Shell app={app} role="customer" title="My policies" subtitle="Review your insurance policies.">
      <section className="panel">
        <div className="section-head">
          <h2>Policy records</h2>
          <button className="ghost" onClick={load}>Refresh</button>
        </div>
        <div className="row-actions lookup-row">
          <input value={policyId} onChange={(event) => setPolicyId(event.target.value)} aria-label="Policy ID" />
          <button className="ghost" onClick={getPolicy}>Get by ID</button>
        </div>
        <PolicyList policies={policies} />
      </section>
    </Shell>
  );
}
