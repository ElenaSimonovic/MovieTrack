const express = require('express');
const router = express.Router();
const komentar = require('../controllers/komentar.controller');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// svi mogu čitati
router.get('/', komentar.getAll); // Dobivanje svih komentara
router.get('/:film', komentar.getByFilm); // Dodajemo rutu za dobivanje komentara po nazivu filma

// mora biti prijavljen
router.post('/', auth, komentar.create); // stvaranje
router.put('/:id', auth, komentar.update); // mijenjanje
router.delete('/:id', auth, komentar.remove); // brisanje

module.exports = router;