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
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRouter);
app.use("/task", taskRouter);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
