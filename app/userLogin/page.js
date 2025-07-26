"use client";
import UserLogin from "../Components/UserLogin";
import { useRouter } from "next/navigation";

export default function UserLoginPage() {
  const router = useRouter();

  const handleLogin = async (email, password) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: "user" }),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof window !== "undefined") {
        localStorage.setItem("userId", data._id);
      }
      router.push("/listoftask");
    } else {
      alert("Invalid user credentials");
    }
  };

  return <UserLogin onLogin={handleLogin} />;
}