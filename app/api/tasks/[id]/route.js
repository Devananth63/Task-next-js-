import clientPromise from "../../db";
import { ObjectId } from "mongodb";

export async function PATCH(request, { params }) {
  const update = await request.json();
  const client = await clientPromise;
  const db = client.db("taskdb");
  await db.collection("tasks").updateOne(
    { _id: new ObjectId(params.id) },
    { $set: update }
  );
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

export async function DELETE(request, { params }) {
  const client = await clientPromise;
  const db = client.db("taskdb");
  await db.collection("tasks").deleteOne({ _id: new ObjectId(params.id) });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
