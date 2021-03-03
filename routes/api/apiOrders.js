const router = require("express").Router();

//model inmport to dbConnectionJS
const { orderEntity } = require("../../config/dbConnection");
const { orderDetailEntity } = require("../../config/dbConnection");


router.get("/", async (req, res) => {
  let orders = await orderEntity.findAll();
  res.json({
    meta: {
      status: 200,
      msg: "OK",
    },
    data: orders,
  });
});


router.post("/newOrder", async (req, res) => {
  let dishes = req.body.order.dishes;
  let createOrder = await orderEntity.create({
    user_id: req.body.order.user,
    payment_method: req.body.order.method,
  });
  dishes.forEach(async (element) => {
    await orderDetailEntity.create({
      dish_id: element.id,
      order_id: createOrder.id,
    });
  });
  res.status(200).json({
    meta: {
      status: 200,
      msg: "order created successfully!!",
    },
  });
});


module.exports = router;
