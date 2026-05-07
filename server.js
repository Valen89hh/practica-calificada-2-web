require('dotenv').config();

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

const almacenesRoutes = require('./routes/almacenes.routes');
const productosRoutes = require('./routes/productos.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', (req, res) => {
    res.render('index', { title: 'Inicio' });
});
app.use('/almacenes', almacenesRoutes);
app.use('/productos', productosRoutes);

// 404
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Pagina no encontrada',
        mensaje: 'La pagina que buscas no existe.'
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render('error', {
        title: 'Error del servidor',
        mensaje: err.message || 'Ocurrio un error inesperado.'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
