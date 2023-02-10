const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();
const db = require("./app/models");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const conf = require("./app/config/db.config");
const cookieParser = require("cookie-parser");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("¡Conectado a la base de datos!");
  })
  .catch((err) => {
    console.log("¡Error al conectar a la base de datos!", err);
    process.exit();
  });
const Usuario = db.usuarios;

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// analizar las solicitudes de tipo de contenido - application/json
app.use(express.json());

app.use(express.static(path.join(__dirname, "static")));

// analizar las solicitudes de tipo de contenido - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/login", function (req, res) {
  // Render login template
  res.sendFile(path.join(__dirname + "/login.html"));
});
app.get("/registro", function (req, res) {
  res.sendFile(path.join(__dirname + "/registro.html"));
});

app.post("/auth", async function (req, res) {
  // Capture the input fields
  const { username, password } = req.body;
  // Ensure the input fields exists and are not empty
  if (!username || !password) {
    return res.status(400).json({
      message: "Faltan datos en el formulario de inicio de sesión",
    });
  }
  //buscar usuario y contraseña en la colección usuario
  Usuario.findOne({ nombre: username })
    .then((usuario) => {
      //Si el usuario no existe, devolver error
      if (!usuario) {
        return res.status(401).json({
          message: "Usuario o contraseña incorrecta",
        });
      }
      // Comprobar la contraseña
      return bcrypt.compare(password, usuario.contraseña).then((resultado) => {
        if (!resultado) {
          return res.status(401).json({
            message: "Usuario o contraseña incorrecta",
          });
        }
        const payload = {
          id: usuario._id,
          nombre: usuario.nombre,
        };
        //construimos el payload y le pasamos el Token_secret
        const token = jwt.sign(payload, conf.TOKEN_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/home");
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({
        message: "Error al procesar la solicitud",
      });
    });
});

app.post("/registro", async function (req, res) {
  // Capturar los campos de entrada
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  // Asegurar que los campos de entrada existen y no estan vacíos
  if (username && password) {
    // crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre: username,
      contraseña: await bcrypt.hash(password, salt),
    });
    // guardar usuario en la colección usuario
    nuevoUsuario.save().then((usuario) => {
      // iniciar la sesión
      req.session.user = usuario;
      res.redirect("/login");
    });
  }
});

app.get("/logout", function (req, res) {
  // Destruye la sesión actual
  res.clearCookie("token");
  res.status(200).json({
    message: "Has cerrado la sesión!",
  });
});

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).send("Acceso denegado.");

  jwt.verify(token, conf.TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(400).send("Token inválido.");
    req.usuario = decoded;
    next();
  });
};

app.get("/home", verifyToken, function (req, res) {
  res.status(200).json({
    message: "Bienvenido, estás autenticado a través de token",
  });
});

// ruta simple
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la Otra cara del Paneta APIRestful" });
});

//consulta a la API OpenStreetMap
const axios = require("axios");

const lat = 28.3587436;
const lon = -14.053676;
const query = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

axios
  .get(query)
  .then((res) => {
    console.log(res.data);
  })
  .catch((error) => {
    console.log(error);
  });

require("./app/routes/usuario.routes.js")(app);
require("./app/routes/actividades.routes.js")(app);
require("./app/routes/localizaciones.routes.js")(app);
require("./app/routes/lugares.routes.js")(app);
require("./app/routes/tipolugares.routes.js")(app);
require("./app/routes/eventos.routes.js")(app);
require("./app/routes/tipoactividades.routes.js")(app);

// establecer el puerto, escuchar las peticiones
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
