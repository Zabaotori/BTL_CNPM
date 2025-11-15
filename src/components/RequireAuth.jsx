// src/RequireAuth.jsx
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children, role }) => {
  const currentRole = localStorage.getItem("role");

  // Nếu chưa login → đưa về login
  if (!currentRole) {
    return <Navigate to="/login" replace />;
  }

  // Nếu role không khớp → đưa về login
  if (currentRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
