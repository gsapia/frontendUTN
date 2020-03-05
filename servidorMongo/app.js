var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const hbs = require('express-handlebars');
const session = require('express-session');


//Settings
app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

//Middlewares
app.use(session({ secret: '"·$&/&·$TG$·DHD' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //convierte de json a body


async function conectar() {
    await mongoose.connect(
        'mongodb://10.128.35.136:27017/curso',
        { useNewUrlParser: true }
    )
    console.log('Conectado!');
}
conectar();

//Esquema Artista
const ArtistaSchema = mongoose.Schema({
    nombre: String,
    apellido: String
})
const ArtistaModel = mongoose.model('Artista', ArtistaSchema);

//Esquema user
const user = mongoose.Schema({
    username: String,
    password: String
})

const userModel = mongoose.model('User', user);

// Promise - Then
/*
mongoose.connect(
    'mongodb://10.5.20.78:27017', 
    {useNewUrlParser: true}
).then(function() {
    console.log('Conectado');
})
*/
app.get('/listado', async function (req, res) {
    if (!req.session.user_id) {
        res.redirect('/login');
        return;
    }
    var list = await ArtistaModel.find().lean();
    res.render('listado', { listado: list });
});

app.get('/buscar/:id', async function (req, res) {
    var listado = await ArtistaModel.find({ _id: req.params.id });
    res.send(listado);
});

app.get('/agregar', async function (req, res) {
    var nuevoArtista = await ArtistaModel.create(
        { nombre: 'Fat', apellido: 'Mike' }
    );
    res.send(nuevoArtista);
});

app.get('/modificar', async function (req, res) {
    await ArtistaModel.findByIdAndUpdate(
        { _id: '5e56fe51143a530abc834fa8' },
        { nombre: 'Nuevo nombre', apellido: 'NA' }
    );
    res.send('ok');
});

app.get('/borrar', async function (req, res) {
    var rta = await ArtistaModel.findByIdAndRemove(
        { _id: '5e56fe51143a530abc834fa8' }
    );
    res.send(rta);
});
//-------------------------------------------------
app.get('/formularioAlta',  (req, res) => {
    res.render('formulario');
})

app.post('/formularioAlta',async (req,res)=>{
    var nuevoArtista = await ArtistaModel.create(

        {
            nombre: req.body.nombre,
            apellido: req.body.apellido
        }
    );
    res.json(nuevoArtista);
});

//-------------------------------------------------

app.post('/formularioProcesado', async (req, res) => {
    var nuevoArtista = await ArtistaModel.create(

        {
            nombre: req.body.nombre,
            apellido: req.body.apellido
        }
    );
    res.redirect('/listado');
    // res.send(nuevoArtista);
})


app.get('/borrar/:id', async (req, res) => {

    var rta = await ArtistaModel.findByIdAndRemove(
        { _id: req.params.id }
    );
    res.send(rta);
    res.redirect('/listado');
})


app.get('/editar/:id', async (req, res) => {
    var artista = await ArtistaModel.findById(
        { _id: req.params.id }
    ).lean();
    res.render('formulario', { datos: artista })
})

app.post('/editar/:id', async (req, res) => {
    if (req.body.nombre == '') {
        res.render('formulario', {
            error: 'El nombre es obligatorio',
            datos: {
                nombre: req.body.nombre,
                apellido: req.body.apellido
            }

        });
        return;

    }
    await ArtistaModel.findByIdAndUpdate(
        { _id: req.params.id },
        {
            nombre: req.body.nombre,
            apellido: req.body.apellido
        }

    );
    res.redirect('/listado');

});


app.get('/contar', (req, res) => {
    if (!req.session.contador) {
        req.session.contador == 0;
    }
    req.session.contador++;
    res.json(req.session.contador);

});


app.get('/login', (req, res) => {
    res.render('formularioLogin');
});

app.post('/login', async (req, res) => {
    const u = await userModel.find({ username: req.body.username, password: req.body.password });
    console.log(u);

    if (u.length) {
        req.session.user_id = u[0]._id;
        res.redirect('/listado');
    }
    else {
        res.send('incorrect');
    }
    //------------------------------------------------------------------
    /*if ((u[0].username != 'admin') || (u[0].password != 'admin123')) {
        res.render('formularioLogin', {
            error: 'Usuario o contraseña invalida',
            datos: {
                username: req.body.username,
                pass: req.body.pass
            }
        })
    }//end if
    else {
        res.render('ok');
    }*/
    //-------------------------------------------------------------------

    return;
});


app.get('/api/artistas', async (req, res) => {
    var listado = await ArtistaModel.find().lean();
    res.json(listado);
});

app.get('/api/artistas/:id', async (req, res) => {
    try {
        var unArtista = await ArtistaModel.findById(req.params.id);
        res.json(unArtista);
    } catch (e) {
        res.status(404).send('error');
    }
});


app.post('/api/artistas', async (req, res) => {
    var artista = await ArtistaModel.create({
        nombre: req.body.nombre,
        apellido: req.body.apellido
    });
    res.json(artista);
});

app.put('/api/artistas/:id', async (req, res) => {
    try {
        await ArtistaModel.findByIdAndUpdate(req.params.id,
            {
                nombre: req.body.nombre,
                apellido: req.body.apellido
            }
        );
        res.status(200).send('ok');
    }
    catch (e) {
        res.send(404).send(error);
    }
});

app.delete('api/artistas/:id', async (req, res) => {
    try {
        await ArtistaModel.findByIdAndDelete(req.params.id);
        res.status(204).send();
    }
    catch (e) {
        res.status(404).send('error');
    }
});

app.listen(80, function () {
    console.log('App en localhost');
});
