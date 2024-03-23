const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db/index.js");

//database connection
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at port : ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGO DB connection failed !! ", err);
    });

const app = express();
const PORT = process.env.PORT || 8000;

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
