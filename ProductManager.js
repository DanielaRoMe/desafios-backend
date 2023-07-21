//const { log } = require("console");
const fs = require("fs");

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  addProduct(info) {
    
    if (
      info.title === undefined ||
      info.description === undefined ||
      info.price === undefined ||
      info.code === undefined ||
      info.stock === undefined ||
      info.category === undefined 
    ) {
      return console.log("ERROR: Todos los campos son obligatorios");
    }

    const product = {
      title: info.title,
      description: info.description,
      price: info.price,
      thumbnail: [info.thumbnail],
      code: info.code,
      stock: info.stock,
      category: info.category
    };    

    return fs.promises.readFile(this.path, "utf-8")
      .then((content) => {

        if (fs.existsSync(this.path)) {
          this.products = JSON.parse(content);
        }

        const exist = this.products.find((el) => el.code === product.code);

        if (!exist) {
          
          const assignId = { id: this.products.length + 1 } ;
          const status = {status: true};

          const newProduct = ({...assignId, ...product, ...status});

          this.products.push( newProduct );
          
          const newProductsString = JSON.stringify(this.products, null, 2);

          return fs.promises.writeFile(this.path, newProductsString)
          .then(()=>{
            console.log(`Producto: ${newProduct.title} agregado con exito`);
            return newProduct;
          })

        } else {
          const errorMsg = `El producto con codigo: ${product.code} ya existe`;
          return errorMsg
        }

      })
      .catch(() => {
        const assignId = { id: this.products.length + 1 } ;
        const status = {status: true};

        const newProduct = ({...assignId, ...product, ...status});

        this.products.push( newProduct );

        const newProductsString = JSON.stringify(this.products, null, 2);
        return fs.promises.writeFile(this.path, newProductsString)
        .then(() =>{
          return newProduct;
        })

      });

  }


  getProducts () {

    return fs.promises.readFile(this.path, "utf-8")

    .then((content) => {

      this.products = JSON.parse(content);
      return this.products

    })
    .catch (()=> {
      return console.log(this.products);
    })
      
  }

  getProductById (id) {

    return fs.promises.readFile(this.path, "utf-8")
    .then ((content) => {

      this.products = JSON.parse(content);

      const productById = this.products.find(el => el.id === id);

      if (!productById){
        const msj = `ERROR: Product: ${id} - Not Found`
        return msj;

      } else {
        return productById;

      }
      
    })
    .catch((err) => {
      console.log(`El archivo "${this.path}" no existe`); 
      return err
    })

      
  }

  updateProduct(id,updateField){

    return fs.promises.readFile(this.path, "utf-8")
    .then ((content) => {

      if (fs.existsSync(this.path)) {
        this.products = JSON.parse(content);
      }

      const productToUpdate = this.products.find(el => el.id === id)

      if(updateField.id){
        const errMsg = "No se puede actualizar el ID"
        return errMsg
      }

        if (!productToUpdate) {
          const errMsg = `No hay ningun producto con el ID: "${id}" registrado o el archivo "${this.path}" aun no ha sido creado`;
          return errMsg
        }

        const updatedProduct = {
          id: id,
          title: updateField.title || productToUpdate.title,
          description: updateField.description || productToUpdate.description,
          price: updateField.price || productToUpdate.price,
          thumbnail: [updateField.thumbnail] || [productToUpdate.thumbnail],
          code: updateField.code || productToUpdate.code,
          stock: updateField.stock || productToUpdate.stock,
          category: updateField.category || productToUpdate.category,
          status: updateField.status || productToUpdate.status
        }
  
        const index = this.products.findIndex(el => el.id === id);
  
        this.products[index] = updatedProduct;

        return fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        .then(() => {
          console.log(`El producto con ID: "${id}" ha sido correctamente actualizado`);
          return updatedProduct
        })

    })
    .catch((err) =>{
      return err;
    })

  }

  deleteProduct(id){

    return fs.promises.readFile(this.path, "utf-8")
    .then((content) => {
      this.products = JSON.parse(content);

      const deleteProduct = this.products.findIndex(el => id === el.id);

      if(deleteProduct !== -1) {

        this.products.splice(deleteProduct,1);

        return fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        .then(()=>{
          const msg = `El producto de ID: ${id} - ha sido eliminado correctamente`;
          return msg;
        })
      } else {
        const msg = `No existe ningun producto con ID: ${id} dentro del archivo "${this.path}" o el archivo aun no ha sido creado.`;
         return msg;
      }
    })
    .catch((err) => {
      return err;
    })
    
  }
}


module.exports = ProductManager;

