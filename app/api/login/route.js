import clientPromise from "../db"; // or "../../db" if in a subfolder

export async function POST(request) {
  const { email, password, role } = await request.json();
  const client = await clientPromise;
  const db = client.db("taskdb");
  const users = db.collection("users");

  console.log("Login attempt:", { email, password, role });
  const user = await users.findOne({ email, password, role });
  console.log("User found:", user);

  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }

  return new Response(
    JSON.stringify({ _id: user._id, name: user.name, email: user.email, role: user.role }),
    { status: 200 }
  );
}
