var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const hbs = require('express-handlebars');

app.engine('handlebars',hbs());
app.set('view engine','handlebars');

app.use(express.urlencoded({ extended: true }));
// Async / Await
async function conectar() {
    await mongoose.connect(
            'mongodb://10.128.35.136:27017/curso', 
            {useNewUrlParser: true}
    )
    console.log('Conectado!');
}
conectar();
const ArtistaSchema = mongoose.Schema({
    nombre: String,
    apellido: String
})
const ArtistaModel = mongoose.model('Artista',ArtistaSchema);
// Promise - Then
/*
mongoose.connect(
    'mongodb://10.5.20.78:27017', 
    {useNewUrlParser: true}
).then(function() {
    console.log('Conectado');
})
*/
app.get('/listado', async function(req, res) {
    var list = await ArtistaModel.find().lean();
    res.render('listado', {listado: list });
});

app.get('/buscar/:id', async function(req, res) {
    var listado = await ArtistaModel.find({_id: req.params.id});
    res.send(listado);
});

app.get('/agregar', async function(req, res) {
    var nuevoArtista = await ArtistaModel.create(
        {nombre: 'Fat', apellido: 'Mike'}
    );
    res.send(nuevoArtista);
});

app.get('/modificar', async function(req, res) {
    await ArtistaModel.findByIdAndUpdate(
        {_id: '5e56fe51143a530abc834fa8'},
        {nombre: 'Nuevo nombre', apellido: 'NA'}
    );
    res.send('ok');
});

app.get('/borrar', async function(req, res) {
    var rta = await ArtistaModel.findByIdAndRemove(
        {_id: '5e56fe51143a530abc834fa8'}
    );
    res.send(rta);
});

app.get('/formularioAlta',async (req,res) => {
    res.render('formulario');
})

app.post('/formularioProcesado', async (req,res) => {
    var nuevoArtista = await ArtistaModel.create(

        {nombre: req.body.nombre,
         apellido: req.body.apellido}
    );
    res.redirect('/listado');
   // res.send(nuevoArtista);
})


app.get('/borrar/:id', async (req, res) => {
    
    var rta = await ArtistaModel.findByIdAndRemove(
        {_id: req.params.id}
    );
    res.send(rta);
    res.redirect('/listado');
})


app.get('/editar/:id', async (req,res) => {
    var artista = await ArtistaModel.findById(
        {_id: req.params.id}
    ).lean();
    res.render('formulario', {datos: artista})
})

app.post('/editar/:id', async (req,res)=> {

    await ArtistaModel.findByIdAndUpdate(
    {_id: req.params.id},
    
    {
     nombre: req.body.nombre,
     apellido: req.body.apellido
    }

    );
    res.redirect('/listado');

});

app.listen(80, function() {
    console.log('App en localhost');
});