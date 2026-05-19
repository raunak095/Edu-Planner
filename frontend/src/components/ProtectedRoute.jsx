import { Navigate } from "react-router-dom";

export default function ProtectedRoute({

  children,
  allowedRole,

}) {

  // ================= GET AUTH =================

  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  // ================= NOT LOGGED IN =================

  if (!token || !user) {

    return (
      <Navigate to="/login" />
    );

  }

  // ================= ROLE MISMATCH =================

  if (

    allowedRole &&

    user.role !== allowedRole

  ) {

    return (
      <Navigate to="/" />
    );

  }

  // ================= AUTHORIZED =================

  return children;

}