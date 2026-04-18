// pokretanje: node index.js

const mysql = require('mysql');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const dbConfig = require("./dbConfig");

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// konekcija na bazu
const dbConn = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

dbConn.connect(err => {
    if (err) throw err;
    console.log("Spojen na bazu");
});

// PORT
app.listen(4200, () => {
    console.log("Server radi na portu 4200");
});


// =====================================================
//  KORISNIK
// =====================================================

// registracija
app.post('/registracija', async (req, res) => {
    const { email, korisnickoIme, lozinka, datumRodjenja } = req.body;

    const hash = await bcrypt.hash(lozinka, 10);

    dbConn.query(
        "INSERT INTO Korisnik VALUES (?, ?, ?, ?, 'Aktivan')",
        [email, hash, korisnickoIme, datumRodjenja],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Registracija uspješna");
        }
    );
});

// login
app.post('/prijava', (req, res) => {
    const { email, lozinka } = req.body;

    dbConn.query(
        "SELECT * FROM Korisnik WHERE Email_korisnika=?",
        [email],
        async (err, result) => {
            if (err) return res.status(500).send(err);
            if (result.length === 0) return res.status(404).send("Ne postoji");

            const user = result[0];
            const match = await bcrypt.compare(lozinka, user.Lozinka);

            if (!match) return res.status(401).send("Kriva lozinka");

            res.send(user);
        }
    );
});

// update korisnika
app.put('/korisnik/:email', async (req, res) => {
    const { korisnickoIme, lozinka } = req.body;
    const email = req.params.email;

    const hash = await bcrypt.hash(lozinka, 10);

    dbConn.query(
        "UPDATE Korisnik SET Korisnicko_ime=?, Lozinka=? WHERE Email_korisnika=?",
        [korisnickoIme, hash, email],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Ažurirano");
        }
    );
});

// delete korisnik
app.delete('/korisnik/:email', (req, res) => {
    dbConn.query(
        "DELETE FROM Korisnik WHERE Email_korisnika=?",
        [req.params.email],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Obrisan korisnik");
        }
    );
});

// dohvati liste korisnika
app.get('/korisnik/:email/liste', (req, res) => {
    dbConn.query(
        "SELECT * FROM Osobna_lista WHERE Email_korisnika=?",
        [req.params.email],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result);
        }
    );
});


// =====================================================
//  FILM
// =====================================================

// dodaj film
app.post('/film', (req, res) => {
    const { naziv, godina, opis, zanr, jezik } = req.body;

    dbConn.query(
        "INSERT INTO Film VALUES (?, ?, ?, ?, ?)",
        [naziv, godina, opis, zanr, jezik],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Film dodan");
        }
    );
});

// svi filmovi
app.get('/filmovi', (req, res) => {
    dbConn.query("SELECT * FROM Film", (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

// jedan film
app.get('/film/:naziv', (req, res) => {
    dbConn.query(
        "SELECT * FROM Film WHERE Naziv_filma=?",
        [req.params.naziv],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result[0]);
        }
    );
});

// update film
app.put('/film/:naziv', (req, res) => {
    const { godina, opis, zanr, jezik } = req.body;

    dbConn.query(
        "UPDATE Film SET Godina_proizvodnje=?, Opis_filma=?, Zanr_filma=?, Jezik_filma=? WHERE Naziv_filma=?",
        [godina, opis, zanr, jezik, req.params.naziv],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Film ažuriran");
        }
    );
});

// delete film
app.delete('/film/:naziv', (req, res) => {
    dbConn.query(
        "DELETE FROM Film WHERE Naziv_filma=?",
        [req.params.naziv],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Film obrisan");
        }
    );
});

// filter
app.get('/filmovi/filter', (req, res) => {
    const { zanr, godina } = req.query;

    dbConn.query(
        "SELECT * FROM Film WHERE Zanr_filma=? AND YEAR(Godina_proizvodnje)=?",
        [zanr, godina],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result);
        }
    );
});


// =====================================================
//  KOMENTARI
// =====================================================

// dodaj komentar
app.post('/komentar', (req, res) => {
    const { email, film, sadrzaj, ocjena } = req.body;

    dbConn.query(
        "INSERT INTO Komentar VALUES (NOW(), ?, NULL, ?, ?, ?)",
        [email, film, sadrzaj, ocjena],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Komentar dodan");
        }
    );
});

// dohvati komentare po filmu
app.get('/komentari/:film', (req, res) => {
    dbConn.query(
        "SELECT * FROM Komentar WHERE Naziv_filma=?",
        [req.params.film],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result);
        }
    );
});

// delete komentar
app.delete('/komentar', (req, res) => {
    const { email, datum } = req.body;

    dbConn.query(
        "DELETE FROM Komentar WHERE Email_korisnika=? AND Datum_i_vrijeme_objave=?",
        [email, datum],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Komentar obrisan");
        }
    );
});


// =====================================================
//  OSOBNE LISTE
// =====================================================

// kreiraj listu
app.post('/lista', (req, res) => {
    const { email, naziv, opis, status } = req.body;

    dbConn.query(
        "INSERT INTO Osobna_lista VALUES (?, ?, ?, ?)",
        [naziv, email, opis, status],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Lista kreirana");
        }
    );
});

// obriši listu
app.delete('/lista', (req, res) => {
    const { email, naziv } = req.body;

    dbConn.query(
        "DELETE FROM Osobna_lista WHERE Naziv_liste=? AND Email_korisnika=?",
        [naziv, email],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Lista obrisana");
        }
    );
});

// dodaj film u listu
app.post('/lista/film', (req, res) => {
    const { email, nazivListe, nazivFilma } = req.body;

    dbConn.query(
        "INSERT INTO Film_u_osobnoj_listi VALUES (?, ?, ?)",
        [nazivListe, email, nazivFilma],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Film dodan u listu");
        }
    );
});

// makni film iz liste
app.delete('/lista/film', (req, res) => {
    const { email, nazivListe, nazivFilma } = req.body;

    dbConn.query(
        "DELETE FROM Film_u_osobnoj_listi WHERE Naziv_liste=? AND Email_korisnika=? AND Naziv_filma=?",
        [nazivListe, email, nazivFilma],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Film uklonjen iz liste");
        }
    );
});

// dohvati filmove iz liste
app.get('/lista/:email/:naziv', (req, res) => {
    const { email, naziv } = req.params;

    dbConn.query(
        "SELECT f.* FROM Film f JOIN Film_u_osobnoj_listi l ON f.Naziv_filma = l.Naziv_filma WHERE l.Email_korisnika=? AND l.Naziv_liste=?",
        [email, naziv],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result);
        }
    );
});


//port na kojem je app
app.listen(4200, function () {
console.log('Node app is running on port 4200');
});
//module.exports = app;


