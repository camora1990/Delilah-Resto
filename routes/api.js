const router = require("express").Router();
const apiUsersRouter = require("./api/apiUsers");
const apiOrdersRouter = require("./api/apiOrders");
const apiDishesRouter = require("./api/apiDishes");

router.use("/users", apiUsersRouter);
router.use("/orders", apiOrdersRouter);
router.use("/dishes", apiDishesRouter);

module.exports = router;
