const dbConn = require('../db/connection');

// kreiraj listu
exports.createList = (req, res) => {
    const { email, naziv, opis, status } = req.body;

    dbConn.query(
        "INSERT INTO Osobna_lista (Naziv_liste, Email_korisnika, Opis_liste, Status_vidljivosti) VALUES (?, ?, ?, ?)",
        [naziv, email, opis, status],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Lista kreirana");
        }
    );
};

// obriši listu
exports.deleteList = (req, res) => {
    const { id_osobne_liste } = req.body;

    dbConn.query(
        "DELETE FROM Osobna_lista WHERE id_osobne_liste = ?",
        [id_osobne_liste],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Lista obrisana");
        }
    );
};

// dodaj film u listu
exports.addFilmToList = (req, res) => {
    const { id_osobne_liste, nazivFilma } = req.body;

    dbConn.query(
        "INSERT INTO Film_u_osobnoj_listi (id_osobne_liste, Naziv_filma) VALUES (?, ?)",
        [id_osobne_liste, nazivFilma],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Film dodan u listu");
        }
    );
};

// makni film iz liste
exports.removeFilmFromList = (req, res) => {
    const { id_osobne_liste, nazivFilma } = req.body;

    dbConn.query(
        "DELETE FROM Film_u_osobnoj_listi WHERE id_osobne_liste=? AND Naziv_filma=?",
        [id_osobne_liste, nazivFilma],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Film uklonjen iz liste");
        }
    );
};

// dohvati filmove iz liste
exports.getFilmsFromList = (req, res) => {
    const { id } = req.params;

    dbConn.query(
        `SELECT f.* 
         FROM Film f 
         JOIN Film_u_osobnoj_listi l 
         ON f.Naziv_filma = l.Naziv_filma 
         WHERE l.id_osobne_liste = ?`,
        [id],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result);
        }
    );
};

exports.getListsByUser = (req, res) => {
    const { email } = req.params;

    dbConn.query(
        "SELECT * FROM Osobna_lista WHERE Email_korisnika=?",
        [email],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result);
        }
    );
};

