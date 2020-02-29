const express = require('express'); // meto la funcion de express en una constante o una variable var.
const app = express(); // el resultado de invocar express() en app
const nodemailer = require('nodemailer');

const handlebars = require('express-handlebars');

app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Pagina principal')

})

app.get('/hola', (req, res) => (
    //req.query.nombre
    res.send('Bienvenido ' + req.query.nombre)
)); //para que funcione la callback, los parametros deben ir explicitamente en dicho orden.
//req es lo que me envia el usuario
//res es para responder, lo que le devuelvo al usuario

app.get('/hola/:nombre', (req, res) => res.send('bienvenido ' + req.params.nombre));


app.post('/contacto', async (req, res) => {
    const opciones = {
        from: 'asd@gmail.com',
        to: 'asd@gmail.com',
        subject: 'titulo de mail',
        text: 'cuerpo del mail'
    }
     await transporter.sendMail(opciones);
    res.send(req.body.nombre);

    console.log(req.body);
    res.send(req.body.name);
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'asd@gmail.com',
        pass: 'pass'
    }
})

app.get('/acerca-de', (req, res) => {
    res.render('acerca', {titulo: 'mi titulo!'});
})

app.listen(3000, () => (console.log('app escuchando en el puerto 3000')))