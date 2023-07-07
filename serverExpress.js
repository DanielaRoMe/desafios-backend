const express = require ('express');

const productsRouter = require ('./routers/productsRouter');
const cartsRouter = require ('./routers/cartsRouter');

// const ProductManager = require ('./ProductManager.js');
// const manager = new ProductManager("./products.json");

// const CartManager = require ('./CartManager');
// const managerCart = new CartManager ("./carts.json");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);

app.listen(8080, () => {
    console.log("El servidor esta escuchando")
});