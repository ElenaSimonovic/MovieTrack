const dbConn = require('../db/connection');

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
    const { id_osobne_liste } = req.body;

    dbConn.query(
        "DELETE FROM Osobna_lista WHERE id_osobne_liste = ?",
        [id_osobne_liste],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Lista obrisana");
        }
    );
});

// dodaj film u listu
app.post('/lista/film', (req, res) => {
    const { id_osobne_liste, nazivFilma } = req.body;

    dbConn.query(
        "INSERT INTO Film_u_osobnoj_listi (id_osobne_liste, Naziv_filma) VALUES (?, ?)",
        [id_osobne_liste, nazivFilma],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Film dodan u listu");
        }
    );
});

// makni film iz liste
app.delete('/lista/film', (req, res) => {
    const { id_osobne_liste, nazivFilma } = req.body;

    dbConn.query(
        "DELETE FROM Film_u_osobnoj_listi WHERE id_osobne_liste=? AND Naziv_filma=?",
        [id_osobne_liste, nazivFilma],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Film uklonjen iz liste");
        }
    );
});

// dohvati filmove iz liste
app.get('/lista/:id', (req, res) => {
    const { id } = req.params;

    dbConn.query(
        "SELECT f.* FROM Film f JOIN Film_u_osobnoj_listi l ON f.Naziv_filma = l.Naziv_filma WHERE l.id_osobne_liste = ?",
        [id],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send(result);
        }
    );
});