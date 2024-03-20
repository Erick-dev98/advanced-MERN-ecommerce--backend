const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middleware/errorMiddleware");

const app = express()

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        origin: ["http://localhost:3000", "https://shopmpya.vercel.app/"],
        credentials: true,
    })
);

//Routes
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
    res.send("Home Page...")
});

//Initialize Error Middleware
app.use(errorHandler)

//Connect to MongoDb
const PORT = process.env.PORT || 5000;
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})
.catch((err) => console.log(err))