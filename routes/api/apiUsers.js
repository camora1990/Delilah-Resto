const router = require("express").Router();
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonWebToken");
const { body, validationResult, check } = require("express-validator");

//model inmport to dbConnectionJS
const { usersEntity } = require("../../config/dbConnection");

//createdToken

const createToken = (user) => {
  const payLoad = {
    user: user,
  };
  let token = jsonWebToken.sign(payLoad, process.env.PRIVATE_KEY);
  return token;
};

//middelwares

async function validateRegisterUser(req, res, next) {
  let user = await usersEntity.findAll({ where: { email: req.body.email } });
  if (user.length > 0) {
    res.status(200).json({
      status: 200,
      msg: `the user ${req.body.email} is registered in the database`,
    });
  } else {
    next();
  }
}

async function validateUserCredential(req, res, next) {
  let user = await usersEntity.findOne({ where: { email: req.body.email } });

  if (user) {
    let comparedPassword = bcrypt.compareSync(
      req.body.login_password,
      user.login_password
    );

    if (comparedPassword) {
      next();
    } else {
      res.status(401.1).json({
        status: 401.1,
        msg: "Invalid password!!",
      });
    }
  } else {
    res.json({
      status: 204,
      msg: "user not found!!",
    });
  }
}

// end middelWares

router.get("/", async (req, res) => {
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
      msg: "OK",
    },
    users,
  });
});

router.post(
  "/registerUser",
  [
    check("email", "Enter valid email!!").isEmail().not().isEmpty(),
    check("login_password")
      .not()
      .isEmpty()
      .withMessage("Required")
      .isLength({ min: 6 })
      .withMessage("must be at least 5 chars long!!")
      .matches(/\d/)
      .withMessage("must contain a number!!"),
    check("home_address", "home address is required!!").not().isEmpty(),
    check("first_name", "First name is required!!").not().isEmpty(),
  ],

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
        msg: "user created successfully",
      },
      data: {
        id: createUser.id,
        fullName: `${createUser.first_name} ${createUser.last_name}`,
        user: createUser.email,
      },
    });
  }
);

router.post("/login", validateUserCredential, async (req, res) => {
  let user = await usersEntity.findOne({
    attributes: ["first_name", "last_name", "is_admin"],
    where: { email: req.body.email },
  });
  let token = createToken(user);
  res.status(200).json({
    meta: {
      status: 200,
      msg: "OK",
    },
    token,
  });
});

module.exports = router;
