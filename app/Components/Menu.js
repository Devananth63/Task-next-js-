import Link from "next/link";

export default function Menu() {
  return (
    <nav style={{ marginBottom: 20 }}>
      <Link href="/dashboard" style={{ marginRight: 10 }}>Dashboard</Link>
      <Link href="/create" style={{ marginRight: 10 }}>Create Task</Link>
      <Link href="/profile" style={{ marginRight: 10 }}>Profile</Link>
      <Link href="/login">Logout</Link>
    </nav>
  );
}
