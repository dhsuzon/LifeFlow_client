import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const uri = process.env.MONGO_DB_URL;
const client = new MongoClient(uri);
const db = client.db("blood_donation_db");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  database: mongodbAdapter(db, {
    client,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "donor",
      },
      status: {
        type: "string",
        defaultValue: "active",
      },

      bloodGroup: {
        type: "string",
      },
      district: {
        type: "string",
      },
      upazila: {
        type: "string",
      },
    },
  },
});
