import "reflect-metadata";
import "@/di/container";
import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import dbConnect from "./config/dbConfig";
import authRoute from "./routers/auth.routers";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/auth', authRoute);

dbConnect()
  .then(() => {
    console.log("✅ Database connected successfully");
    const PORT = process.env.PORT || 8080;
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });
