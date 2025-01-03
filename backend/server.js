const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleware/errorMeddileware");

const app = express();

// Apply middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies
app.use(express.urlencoded({ extended: false}));
app.use(
    cors({
        origin: ["http://localhost:3000", "http://marketmingle.vercel.app"],
        credentials: true,
    })
);

// Routes
app.use("/api/users", userRoute);
app.get("/", (req, res) => {
    res.send("Home Page...");
});

// Error middleware
app.use(errorHandler)

// Set PORT
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
    });
