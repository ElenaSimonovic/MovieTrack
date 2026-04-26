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
                return res.status(500).send("Greška baze: " + err.sqlMessage);
            }
            res.send("Registracija OK");
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
                email: user.Email_korisnika,
                korisnickoIme: user.Korisnicko_ime,
                admin: user.Admin_da_ne === 1, // 🔥 KLJUČNO
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