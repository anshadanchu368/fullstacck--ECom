const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-route");
const shopProductsRouter = require("./routes/shop/products-route");
mongoose
  .connect(
    "mongodb+srv://Jasmine:MyUserPassword@cluster1.ksqolek.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster1"
  )
  .then(() => console.log("mongodb connected"))
  .catch((e) => console.log(e));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
