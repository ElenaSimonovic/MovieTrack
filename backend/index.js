const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const korisnikRoutes = require('./routes/korisnik.routes');
const filmRoutes = require('./routes/film.routes');
const komentarRoutes = require('./routes/komentar.routes');
const listaRoutes = require('./routes/lista.routes');

app.use('/korisnik', korisnikRoutes);
app.use('/film', filmRoutes);
app.use('/komentar', komentarRoutes);
app.use('/lista', listaRoutes);


app.listen(4200, () => {
    console.log("Server radi na 4200");
});