var express = require("express");
var router = express.Router();
const multer = require("multer");

let usersController = require("../controller/usersController");
const validations = require("../middlewares/validatRegisterMiddlewares");
const validationsLogin = require("../middlewares/validatLoginMiddlewares");

const guestMiddlewares = require("../middlewares/gustMiddlewares");
const loggedMiddleware = require("../middlewares/loggedMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/img");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });
// Devolver el formulario de login
router.get("/login", guestMiddlewares, usersController.login);
router.post("/login", validationsLogin, usersController.userProcess);

// Devolver el formulario de register
router.get("/register", guestMiddlewares, usersController.register);
router.post(
  "/register",
  upload.single("image"),
  validations,
  usersController.saveUsers
);
// Devolver el formulario de edicion
router.get("/userEdit/:id", usersController.edit);
router.put("/userEdit/:id", upload.single("image"), usersController.userUpdate);

// Devuelve la vista del profile
router.get("/profile", loggedMiddleware, usersController.profile);
//Logout
router.get("/logout", usersController.logout);

module.exports = router;
