const dbConn = require('../db/connection');

// svi filmovi
exports.getAll = (req, res) => {
    dbConn.query("SELECT * FROM Film", (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
};

// jedan film
exports.getOne = (req, res) => {
    dbConn.query(
        "SELECT * FROM Film WHERE Naziv_filma=?",
        [req.params.naziv],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result[0]);
        }
    );
};

// dodaj film
exports.addFilm = (req, res) => {
    const { naziv, godina, opis, zanr, jezik } = req.body;

    dbConn.query(
        "INSERT INTO Film VALUES (?, ?, ?, ?, ?)",
        [naziv, godina, opis, zanr, jezik],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Film dodan");
        }
    );
};

// update film
exports.updateFilm = (req, res) => {
    const { godina, opis, zanr, jezik } = req.body;

    dbConn.query(
        "UPDATE Film SET Godina_proizvodnje=?, Opis_filma=?, Zanr_filma=?, Jezik_filma=? WHERE Naziv_filma=?",
        [godina, opis, zanr, jezik, req.params.naziv],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Film ažuriran");
        }
    );
};

// delete film
exports.deleteFilm = (req, res) => {
    dbConn.query(
        "DELETE FROM Film WHERE Naziv_filma=?",
        [req.params.naziv],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Film obrisan");
        }
    );
};

// filter
exports.filter = (req, res) => {
    const { zanr, godina } = req.query;

    dbConn.query(
        "SELECT * FROM Film WHERE Zanr_filma=? AND YEAR(Godina_proizvodnje)=?",
        [zanr, godina],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result);
        }
    );
};