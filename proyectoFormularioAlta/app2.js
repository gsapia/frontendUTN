const express = require('express');
const app = express();
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const axios = require('axios');

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


app.engine('handlebars', handlebars());

//Settings
app.set('view engine', 'handlebars');
app.set('port', 3000);

//Routes
app.listen(3000, (req, res) => {
    console.log('Escuchando el puerto', app.get('port'));
});

app.get('/', (req, res) => {
    res.send('Hola bienvenido');
})

app.get('/alta', (req, res) => {
    res.render('formulario');
});

app.post('/procesar_alta', (req, res) => {
    if (req.body.nombre === "") {
        res.render('formulario', { error: 'Error: Ingrese el nombre' });
    }
    else if ((req.body.nombre.length) < 5) {
        res.render('formulario', {
            error: 'Error: La cantidad de caracteres es < 5',
            datos: req.body
        });
    }
    else res.render('ok');
});

app.get('/listado', async (req, res) => {
    try {
        const respuesta = await axios.get('https://jsonplaceholder.typicode.com/todos');
        var listado = respuesta.data;
        res.render('listado', { listado: listado });

    } catch (e) {
        res.send('Error');
    }

});

app.get('/listadoMeli' , async (req, res) => {
    try{
    const respuesta = await axios.get('https://api.mercadolibre.com/sites/MLA/categories');
    var listadoMeli = respuesta.data;
    res.render('listadoMeli', { listado: listadoMeli });
    }
    catch (e){
        res.send('Error');
    }
})