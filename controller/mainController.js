const db = require("../database/models");

let mainController = {
  index: async (req, res) => {
    const sliderInfo = [
      { class: "item-a", img: "Imagen-principal.jpg" },
      { class: "item-a", img: "nike-futbol-women.jpg" },
      { class: "item-b", img: "Real-Madrid.jpg" },
      { class: "item-c", img: "botas-adidas.jpg" },
      { class: "item-d", img: "Puma-camisa.jpg" },
      { class: "item-e", img: "R.jpg" },
      { class: "item-a", img: "img-slider-women.jpg" },
    ];

    try {
      let products = await db.Product.findAll();

      const pelotas = products.filter((producto) => {
        return producto.category_id == 1;
      });
      let pelotasAEnviar = [];
      let cantidadDeIteraciones = 3;
      if (pelotas.length < 3) {
        cantidadDeIteraciones = pelotas.length;
      }
      for (let i = 0; i < cantidadDeIteraciones; i++) {
        pelotasAEnviar.push(pelotas[i]);
      }
      const camisetas = products.filter((producto) => {
        return producto.category_id == 2;
      });
      let camisetaAEnviar = [];
      cantidadDeIteraciones = 2;
      if (camisetas.length < 2) {
        cantidadDeIteraciones = camisetas.length;
      }
      for (let i = 0; i < cantidadDeIteraciones; i++) {
        camisetaAEnviar.push(camisetas[i]);
      }
      const botines = products.filter((producto) => {
        return producto.category_id == 5;
      });
      let botinAEnviar = [];
      cantidadDeIteraciones = 3;
      if (botines.length < 3) {
        cantidadDeIteraciones = botines.length;
      }
      for (let i = 0; i < cantidadDeIteraciones; i++) {
        botinAEnviar.push(botines[i]);
      }

      res.render("index", {
        sliderInfo,
        pelotasAEnviar,
        camisetaAEnviar,
        botinAEnviar,
      });
    } catch (error) {
      console.log(error);
      res.send("error");
    }
  },
  nosotros: (req, res) => {
    res.render("sobreNosotros");
  },
};
module.exports = mainController;
