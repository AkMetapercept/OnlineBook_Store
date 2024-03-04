const express = require("express");
const connectDb = require("./config/db");
const cookieParser = require("cookie-parser");
const bodyParser=require("body-parser")

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/auth", require("./route/userRoute"));

app.use("/api",require("./route/bookRoute"));

app.use("/api/cart",require("./route/shoppingCartRoute"))

app.use("/api/order",require("./route/orderRoute"))

app.listen(3000, () => {
  console.log("server running on", 3000);
});

connectDb();