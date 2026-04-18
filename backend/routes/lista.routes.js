const express = require('express');
const router = express.Router();
const lista = require('../controllers/lista.controller');

router.get('/:email', lista.getByUser);
router.get('/:email/:naziv', lista.getMoviesFromList);

router.post('/', lista.create);
router.post('/film', lista.addFilm);

router.delete('/', lista.delete);
router.delete('/film', lista.removeFilm);

module.exports = router;