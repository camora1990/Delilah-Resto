const router = require("express").Router();
const { validationResult, check, param, body } = require("express-validator");

const { dishEntity } = require("../../config/dbConnection");
const {
  validateIsAdim,
  validateToken,
  validateDish,
} = require("../middlewares");

router.get("/", validateToken, validateIsAdim, async (req, res) => {
  let dishes = await dishEntity.findAll();
  res.status(200).json({
    meta: {
      status: 200,
      message: "OK",
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
        message: "OK",
      },
      dish,
    });
  }
);

router.put(
  "/updateDish/:id",
  [
    param("id")
      .not()
      .isEmpty()
      .withMessage("id is required!!")
      .isInt()
      .withMessage("Invalid type to Id!!"),
  ],
  validateToken,
  validateIsAdim,
  validateDish,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        status: 422,
        error: error.array(),
      });
    }
    delete req.body.is_admin;
    delete req.body.dish;
    console.log(req.body);
    let dish;
    try {
      dish = await dishEntity.update(req.body, {
        where: { id: req.params.id },
      });
      res.status(200).json({
        meta: {
          status: 200,
          message: "Dish was update successfully",
        },
        dish: await dishEntity.findOne({where:{id:req.params.id}}),
      });
    } catch (error) {
      res.status(400).json({
        meta: {
          status: 400,
          message: "Error",
        },
        error,
      });
    }
  }
);

router.delete(
  "/deleteDish/:id",
  [
    param("id")
      .not()
      .isEmpty()
      .withMessage("id is required")
      .isInt()
      .withMessage("Invalid type to Id!!"),
  ],
  validateToken,
  validateIsAdim,
  validateDish,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        status: 422,
        error: error.array(),
      });
    }

    await dishEntity.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      meta: {
        status: 200,
        message: "Dish was removed successfully!!",
      },
      dish: req.body.dish,
    });
  }
);

module.exports = router;
