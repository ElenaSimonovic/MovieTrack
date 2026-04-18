const dbConn = require('../db/connection');

// kreiraj listu
exports.create = (req, res) => {
    const { email, naziv, opis, status } = req.body;

    dbConn.query(
        "INSERT INTO Osobna_lista VALUES (?, ?, ?, ?)",
        [naziv, email, opis, status],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Lista kreirana");
        }
    );
};

// obriši listu
exports.delete = (req, res) => {
    const { email, naziv } = req.body;

    dbConn.query(
        "DELETE FROM Osobna_lista WHERE Naziv_liste=? AND Email_korisnika=?",
        [naziv, email],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Lista obrisana");
        }
    );
};

// dohvati liste korisnika
exports.getByUser = (req, res) => {
    dbConn.query(
        "SELECT * FROM Osobna_lista WHERE Email_korisnika=?",
        [req.params.email],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result);
        }
    );
};

// dodaj film u listu
exports.addFilm = (req, res) => {
    const { email, nazivListe, nazivFilma } = req.body;

    dbConn.query(
        "INSERT INTO Film_u_osobnoj_listi VALUES (?, ?, ?)",
        [nazivListe, email, nazivFilma],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Dodano u listu");
        }
    );
};

// makni film iz liste
exports.removeFilm = (req, res) => {
    const { email, nazivListe, nazivFilma } = req.body;

    dbConn.query(
        "DELETE FROM Film_u_osobnoj_listi WHERE Naziv_liste=? AND Email_korisnika=? AND Naziv_filma=?",
        [nazivListe, email, nazivFilma],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Maknuto iz liste");
        }
    );
};

// dohvati filmove iz liste
exports.getMoviesFromList = (req, res) => {
    const { email, naziv } = req.params;

    dbConn.query(
        `SELECT f.* 
         FROM Film f
         JOIN Film_u_osobnoj_listi l 
         ON f.Naziv_filma = l.Naziv_filma
         WHERE l.Email_korisnika=? AND l.Naziv_liste=?`,
        [email, naziv],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result);
        }
    );
};