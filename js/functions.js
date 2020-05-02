//Validar usuario y contraseña, guarda en el token si el usuario es admin o no
function validarUsuario(req, res, next) {
    let nombreusuario = req.body.nombreusuario;
    let password = req.body.password;
    if (typeof nombreusuario != undefined && typeof password != undefined) {
      sequelize
        .query("SELECT * FROM usuarios WHERE nombre_usuario= ?", {
          replacements: [nombreusuario],
          type: sequelize.QueryTypes.SELECT
        })
        .then(resultados => {
          let usuario = resultados[0];
          if (usuario == undefined) {
            res.status(400).json("Usuario inexistente");
          } else {
            if (hashing.verify(password, usuario.password)) {
              usuario_token = {
                id_usuario: usuario.id,
                nombreusuario: nombreusuario,
                admin: usuario.admin
              };
              const token = jwt.sign({ usuario_token }, passwordJwt);
              req.locals = token;
              return next();
            } else {
              res.status(400).json("Contraseña incorrecta");
            }
          }
        })
        .catch(err => {
          res.status(400).json("Ha ocurrido un error autenticando");
        });
    }
  }
  
  //Dado un token, se fija si corresponde a un admin o no
  function validarAdmin(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json("Primero debes iniciar sesión");
    } else {
      const verificado = jwt.verify(token, passwordJwt);
      let usuario = verificado.usuario_token;
      if (usuario.admin == 1) {
        return next();
      } else {
        res.status(403).json("Acceso denegado. Sólo administradores");
      }
    }
  }
  
  //Chequea que se haya iniciado sesión para poder interactuar
  function darAcceso(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json("Primero debes iniciar sesión");
    } else {
      const verificado = jwt.verify(token, passwordJwt);
      let usuario = verificado.usuario_token;
      if (usuario != undefined) {
        req.locals = usuario;
        return next();
      } else {
        res.status(403).json("Token inválido");
      }
    }
  }
  
  //Calcula el total de un pedido realizado
  async function calcularPrecioTotal(req, res, next) {
    let productos = req.body.productos;
    let cantidades = req.body.cantidades;
    let total = 0;
    for (var i = 0; i < productos.length; i++) {
      let cantidad = cantidades[i];
      await sequelize
        .query("SELECT precio FROM productos WHERE id = ?", {
          replacements: [productos[i]],
          type: sequelize.QueryTypes.SELECT
        })
        .then(resultados => {
          let precio = resultados[0].precio;
          total = total + precio * cantidad;
        })
        .catch(error => res.status(400).json("Algo salió mal"));
    }
    res.locals = total;
    return next();
  }