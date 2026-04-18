const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const film = require('../controllers/film.controller');

router.get('/', film.getAll);
router.get('/filter', film.filter);
router.get('/:naziv', film.getOne);

/*
primjer zaštite ruta s jwt:
 router.post('/', auth, filmController.addFilm);
*/
router.post('/', film.addFilm);
router.put('/:naziv', film.updateFilm);
router.delete('/:naziv', film.deleteFilm);

module.exports = router;