const db = require("../../database/models");


let productApiController = {
    'list': (req, res) => {
        let products = db.Product.findAll({
            raw:true,// te trae directamente el array dentro de lo que te trae la base de datos
           // include: ['category','size'] NO SE SI VA ESTO, CREO QUE USANDO  EL PRODUCT.RELATION YA ESTA
           attributes: ['id','name','description','category_id'] // CON ESTO NO NECESITO BORRAR CON EL DELETE
        })
        let categories = db.Category.findAll({
           raw:true
        })
        Promise.all([products,categories])
        .then(([products,categories]) => {

            let categoriesNames = [];
            let categoriesCount = [];
            categories.forEach((category) => {
                categoriesNames.push(category.name);
                categoriesCount.push(0)
              
            })
            products.forEach((product) => {
                categoriesCount[product.category_id - 1] = categoriesCount[product.category_id - 1] + 1 // le pones el menos uno porque al array arranca de la posicion 0, la parte de la izquierda es la que acumula y se posiciona dentro de lo que le corresponde en el array
            // y cuando estas recorriendo el array en la posicion 0 como product.category es 1 le resta un 1 para estar en la posicion 0 y le sumas 1 para que te cuente 1 elemento en esa posicion
            })
            let countByCategoryToSend = [];
            for (let i = 0; i < categoriesNames.length; i++) {
                //countByCategoryToSend[categoriesNames[i]] = categoriesCount[i];
                countByCategoryToSend.push(categoriesNames[i] + ':     ' + categoriesCount[i])
            }
           // res.send(products)
            products.forEach(product => {
                // delete product.price;// aca eliminamos informacion que a React no le sirve
                // delete product.brand;
                // delete product.size_id;
                // delete product.category_id;
                // delete product.discount;
                // delete product.image;
                // delete product.gender;
                // delete product.deleted
                product.relation = [ // aca le agregamos al objeto este array con la relaciones
                    "category_id",
                    "size_id"
                ];
                product.detailUrl = 'http://localhost:3030/api/product/' + product.id
            });
            return res.status(200).json({
                count: products.length,
                countByCategory: countByCategoryToSend,
                categoriesCount: categories.length,
                products: products,
                status: 200
            })
           
            })
    },
    'detail': (req, res) => {
        db.Product.findByPk(req.params.id,{
            include: ['category','size']})
            .then(product => {
               
                let respuesta = {
                    meta: {
                        status: 200,
                        url: '/api/product/:id'
                    },
                    data:{
                        product, 
                        imgUrl: 'http://localhost:3030/img/' + product.image
                    } 
                }
                res.json(respuesta);
            });
    }



}


module.exports = productApiController