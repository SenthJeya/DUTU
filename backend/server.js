const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRouter = require("./routes/auth");
const taskRouter = require("./routes/task");

const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ["https://dutuapp.vercel.app"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true // Allow cookies and credentials
}));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the DUTU backend API!");
});
app.use("/auth", authRouter);
app.use("/task", taskRouter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
