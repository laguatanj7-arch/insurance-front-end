import React, { useEffect, useState } from "react";
import { PolicyList, StatCard } from "../../components/DataViews";
import { Shell } from "../../components/Layout";
import { api } from "../../services/api";

export default function CustomerDashboard({ app }) {
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get("/policies");
        setPolicies(data.policies || []);
      } catch (error) {
        app.handleError(error);
      }
    }
    load();
  }, []);

  return (
    <Shell app={app} role="customer" title="Customer dashboard" subtitle="View your policies and start insurance claims.">
      <section className="stats-grid">
        <StatCard label="My policies" value={policies.length} note="Policies assigned to this account" />
        <StatCard label="Profile security" value="AES" note="Personal data decrypts on read" />
        <StatCard label="Claims" value="Ready" note="Use My Claims to file one" />
      </section>
      <section className="panel">
        <h2>My active policies</h2>
        <PolicyList policies={policies} />
      </section>
    </Shell>
  );
}
