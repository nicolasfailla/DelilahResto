const express = require("express");
const app = express();

//librería para encriptar y validar contraseñas
const hashing = require("password-hash");

const mysql = require("mysql2");

const Sequelize = require("sequelize");

//Para conectar con la base de datos
const sequelize = new Sequelize("mysql://root:@localhost:3306/delilah");

const jwt = require("jsonwebtoken");

//Contraseña para firmar los tokens
const passwordJwt = "MafcxI9nlw";

app.use(express.json());

app.listen(3000, function() {
    console.log("Servidor iniciado en puerto 3000...");
  });

