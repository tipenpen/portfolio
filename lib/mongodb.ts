import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const options = {};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // Di lingkungan development, gunakan variabel global agar koneksi tidak dibuat berulang kali saat hot reload
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // Di lingkungan produksi (Vercel serverless), buat client baru yang di-cache per instance
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;
