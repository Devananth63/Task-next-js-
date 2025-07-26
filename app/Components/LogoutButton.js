"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    router.push("/");
  };
  return (
    <button
      onClick={handleLogout}
      style={{
        background: "#c00",
        color: "#fff",
        border: "none",
        padding: "8px 16px",
        borderRadius: 4,
        marginLeft: 10,
      }}
    >
      Logout
    </button>
  );
}
