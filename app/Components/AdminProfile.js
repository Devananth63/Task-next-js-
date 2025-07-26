export default function AdminProfile({ admin }) {
  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Admin Profile</h2>
      <p>Name: {admin?.name}</p>
      <p>Email: {admin?.email}</p>
    </div>
  );
}
