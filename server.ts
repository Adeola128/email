import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Brevo API Setup
  const apiInstance = new TransactionalEmailsApi();
  const apiKey = process.env.BREVO_API_KEY;
  
  if (apiKey) {
    apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);
  }

  // API Routes
  app.post("/api/send-email", async (req, res) => {
    const { recipients, subject, htmlContent, senderName, senderEmail } = req.body;

    if (!apiKey) {
      return res.status(500).json({ error: "Brevo API key not configured" });
    }

    try {
      const sendSmtpEmail = new SendSmtpEmail();
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = htmlContent;
      sendSmtpEmail.sender = { name: senderName || "Oratora Odyssey", email: senderEmail || "noreply@oratora.com" };
      sendSmtpEmail.to = recipients.map((r: { email: string; name?: string }) => ({ email: r.email, name: r.name }));

      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      res.json({ success: true, messageId: data.body.messageId });
    } catch (error: unknown) {
      const err = error as { response?: { body: unknown }; message: string };
      console.error("Brevo Error:", err.response?.body || err.message);
      res.status(500).json({ error: "Failed to send email", details: err.response?.body || err.message });
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
