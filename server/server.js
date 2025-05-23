require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-route");
const shopProductsRouter = require("./routes/shop/products-route");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter =require('./routes/shop/search-routes')
const adminOrdersRouter =require('./routes/admin/order-routes')
const shopReviewRouter =require('./routes/shop/review-routes')
const commonFeatureRouter =require('./routes/common/feature-routes')

const newsletterRoutes = require('./routes/shop/newsletter-routes')
mongoose
  .connect(
   process.env.MONGO_URL
  )
  .then(() => console.log("mongodb connected"))
  .catch((e) => console.log(e));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
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
app.use(express.static('public'));

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrdersRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search",shopSearchRouter)
app.use("/api/shop/review",shopReviewRouter)
app.use("/api/common/feature",commonFeatureRouter)
app.use('/api/newsletter', newsletterRoutes)

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});
