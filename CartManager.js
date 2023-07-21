const fs = require("fs");

class CartManager {
  constructor(path) {
    this.cart = [];
    this.path = path;
  }

  addCart() {
    return fs.promises.readFile(this.path, "utf-8")
    .then((content) => {
      if (fs.existsSync(this.path)) {
        this.cart = JSON.parse(content);
      }

      const newCart = {
        id: this.cart.length + 1,
        products: [],
      };

      this.cart.push(newCart);

      const cartToString = JSON.stringify(this.cart, null, 2);

      return fs.promises.writeFile(this.path, cartToString)
      .then(() => {
        return newCart;
      });
    })
    .catch(() => {
        const newCart = {
            id: this.cart.length + 1,
            products: [],
          };
    
          this.cart.push(newCart);
    
          const cartToString = JSON.stringify(this.cart, null, 2);
    
          return fs.promises.writeFile(this.path, cartToString)
          .then(() => {
            return newCart;
          });
    })
  }

  getProductsCart(cartId) {

    return fs.promises.readFile(this.path, "utf-8")
    .then ((content) => {

      this.cart = JSON.parse(content);

      const cartById = this.cart.find(el => el.id === cartId);

      const productsInCart = cartById.products;

      if (!cartById){
        const msj = `ERROR: Cart: ${id} - Not Found`
        return msj;

      } else {
        return productsInCart;

      }
      
    })
    .catch(() => {
      const msg = `El ID que busca no existe`; 
      return msg
    })

  }

  addProductToCart(product, cartId) {

    return fs.promises.readFile(this.path, "utf-8")
    .then((content) => {
        
        if (fs.existsSync(this.path)) {
          this.cart = JSON.parse(content);
        }

        const cartById = this.cart.find(el => el.id === cartId);

        if (!cartById){
            const msg = `No existe el carrito con ID ${cartId}`
            console.log(msg);
            return msg;
        }

        const existProduct = cartById.products.find((el) => el.id === product.id);

        if (!existProduct){

            cartById.products.push({
                id: product.id,
                quantity: 1
            })

            const index = this.cart.findIndex(el => el.id === cartId);
  
            this.cart[index] = cartById;
            
            return fs.promises.writeFile(this.path, JSON.stringify(this.cart, null, 2))
            .then(() => {
            console.log(`El carrito con ID: "${cartId}" ha sido correctamente actualizado`);
            return this.cart[index];
            })

        } else {

            const updateProductQty = {
                id: existProduct.id,
                quantity: existProduct.quantity + 1 
            }

            const cartIndex = this.cart.findIndex(el => el.id === cartId);

            const productIndex = cartById.products.findIndex(el => el.id === product.id);

            this.cart[cartIndex].products[productIndex] = updateProductQty;

            return fs.promises.writeFile(this.path, JSON.stringify(this.cart, null, 2))
            .then(() => {
            console.log(`El carrito con ID: "${cartId}" ha sido correctamente actualizado`);
            return this.cart[cartIndex];
            });

            //cartById.products.quantity += 1

        }

    })
    .catch(()=>{
        console.log(`no se que paso xD`);
    })

  }
}

module.exports = CartManager;

