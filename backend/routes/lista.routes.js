const express = require('express');
const router = express.Router();
const lista = require('../controllers/lista.controller');

// 1. KREIRANJE LISTE
// Poziv: POST http://localhost:4200/lista
router.post('/', lista.createList);

// 2. DODAVANJE FILMA U LISTU
// Poziv: POST http://localhost:4200/lista/film
router.post('/film', lista.addFilmToList);

// 3. BRISANJE FILMA IZ LISTE 
router.delete('/film', lista.removeFilmFromList);

// 4. BRISANJE CIJELE LISTE 
router.delete('/', lista.deleteList);

// 5. DOHVAĆANJE FILMOVA IZ LISTE
router.get('/lista/:id', lista.getFilmsFromList);

// 6. DOHVAĆANJE LISTI KORISNIKA
router.get('/user/:email', lista.getListsByUser);

// 7. DOHVAĆANJE JAVNIH LISTI
router.get('/javne', lista.getAllPublicLists);

module.exports = router;