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
    // 1. Podaci koji dolaze s frontenda (v-model="loginData.email")
    const { email, lozinka } = req.body; 

    // 2. SQL upit s točnim nazivom stupca: Email_korisnika
    const sql = "SELECT * FROM Korisnik WHERE Email_korisnika = ?";
    
    dbConn.query(sql, [email], (err, result) => {
        if (err) {
            console.error("Greška u bazi:", err);
            return res.status(500).send("Greška na serveru.");
        }

        // Provjera je li korisnik pronađen
        if (result.length === 0) {
            return res.status(404).send("Korisnik s tim emailom ne postoji.");
        }

        const user = result[0];

        // 3. USPOREDBA (Pazi na velika slova!)
        // 'lozinka' je ono što je korisnik upravo utipkao
        // 'user.Lozinka' je ono što piše u bazi (veliko L)
        if (lozinka === user.Lozinka) {
            
            // Ako želiš generirati token (ako imaš instaliran jsonwebtoken)
            // const token = jwt.sign({ id: user.id }, "tvoja_tajna", { expiresIn: '1h' });

            res.send({
                message: "Prijava uspješna",
                Korisnicko_ime: user.Korisnicko_ime 
            });
            
        } else {
            // Ako lozinka ne odgovara
            console.log("Neuspjela prijava za email:", email);
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