import { MongoClient, Db, Collection } from 'mongodb';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface UserDocument {
  id: string;
  email: string;
  fullName: string;
  passwordHash?: string;
  avatar?: string;
  googleId?: string;
  provider: 'local' | 'google';
  createdAt: string;
  lastLoginAt: string;
  emergencyContact?: string;
}

export interface SessionDocument {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

// In-memory + file-backed fallback store
const BACKUP_FILE = path.join(process.cwd(), '.data', 'users.json');

// Ensure .data dir exists
try {
  const dir = path.dirname(BACKUP_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
} catch {
  // Ignored if in restricted filesystem
}

let inMemoryUsers: UserDocument[] = [];
let inMemorySessions: SessionDocument[] = [];

// Try to load cached users from file
try {
  if (fs.existsSync(BACKUP_FILE)) {
    const raw = fs.readFileSync(BACKUP_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.users)) inMemoryUsers = parsed.users;
    if (Array.isArray(parsed.sessions)) inMemorySessions = parsed.sessions;
  }
} catch (e) {
  console.log('[DB] Note: Initialized in-memory user cache');
}

function persistToFile() {
  try {
    const dir = path.dirname(BACKUP_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      BACKUP_FILE,
      JSON.stringify({ users: inMemoryUsers, sessions: inMemorySessions }, null, 2),
      'utf-8'
    );
  } catch (err) {
    // Non-fatal
  }
}

// MongoDB Client Lazy Initialization
let mongoClient: MongoClient | null = null;
let dbInstance: Db | null = null;
let isMongoConnecting = false;

async function getDatabase(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    return null;
  }

  if (dbInstance) {
    return dbInstance;
  }

  if (isMongoConnecting) {
    // Wait a brief moment if connection is in progress
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (dbInstance) return dbInstance;
  }

  try {
    isMongoConnecting = true;
    mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    await mongoClient.connect();
    dbInstance = mongoClient.db('apnaroute');
    console.log('[MongoDB] Connected successfully to ApnaRoute database');

    // Create unique index on email
    try {
      await dbInstance.collection('users').createIndex({ email: 1 }, { unique: true });
    } catch {
      // Index might exist
    }

    return dbInstance;
  } catch (err: any) {
    console.warn('[MongoDB] Unable to connect to MongoDB URI, running with persistent store:', err.message);
    dbInstance = null;
    return null;
  } finally {
    isMongoConnecting = false;
  }
}

// 1. Find User by Email
export async function findUserByEmail(email: string): Promise<UserDocument | null> {
  const cleanEmail = email.trim().toLowerCase();
  try {
    const db = await getDatabase();
    if (db) {
      const user = await db.collection<UserDocument>('users').findOne({ email: cleanEmail });
      if (user) return user;
    }
  } catch (e) {
    console.error('[DB] findUserByEmail MongoDB error, falling back:', e);
  }

  const local = inMemoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  return local || null;
}

// 2. Find User by ID
export async function findUserById(id: string): Promise<UserDocument | null> {
  try {
    const db = await getDatabase();
    if (db) {
      const user = await db.collection<UserDocument>('users').findOne({ id });
      if (user) return user;
    }
  } catch (e) {
    console.error('[DB] findUserById MongoDB error, falling back:', e);
  }

  const local = inMemoryUsers.find((u) => u.id === id);
  return local || null;
}

// 3. Find User by Google ID
export async function findUserByGoogleId(googleId: string): Promise<UserDocument | null> {
  try {
    const db = await getDatabase();
    if (db) {
      const user = await db.collection<UserDocument>('users').findOne({ googleId });
      if (user) return user;
    }
  } catch (e) {
    console.error('[DB] findUserByGoogleId error, falling back:', e);
  }

  const local = inMemoryUsers.find((u) => u.googleId === googleId);
  return local || null;
}

// 4. Create User
export async function createUser(userData: {
  email: string;
  fullName: string;
  passwordHash?: string;
  avatar?: string;
  googleId?: string;
  provider: 'local' | 'google';
  emergencyContact?: string;
}): Promise<UserDocument> {
  const newUser: UserDocument = {
    id: `usr_${crypto.randomBytes(8).toString('hex')}`,
    email: userData.email.trim().toLowerCase(),
    fullName: userData.fullName.trim(),
    passwordHash: userData.passwordHash,
    avatar:
      userData.avatar ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.fullName || userData.email)}`,
    googleId: userData.googleId,
    provider: userData.provider,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    emergencyContact: userData.emergencyContact || '+91 98765 43210'
  };

  // Always store locally
  const existingIdx = inMemoryUsers.findIndex((u) => u.email.toLowerCase() === newUser.email);
  if (existingIdx >= 0) {
    inMemoryUsers[existingIdx] = newUser;
  } else {
    inMemoryUsers.push(newUser);
  }
  persistToFile();

  // Store in MongoDB if available
  try {
    const db = await getDatabase();
    if (db) {
      await db.collection('users').updateOne(
        { email: newUser.email },
        { $set: newUser },
        { upsert: true }
      );
    }
  } catch (e) {
    console.error('[DB] createUser MongoDB error:', e);
  }

  return newUser;
}

// 5. Update Password
export async function updateUserPassword(email: string, newPasswordHash: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  let updated = false;

  const user = inMemoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  if (user) {
    user.passwordHash = newPasswordHash;
    persistToFile();
    updated = true;
  }

  try {
    const db = await getDatabase();
    if (db) {
      const res = await db.collection('users').updateOne(
        { email: cleanEmail },
        { $set: { passwordHash: newPasswordHash } }
      );
      if (res.matchedCount > 0) updated = true;
    }
  } catch (e) {
    console.error('[DB] updateUserPassword error:', e);
  }

  return updated;
}

// 6. Update User Last Login
export async function updateUserLastLogin(id: string): Promise<void> {
  const now = new Date().toISOString();
  const user = inMemoryUsers.find((u) => u.id === id);
  if (user) {
    user.lastLoginAt = now;
    persistToFile();
  }

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection('users').updateOne({ id }, { $set: { lastLoginAt: now } });
    }
  } catch (e) {
    // Non-fatal
  }
}

// 7. Sessions Management
export async function saveSession(userId: string, token: string): Promise<void> {
  const session: SessionDocument = {
    token,
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };

  inMemorySessions = inMemorySessions.filter((s) => s.token !== token);
  inMemorySessions.push(session);
  persistToFile();

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection('sessions').updateOne(
        { token },
        { $set: session },
        { upsert: true }
      );
    }
  } catch (e) {
    // Non-fatal
  }
}

export async function getSession(token: string): Promise<SessionDocument | null> {
  try {
    const db = await getDatabase();
    if (db) {
      const s = await db.collection<SessionDocument>('sessions').findOne({ token });
      if (s) return s;
    }
  } catch {
    // fallback
  }

  const local = inMemorySessions.find((s) => s.token === token);
  return local || null;
}

export async function deleteSession(token: string): Promise<void> {
  inMemorySessions = inMemorySessions.filter((s) => s.token !== token);
  persistToFile();

  try {
    const db = await getDatabase();
    if (db) {
      await db.collection('sessions').deleteOne({ token });
    }
  } catch {
    // Non-fatal
  }
}
