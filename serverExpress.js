const express = require ('express');
const ProductManager = require ('./ProductManager.js');

const manager = new ProductManager("./products.json");

const app = express();

app.get('/', (req, res) => {
    return res.send("Bienvenido!")
})

app.get('/products', (req, res) => {

    const limit = req.query.limit;

    if(!limit){
        manager.getProducts()
        .then((products) => {
            return res.send(products);
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
            ///const filteredProducts = productsToFilter.splice(limit,(productsToFilter.length-limit))
            return res.send(products);
        })
        .catch((error) => {
            console.log("Error:", error);
            return res.status(500).send("Error en servidor");
        });

    }

   

}); 

app.get('/products/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);

    manager.getProductById(userId)
    .then((user) =>{
        return res.send(user)
    })
    .catch((error) =>{
        console.log("Error", error);
        return res.status(500).send("Error en servidor")
    })



})

app.listen(8080, () => {
    console.log("El servidor esta escuchando")
});