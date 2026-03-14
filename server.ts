import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Brevo API Setup
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  // API Routes
  app.post("/api/send-email", async (req, res) => {
    const { recipients, subject, htmlContent, senderName, senderEmail } = req.body;

    if (!BREVO_API_KEY) {
      return res.status(500).json({ error: "Brevo API key not configured" });
    }

    try {
      const brevoResponse = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { 
            name: senderName || "Oratora Odyssey", 
            email: senderEmail || "noreply@oratora.com" 
          },
          to: recipients.map((r: { email: string; name?: string }) => ({ 
            email: r.email, 
            name: r.name 
          })),
          subject,
          htmlContent,
        },
        {
          headers: {
            "api-key": BREVO_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      res.json({ success: true, messageId: brevoResponse.data.messageId });
    } catch (error: unknown) {
      const err = error as { message: string; response?: { data: unknown } };
      console.error("Brevo Error:", err.message);
      res.status(500).json({ 
        error: "Failed to send email", 
        details: err.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
