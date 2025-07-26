import UserProfile from "../Components/UserProfile";

export const dynamic = 'force-dynamic';

export default function UserProfilePage() {
  // For demo, just show static user info
  const user = { name: "User", email: "user@example.com" };
  
  return (
    <div>
      <UserProfile user={user} />
    </div>
  );
}
