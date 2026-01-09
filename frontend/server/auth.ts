/**
 * Local Authentication System
 * Replaces Manus OAuth with email/password authentication
 */

import { db } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { sign, verify } from "jsonwebtoken";
import { createHash, randomBytes } from "crypto";

// Simple password hashing using crypto (no external dependencies)
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha256")
    .update(password + salt)
    .digest("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  const newHash = createHash("sha256")
    .update(password + salt)
    .digest("hex");
  return hash === newHash;
}

// JWT token generation
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const TOKEN_EXPIRY = "7d";

export function generateToken(userId: number, email: string): string {
  return sign({ userId, email }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    return verify(token, JWT_SECRET) as { userId: number; email: string };
  } catch {
    return null;
  }
}

// User registration
export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; user?: any; error?: string; token?: string }> {
  try {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    // Hash password and create user
    const hashedPassword = hashPassword(password);
    const openId = randomBytes(32).toString("hex"); // Generate unique openId for compatibility

    const result = await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
      openId,
      loginMethod: "local",
    });

    const newUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!newUser) {
      return { success: false, error: "Failed to create user" };
    }

    const token = generateToken(newUser.id, newUser.email!);

    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      token,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Registration failed" };
  }
}

// User login
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: any; error?: string; token?: string }> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    if (!user.password) {
      return { success: false, error: "Please use OAuth to login" };
    }

    const isValid = verifyPassword(password, user.password);
    if (!isValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Update last signed in
    await db
      .update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, user.id));

    const token = generateToken(user.id, user.email!);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        location: user.location,
        headline: user.headline,
        summary: user.summary,
      },
      token,
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed" };
  }
}

// Get user from token
export async function getUserFromToken(token: string): Promise<any | null> {
  const decoded = verifyToken(token);
  if (!decoded) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, decoded.userId),
  });

  if (!user) return null;

  return {
    id: user.id,
    openId: user.openId,
    email: user.email,
    name: user.name,
    role: user.role,
    avatarUrl: user.avatarUrl,
    phone: user.phone,
    location: user.location,
    headline: user.headline,
    summary: user.summary,
    linkedinUrl: user.linkedinUrl,
    websiteUrl: user.websiteUrl,
    profileComplete: user.profileComplete,
  };
}
