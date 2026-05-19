/**
 * MongoDB connection helper.
 *
 * Uses a global cache so Next.js dev hot-reload doesn't open a new
 * connection on every change, and so serverless cold-starts reuse
 * the existing pool across the same invocation.
 */
import mongoose, { type Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // We don't throw at module-load time so the build doesn't crash when
  // env vars haven't been set yet (e.g. preview deploys). We throw only
  // when an API route actually tries to connect.
  console.warn('[mongodb] MONGODB_URI is not set — DB writes will fail until configured.');
}

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
if (!global.mongooseCache) global.mongooseCache = cached;

export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required.');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10_000,
      socketTimeoutMS: 45_000,
      dbName: process.env.MONGODB_DB_NAME,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
