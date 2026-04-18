const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const film = require('../controllers/film.controller');

router.get('/search', film.search);
router.get('/', film.getAll);
router.get('/filter', film.filter);
router.get('/:naziv', film.getOne);


/*
primjer zaštite ruta s jwt:
 router.post('/', auth, filmController.addFilm);
*/
router.post('/', film.create);
router.put('/:naziv', film.update);
router.delete('/:naziv', film.remove);

module.exports = router;