const express = require('express');
const router = express.Router();
const korisnikController = require('../controllers/korisnik.controller');

router.post('/registracija', korisnikController.registracija);
router.post('/prijava', korisnikController.prijava);
router.delete('/:email', korisnikController.obrisiKorisnika);
router.put('/blokiraj/:email', korisnik.blokiraj);

module.exports = router;