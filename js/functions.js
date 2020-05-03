// --- DELILAH RESTO: A DELIVERY FOOD API. FUNCTIONS ---

// --- LIBRARIES ---

const express = require("express");

const app = express();

const hashing = require("password-hash");

const mysql = require("mysql2");

const Sequelize = require("sequelize");

const sequelize = new Sequelize("mysql://root:@localhost:3306/delilah_resto");

const jwt = require("jsonwebtoken");

const passwordJwt = "Leg5C2qbn";

const endpoints = require('./endpoints.js');

app.use(express.json());

// --- USER AND PASS AUTHORIZATION. SAVES IN TOKEN IF USER IS ADMIN OR NOT ---

const userValidation = async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  if (typeof username != undefined && typeof password != undefined) {
    sequelize
      .query("SELECT * FROM users WHERE username= ?", {
        replacements: [username],
        type: sequelize.QueryTypes.SELECT
      })
      .then(result => {
        let user = result[0];
        if (user == undefined) {
          res.status(400).json("Non-existent user");
        } else {
          if (hashing.verify(password, user.password)) {
            user_token = {
              id_user: user.id,
              username: username,
              admin: user.admin
            };
            const token = jwt.sign({ user_token }, passwordJwt);
            req.locals = token;
            return next();
          } else {
            res.status(400).json("Wrong password");
          }
        }
      })
      .catch(err => {
        res.status(400).json("An error has occurred during authentification");
      });
  }
}





// -- WITH GIVEN TOKEN, CHECKS IF ITS ADMIN OR NOT ---


const adminValidation = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json("Please login first");
  } else {
    const verified = jwt.verify(token, passwordJwt);
    let user = verified.user_token;
    if (user.admin == 1) {
      return next();
    } else {
      res.status(403).json("Acces denied. Only Admin");
    }
  }
};


/*
// --- VALIDATES THAT LOG IN HAS BEEN MADE --- 

function giveAcces(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json("Please log in first");
  } else {
    const verified = jwt.verify(token, passwordJwt);
    let user = verified.user_token;
    if (user != undefined) {
      req.locals = user;
      return next();
    } else {
      res.status(403).json("Invalid token");
    }
  }
}

// --- CALCULATES THE TOTAL COST OF AN ORDER ---

async function totalCostCalculation(req, res, next) {
  let products = req.body.products;
  let quantities = req.body.quantities;
  let total = 0;
  for (var i = 0; i < products.length; i++) {
    let quantity = quantities[i];
    await sequelize
      .query("SELECT price FROM products WHERE id = ?", {
        replacements: [products[i]],
        type: sequelize.QueryTypes.SELECT
      })
      .then(results => {
        let price = results[0].price;
        total = total + price * quantity;
      })
      .catch(error => res.status(400).json("Something went wrong"));
  }
  res.locals = total;
  return next();
}

*/

module.exports = {
  
  adminValidation: adminValidation,
  userValidation: userValidation,
  /*
  giveAcces: giveAcces,
  totalCostCalculation: totalCostCalculation
  */
};



