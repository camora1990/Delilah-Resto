const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const apiRouter = require("./routes/api");
const dotenv = require("dotenv").config();
const expressJwt = require("express-jwt");
const router = require("express").Router();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router)
// app.use(
//   expressJwt({
//     secret: process.env.PRIVATE_KEY,
//     algorithms: ["sha1", "RS256", "HS256"],
//   }).unless({
//     path: ["/apiv1/users/login", "/apiv1/users/registerUser"],
//   })
// );

app.use("/apiv1", apiRouter);

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});


var d =[
  {
    dish_name: 'Bagel de salmon',
    price: 425,
    quantity: 3,
    total: 1275,
    dish_id: 1,
    order_id: 4
  },
  {
    dish_name: 'Hamburguesa clasica',
    price: 350,
    quantity: 5,
    total: 1750,
    dish_id: 2,
    order_id: 4
  },
  {
    dish_name: 'Sandwich veggie',
    price: 310,
    quantity: 2,
    total: 620,
    dish_id: 3,
    order_id: 4
  },
  {
    dish_name: 'Ensalda veggie',
    price: 340,
    quantity: 1,
    total: 340,
    dish_id: 4,
    order_id: 4
  }
]