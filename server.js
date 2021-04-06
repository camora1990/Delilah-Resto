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

app.use(helmet());
app.use(cors());
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


