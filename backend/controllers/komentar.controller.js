const dbConn = require('../db/connection');

// svi komentari za film
exports.getByFilm = (req, res) => {
    dbConn.query(
        "SELECT * FROM Komentar WHERE Naziv_filma=?",
        [req.params.film],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result);
        }
    );
};

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
    const { id_komentara } = req.body;

    dbConn.query(
        "DELETE FROM Komentar WHERE id_komentara = ?",
        [id_komentara],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Komentar obrisan");
        }
    );
});

