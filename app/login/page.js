"use client";
import AdminLogin from "../Components/AdminLogin";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email, password) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: "admin" }),
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return <AdminLogin onLogin={handleLogin} />;
}
