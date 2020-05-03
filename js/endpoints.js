// --- DELILAH RESTO: A DELIVERY FOOD API. ENDPOINTS ---

// --- LIBRARIES ---

const express = require("express");

const app = express();

const hashing = require("password-hash");

const mysql = require("mysql2");

const Sequelize = require("sequelize");

const sequelize = new Sequelize("mysql://root:@localhost:3306/delilah_resto");

const jwt = require("jsonwebtoken");

const passwordJwt = "Leg5C2qbn";

app.use(express.json());

// --- CREATING NEW USERS. FREE ACCES

const createUser = async (req, res) => {
  username = req.body.username;
  password = req.body.password;
  encryptedPassword = hashing.generate(password);
  name = req.body.name;
  last_name = req.body.last_name;
  email = req.body.email;
  phone = req.body.phone;

  if (
    !username ||
    !password ||
    !name ||
    !last_name ||
    !email ||
    !phone
  ) {
    res.status(400).json("There are required field empty");
  } else {
    sequelize
      .query("SELECT id FROM users WHERE username=?", {
        replacements: [username],
        type: sequelize.QueryTypes.SELECT
      })
      .then(results => {
        if (results.length == 0) {
          sequelize
            .query(
              "INSERT INTO users (username, password, name, last_name, mail, phone, admin) VALUES (?,?,?,?,?,?,?)",
              {
                replacements: [
                  username,
                  encryptedPassword,
                  name,
                  last_name,
                  email,
                  phone,
                  0
                ]
              }
            )
            .then(resultados => {
              res.status(201).json("User has benn succesfully created");
            });
        } else {
          res.status(400).json("Username not available");
        }
      });
  }
};

// --- GETS ALL USERS. ONLY ADMIN ---


const getUsers = async (req, res) => {
 {
  sequelize
    .query("SELECT username, name, last_name, mail, phone, admin FROM users", { type: sequelize.QueryTypes.SELECT })
    .then(results => {
      res.status(200).json(results);
    });
}};



// --- LOG IN. FREE ACCES ---

const login = async (req, res) => {
  const token = req.locals;
  res.status(200).json({"token": token});
};

// --- CREATES PRODUCT. ONLY ADMIN ---

const createProduct = async (req, res) => {
  name = req.body.name;
  price = req.body.price;

  sequelize
    .query("INSERT INTO products (name, price) VALUES (?,?)", {
      replacements: [name, price]
    })
    .then(resultados => {
      res
        .status(201)
        .json("New product added to database");
    });
};

// DELETES PRODUCTS. ONLY ADMIN ---

const deleteProduct = async (req, res) => {
  const product_id = req.params.id;
  sequelize
    .query("DELETE FROM products WHERE id = ?", {
      replacements: [product_id]
    })
    .then(resultados => {
      res.status(200).json("Product deleted");
    });
};



// --- EDIT PRODUCT. ONLY ADMIN ---

const updateProduct = async (req, res) => {
  let id_product = req.params.id;
  let new_name = req.body.new_name;
  let new_price = req.body.new_price;
  if (new_name != undefined && new_price != undefined) {
    sequelize
      .query("UPDATE products SET name = ?, price = ? WHERE id = ?", {
        replacements: [new_name, new_price, id_product]
      })
      .then(resultados => {
        res.status(200).json("Changes has been made");
      });
  } else if (new_name != undefined) {
    sequelize
      .query("UPDATE products SET name = ? WHERE id = ?", {
        replacements: [new_name, id_product]
      })
      .then(resultados => {
        res.status(200).json("The name of the products has been updated");
      });
  } else if (new_price != undefined) {
    sequelize
      .query("UPDATE products SET price = ? WHERE id = ?", {
        replacements: [new_price, id_product]
      })
      .then(resultados => {
        res.status(200).json("The price of the product has been updated");
      });
  }
};



// --- GETS ALL AVAILABLE PRODUCTS. ONLY ADMIN AND AUTHENTIFIED USERS ---

const getProducts = async (req, res) => {
  sequelize
    .query("SELECT * FROM products", { type: sequelize.QueryTypes.SELECT })
    .then(results => {
      res.status(200).json(results);
    });
};



// --- MAKES NEW ORDER. ONLY AUTHENTIFIED USERS ---

const createOrder = async (req, res) => {
  let user_id = req.locals.id_user;
  let adress = req.body.adress;
  let total = res.locals;
  let payment_method = req.body.payment_method;
  let products = req.body.products;
  let quantities = req.body.quantities;

  sequelize
    .query(
      "INSERT INTO orders (user_id, adress, total, payment_method) VALUES (?,?,?,?)",
      {
        replacements: [user_id, adress, total, payment_method]
      }
    )
    .then(resultados => {

      // QUERY FOR GIVING THE ID OF THE NEW ORDER

      sequelize
        .query("SELECT id FROM orders ORDER BY id DESC LIMIT 1", {
          type: sequelize.QueryTypes.SELECT
        })
        .then(results => {
          let order_id = results[0].id;
          for (var i = 0; i < products.length; i++) {
            let product = products[i];
            let quantity = quantities[i];
            sequelize.query(
              "INSERT INTO orders_products (order_id, product_id, quantity) VALUES (?,?,?)",
              {
                replacements: [order_id, product, quantity]
              }
            );
          }
          res.status(200).json("New order was made succesfully");
        });
    });
};



// --- GETS ALL ORDERS. ONLY ADMIN ---

const getOrders = async (req, res) => {
  sequelize
    .query(
      "SELECT orders.*, products.name AS name_product, orders_products.quantity FROM orders JOIN orders_products ON orders_products.order_id = orders.id JOIN products ON orders_products.product_id = products.id",
      { type: sequelize.QueryTypes.SELECT }
    )
    .then(results => {
      res.status(200).json(results);
    });
};

// --- UPDATES STATES OF A PRODUCT. ONLY ADMIN ---

const updateOrder = async (req, res) => {
  let order_id = req.params.id;
  let new_state = req.body.new_state;
  sequelize
    .query("UPDATE orders SET state = ? WHERE id = ?", {
      replacements: [new_state, order_id]
    })
    .then(resultados => {
      res.status(200).json("Order state was updated");
    });
};

// --- MODULE EXPORT ---

module.exports = {
  createUser: createUser,
  getUsers: getUsers,
  login: login,
  createProduct: createProduct,
  deleteProduct: deleteProduct,
  updateProduct: updateProduct,
  getProducts: getProducts,
  createOrder: createOrder,
  getOrders: getOrders,
  updateOrder: updateOrder
};


