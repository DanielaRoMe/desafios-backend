const express = require ('express');

const ProductManager = require ('../ProductManager');
const manager = new ProductManager("./products.json");

// const CartManager = require ('../CartManager');
// const managerCart = new CartManager ("./carts.json");

const { Router } = express; 

const viewsRouter = Router();

viewsRouter.get('/home', (req, res) => {

    const limit = req.query.limit;

    if(!limit){
        manager.getProducts()
        .then((products) => {
            const params = {
                title: 'Home - Productos',
                products
            }
            return res.render('home', params);
        })
        .catch((error) => {
            console.log("Error:", error);
            return res.status(500).send("Internal Server Error");
        });
    } else {
        manager.getProducts()
        .then((products) => {

            if(limit > products.length){
                return res.send(`ERROR: la cantidad de productos registrados es ${products.length}`);
            }
            products.splice(limit,(products.length-limit))

            const params = {
                title: 'Home - Productos',
                products
            }
            return res.render('home', params);
        })
        .catch((error) => {
            console.log("Error:", error);
            return res.status(500).send("Error en servidor");
        });

    }

}); 

viewsRouter.get('/realTimeProducts', (req, res) => {

    const limit = req.query.limit;

    if(!limit){
        manager.getProducts()
        .then((products) => {
            const params = {
                title: 'Real Time Productos',
                products
            }
            return res.render('realTimeProducts', params);
        })
        .catch((error) => {
            console.log("Error:", error);
            return res.status(500).send("Internal Server Error");
        });
    } else {
        manager.getProducts()
        .then((products) => {

            if(limit > products.length){
                return res.send(`ERROR: la cantidad de productos registrados es ${products.length}`);
            }
            products.splice(limit,(products.length-limit))

            const params = {
                title: 'Real Time Products',
                products
            }
            return res.render('realTimeProducts', params);
        })
        .catch((error) => {
            console.log("Error:", error);
            return res.status(500).send("Error en servidor");
        });

    }

}); 

module.exports = viewsRouter;