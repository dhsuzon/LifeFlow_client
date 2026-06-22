import { MongoClient } from "mongodb";

const uri = process.env.MONGO_DB_URL;

if (!uri) throw new Error("MONGO_DB_URL is not configured");

const globalForMongo = globalThis;
const client = globalForMongo.__mongoClient || new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.__mongoClient = client;
}

export const db = client.db("blood_donation_db");
export { client };
