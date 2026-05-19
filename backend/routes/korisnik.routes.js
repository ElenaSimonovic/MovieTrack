const express = require('express');
const router = express.Router();
const korisnikController = require('../controllers/korisnik.controller');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// PUBLIC
router.post('/registracija', korisnikController.registracija);
router.post('/prijava', korisnikController.prijava);
router.delete('/:email', auth, korisnikController.obrisiKorisnika);

// ADMIN ONLY
router.put('/blokiraj/:email', auth, admin, korisnikController.blokiraj);

// USER (mora biti prijavljen)
router.post('/password', auth, korisnikController.changePassword);

module.exports = router;