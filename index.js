const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./db/index.js");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 8000;

// database connection
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at port : ${PORT} on ${process.env.MODE_ENV} mode`);
        });
    })
    .catch((err) => {
        console.log("MONGO DB connection failed !! ", err);
    });

// middlewares setup
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// import and use routes
const userRoute = require("./routes/user.route.js");
const productRoute = require("./routes/product.route.js");
const categoryRoute = require("./routes/category.route.js");
const orderRoute = require("./routes/order.route.js");

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/order", orderRoute);