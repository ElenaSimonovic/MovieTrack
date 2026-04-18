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
exports.create = (req, res) => {
    const { email, film, sadrzaj, ocjena } = req.body;

    dbConn.query(
        "INSERT INTO Komentar (Datum_i_vrijeme_objave, Email_korisnika, Naziv_filma, Sadrzaj_komentara, Ocjena) VALUES (NOW(), ?, ?, ?, ?)",
        [email, film, sadrzaj, ocjena],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Komentar dodan");
        }
    );
};

// dohvati komentare po filmu (duplicate endpoint, ali ostavljen kao u tvom kodu)
exports.getAllByFilm = (req, res) => {
    dbConn.query(
        "SELECT * FROM Komentar WHERE Naziv_filma=?",
        [req.params.film],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result);
        }
    );
};

// delete komentar
exports.remove = (req, res) => {
    const { id_komentara } = req.body;

    dbConn.query(
        "DELETE FROM Komentar WHERE id_komentara = ?",
        [id_komentara],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Komentar obrisan");
        }
    );
};