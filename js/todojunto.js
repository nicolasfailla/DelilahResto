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

// --- USER AND PASS AUTHORIZATION. SAVES IN TOKEN IF USER IS ADMIN OR NOT ---

function userValidation(req, res, next) {
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

function adminValidation(req, res, next) {
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
}

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
      .query("SELECT precio FROM products WHERE id = ?", {
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

// --- CREATING NEW USERS. FREE ACCES

app.post("/users", (req, res) => {
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
});

// --- GETS ALL USERS. ONLY ADMIN ---

app.get("/users", adminValidation, (req, res) => {
  sequelize
    .query("SELECT username, name, last_name, mail, phone, admin FROM users", { type: sequelize.QueryTypes.SELECT })
    .then(results => {
      res.status(200).json(results);
    });
});



// --- LOG IN. FREE ACCES ---

app.post("/login", userValidation, (req, res) => {
  const token = req.locals;
  res.status(200).json({"token": token});
});

// --- CREATES PRODUCT. ONLY ADMIN ---

app.post("/products", adminValidation, (req, res) => {
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
});

// DELETES PRODUCTS. ONLY ADMIN ---

app.delete("/products/:id", adminValidation, (req, res) => {
  const product_id = req.params.id;
  sequelize
    .query("DELETE FROM products WHERE id = ?", {
      replacements: [product_id]
    })
    .then(resultados => {
      res.status(200).json("Product deleted");
    });
});

// --- EDIT PRODUCT. ONLY ADMIN ---

app.patch("/products/:id", adminValidation, (req, res) => {
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
});

// --- GETS ALL AVAILABLE PRODUCTS. ONLY ADMIN AND AUTHENTIFIED USERS ---

app.get("/products", giveAcces, (req, res) => {
  sequelize
    .query("SELECT * FROM products", { type: sequelize.QueryTypes.SELECT })
    .then(results => {
      res.status(200).json(results);
    });
});

// --- MAKES NEW ORDER. ONLY AUTHENTIFIED USERS ---

app.post("/orders", giveAcces, totalCostCalculation, (req, res) => {
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
});

// --- GETS ALL ORDERS. ONLY ADMIN ---

app.get("/orders", adminValidation, (req, res) => {
  sequelize
    .query(
      "SELECT orders.*, products.name AS name_product, orders_products.quantity FROM orders JOIN orders_products ON orders_products.order_id = orders.id JOIN products ON orders_products.product_id = products.id",
      { type: sequelize.QueryTypes.SELECT }
    )
    .then(results => {
      res.status(200).json(results);
    });
});

// --- UPDATES STATES OF A PRODUCT. ONLY ADMIN ---

app.patch("/orders/:id", adminValidation, (req, res) => {
  let order_id = req.params.id;
  let new_state = req.body.new_state;
  sequelize
    .query("UPDATE orders SET state = ? WHERE id = ?", {
      replacements: [new_state, order_id]
    })
    .then(resultados => {
      res.status(200).json("Order state was updated");
    });
});

// --- SERVER LISTEN ---

app.listen(3000, function() {
  console.log("Server initiated on port 3306...");
});
