const router = require("express").Router();

//model inmport to dbConnectionJS
const { orderEntity, orderDetailEntity } = require("../../config/dbConnection");

const {
  validateToken,
  validateIsAdim,
  validateDishes,
  validateOrder,
} = require("../middlewares");
const { check, validationResult, param } = require("express-validator");

let validatorParamId = [
  param("id")
    .not()
    .isEmpty()
    .withMessage("id is required!!")
    .isInt()
    .withMessage("Invalid type to Id!!"),
];

let validatorUpdateDish = [
  param("id")
    .not()
    .isEmpty()
    .withMessage("id is required!!")
    .isNumeric()
    .withMessage("Invalid type to Id!!"),
  check("order_status")
    .not()
    .isEmpty()
    .isIn(["CONFIRMED", "PREPARING", "SENT", "CANCELLED", "DELIVERED", "NEW"])
    .withMessage(
      "Invalid options [CONFIRMED or PREPARING or SENT or CANCELLED or DELIVERED or NEW]"
    ),
];

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

router.post(
  "/newOrder",
  validator,
  validateToken,
  validateDishes,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        status: 422,
        error: error.array(),
      });
    }
    const newOrder = await orderEntity.create({
      user_id: req.body.userId,
      payment_method: req.body.order.payment_method,
      total: req.body.order.total,
    });

    const dishes = req.body.order.dishes;

    dishes.forEach((dish) => {
      dish.order_id = newOrder.id;
    });

    await orderDetailEntity.bulkCreate(dishes);

    res.status(200).json({
      meta: {
        status: 200,
        message: "Order was create successfully!!",
      },
      order: newOrder,
    });
  }
);

router.delete(
  "/deleteOrder/:id",
  validatorParamId,
  validateToken,
  validateIsAdim,
  validateOrder,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        status: 422,
        error: error.array(),
      });
    }

    await orderEntity.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      meta: {
        status: 200,
        message: "Order was removed successfully!!",
      },
      order: req.body.order,
    });
  }
);

router.put(
  "/updateOrder/:id",
  validatorUpdateDish,
  validateToken,
  validateIsAdim,
  async (req, res) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(422).json({
        status: 422,
        error: error.array(),
      });
    }
    await orderEntity.update(
      { order_status: req.body.order_status },
      { where: { id: req.params.id } }
    );

    let order = await orderEntity.findOne({
      attributes: ["id", "order_status", "payment_method", "total"],
      where: { id: req.params.id },
    });
    res.status(200).json({
      meta: {
        status: 200,
        message: "Order was update successfully!!",
      },
      order,
    });
  }
);

router.get(
  "/:id",
  [
    param("id")
      .not()
      .isEmpty()
      .withMessage("id is required!!")
      .isNumeric()
      .withMessage("Invalid type to Id!!"),
  ],
  validateToken,
  validateIsAdim,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        status: 422,
        error: error.array(),
      });
    }
    console.log(req.params.id);
    let order = await orderEntity.findOne({
      attributes: [
        "order_status",
        "id",
        "user_id",
        "payment_method",
        "total",
        "updatedAt",
        "createdAt",
      ],
      where: { id: req.params.id },
    });
    if (order) {
      order.dataValues.details = await orderDetailEntity.findAll({
        attributes: ["dish_name", "price", "quantity", "total"],
        where: { order_id: req.params.id },
      });
      res.status(200).json({
        meta: {
          status: 200,
          message: "Ok",
        },

        order,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "Order not found",
      });
    }
  }
);

module.exports = router;
