const express = require('express');
const app = express();
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

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

io.on("connection", (socket) => {
  console.log("Client spojen:", socket.id);
})

app.set("io", io);

server.listen(4200, () => {
    console.log("Server radi na 4200");
});