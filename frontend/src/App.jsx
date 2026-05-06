import { RouterProvider } from "react-router";
import { router } from "./routes.js";
import { AuthProvider } from "./app/contexts/AuthContext.jsx";
import { useEffect } from "react";

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
