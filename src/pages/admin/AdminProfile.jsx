import React from "react";
import CustomerProfile from "../customer/CustomerProfile";

export default function AdminProfile(props) {
  return <CustomerProfile {...props} forcedRole="admin" />;
}
