const express = require('express');
const router = express.Router();
const komentar = require('../controllers/komentar.controller');

router.get('/:film', komentar.getByFilm);

router.post('/', komentar.addKomentar);
router.put('/', komentar.updateKomentar);
router.delete('/', komentar.deleteKomentar);

module.exports = router;