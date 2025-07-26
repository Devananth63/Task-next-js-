export async function GET() {
  return new Response(
    JSON.stringify({ message: "API is working" }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    return new Response(
      JSON.stringify({ 
        message: "POST is working", 
        received: body 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: "POST error", 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 