import { Navigate } from "react-router-dom";

export default function ProtectedRoute({

  children,
  allowedRole,

}) {

  // ✅ Get User from LocalStorage
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // ✅ If no user → go login
  if (!user) {

    return (
      <Navigate to="/login" />
    );

  }

  // ✅ Role mismatch
  if (
    allowedRole &&
    user.role !== allowedRole
  ) {

    return (
      <Navigate to="/" />
    );

  }

  // ✅ Authorized
  return children;

}