var express = require("express");
var router = express.Router();
const multer = require("multer");

const loggedMiddleware = require("../middlewares/loggedMiddleware");
const createMiddlewares = require("../middlewares/createMiddlewares");
const editMiddlewares = require("../middlewares/editMiddlewares");

// ************ Requiero la funcionalidad del controlador ************
let productController = require("../controller/productController");

// ************ Configuracion de Multer ************
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/img");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

// ************ Configuracion de las rutas ************
// Devolver todos los productos
router.get("/productList", productController.listaDeProductos);
// Devolver los productos segun su genero
router.get("/category/:id/", productController.category);
// RUta para la barra de busqueda
router.post("/search/", productController.search);
// Devolver los productos en oferta
router.get("/sale/:id/", productController.sale);
// Devolver los productos en temporada
router.get("/season/:id/", productController.season);

router.post(
  "/productList",
  upload.single("image"),
  createMiddlewares,
  productController.store
);
// Crear un producto
router.get("/createProduct", productController.crearProducto);

// Devolver un producto
router.get("/productdetail/:id", productController.detalle);
// Editar un producto
router.get("/editProduct/:id", productController.editarProducto);
router.put(
  "/editProduct/:id",
  upload.single("editImage"),
  editMiddlewares,
  productController.update
);
// Eliminar un producto
router.delete("/delete/:id", productController.destroy);

router.get("/productCart", loggedMiddleware, productController.carrito);

module.exports = router;
