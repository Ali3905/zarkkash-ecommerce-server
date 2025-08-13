require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { connectToMongoDB } = require("./connections")
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 8000
const app = express()
connectToMongoDB(process.env.MONGO_URI || "mongodb://localhost:27017/zarqash")
app.use(express.json())

const productsRoute = require("./routes/product")
const orderRoute = require("./routes/order")
const authRoute = require("./routes/auth")

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}))

app.use(express.urlencoded({ extended: true }))

app.use("/api/products", productsRoute)
app.use("/api/orders", orderRoute)
app.use("/api/auth", authRoute)

app.get("/", (req, res) => {
    res.send("Welcome to Homepage of Ecommerce API")
})

app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT)
})
