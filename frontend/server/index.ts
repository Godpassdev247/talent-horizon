import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { registerUser, loginUser, getUserFromToken } from "./auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Parse JSON bodies
  app.use(express.json());

  // Local Auth API Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name } = req.body;
      
      if (!email || !password || !name) {
        return res.status(400).json({ success: false, error: "Email, password, and name are required" });
      }

      const result = await registerUser(email, password, name);
      return res.json(result);
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ success: false, error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ success: false, error: "Email and password are required" });
      }

      const result = await loginUser(email, password);
      return res.json(result);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ success: false, error: "Login failed" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, error: "No token provided" });
      }

      const token = authHeader.substring(7);
      const user = await getUserFromToken(token);
      
      if (!user) {
        return res.status(401).json({ success: false, error: "Invalid token" });
      }

      return res.json({ success: true, user });
    } catch (error) {
      console.error("Auth check error:", error);
      return res.status(500).json({ success: false, error: "Auth check failed" });
    }
  });

  app.post("/api/auth/logout", (_req, res) => {
    // For local auth, logout is handled client-side by clearing localStorage
    return res.json({ success: true });
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
