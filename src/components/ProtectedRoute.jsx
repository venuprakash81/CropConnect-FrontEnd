import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getLogin } from "../utils/auth";

export default function ProtectedRoute() {
  const session = getLogin();
  const location = useLocation();

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}