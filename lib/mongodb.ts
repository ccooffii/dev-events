import mongoose, { Connection } from 'mongoose';

// MongoDB connection URI from environment variables
const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

/**
 * Global cache for the Mongoose connection.
 * This prevents creating multiple connections in development due to hot reloading.
 */
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

declare global {
  // Allow global cache on Node.js global object
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}


if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}
const cached: MongooseCache = global.mongooseCache;

/**
 * Connects to MongoDB using Mongoose and caches the connection.
 * @returns {Promise<Connection>} The Mongoose connection
 */
export async function connectToDatabase(): Promise<Connection> {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }
  if (cached.conn) {
    // Return cached connection if available
    return cached.conn;
  }
  if (!cached.promise) {
    // Create a new connection promise if not already connecting
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongooseInstance) => mongooseInstance.connection);
  }
  // Await the connection and cache it
  cached.conn = await cached.promise;
  return cached.conn;
}
