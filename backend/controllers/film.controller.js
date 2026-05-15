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
exports.create = (req, res) => {
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
exports.update = (req, res) => {
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
exports.remove = (req, res) => {
    dbConn.query(
        "DELETE FROM Film WHERE Naziv_filma=?",
        [req.params.naziv],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Film obrisan");
        }
    );
};

// filter filmova
// filter filmova
exports.filter = (req, res) => {
    const { zanr, godinaOd, godinaDo } = req.query;

    let query = "SELECT * FROM Film WHERE 1=1";
    const params = [];

    if (zanr) {
        query += " AND Zanr_filma LIKE ?";
        params.push(`%${zanr}%`); // Ovo će tražiti npr. "Akcija" unutar "Akcija, SF"
    }

    if (godinaOd && godinaDo) {
        query += " AND YEAR(Godina_proizvodnje) BETWEEN ? AND ?";
        params.push(godinaOd, godinaDo);
    }

    dbConn.query(query, params, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
};

exports.search = (req, res) => {
    const { query } = req.query;

    dbConn.query(
        "SELECT * FROM Film WHERE Naziv_filma LIKE ?",
        [`%${query}%`],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result);
        }
    );
};