const db = require("../database/models");
const { validationResult } = require("express-validator");

const fs = require("fs");

let productController = {
  carrito: (req, res) => {
    res.render("product/productCart");
  },

  detalle: (req, res) => {
    let promDetail = db.Product.findByPk(req.params.id);
    let promSizes = db.Size.findAll();
    Promise.all([promDetail, promSizes])
      .then(([product, sizes]) => {
        res.render("product/productDetail", {
          product,
          sizes,
        });
      })
      .catch((error) => {
        console.log(error);
        res.send("error");
      });
  },
  // (get) Create - Formulario para crear
  crearProducto: (req, res) => {
    let promCategories = db.Category.findAll();
    let promSizes = db.Size.findAll();
    Promise.all([promCategories, promSizes]).then(([categories, sizes]) => {
      return res.render("product/createProduct", { categories, sizes });
    });
  },
  // ************ (post) Create - Método para guardar la info ************
  store: (req, res) => {
    const resultValidations = validationResult(req);

    console.log(resultValidations.errors);
    if (resultValidations.errors.length > 0) {
      let promCategories = db.Category.findAll();
      let promSizes = db.Size.findAll();
      Promise.all([promCategories, promSizes]).then(([categories, sizes]) => {
        return res.render("product/createProduct", {
          categories,
          sizes,
          errors: resultValidations.mapped(),
          oldData: req.body,
        });
      });
    } else {
      db.Product.create({
        id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        brand: req.body.brand,
        size_id: req.body.size_id,
        category_id: req.body.category_id,
        discount: req.body.discount,
        image: req.file ? req.file.filename : "default-image.jpg",
        gender: req.body.gender,
        deleted: 0,
      })
        .then(() => {
          res.redirect("/product/productList");
        })
        .catch((error) => {
          console.log(error);
          res.send("error");
        });
    }
  },
  // ************ (Get) editar un producto - Método que nos trae la vista del formulario para editar un producto ************
  editarProducto: (req, res) => {
    let productId = req.params.id;
    let promEdit = db.Product.findByPk(productId, {
      include: [{ association: "category" }, { association: "size" }],
    });
    let promSizes = db.Size.findAll();
    let promCategories = db.Category.findAll();
    Promise.all([promEdit, promSizes, promCategories])
      .then(([product, sizes, categories]) => {
        return res.render("product/editProduct", {
          product,
          sizes,
          categories,
        });
      })
      .catch((error) => {
        console.log(error);
        res.send("error");
      });
  },
  // ************ (get)  - Método para devolver la lista de productos ************
  listaDeProductos: (req, res) => {
    db.Product.findAll()
      .then((products) => {
        res.render("product/productList", { products });
      })
      .catch((error) => {
        console.log(error);
        res.send("error");
      });
  },
  category: (req, res) => {
    db.Product.findAll()
      .then((products) => {
        res.render("product/categoryProduct", {
          products,
          category: req.params.id,
        });
      })
      .catch((error) => {
        console.log(error);
        res.send("error");
      });
  },
  search: (req, res) => {
    db.Product.findAll({
      where: {
        name: {
          [db.Sequelize.Op.like]: "%" + req.body.searching + "%",
        },
      },
    })
      .then((products) => {
        res.render("product/searchProducts", {
          products,
        });
      })
      .catch((error) => {
        console.log(error);
        res.send("error");
      });
  },

  sale: (req, res) => {
    let productToFilter = 10;
    db.Product.findAll({
      where: {
        discount: { [db.Sequelize.Op.gte]: productToFilter },
      },
    })
      .then((products) => {
        res.render("product/saleProduct", {
          products,
        });
      })
      .catch((error) => {
        console.log(error);
        res.send("error");
      });
  },
  season: (req, res) => {
    res.render("product/newSeasonProduct", {
      products,
      season: req.params.id,
    });
  },
  // ************ (put) editar - Método para editar la info que se envia desde el Formulario y que se almacenara en la base de datos ************
  update: (req, res) => {
    const resultValidations = validationResult(req);

    console.log(resultValidations.errors);
    if (resultValidations.errors.length > 0) {
      let productId = req.params.id;
      let promEdit = db.Product.findByPk(productId, {
        include: [{ association: "category" }, { association: "size" }],
      });
      let promSizes = db.Size.findAll();
      let promCategories = db.Category.findAll();
      Promise.all([promEdit, promSizes, promCategories])
        .then(([product, sizes, categories]) => {
          return res.render("product/editProduct", {
            product,
            sizes,
            categories,
            errors: resultValidations.mapped(),
            oldData: req.body,
          });
        })
        .catch((error) => {
          console.log(error);
          res.send("error");
        });
    } else {
      db.Product.findByPk(req.params.id)

        .then((product) => {
          db.Product.update(
            {
              id: req.params.id,
              name: req.body.name,
              description: req.body.description,
              price: req.body.price,
              brand: req.body.brand,
              size_id: req.body.size_id,
              category_id: req.body.category_id,
              discount: req.body.discount,
              image: req.file ? req.file.filename : product.image,
              gender: req.body.gender,
              deleted: 0,
            },
            {
              where: { id: req.params.id },
            }
          );
        })
        .then(() => {
          res.redirect("/product/productList");
        });
    }
  },
  // ************ (delete)  - Método para eliminar un producto de la base de datos ************
  destroy: (req, res) => {
    db.Product.destroy({
      where: { id: req.params.id },
    }).then(() => {
      res.redirect("/product/productList");
    });
  },
};

module.exports = productController;
