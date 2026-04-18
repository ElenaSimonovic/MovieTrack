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
exports.addKomentar = (req, res) => {
    const { email, film, sadrzaj, ocjena } = req.body;

    dbConn.query(
        "INSERT INTO Komentar VALUES (NOW(), ?, NULL, ?, ?, ?)",
        [email, film, sadrzaj, ocjena],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Komentar dodan");
        }
    );
};

// update komentar
exports.updateKomentar = (req, res) => {
    const { email, datum, sadrzaj, ocjena } = req.body;

    dbConn.query(
        "UPDATE Komentar SET Sadrzaj_komentara=?, Ocjena=? WHERE Email_korisnika=? AND Datum_i_vrijeme_objave=?",
        [sadrzaj, ocjena, email, datum],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Komentar ažuriran");
        }
    );
};

// delete komentar
exports.deleteKomentar = (req, res) => {
    const { email, datum } = req.body;

    dbConn.query(
        "DELETE FROM Komentar WHERE Email_korisnika=? AND Datum_i_vrijeme_objave=?",
        [email, datum],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Komentar obrisan");
        }
    );
};