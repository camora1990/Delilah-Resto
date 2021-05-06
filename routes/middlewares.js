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
  console.log(req.body);
  if (
    req.body.email == undefined ||
    req.body.email == null ||
    req.body.login_password == undefined ||
    req.body.login_password == null
  ) {
    return res.status(422).json({
      status: 422,
      error: "Required email and password!!",
    });
  }

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
      return res.status(403).json({
        status: 403,
        message: "Invalid password!!",
      });
    }
  } else {
    return res.status(403).json({
      status: 403,
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
    return res.status(407).send({
      status: 407,
      message: "No authorization token was found",
    });
  }

  token = req.headers.authorization.split(" ")[1];
  try {
    isvalid = jsonWebToken.verify(token, process.env.PRIVATE_KEY);
  } catch (error) {
    return res.status(401).send({
      meta: {
        status: 401,
        message: "Invalid token!!",
      },
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
    return res.status(403).json({
      status: 403,
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

/*
functions: validate if dishes is in data base and are correct data
Author: Camilo Morales Sanchez.
Event: invoked from:
apiOrders endpoint/apiv1/orders/newOrder"
*/

async function validateDishes(req, res, next) {
  if (req.body.order.dishes == undefined || req.body.order.dishes == null) {
    return res.status(422).json({
      status: 422,
      error: "Required dishes",
    });
  }
  let dishes = req.body.order.dishes;
  let totalOrder = 0;
  for (let i = 0; i < dishes.length; i++) {
    try {
      if (dishes[i].quantity >0) {
        let tempDish = await dishEntity.findOne({ where: { id: dishes[i].id } });
      if (tempDish) {
        dishes[i] = {
          dish_name: tempDish.name_dish,
          price: tempDish.price,
          quantity: dishes[i].quantity,
          total: tempDish.price * dishes[i].quantity,
          dish_id: dishes[i].id,
          order_id: null,
        };
        totalOrder += tempDish.price * dishes[i].quantity;
      } else {
        return res.status(404).json({
          status: 404,
          message: `Dish with id:${dishes[i].id} is not in data base`,
        });
      }
      } else {
        return res.status(400).json({ status: 400, message: "Quantity is required"});
      }
      
    } catch (error) {
      return res.status(400).json({ status: 400, message: "Failed in create order"});
    }
  }
  req.body.order.dishes = dishes;
  req.body.order.total = totalOrder;
  next();
}

module.exports = {
  validateRegisterUser,
  validateUserCredential,
  validateToken,
  validateIsAdim,
  validateDish,
  validateDishes,
};
