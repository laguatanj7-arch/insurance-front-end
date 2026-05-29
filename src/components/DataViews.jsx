import React from "react";
import { EmptyState } from "./Layout";

export function StatCard({ label, value, note }) {
  return (
    <article className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </article>
  );
}

export function PolicyList({ policies }) {
  if (!policies.length) return <EmptyState title="No policies yet" message="Load records or create a policy." />;

  return (
    <div className="record-list">
      {policies.map((policy) => (
        <div className="record-row" key={policy.id}>
          <span>
            <strong>{policy.policy_number}</strong>
            <small>{policy.type} insurance for {policy.customer_name || `Customer #${policy.customer_id}`}</small>
          </span>
          <span className="badge active">{policy.status}</span>
        </div>
      ))}
    </div>
  );
}

export function ClaimList({ claims }) {
  if (!claims.length) return <EmptyState title="No claims yet" message="Load records or submit a claim." />;

  return (
    <div className="record-list">
      {claims.map((claim) => (
        <div className="record-row" key={claim.id}>
          <span>
            <strong>Claim #{claim.id}</strong>
            <small>{claim.policy_number} · {claim.incident_location || "Encrypted details unavailable"}</small>
          </span>
          <span className="badge pending">{claim.status}</span>
        </div>
      ))}
    </div>
  );
}
