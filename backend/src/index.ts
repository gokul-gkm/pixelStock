import "reflect-metadata";
import "@/di/container";
import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from 'morgan';

import dbConnect from "./config/dbConfig";
import { globalErrorHandler } from "./middlewares/error.middleware";
import authRoute from "./routers/auth.routers";
import userRoute from "./routers/user.routers";
import imageRoute from "./routers/image.routers";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const morganFormat = ":method :url :status :response-time ms";

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(morganFormat));

app.use('/auth', authRoute);
app.use('/users', userRoute);
app.use('/images', imageRoute);

app.use(globalErrorHandler);

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
