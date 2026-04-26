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

// delete komentar
exports.remove = (req, res) => {
    const id = req.params.id;

    dbConn.query(
        "DELETE FROM Komentar WHERE id_komentara = ?",
        [id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Komentar obrisan");
        }
    );
};

// dohvati sve komentare po vremenu
exports.getAll = (req, res) => {
    dbConn.query(
        "SELECT * FROM Komentar ORDER BY Datum_i_vrijeme_objave DESC",
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result);
        }
    );
};