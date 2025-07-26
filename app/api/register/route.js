import clientPromise from "../db";

export async function POST(request) {
  const { name, email, password, role } = await request.json();
  const client = await clientPromise;
  const db = client.db("taskdb");
  const users = db.collection("users");

  // Check if user already exists (by email and role)
  const existing = await users.findOne({ email, role });
  if (existing) {
    return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
  }

  const result = await users.insertOne({ name, email, password, role });
  return new Response(JSON.stringify({ id: result.insertedId }), { status: 201 });
}
