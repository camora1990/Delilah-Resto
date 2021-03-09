const router = require("express").Router();

//model inmport to dbConnectionJS
const {
  orderEntity,
  orderDetailEntity,
  dishEntity,
} = require("../../config/dbConnection");

const { validateToken, validateIsAdim } = require("../middlewares");
const { check, validationResult } = require("express-validator");

let validator = [
  check("order").not().isEmpty().withMessage("Order is required"),
  check("order.payment_method")
    .not()
    .isEmpty()
    .isIn(["CARD", "CASH"])
    .withMessage("Invalid options [CARD or CASH]"),
  check("order.dishes")
    .not()
    .isEmpty()
    .withMessage("The dishes are required!!"),
];

router.post("/newOrder", validator, validateToken, async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({
      status: 422,
      error: error.array(),
    });
  }

  let totalOrder = 0;
  const newOrder = await orderEntity.create({
    user_id: req.body.userId,
    payment_method: req.body.order.payment_method,
  });

  const dishes = req.body.order.dishes;

  for (let i = 0; i < dishes.length; i++) {
    let tempDish = await dishEntity.findOne({ where: { id: dishes[i].id } });
    let orderDetails = await orderDetailEntity.create({
      dish_name: tempDish.name_dish,
      price: tempDish.price,
      quantity: dishes[i].quantity,
      total: tempDish.price * dishes[i].quantity,
      dish_id: dishes[i].id,
      order_id: newOrder.id,
    });
    totalOrder += orderDetails.total;
  }

  await orderEntity.update(
    { total: totalOrder },
    { where: { id: newOrder.id } }
  );

  res.status(200).json({
    meta: {
      status: 200,
      message: "Order was create successfully!!",
    },
    order: await orderEntity.findOne({ where: { id: newOrder.id } }),
  });
});


router.put("/updateOrder/:id",validateToken,validateIsAdim, async(req,res)=>{
  
})

module.exports = router;
