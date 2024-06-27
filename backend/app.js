const express = require("express");
const cors = require("cors");

const app = express();

// Middleware for Cross-Origin Resource Sharing
const corsOptions = {
    origin: "*", // Allow all origins or specify your desired origins
    methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

// Middleware for parsing JSON bodies
app.use(express.json());

const mainRouter = require("./routes/index");
app.use("/api/v1", mainRouter);

// Define a simple route to test if the server is running
app.get("/", (req, res) => {
    res.send("Successfully hit the endpoint!");
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

// Using /api/v1 allows us to use different routers for all different versions
// app.use("/api/v2", newRouter)
