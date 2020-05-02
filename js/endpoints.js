
//Endpoint para crear usuario, acceso libre
app.post("/usuarios", (req, res) => {
    nombreusuario = req.body.nombreusuario;
    password = req.body.password;
    passwordEncriptada = hashing.generate(password);
    nombre = req.body.nombre;
    apellido = req.body.apellido;
    email = req.body.email;
    telefono = req.body.telefono;
  
    if (
      !nombreusuario ||
      !password ||
      !nombre ||
      !apellido ||
      !email ||
      !telefono
    ) {
      res.status(400).json("Hay campos obligatorios vacíos");
    } else {
      sequelize
        .query("SELECT id FROM usuarios WHERE nombre_usuario=?", {
          replacements: [nombreusuario],
          type: sequelize.QueryTypes.SELECT
        })
        .then(resultados => {
          if (resultados.length == 0) {
            sequelize
              .query(
                "INSERT INTO usuarios (nombre_usuario, password, nombre, apellido, mail, telefono,admin) VALUES (?,?,?,?,?,?,?)",
                {
                  replacements: [
                    nombreusuario,
                    passwordEncriptada,
                    nombre,
                    apellido,
                    email,
                    telefono,
                    0
                  ]
                }
              )
              .then(resultados => {
                res.status(201).json("El usuario ha sido creado con éxito");
              });
          } else {
            res.status(400).json("El nombre de usuario no está disponible");
          }
        });
    }
  });
  
  //Trae todos los usuarios, sólo administrador
  app.get("/usuarios", validarAdmin, (req, res) => {
    sequelize
      .query("SELECT nombre_usuario, nombre, apellido, mail, telefono,admin FROM usuarios", { type: sequelize.QueryTypes.SELECT })
      .then(resultados => {
        res.status(200).json(resultados);
      });
  });
  
  //Endpoint para iniciar sesión, acceso libre
  app.post("/login", validarUsuario, (req, res) => {
    const token = req.locals;
    res.status(200).json({"token": token});
  });
  
  //Endpoint para crear productos, sólo administrador
  app.post("/productos", validarAdmin, (req, res) => {
    nombre = req.body.nombre;
    precio = req.body.precio;
  
    sequelize
      .query("INSERT INTO productos (nombre, precio) VALUES (?,?)", {
        replacements: [nombre, precio]
      })
      .then(resultados => {
        res
          .status(201)
          .json("Se ha agregado el nuevo producto a la base de datos");
      });
  });
  
  //Endpoint para eliminar productos, sólo administrador
  app.delete("/productos/:id", validarAdmin, (req, res) => {
    const producto_id = req.params.id;
    sequelize
      .query("DELETE FROM productos WHERE id = ?", {
        replacements: [producto_id]
      })
      .then(resultados => {
        res.status(200).json("Se ha eliminado el producto");
      });
  });
  
  //Endpoint para editar productos, sólo administrador
  app.patch("/productos/:id", validarAdmin, (req, res) => {
    let id_producto = req.params.id;
    let nuevo_nombre = req.body.nuevo_nombre;
    let nuevo_precio = req.body.nuevo_precio;
    if (nuevo_nombre != undefined && nuevo_precio != undefined) {
      sequelize
        .query("UPDATE productos SET nombre = ?, precio = ? WHERE id = ?", {
          replacements: [nuevo_nombre, nuevo_precio, id_producto]
        })
        .then(resultados => {
          res.status(200).json("Se realizaron los cambios");
        });
    } else if (nuevo_nombre != undefined) {
      sequelize
        .query("UPDATE productos SET nombre = ? WHERE id = ?", {
          replacements: [nuevo_nombre, id_producto]
        })
        .then(resultados => {
          res.status(200).json("El nombre del producto ha sido actualizado");
        });
    } else if (nuevo_precio != undefined) {
      sequelize
        .query("UPDATE productos SET precio = ? WHERE id = ?", {
          replacements: [nuevo_precio, id_producto]
        })
        .then(resultados => {
          res.status(200).json("El precio del producto ha sido actualizado");
        });
    }
  });
  
  //Endpoint para consultar todos los productos disponibles, sólo usuarios autenticados y admin
  app.get("/productos", darAcceso, (req, res) => {
    sequelize
      .query("SELECT * FROM productos", { type: sequelize.QueryTypes.SELECT })
      .then(resultados => {
        res.status(200).json(resultados);
      });
  });
  
  //Endpoint para realizar un nuevo pedido, usuarios autenticados
  app.post("/pedidos", darAcceso, calcularPrecioTotal, (req, res) => {
    let usuario_id = req.locals.id_usuario;
    let direccion = req.body.direccion;
    let total = res.locals;
    let metodo_pago = req.body.metodo_pago;
    let productos = req.body.productos;
    let cantidades = req.body.cantidades;
  
    sequelize
      .query(
        "INSERT INTO pedidos (usuario_id, direccion, total, metodo_pago) VALUES (?,?,?,?)",
        {
          replacements: [usuario_id, direccion, total, metodo_pago]
        }
      )
      .then(resultados => {
        //Este query es para saber el id que va a tener este nuevo pedido
        sequelize
          .query("SELECT id FROM pedidos ORDER BY id DESC LIMIT 1", {
            type: sequelize.QueryTypes.SELECT
          })
          .then(resultados => {
            let pedido_id = resultados[0].id;
            for (var i = 0; i < productos.length; i++) {
              let producto = productos[i];
              let cantidad = cantidades[i];
              sequelize.query(
                "INSERT INTO pedidos_productos (pedido_id, producto_id, cantidad) VALUES (?,?,?)",
                {
                  replacements: [pedido_id, producto, cantidad]
                }
              );
            }
            res.status(200).json("El pedido fue realizado con éxito");
          });
      });
  });
  
  //Trae todos los pedidos, sólo administrador
  app.get("/pedidos", validarAdmin, (req, res) => {
    sequelize
      .query(
        "SELECT pedidos.*, productos.nombre AS nombre_producto, pedidos_productos.cantidad FROM pedidos JOIN pedidos_productos ON pedidos_productos.pedido_id = pedidos.id JOIN productos ON pedidos_productos.producto_id = productos.id",
        { type: sequelize.QueryTypes.SELECT }
      )
      .then(resultados => {
        res.status(200).json(resultados);
      });
  });
  
  //Endpoint para actualizar el estado de un pedido, sólo administradores
  app.patch("/pedidos/:id", validarAdmin, (req, res) => {
    let id_pedido = req.params.id;
    let nuevo_estado = req.body.nuevo_estado;
    sequelize
      .query("UPDATE pedidos SET estado = ? WHERE id = ?", {
        replacements: [nuevo_estado, id_pedido]
      })
      .then(resultados => {
        res.status(200).json("El estado del pedido fue modificado");
      });
  });