const express = require("express");
const cors = require("cors")

const app = express();

// Middleware for Cross Orign Resource Sharing
corsOptions = {
    origin:"/api",
    methods:["GET", "POST"],
};
app.use(cors());

//Middleware for parsing json bodies
app.use(express.json());

const mainRouter = require("./routes/index");
app.use("/api/v1",mainRouter);


app.listen(3000);

// Using /api/v1 allows us to use a diffrent routers for all diffrent version
// app.use("/api/v2",newRouter)
