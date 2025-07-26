
export default function UserProfile({ user }) {
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>User Profile</h2>
      <p>Name: {user?.name || 'N/A'}</p>
      <p>Email: {user?.email || 'N/A'}</p>
    </div>
  );
}
