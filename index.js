const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

// middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is started at PORT: ${PORT}`);
});