import React from "react";

export function Field({ label, children }) {
  return (
    <label className="field">
      {label}
      {children}
    </label>
  );
}

export function TextInput({ label, value, onChange, type = "text", required = true }) {
  return (
    <Field label={label}>
      <input type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} />
    </Field>
  );
}

export function TextArea({ label, value, onChange }) {
  return (
    <Field label={label}>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </Field>
  );
}
