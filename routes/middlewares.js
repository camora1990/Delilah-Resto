const { usersEntity } = require("../config/dbConnection");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonWebToken");
const { body } = require("express-validator");

/*
functions: Validates if user is registered in the data base
Author: Camilo Morales Sanchez.
Event: invoked from ApiUser endpoint /apiv1"/users/registerUser
*/
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

/*
functions: validate if the credentials are correct
Author: Camilo Morales Sanchez.
Event: invoked from ApiUser endpoint /apiv1/users/login
*/
async function validateUserCredential(req, res, next) {
  let user = await usersEntity.findOne({
    where: { email: req.body.email },
  });

  if (user) {
    let comparedPassword = bcrypt.compareSync(
      req.body.login_password,
      user.login_password
    );
    if (comparedPassword) {
      req.body.userToken = {
        first_name: user.first_name,
        last_name: user.last_name,
        is_admin: user.is_admin,
        email: user.email,
      };
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

/*
functions: validate if the token is correct
Author: Camilo Morales Sanchez.
Event: invoked from ApiUser endpoint/apiv1/users/
*/
function validateToken(req, res, next) {
  var token = req.headers["authorization"];
  let isvalid;
  if (!token) {
    return res.status(401).send({
      status: 401,
      message: "No authorization token was found",
    });
  }

  token = req.headers.authorization.split(" ")[1];
  try {
    isvalid = jsonWebToken.verify(token, process.env.PRIVATE_KEY);
  } catch (error) {
    return res.status(401).send({
      status: 401,
      message: "Invalid token!!",
    });
  }

  req.body.is_admin = isvalid.user.is_admin;
  next();
}

module.exports = {
  validateRegisterUser,
  validateUserCredential,
  validateToken,
};
