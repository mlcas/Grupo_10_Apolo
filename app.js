let express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const setLocals = require("./middlewares/setLocals.js");
const cookies = require("cookie-parser");

let app = express();

const path = require("path");
// ************ ACA ESTOY REQUIRIENDO LA INFORMACION QUE TIENEN LOS ENRRUTADORES ************
var mainRouter = require("./routes/mainRouter.js");
var productRouter = require("./routes/productRouter");
var usersRouter = require("./routes/usersRouter");

// ************ ACA ESTOY REQUIRIENDO LA INFORMACION QUE TIENEN LOS ENRRUTADORES DE LA API ************
var productApiRouter = require("./routes/api/productApiRouter");
var userApiRouter = require("./routes/api/userApiRouter");

// ************ MIDDLEWARES ************
app.use(express.static(path.join(__dirname, "./public")));
// es para poder obtner la info que viaja desde el formulario(req.body)
app.use(express.urlencoded({ extended: false }));
// es para trabajar con la session
app.use(
  session({
    secret: "Shhh, it s a secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookies());
// es para poder trabajar con el Json
app.use(express.json());
// Para poder usar los métodos PUT y DELETE
app.use(methodOverride("_method"));
// Lo uso para el slider
app.use("/js", express.static(__dirname + "/public/js"));
app.use(setLocals);

// ************ TEMPLATE ENGINE ************
app.set("views", "./views"); // es para que por defecto tome la vista
app.set("view engine", "ejs");

// Aca el servidor se queda escuchando a la espera de ser llamado por algun metodo de Http
app.listen(3030, () => {
  console.log("Servidor Corriendo en el puerto http://localhost:3030/");
});
// ************ PUNTO DE ENTRADA HACIA LAS RUTAS ************
app.use("/", mainRouter);
app.use("/product", productRouter);
app.use("/user", usersRouter);

// ************ PUNTO DE ENTRADA HACIA LAS RUTAS CON API ************
app.use("/api/product", productApiRouter);
app.use("/api/user", userApiRouter);
