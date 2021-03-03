const router = require("express").Router();
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonWebToken");
const { body, validationResult, check } = require("express-validator");

//model inmport to dbConnectionJS
const { usersEntity } = require("../../config/dbConnection");


//middelwares

async function validateRegisterUser(req, res, next) {

  let user = await usersEntity.findAll({where: {email: req.body.email }})
  if (user.length>0) {
    res.status(200).json({
      status: 200,
      msg: `the user ${req.body.email} is registered in the database`
    })
  }else{
    next()
  }
  
}


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
    data: users,
  });

});


router.post(
  "/registerUser",
  [
    check("email", "Enter valid email!!").isEmail().not().isEmpty(),
    check("login_password").not().isEmpty().withMessage("Required")
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
        status:422,
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

module.exports = router;