const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const apiRouter = require("./routes/api");
const dotenv = require("dotenv");
const expressJwt = require("express-jwt");
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  expressJwt({
    secret: process.env.PRIVATE_KEY,
    algorithms: ["RS256"],
  })
);
app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
