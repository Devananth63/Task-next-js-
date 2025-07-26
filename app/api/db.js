import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb+srv://Dev:dev123@cluster0.vkivhzh.mongodb.net/?retryWrites=true&w=majority";
console.log("MongoDB URI:", uri.substring(0, 20) + "..."); // Log partial URI for debugging

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    console.log("Creating new MongoDB client in development");
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  console.log("Creating new MongoDB client in production");
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Test the connection
clientPromise
  .then(() => {
    console.log("MongoDB connection established successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

export default clientPromise;