const express = require('express');
const router = express.Router();
const lista = require('../controllers/lista.controller');

// CREATE
router.post('/', lista.createList);

// ADD / REMOVE FILM
router.post('/film', lista.addFilmToList);
router.delete('/film', lista.removeFilmFromList);

// DELETE LIST
router.delete('/', lista.deleteList);

// GET FILMS FROM LIST
router.get('/lista/:id', lista.getFilmsFromList);

//display list
router.get('/user/:email', lista.getListsByUser);

module.exports = router;