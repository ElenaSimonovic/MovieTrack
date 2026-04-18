<template>
  <q-page class="page">

    <div class="content">
      <h5 class="title" ><img style="height: 275px; width: auto;" src="../assets/logo.png" alt="logo" ></h5>

      <!-- SEARCH + FILTER -->
      <div class="search-bar">
        <q-input
          filled
          v-model="search"
          placeholder="Pretraži film..."
          class="search-input"
          @keyup.enter="fetchMovies"
        />

        <q-select
          filled
          v-model="selectedGenre"
          :options="genres"
          label="Žanr"
          clearable
          class="genre-select"
        />

        <q-btn
          label="Pretraži"
          @click="fetchMovies"
          class="search-btn"
        />
      </div>

      <!-- MOVIES GRID -->
      <div class="movies-grid">
        <q-card
          v-for="movie in movies"
          :key="movie.Naziv_filma"
          class="movie-card"
        >
          <img
            src="https://via.placeholder.com/300x450"
            class="movie-img"
          />

          <q-card-section>
            <div class="movie-title">{{ movie.Naziv_filma }}</div>
            <div class="movie-genre">{{ movie.Zanr_filma }}</div>
          </q-card-section>
        </q-card>
      </div>

    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const search = ref("");
const selectedGenre = ref("");
const selectedYear = ref("");
const movies = ref([]);

const genres = ["Akcija", "Komedija", "Drama", "Horor", "SF"];

const fetchMovies = async () => {
  try {
   // Definiramo bazu (tvoj backend je na 4200)
    // Primijeti: nema "/api" jer ga nisi definirala u Expressu
    const API_URL = "http://localhost:4200/film";

    let res;

    // SEARCH
    if (search.value) {
      res = await axios.get(`${API_URL}/search`, {
        params: { query: search.value },
      });
    }
    // FILTER
    else if (selectedGenre.value) {
      res = await axios.get(`${API_URL}/filter`, {
        params: { zanr: selectedGenre.value },
      });
    }
    // ALL
    else {
      res = await axios.get(API_URL);
    }

    movies.value = res.data;
  } catch (err) {
    console.error("Greška:", err);
  }
};

onMounted(fetchMovies);
</script>

<style scoped>
.page {
  background-color: #f4f7f9;
  min-height: 100vh;
}

.content {
  width: 90%;
  max-width: 1200px;
  margin: auto;
}

.title {
  text-align: center;
  color: #5c7c8a;
  margin-bottom: 30px;
}

/* SEARCH */
.search-bar {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.search-input {
  width: 250px;
}

.genre-select {
  width: 180px;
}

.search-btn {
  background-color: #ff6b6b;
  color: white;
}

/* GRID */
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 20px;
}

/* CARD */
.movie-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s;
}

.movie-card:hover {
  transform: scale(1.05);
}

.movie-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.movie-title {
  font-weight: bold;
  color: #333;
}

.movie-genre {
  color: #777;
}
</style>
