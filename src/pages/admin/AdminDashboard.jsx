import React, { useEffect, useState } from "react";
import { Shell } from "../../components/Layout";
import { StatCard } from "../../components/DataViews";
import { api } from "../../services/api";

export default function AdminDashboard({ app }) {
  const [stats, setStats] = useState({ policies: 0, claims: 0, premium: "0.00" });

  useEffect(() => {
    async function load() {
      try {
        const [policies, claims, premiums] = await Promise.all([
          api.get("/admin/policies"),
          api.get("/admin/claims"),
          api.get("/reports/premium-collection")
        ]);
        const premiumTotal = (premiums.premium_collection || []).reduce((sum, row) => sum + Number(row.total_premium || 0), 0);
        setStats({
          policies: policies.policies?.length || 0,
          claims: claims.claims?.length || 0,
          premium: premiumTotal.toFixed(2)
        });
      } catch (error) {
        app.handleError(error);
      }
    }
    load();
  }, []);

  return (
    <Shell app={app} role="admin" title="Admin dashboard" subtitle="Overview of policies, claims, and premium collection.">
      <section className="stats-grid">
        <StatCard label="Policies" value={stats.policies} note="Total managed records" />
        <StatCard label="Claims" value={stats.claims} note="All submitted claims" />
        <StatCard label="Premium" value={stats.premium} note="Collected amount summary" />
      </section>
      <section className="panel">
        <h2>System flow</h2>
        <div className="flow-strip">
          <span>Register customer</span>
          <span>Create policy</span>
          <span>Submit claim</span>
          <span>Review reports</span>
        </div>
      </section>
    </Shell>
  );
}
