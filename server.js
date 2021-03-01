const express = require("express");
const bodyParser = require("body-parser");
const jsonWebToken = require("jsonWebToken");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv").config();
const sequelize = require("./config/dbConnection");

require('./config/dbConnection')
const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get("/users", async (req, res) => {
  let response = await sequelize.query("SELECT * FROM users", {
    type: sequelize.QueryTypes.SELECT,
  });
  res.send(response);
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
