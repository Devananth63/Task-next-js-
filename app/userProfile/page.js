import UserProfile from "../Components/UserProfile";

export default function UserProfilePage() {
  // For demo, just show static user info
  const user = { name: "User", email: "user@example.com" };
  return <UserProfile user={user} />;
}
