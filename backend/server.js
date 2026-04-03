import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import userRoutes from "./routes/user.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

import { startKinesisConsumer } from "./kinesisConsumer.js";

//const app = express();

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body) 
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

//  Health check route (for Docker)
app.get("/", (req, res) => {
  res.send("Backend is running ");
});


server.listen(PORT,"0.0.0.0", async() => {
    connectToMongoDB();
    console.log(`Server running on port ${PORT}`)
    //Start consumer AFTER DB is ready
    startKinesisConsumer();
});
