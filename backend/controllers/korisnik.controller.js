const dbConn = require('../db/connection');
const bcrypt = require('bcrypt');

exports.registracija = async (req, res) => {
    const { email, korisnickoIme, lozinka, datumRodjenja } = req.body;

    const hash = await bcrypt.hash(lozinka, 10);

    dbConn.query(
        "INSERT INTO Korisnik VALUES (?, ?, ?, ?, 'Aktivan')",
        [email, hash, korisnickoIme, datumRodjenja],
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Registracija OK");
        }
    );
};

exports.prijava = (req, res) => {
    const { email, lozinka } = req.body;

    dbConn.query(
        "SELECT * FROM Korisnik WHERE Email_korisnika=?",
        [email],
        async (err, result) => {
            if (err) return res.status(500).send(err);
            if (result.length === 0) return res.status(404).send("Ne postoji");

            const user = result[0];
            const match = await bcrypt.compare(lozinka, user.Lozinka);

            if (!match) return res.status(401).send("Kriva lozinka");

            // GENERIRAJ TOKEN
            const token = jwt.sign(
                {
                    email: user.Email_korisnika,
                    korisnickoIme: user.Korisnicko_ime
                },
                SECRET,
                { expiresIn: "2h" }
            );

            res.send({
                message: "Login uspješan",
                token: token
            });
        }
    );
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