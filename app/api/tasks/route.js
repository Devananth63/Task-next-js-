import clientPromise from "../db";
import { ObjectId } from "mongodb";

export async function POST(request) {
  const { title, description, assignedTo, status } = await request.json();
  const client = await clientPromise;
  const db = client.db("taskdb");
  const tasks = db.collection("tasks");
  try {
    // Log the received data
    console.log("Received:", { title, description, assignedTo, status });
    // Try to create the ObjectId
    const result = await tasks.insertOne({
      title,
      description,
      assignedTo: new ObjectId(assignedTo),
      status,
    });
    return new Response(JSON.stringify({ id: result.insertedId }), { status: 201 });
  } catch (err) {
    // Log the error to your terminal
    console.error("Task creation error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function GET(request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const client = await clientPromise;
  const db = client.db("taskdb");
  const tasks = db.collection("tasks");
  let query = {};
  if (userId) {
    query.assignedTo = new ObjectId(userId);
  }
  const result = await tasks.find(query).toArray();
  return new Response(JSON.stringify(result), { status: 200 });
}
