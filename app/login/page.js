"use client";
import AdminLogin from "../Components/AdminLogin";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (email, password) => {
    try {
      setError("");
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "admin" }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Invalid admin credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div>
      {error && (
        <div style={{ 
          color: 'red', 
          textAlign: 'center', 
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: '#ffe6e6',
          border: '1px solid #ff9999',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      <AdminLogin onLogin={handleLogin} />
    </div>
  );
}
