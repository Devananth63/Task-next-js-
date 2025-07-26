import { MongoClient } from "mongodb";

const uri = "mongodb+srv://Dev:dev123@cluster0.vkivhzh.mongodb.net/?retryWrites=true&w=majority";
const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;