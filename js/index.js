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


// --- ENDPOINTS ---

app.post('/users', endpoints.createUser);

app.get("/users", functions.adminValidation, endpoints.getUsers);

app.post("/login", functions.userValidation, endpoints.login);

app.post("/products", functions.adminValidation, endpoints.createProduct);

app.delete("/products/:id", functions.adminValidation, endpoints.deleteProduct);

// --- SERVER LISTEN ---

app.listen(3000, function() {
  console.log("Server initiated on port 3306...");
});

