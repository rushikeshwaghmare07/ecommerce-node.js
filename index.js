const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db/index.js");
const cookieParser = require("cookie-parser");

//database connection
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at port : ${PORT} on ${process.env.NODE_ENV} mode`);
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
app.use(cookieParser());

// route and routes imports
const userRoute = require("./routes/user.route.js");
const productRoute = require("./routes/product.route.js");

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);