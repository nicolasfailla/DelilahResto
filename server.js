var express = require('express');
var app = express();
var fs = require('fs');
var Sequelize = require('sequelize');


const sequelize = new Sequelize('mysql://root@localhost:3306/banco');


app.use(express.json());

const usuarios = [
    {
        "id": 1,
        "nombre": "Jorge Luis Borges",
        "email": "jorgitob@example.com",
        "saldo": 1000, 
        "pass": "leyendo1234"
    },
    {
        "id": 2, 
        "nombre": "Daniel Segovia",
        "email": "danikpo@example.com",
        "saldo": 10, 
        "pass": "desarrollando1235"
    }
];

app.get('/usuario/:id', (req, res) => {
    const id = req.params.id;
    usuario = returnID (id);
    if(usuario != false){
        res.json(usuario);
    }else {
        res.json({msj: "El usuario no existe"});
    }
})
app.get('/usuario/:id/:pass', (req, res) => {
    const id = req.params.id;
    const pass = req.params.pass;
    usuario = returnID (id);
    contra = returnPass (pass);
    console.log(usuario);
    console.log(contra);
    if(usuario.id == contra) {
        res.json({msj: 'OK'})
    } else {
        res.json({msj: 'Datos Incorrectos'});
    }
})
app.post('/login', (req, res) => {
    id = req.body.id;
    pass = req.body.pass;
    usuario = returnID (id);
    contra = returnPass (pass);
    if(usuario.id == contra) {
        res.status(200).json({msj: 'Acceso Permitido'})
    } else {
        res.status(403).json({msj: 'Acceso Denegado'})
    }

})

app.post('/usuario', (req, res) => {
    pass = req.body.pass;
    username = req.body.username;
    pais = req.body.pais;
    apellido = req.body.apellido;
    dni = req.body.dni;
    nombre = req.body.nombre;
    email = req.body.email;

    sequelize.query('INSERT INTO usuarios (nombre, apellido, usuario, password, pais, dni, email) VALUES (?,?,?,?,?,?,?)',
    {
        replacements: [nombre, apellido, username, pass, pais, dni, email]

    }
    ).then(function (resultados) { console.log(resultados)
        res.json({msj: 'ok'});
        console.log("la info fue agregada a la tabla")
    });


    

})


app.post('/cuenta', (req, res) => {
    usuario_id = req.body.usuario_id;
    saldo = req.body.saldo;
    tipo = req.body.tipo;
    moneda = req.body.moneda;

    sequelize.query('INSERT INTO cuentas (usuario_id, saldo, tipo, moneda) VALUES (?,?,?,?)',
    {
        replacements: [usuario_id, saldo, tipo, moneda]

    }
    ).then(function (resultados) { console.log(resultados)
        res.json({msj: 'ok'});
        console.log("la info fue agregada a la tabla")
    });


    

})

app.get('/usuarios', (req, res) => {
  sequelize.query('SELECT * FROM usuarios',
  {type: sequelize.QueryTypes.SELECT}
  ).then(function(resultados){
      console.log(resultados)
      res.json(resultados);
  })
})


function returnID (id) {
    
    for(i=0; i<usuarios.length; i++){
        if (usuarios[i].id == id){
            return usuarios[i]
        }
    };

    return false;
}
function returnPass (pass) {
    
    for(i=0; i<usuarios.length; i++){
        if (usuarios[i].pass == pass){
            return usuarios[i].id
        }
    };
    return false;
}
function returnI (id) {
    for(i=0; i<autores.length; i++){
        if (autores[i].id == id){
            return i
        }
    };

    return false;
}

app.listen(3002, function () {
    console.log('Example app listening on port 3002!. Anda');
});