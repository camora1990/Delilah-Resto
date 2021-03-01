const {Sequelize} = require("sequelize");

const sequelize = new Sequelize('OnlineOrderingSystem', 'Camorasa', 'M0r4l3s1027', {
  dialect: "mssql",
  host: "localhost",
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = sequelize;
