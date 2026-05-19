const dbConn = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = "tajni_kljuc";

exports.registracija = async (req, res) => {
    const { email, korisnickoIme, lozinka, datumRodjenja } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(lozinka, 10);

        const sql = `
            INSERT INTO Korisnik 
            (Email_korisnika, Lozinka, Korisnicko_ime, Datum_rodjenja, Status_racuna, Admin_da_ne) 
            VALUES (?, ?, ?, ?, 'Aktivan', 0)
        `;
        
        dbConn.query(
            sql,
            [email, hashedPassword, korisnickoIme, datumRodjenja],
            (err) => {
                if (err) {
                    return res.status(500).send("greška " + err.sqlMessage);
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

    } catch (err) {
        res.status(500).send("Greška pri hashiranju lozinke");
    }
};

exports.prijava = (req, res) => {
    const { email, lozinka } = req.body;

    const sql = "SELECT * FROM Korisnik WHERE Email_korisnika = ?";
    
    dbConn.query(sql, [email], async (err, result) => {
        if (err) return res.status(500).send("Greška na serveru.");

        if (result.length === 0) {
            return res.status(404).send("Korisnik ne postoji.");
        }

        const user = result[0];

        try {
            const match = await bcrypt.compare(lozinka, user.Lozinka);

            if (match) {
                const token = jwt.sign(
                    {
                        email: user.Email_korisnika,
                        admin: user.Admin_da_ne === 1
                    },
                    SECRET,
                    { expiresIn: '1h' }
                );

                res.send({
                    message: "Prijava uspješna",
                    token,
                    email: user.Email_korisnika,
                    korisnickoIme: user.Korisnicko_ime,
                    admin: user.Admin_da_ne === 1,
                    status: user.Status_racuna
                });
            } else {
                res.status(401).send("Pogrešna lozinka.");
            }
        } catch (err) {
            res.status(500).send("Greška pri provjeri lozinke");
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
        async (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.length === 0) {
                return res.status(404).send("Korisnik ne postoji");
            }

            const user = result[0];

            try {
                const match = await bcrypt.compare(oldPassword, user.Lozinka);

                if (!match) {
                    return res.status(401).send("Stara lozinka je kriva");
                }

                const hashedNew = await bcrypt.hash(newPassword, 10);

                dbConn.query(
                    "UPDATE Korisnik SET Lozinka=? WHERE Email_korisnika=?",
                    [hashedNew, email],
                    (err) => {
                        if (err) return res.status(500).send(err);
                        res.send("Lozinka promijenjena");
                    }
                );

            } catch (err) {
                res.status(500).send("Greška pri promjeni lozinke");
            }
        }
    );
};