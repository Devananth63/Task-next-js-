import clientPromise from "../db";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("taskdb");
  const users = await db.collection("users").find({ role: "user" }).toArray();
  return new Response(JSON.stringify(users), { status: 200 });
}
