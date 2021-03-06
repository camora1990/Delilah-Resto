const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv").config();

const userModel = require("../models/users");
const orderModel = require("../models/orders");
const dishModel = require("../models/dishes");
const orderDetailModel = require("../models/order_details");

const BD_NAME = process.env.BD_NAME;
const BD_USER = process.env.BD_USER;
const BD_PASSWORD = process.env.BD_PASSWORD;


const sequelize = new Sequelize(
  BD_NAME,
  BD_USER,
  BD_PASSWORD,
  {
    dialect: "mssql",
    host: "localhost",
    port: 1433,
    dialectOptions: {
      useUTC: true,
    }
  }
);

//created the models in database
const usersEntity = userModel(sequelize, Sequelize);
const orderEntity = orderModel(sequelize, Sequelize);
const dishEntity = dishModel(sequelize, Sequelize);
const orderDetailEntity = orderDetailModel(sequelize, Sequelize);

//create asociations between tables
//1 to *
//add key user_id to order
usersEntity.hasMany(orderEntity, { as: "userId", foreignKey: "user_id" });
dishEntity.hasMany(orderDetailEntity, { as: "dishId", foreignKey: "dish_id" });
orderEntity.hasMany(orderDetailEntity, {
  as: "orderId",
  foreignKey: "order_id",
});

sequelize
  .sync({ force: false })
  .then(() => console.log("dataBase and entities were created successfully!!"));

  
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });


module.exports = {
  sequelize,
  usersEntity,
  orderEntity,
  dishEntity,
  orderDetailEntity,
};
