import React, { useEffect, useState } from "react";
import { Shell, EmptyState } from "../../components/Layout";
import { api } from "../../services/api";

export default function AdminReports({ app }) {
  const [claims, setClaims] = useState([]);
  const [premiums, setPremiums] = useState([]);

  async function load() {
    try {
      const [claimData, premiumData] = await Promise.all([
        api.get("/reports/claims-status"),
        api.get("/reports/premium-collection")
      ]);
      setClaims(claimData.claims_status || []);
      setPremiums(premiumData.premium_collection || []);
    } catch (error) {
      app.handleError(error);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <Shell app={app} role="admin" title="Reports" subtitle="Claims status and premium collection summaries.">
      <div className="two-column">
        <ReportPanel title="Claims status" rows={claims} fields={["status", "total_claims", "total_amount"]} />
        <ReportPanel title="Premium collection" rows={premiums} fields={["status", "total_policies", "total_premium"]} />
      </div>
    </Shell>
  );
}

function ReportPanel({ title, rows, fields }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {!rows.length ? <EmptyState title="No data yet" message="Create records to populate this report." /> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>{fields.map((field) => <th key={field}>{field.replaceAll("_", " ")}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.status}>{fields.map((field) => <td key={field}>{row[field]}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
