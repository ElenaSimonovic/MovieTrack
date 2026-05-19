const express = require('express');
const router = express.Router();
const film = require('../controllers/film.controller');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// PUBLIC
router.get('/search', film.search);
router.get('/', film.getAll);
router.get('/filter', film.filter);
router.get('/:naziv', film.getOne);

// ADMIN ONLY
router.post('/', auth, admin, film.create);
router.put('/:naziv', auth, admin, film.update);
router.delete('/:naziv', auth, admin, film.remove);

module.exports = router;