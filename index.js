const express = require("express");
const server = express();
const mongoose = require("mongoose");
const { CreateProduct } = require("./controller/Product");
const productRouter = require("./routes/Products");

server.use(express.json()); //to parse req.body
server.use("/products", productRouter.router); // Use the product router

main();
async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}
server.listen(8085, () => {
  console.log("Server is running on port 8085");
});

server.get("/", (req, res) => {
  res.send("Hello, World!");
});

server.post("/products", CreateProduct);

server.get("/hello", (req, res) => {
  res.send("Hello, World!");
});
