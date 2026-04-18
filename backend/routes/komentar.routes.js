const express = require('express');
const router = express.Router();
const komentar = require('../controllers/komentar.controller');

router.get('/:film', komentar.getByFilm);

router.post('/', komentar.create);
router.delete('/:id', komentar.remove);

module.exports = router;