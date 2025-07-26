import clientPromise from "../db";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("taskdb");
    
    // Test the connection by listing collections
    const collections = await db.listCollections().toArray();
    
    return new Response(
      JSON.stringify({ 
        status: "Connected", 
        database: "taskdb",
        collections: collections.map(c => c.name)
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Database test error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Database connection failed", 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 