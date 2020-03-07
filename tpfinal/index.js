const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const hbs = require('express-handlebars');

const session = require('express-session');


//Settings
app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');
app.set('port', 3000);


//Middlewares
app.use(session({ secret: '"·$&/&·$TG$·DHD' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //convierte de json a body

//--------------------------------------------
async function conectar() {
    await mongoose.connect(
        'mongodb://10.128.35.136:27017/curso',
        { useNewUrlParser: true }
    )
    console.log('Conectado!');
}
//--------------------------------------------
conectar();

const EstadoSchema = mongoose.Schema({
    estado: String,
    detalle: String
})
const EstadoModel = mongoose.model('Estado', EstadoSchema);


//Llenando nuevo estado
app.get('/agregarEstado', (req, res) => {
    res.render('formulario');
});

//Creando nuevo estado
app.post('/agregarEstado', async (req, res) => {
    var nuevoEstado = await EstadoModel.create(

        {
            estado: req.body.estado,
            detalle: req.body.detalle
        }
    );

    res.redirect('/listado');
});


//Editando un estado ---------------------------------
app.get('/editarEstado/:id', async (req, res) => {
    var estado = await EstadoModel.findById(
        { _id: req.params.id }
    ).lean();
    res.render('formulario', { datos: estado })
});

app.post('/editarEstado/:id', async (req, res) => {
    if (req.body.estado == '') {
        res.render('formulario', {
            error: 'El estado es obligatorio',
            datos: {
                estado: req.body.estado,
                detalle: req.body.detalle
            }

        });
        return;

    }
    await EstadoModel.findByIdAndUpdate(
        { _id: req.params.id },
        {
            estado: req.body.estado,
            detalle: req.body.detalle
        }

    );
    res.redirect('/listado');
});
//----------------------------------------------------


//Obteniendo el listado
app.get('/listado', async function (req, res) {
    var list = await EstadoModel.find().lean();
    res.render('listado', { listado: list });
});
//---------------------


//Borrando un estado
app.get('/borrar/:id', async (req, res) => {

    var rta = await EstadoModel.findByIdAndRemove(
        { _id: req.params.id }
    );
    res.redirect('/listado');
});
//----------------------------------------------------


//Iniciando Servidor
app.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'));
});