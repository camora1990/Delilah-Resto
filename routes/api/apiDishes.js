const router = require("express").Router();
const {validationResult, check } = require("express-validator");

const { dishEntity } = require("../../config/dbConnection");
const { validateIsAdim, validateToken } = require("../middlewares");

router.get("/", validateToken, validateIsAdim, async (req, res) => {
  let dishes = await dishEntity.findAll();
  res.status(200).json({
    meta: {
      status: 200,
      msg: "OK",
    },
    dishes,
  });
});

router.post(
  "/createDish",
  [
    check("name_dish", "Name dish is required!!").not().isEmpty(),
    check("price")
      .not()
      .isEmpty()
      .withMessage("Precie is required!!")
      .isNumeric()
      .withMessage("The price must be numerical!!"),
    check("description", "Description is required!!").not().isEmpty(),
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
    let dish = await dishEntity.create({
      name_dish: req.body.name_dish,
      price: req.body.price,
      description: req.body.description,
    });

    res.status(200).json({
      meta: {
        status: 200,
        msg: "OK",
      },
      dish,
    });
  }
);

router.delete(
  "/deleteDish/:id",
  // [
  //   param("id")
  //     .not()
  //     .isEmpty()
  //     .withMessage("id is required")
  //     .isInt()
  //     .withMessage("Invalid type to Id!!"),
  // ],

  async (req, res) => {
    // const error = validationResult(req);
    res.json({msg:"msg"});
  }
);

module.exports = router;
