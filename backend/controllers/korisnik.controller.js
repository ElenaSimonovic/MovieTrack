const dbConn = require('../db/connection');
const bcrypt = require('bcrypt');

exports.registracija = (req, res) => {
    const { email, korisnickoIme, lozinka, datumRodjenja } = req.body;

    // DIREKTNO šaljemo lozinku u bazu bez ikakvog šifriranja
    const sql = `
        INSERT INTO Korisnik 
        (Email_korisnika, Lozinka, Korisnicko_ime, Datum_rodjenja, Status_racuna, Admin_da_ne) 
        VALUES (?, ?, ?, ?, 'Aktivan', 0)
    `;
    
    dbConn.query(
        sql,
        [email, lozinka, korisnickoIme, datumRodjenja],
        (err) => {
            if (err) {
                return res.status(500).send("greška" + err.sqlMessage);
            }

            const sqlLista = `
                INSERT INTO Osobna_lista 
                (Naziv_liste, Email_korisnika, Opis_liste, Status_vidljivosti) 
                VALUES (?, ?, ?, ?)
            `;

            const defaultLists = [
                ["Želim gledati", email, "Filmovi koje želim gledati", "Privatna"],
                ["Favoriti", email, "Omiljeni filmovi", "Privatna"]
            ];

            dbConn.query(sqlLista, defaultLists[0], (err) => {
                if (err) return res.status(500).send(err);

                dbConn.query(sqlLista, defaultLists[1], (err) => {
                    if (err) return res.status(500).send(err);

                    res.send("Registracija OK");
                });
            });
        }
    );
};

exports.prijava = (req, res) => {
    const { email, lozinka } = req.body;

    const sql = "SELECT * FROM Korisnik WHERE Email_korisnika = ?";
    
    dbConn.query(sql, [email], (err, result) => {
        if (err) return res.status(500).send("Greška na serveru.");

        if (result.length === 0) {
            return res.status(404).send("Korisnik ne postoji.");
        }

        const user = result[0];

        if (lozinka === user.Lozinka) {

            res.send({
                message: "Prijava uspješna",
                email: user.Email_korisnika,
                korisnickoIme: user.Korisnicko_ime,
                admin: user.Admin_da_ne === 1,
                status: user.Status_racuna
            });

        } else {
            res.status(401).send("Pogrešna lozinka.");
        }
    });
};

exports.obrisiKorisnika = (req, res) => {
    dbConn.query(
        "DELETE FROM Korisnik WHERE Email_korisnika=?",
        [req.params.email],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Obrisan");
        }
    );
};

exports.blokiraj = (req, res) => {
    dbConn.query(
        "UPDATE Korisnik SET Status_racuna='Blokiran' WHERE Email_korisnika=?",
        [req.params.email],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Korisnik blokiran");
        }
    );
};

exports.changePassword = (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    dbConn.query(
        "SELECT Lozinka FROM Korisnik WHERE Email_korisnika=?",
        [email],
        (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.length === 0) {
                return res.status(404).send("Korisnik ne postoji");
            }

            const user = result[0];

            if (oldPassword !== user.Lozinka) {
                return res.status(401).send("Stara lozinka je kriva");
            }

            dbConn.query(
                "UPDATE Korisnik SET Lozinka=? WHERE Email_korisnika=?",
                [newPassword, email],
                (err) => {
                    if (err) return res.status(500).send(err);
                    res.send("Lozinka promijenjena");
                }
            );
        }
    );
};