const express = require("express");
const server = express();
const mongoose = require("mongoose");
const productRouter = require("./routes/Products");
const categoryRouter = require("./routes/Categories");
const brandRouter = require("./routes/Brands");
const userRouter = require("./routes/Users");
const cors = require("cors");

server.use(express.json()); //to parse req.body
server.use(cors()); //to allow cross-origin requests

// Routes
server.use("/products", productRouter.router); // Use the product router
server.use("/categories", categoryRouter.router); // Use the category router
server.use("/brands", brandRouter.router); // Use the brand router
server.use("/users", userRouter.router);

main();
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}
server.listen(8080, () => {
  console.log("Server is running on port 8080");
});

// server.post("/products", CreateProduct);

server.get("/hello", (req, res) => {
  res.send("Hello, World!");
});
