import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // <-- 1. Added CORS import
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import path from "path"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; 

// 2. Added CORS configuration before your routes
app.use(cors({
    origin: '*', // Allows development requests from your local Expo IP cleanly
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON request bodies
app.use(express.json());

app.use("/uploads",express.static(path.join(process.cwd(),"uploads")))



// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));

// Root route
app.get('/', (req, res) => {
    res.send("Hello Gokul");
});

app.use("/api/users", userRoutes);

// Start the server using the PORT variable
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});