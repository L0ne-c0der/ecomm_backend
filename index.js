require("dotenv").config();
const express = require("express");
const server = express();
const mongoose = require("mongoose");
// session removed: using stateless JWT + refresh-token flow
const productRouter = require("./routes/Products");
const categoryRouter = require("./routes/Categories");
const brandRouter = require("./routes/Brands");
const userRouter = require("./routes/Users");
const authRouter = require("./routes/Auths");
const adminOrderRouter = require("./routes/adminOrders");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Middleware
server.use(cookieParser());
server.use(express.json()); //to parse req.body
server.use(
  cors({
    origin: true, // frontend origin — must be exact
    credentials: true, // allow cookies/credentials
  })
); //to allow cross-origin requests
server.use(express.urlencoded({ extended: true }));

// Routes
server.use(express.static("public")); // optional: keep only useful middleware
server.use("/products", productRouter.router); // Use the product router
server.use("/categories", categoryRouter.router); // Use the category router
server.use("/brands", brandRouter.router); // Use the brand router
server.use("/orders", adminOrderRouter.router); // Use the admin order router
server.use("/users", userRouter.router);
server.use("/auth", authRouter.router);

main();
async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

server.get("/hello", (req, res) => {
  res.send("Hello, World!");
});
