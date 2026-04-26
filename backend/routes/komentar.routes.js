const express = require('express');
const router = express.Router();
const komentar = require('../controllers/komentar.controller');

router.get('/', komentar.getAll); // Dobivanje svih komentara
router.get('/:film', komentar.getByFilm);  // Dodajemo rutu za dobivanje komentara po nazivu filma
router.post('/', komentar.create); // stvaranje
router.put('/:id', komentar.update); // mijenjanje
router.delete('/:id', komentar.remove); // brisanje

module.exports = router;