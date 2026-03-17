import { RouterProvider } from "react-router";
import { router } from "./routes.js";
import { AuthProvider } from "./app/contexts/AuthContext.jsx";
import { useEffect } from "react";

/**
 * UniMate App - Roommate & Carpool Platform
 * Main application entry point
 * Last updated: 2026-03-12
 */
export default function App() {
  // Load saved theme on app start
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
