const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonWebToken");

const { usersEntity } = require("../config/dbConnection");
const { dishEntity } = require("../config/dbConnection");

/*
functions: Validates if user is registered in the data base
Author: Camilo Morales Sanchez.
Event: invoked from apiUser endpoint /apiv1"/users/registerUser
*/

async function validateRegisterUser(req, res, next) {
  let user = await usersEntity.findAll({ where: { email: req.body.email } });
  if (user.length > 0) {
    res.status(200).json({
      status: 200,
      message: `the user ${req.body.email} is registered in the database`,
    });
  } else {
    next();
  }
}

/*
functions: validate if the credentials are correct
Author: Camilo Morales Sanchez.
Event: invoked from apiUser endpoint /apiv1/users/login
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
        id: user.id,
      };
      next();
    } else {
      res.status(401.1).json({
        status: 401.1,
        message: "Invalid password!!",
      });
    }
  } else {
    res.json({
      status: 204,
      message: "user not found!!",
    });
  }
}

/*
functions: validate if the token is correct
Author: Camilo Morales Sanchez.
Event: invoked from:
apiUser endpoint/apiv1/users/
apiDishes endpoints all
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
      error: {
        name: error.name,
        message: error.message,
      },
    });
  }

  req.body.is_admin = isvalid.user.is_admin;
  req.body.userId = isvalid.user.id;
  next();
}

/*
functions: validate if user is admin
Author: Camilo Morales Sanchez.
Event: invoked from:
apiUser endpoint/apiv1/users/
apiDishes endpoints all
*/

function validateIsAdim(req, res, next) {
  if (req.body.is_admin) {
    next();
  } else {
    return res.status(401).json({
      status: 401,
      message: "You need administrator permissions!!",
    });
  }
}

/*
functions: validate if dish is in data base
Author: Camilo Morales Sanchez.
Event: invoked from:
apiDishes endpoint/apiv1/dishes//deleteDish/
*/

async function validateDish(req, res, next) {
  let dish;
  if (Number.isNaN(parseInt(req.params.id))) {
    return next();
  }

  try {
    dish = await dishEntity.findOne({ where: { id: req.params.id } });
    if (dish) {
      req.body.dish = dish;
      next();
    } else {
      return res.status(404).json({
        status: 404,
        message: `the dish with id: ${req.params.id} doesn´t exist`,
      });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ status: 404, message: "Failed", error: error.parent.message });
  }
}

module.exports = {
  validateRegisterUser,
  validateUserCredential,
  validateToken,
  validateIsAdim,
  validateDish,
};
