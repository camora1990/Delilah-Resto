const { Sequelize, DataTypes } = require("sequelize");

const userModel = require("../models/users");
const orderModel = require("../models/orders");
const dishModel = require('../models/dishes')
const orderDetailModel= require('../models/order_details')

const sequelize = new Sequelize(
  "OnlineOrderingSystem",
  "Camorasa",
  "M0r4l3s1027",
  {
    dialect: "mssql",
    host: "localhost",
    port: 1433,
  }
);

//created the models in database
const user = userModel(sequelize, Sequelize);
const order = orderModel(sequelize, Sequelize);
const dish = dishModel(sequelize, Sequelize);
const orderDetail = orderDetailModel(sequelize, Sequelize)


//create asociations between tables
//1 to *
//add key user_id to order
user.hasMany(order, { as: "userId", foreignKey: "user_id" });
dish.hasMany(orderDetail, {as: "dishId", foreignKey: "dish_id"});
order.hasMany(orderDetail,{as: "orderId", foreignKey: "order_id"})

sequelize
  .sync({ force: false })
  .then(() => console.log("table created successfully!!"));

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = { sequelize, user, order };
