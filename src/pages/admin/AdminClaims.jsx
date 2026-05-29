import React, { useEffect, useState } from "react";
import { ClaimList } from "../../components/DataViews";
import { Shell } from "../../components/Layout";
import { api } from "../../services/api";

export default function AdminClaims({ app }) {
  const [claims, setClaims] = useState([]);
  const [claimId, setClaimId] = useState("1");

  async function load() {
    try {
      const data = await api.get("/admin/claims");
      setClaims(data.claims || []);
    } catch (error) {
      app.handleError(error);
    }
  }

  async function getClaim() {
    try {
      const data = await api.get(`/claims/${claimId}`);
      app.showMessage(`Loaded claim #${data.claim.id}`);
    } catch (error) {
      app.handleError(error);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <Shell app={app} role="admin" title="Claims" subtitle="View submitted claims with decrypted sensitive details.">
      <section className="panel">
        <div className="section-head">
          <h2>Claim records</h2>
          <button className="ghost" onClick={load}>Refresh</button>
        </div>
        <div className="row-actions lookup-row">
          <input value={claimId} onChange={(event) => setClaimId(event.target.value)} aria-label="Claim ID" />
          <button className="ghost" onClick={getClaim}>Get by ID</button>
        </div>
        <ClaimList claims={claims} />
      </section>
    </Shell>
  );
}
