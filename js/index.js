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

const functions = require('./functions.js');

app.use(express.json());


// --- ENDPOINTS USERS AND LOGIN ---

app.post('/users', endpoints.createUser);

app.get("/users", functions.adminValidation, endpoints.getUsers);

app.post("/login", functions.userValidation, endpoints.login);

// --- ENDPOINTS PRODUCTS ---

app.post("/products", functions.adminValidation, endpoints.createProduct);

app.patch("/products/:id", functions.adminValidation, endpoints.updateProduct);

app.delete("/products/:id", functions.adminValidation, endpoints.deleteProduct);

app.get("/products", functions.giveAcces, endpoints.getProducts);

// --- ENDPOINTS ORDERS ---

app.post("/orders", functions.giveAcces, functions.totalCostCalculation, endpoints.createOrder);

app.get("/orders", functions.adminValidation, endpoints.getOrders);

app.patch("/orders/:id", functions.adminValidation, endpoints.updateOrder);

// --- SERVER LISTEN ---

app.listen(3000, function() {
  console.log("Server initiated on port 3306...");
});

