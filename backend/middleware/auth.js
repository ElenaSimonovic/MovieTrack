const jwt = require('jsonwebtoken');
const SECRET = "tajni_kljuc";

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).send("Nema tokena");
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).send("Nevažeći token");

        req.user = user; // dodaj u request
        next();
    });
};