const router = require("express").Router();
const jsonWebToken = require("jsonWebToken");
const bcrypt = require("bcrypt");
const { validationResult, check } = require("express-validator");
const {
  validateRegisterUser,
  validateUserCredential,
  validateToken,
  validateIsAdim,
} = require("../middlewares");

//model inmport to dbConnectionJS
const { usersEntity } = require("../../config/dbConnection");

//create Token
const createToken = (user) => {
  const payLoad = {
    user: user,
  };
  let token = jsonWebToken.sign(payLoad, process.env.PRIVATE_KEY, {
    expiresIn: 60 * 60 * 24,
  });
  return token;
};

let validator = [
  check("email", "Enter valid email!!").isEmail().not().isEmpty(),
  check("login_password")
    .not()
    .isEmpty()
    .withMessage("Password is Required")
    .isLength({ min: 6 })
    .withMessage("must be at least 5 chars long!!")
    .matches(/\d/)
    .withMessage("must contain a number!!"),
  check("home_address", "home address is required!!").not().isEmpty(),
  check("first_name", "First name is required!!").not().isEmpty(),
];

router.get("/", validateToken, validateIsAdim, async (req, res) => {
  let users = await usersEntity.findAll({
    attributes: [
      "id",
      "first_name",
      "last_name",
      "email",
      "phone_number",
      "home_address",
      "is_admin",
    ],
  });

  res.status(200).json({
    meta: {
      status: 200,
      message: "OK",
    },
    users: users,
  });
});

router.post(
  "/registerUser/",
  validator,
  validateRegisterUser,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        status: 422,
        error: error.array(),
      });
    }

    req.body.login_password = bcrypt.hashSync(req.body.login_password, 10);
    let createUser = await usersEntity.create(req.body);
    res.status(201).json({
      meta: {
        status: 201,
        message: "user created successfully",
      },
      user: {
        id: createUser.id,
        fullName: `${createUser.first_name} ${createUser.last_name}`,
        user: createUser.email,
      },
    });
  }
);

router.post(
  "/login/",
  [
    check("email", "Enter valid email!!").isEmail().not().isEmpty(),
    check("login_password").not().isEmpty().withMessage("Password is Required"),
  ],
  validateUserCredential,
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        status: 422,
        error: error.array(),
      });
    }
    let token = createToken(req.body.userToken);
    res.status(200).json({
      meta: {
        status: 200,
        message: "OK",
      },
      token,
    });
  }
);

module.exports = router;
