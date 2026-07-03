import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const cached = global.mongooseCache ?? { conn: null, promise: null };

global.mongooseCache = cached;

export function getMongoConfigError() {
  const mongoUri = process.env.MONGODB_URI?.trim();

  if (!mongoUri) {
    return "Missing MONGODB_URI environment variable.";
  }

  if (mongoUri.includes("cluster.example.mongodb.net")) {
    return "MONGODB_URI still points to the sample Atlas host. Replace cluster.example.mongodb.net with your real MongoDB Atlas cluster hostname.";
  }

  return null;
}

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI?.trim();
  const configError = getMongoConfigError();

  if (!mongoUri || configError) {
    throw new Error(configError ?? "Missing MONGODB_URI environment variable.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
