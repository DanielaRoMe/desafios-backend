const { log } = require("console");
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
      info.thumbnail === undefined ||
      info.code === undefined ||
      info.stock === undefined
    ) {
      return console.log("ERROR: Todos los campos son obligatorios");
    }

    const newProduct = {
      title: info.title,
      description: info.description,
      price: info.price,
      thumbnail: info.thumbnail,
      code: info.code,
      stock: info.stock,
    };    

    fs.promises.readFile(this.path, "utf-8")
      .then((content) => {

        if (fs.existsSync(this.path)) {
          this.products = JSON.parse(content);
        }

        const exist = this.products.find((el) => el.code === newProduct.code);

        if (!exist) {
          
          const assignId = { id: this.products.length + 1 } ;

          this.products.push({...assignId, ...newProduct})
          
          const newProductsString = JSON.stringify(this.products, null, 2);

          fs.promises.writeFile(this.path, newProductsString)
          .then(()=>{
            console.log(`Producto: ${newProduct.title} agregado con exito`);
          })
        } else {
          console.log(`El producto con codigp: ${newProduct.code} ya existe`);
        }

      })
      .catch(() => {
        const assignId = { id: this.products.length + 1 } ;

        this.products.push({...assignId, ...newProduct});

        const newProductsString = JSON.stringify(this.products, null, 2);
        fs.promises.writeFile(this.path, newProductsString);

        return console.log(`Producto: ${newProduct.title} agregado con exito`);
      });

  }


  getProducts () {

    fs.promises.readFile(this.path, "utf-8")
    .then((content) => {

      this.products = JSON.parse(content);
      
      return console.log(this.products);
    })
    .catch (()=> {
      return console.log(this.products);
    })
      
  }

  getProductById (id) {

    fs.promises.readFile(this.path, "utf-8")
    .then ((content) => {

      this.products = JSON.parse(content);

      const productById = this.products.find(el => el.id === id);

      productById ? console.log(productById) : console.log(`ERROR: Product: ${id} - Not Found`);

    })
    .catch((err) => {
      console.log(`El archivo "${this.path}" no existe`);
    })

      
  }

  updateProduct(id,updateField){

    fs.promises.readFile(this.path, "utf-8")
    .then ((content) => {

      if (fs.existsSync(this.path)) {
        this.products = JSON.parse(content);
      }

      const productToUpdate = this.products.find(el => el.id === id)

      if(updateField.id){
        console.log("No se puede actualizar el ID");
        return
      } else {

        const updatedProduct = {
          id: id,
          title: updateField.title || productToUpdate.title,
          description: updateField.description || productToUpdate.description,
          price: updateField.price || productToUpdate.price,
          thumbnail: updateField.thumbnail || productToUpdate.thumbnail,
          code: updateField.code || productToUpdate.code,
          stock: updateField.stock || productToUpdate.stock
  
        }
  
        const index = this.products.findIndex(el => id === el.id);
  
        this.products[index] = updatedProduct;

        fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))

        console.log(`El producto con ID: "${id}" ha sido correctamente actualizado`);
        return
      }

    })
    .catch((err) =>{
      console.log(`No hay ningun producto con el ID: "${id}" registrado o el archivo "${this.path}" aun no ha sido creado`, err);

    })

  }

  deleteProduct(id){

    fs.promises.readFile(this.path, "utf-8")
    .then((content) => {
      this.products = JSON.parse(content);

      const deleteProduct = this.products.findIndex(el => id === el.id);

      if(deleteProduct !== -1) {

        this.products.splice(deleteProduct,1);

        fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        .then(()=>{
          console.log(`El producto de ID: ${id} - ha sido eliminado correctamente`);
        })

      } else {
        console.log(`No existe ningun producto con ID: ${id}`);
      }
      
    })
    .catch((err) => {
      console.log(`Momentaneamente no existe ningun producto con el ID: "${id}" dentro del archivo "${this.path}" o el archivo aun no ha sido creado.`, err);
    })

  }
}

const manager = new ProductManager("./products.json");

//Consultando los productos existentes, si existen devuelve el arreglo de productos en JSON, de no existir aun datos, devuelve el arreglo vacio - OK
// manager.getProducts();

//Intentando borrar producto por ID - ID inexixtente - OK
//manager.deleteProduct(10);

//Borrando producto por ID - OK
//manager.deleteProduct(2);

//Actualizando producto cuyo ID no esta aun registrado - ERROR - OK
//manager.updateProduct(10);

//Actualizando producto cuyo ID si esta el JSON, pero el ID no se puede actualizar - ERROR - OK
//manager.updateProduct(2,{id:5, price:500});

//Actualizando producto cuyo ID si esta en el JSON - OK
//manager.updateProduct(2,{price:900, stock:1});

///Solo muetra el elemento con ID 2 - manga de FMA
//manager.getProductById(2);

//ERROR: No existe producto con ID 10
//manager.getProductById(10); 



// //agregando 3 productos - OK
manager.addProduct({
  title: "NANA Tomo 1",
  description: "Manga creado por Ai Yazawa",
  price: 480,
  thumbnail: "NANA-tomo1.jpg",
  code: "1111",
  stock: 5,
});
manager.addProduct({
  title: "Fullmetal Alchemist Tomo 1",
  description: "Manga creado por Hiromu Arakawa",
  price: 480,
  thumbnail: "FMA-tomo1.jpg",
  code: "7894",
  stock: 7,
});
manager.addProduct({
  title: "NANA Tomo 5",
  description: "Manga creado por Ai Yazawa",
  price: 480,
  thumbnail: "NANA-tomo5.jpg",
  code: "1125",
  stock: 8
});


//agregando otro producto pero con un dato faltante - validacion de campo completado - OK
// manager.addProduct({
//     title: "NANA Tomo 2",
//     description: "Manga creado por Ai Yazawa",
//     thumbnail: "NANA-tomo2.jpg",
//     code: "1112",
//     stock: 10
// });

// //agregando otro producto pero codigo duplicado - validacion de codigo unico - OK
// manager.addProduct({
//     title: "NANA Tomo 3",
//     description: "Manga creado por Ai Yazawa",
//     price: 480,
//     thumbnail: "NANA-tomo3.jpg",
//     code: "1111",
//     stock: 2
// });

// //Agregando varios productos para luego buscar por ID
// manager.addProduct({
//     title: "NANA Tomo 21",
//     description: "Manga creado por Ai Yazawa",
//     price: 480,
//     thumbnail: "NANA-tomo21.jpg",
//     code: "1221",
//     stock: 1
// });
// manager.addProduct({
//     title: "Jujutsu Kaisen Tomo 0",
//     description: "Manga creado por Gege Akutami",
//     price: 480,
//     thumbnail: "Jujutsu-tomo0.jpg",
//     code: "4568",
//     stock: 15
// });


