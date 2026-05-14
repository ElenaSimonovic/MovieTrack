<template>
  <q-page class="page">
    <div class="header-actions q-pa-md row justify-end items-center q-gutter-sm">

      <template v-if="!user">

  <div class="column items-center q-gutter-md">

    <q-btn
      unelevated
      icon="movie"
      label="Pogledaj help video"
      color="dark"
      no-caps
      size="lg"
      class="text-weight-bold"
      @click="showVideo = true"
    />

    <div class="row q-gutter-md">

      <q-btn
        unelevated
        label="Prijava"
        color="secondary"
        to="/login"
        no-caps
        class="text-weight-bold"
      />

      <q-btn
        unelevated
        label="Registracija"
        color="secondary"
        to="/register"
        no-caps
        class="text-weight-bold"
      />

    </div>
  </div>

  <!-- VIDEO MODAL -->
  <q-dialog v-model="showVideo">

  <q-card class="video-modal">

    <div class="video-header row items-center justify-between">
      <div class="text-h6 text-weight-bold text-white">
        MovieTrack Help
      </div>

      <q-btn
        flat
        round
        dense
        icon="close"
        color="white"
        v-close-popup
      />
    </div>

    <video
      class="movie-video"
      controls
      autoplay
    >
      <source :src="videoSrc" type="video/mp4" />
    </video>

  </q-card>

</q-dialog>

</template>
      <template v-else>
        <div class="row items-center q-gutter-sm cursor-pointer">
          <div class="text-subtitle1 text-weight-bold color-text q-mr-xs">
            {{ user.Korisnicko_ime || user.korisnik }}
          </div>

          <q-btn round flat color="secondary">
            <q-avatar size="42px">
              <q-icon name="account_circle" size="42px" />
            </q-avatar>

            <q-menu transition-show="jump-down" transition-hide="jump-up">
              <q-list style="min-width: 150px">

                <q-item class="bg-grey-2 text-center">
                  <q-item-section>
                    <div class="text-weight-bold text-secondary text-h6">
                      {{ user.korisnickoIme || user.Korisnicko_ime || user.korisnik  }}
                    </div>
                  </q-item-section>
                </q-item>

                <q-separator />

                <q-item clickable v-close-popup @click="logout" class="text-negative">
                  <q-item-section avatar>
                    <q-icon name="logout" color="negative" />
                  </q-item-section>
                  <q-item-section>Odjava</q-item-section>
                </q-item>
                <q-item clickable @click="$router.push('/korisnik')">
                  <q-item-section>Pregled</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </template>
    </div>

    <div class="content">
      <h5 class="title">
        <img style="height: 275px; width: auto;" src="../assets/logo.png" alt="logo">
      </h5>

      <div class="search-bar">
        <q-input
          filled
          v-model="search"
          placeholder="Pretraži film..."
          class="search-input"
          @keyup.enter="fetchMovies"
          color="secondary"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-select
          filled
          v-model="selectedGenre"
          :options="genres"
          label="Žanr"
          clearable
          class="genre-select"
          @update:model-value="fetchMovies"
          color="secondary"
        >
          <template v-slot:prepend>
            <q-icon name="category" />
          </template>
        </q-select>

        <q-btn
          label="Pretraži"
          icon="search"
          @click="fetchMovies"
          class="search-btn text-weight-bold"
          unelevated
        />
      </div>

      <div class="movies-grid">
        <q-card
          v-for="movie in movies"
          :key="movie.Naziv_filma"
          class="movie-card shadow-2"
          @click="$router.push('/film/' + movie.Naziv_filma)"
          style="cursor: pointer;"
        >
          <div class="movie-icon-container">
            <q-icon name="movie" size="100px" color="grey-7" />
          </div>

          <q-card-section>
            <div class="movie-title text-weight-bold">{{ movie.Naziv_filma }}</div>
            <div class="movie-genre text-grey-7">{{ movie.Zanr_filma }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import videoSrc from 'src/assets/video/MovieTrack-help.mp4'

const showVideo = ref(false)

const router = useRouter();
const search = ref("");
const selectedGenre = ref("");
const movies = ref([]);
const user = ref(null);

const genre_lokalno = 'invisibleGenres'
const hiddenGenres = ref([])

const genres = ["Akcija", "Komedija", "Drama", "Horor", "SF"];

const checkUser = () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      user.value = parsed;
    } catch (e) {
      user.value = null;
    }
  }
};

const logout = () => {
  localStorage.removeItem("user");
  user.value = null;
  router.push("/login");
};

const fetchMovies = async () => {
  try {
    const API_URL = "http://localhost:4200/film";
    let res;
    if (search.value) {
      res = await axios.get(`${API_URL}/search`, { params: { query: search.value } });
    } else if (selectedGenre.value) {
      res = await axios.get(`${API_URL}/filter`, { params: { zanr: selectedGenre.value } });
    } else {
      res = await axios.get(API_URL);
    }
    // filmovi sa zanrovima koje korisnik ne voli se nebum prikazivali
    const hidden = JSON.parse(localStorage.getItem(genre_lokalno) || '[]')
    movies.value = res.data.filter(movie => {
    return !hidden.some(g => movie.Zanr_filma?.includes(g))
})
  } catch (err) {
    console.error("Greška:", err);
  }
};

onMounted(() => {
  fetchMovies()
  checkUser()
  const saved = localStorage.getItem(genre_lokalno)
  if (saved) {
    hiddenGenres.value = JSON.parse(saved)
  }
})
</script>

<style scoped>
.page {
  background-color: #f4f7f9;
  min-height: 100vh;
}
.header-actions {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  z-index: 10;
}
.color-text {
  color: #2c3e50;
}
.content {
  width: 90%;
  max-width: 1200px;
  margin: auto;
  padding-top: 80px;
}
.title {
  text-align: center;
  color: #5c7c8a;
  margin-bottom: 30px;
}
.search-bar {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}
.search-input { width: 280px; }
.genre-select { width: 200px; }
.search-btn {
  background-color: #26a69a;
  color: white;
  padding: 0 20px;
}
.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 20px;
  padding-bottom: 40px;
}
.movie-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
  border: 1px solid #eee;
}
.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1) !important;
}
.movie-icon-container {
  width: 100%;
  height: 250px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
  align-items: center;
}
.movie-title {
  font-size: 1.1rem;
  color: #333;
}


.video-modal {
  width: 90vw;
  max-width: 1100px;
  background: #121212;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
}

.video-header {
  padding: 16px 20px;
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(10px);
}

.movie-video {
  width: 100%;
  aspect-ratio: 16/9;
  display: block;
  background: black;
}
</style>
