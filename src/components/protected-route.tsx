import * as React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = auth.currentUser;
  console.log(user);
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
}
