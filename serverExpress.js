const express = require ('express');
const handlebars = require ('express-handlebars');
const { Server } = require ('socket.io')

const productsRouter = require ('./routers/productsRouter');
const cartsRouter = require ('./routers/cartsRouter');
const viewsRouter = require('./routers/viewsRouter')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', handlebars.engine());
app.set('views','./views');
app.set('view engine', 'handlebars');

app.use('/static', express.static('public'));

const PORT = 8080;

const httpServer = app.listen(PORT, () => {
    console.log(`El servidor esta escuchando en el puerto ${PORT}`)
});

const socketServer = new Server(httpServer);

// socketServer.on('conection', (socket) =>{
//     console.log("Nuevo cliente conectado");
// })

app.use('/api/products/', productsRouter);
app.use('/api/carts/', cartsRouter);
app.use('/', viewsRouter);

