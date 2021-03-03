const dotenv = require("dotenv");
dotenv.config()

const setting = {
  BD_NAME: process.env.BD_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  PORT: process.env.PORT,
};

module.exports = setting ;
