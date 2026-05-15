<template>
  <q-page class="page" :class="$q.dark.isActive ? 'bg-dark' : ''">
    <div class="header-actions q-pa-md row justify-end items-center q-gutter-sm">

      <template v-if="!user">
        <div class="column items-center q-gutter-md">
          <q-btn
            unelevated
            icon="movie"
            label="Pogledaj help video"
            :color="$q.dark.isActive ? 'grey-9' : 'dark'"
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
            <video class="movie-video" controls autoplay>
              <source :src="videoSrc" type="video/mp4" />
            </video>
          </q-card>
        </q-dialog>
      </template>

      <template v-else>
        <div class="row items-center q-gutter-sm cursor-pointer">
          <div class="text-subtitle1 text-weight-bold q-mr-xs" :class="$q.dark.isActive ? 'text-white' : 'color-text'">
            {{ user.Korisnicko_ime || user.korisnik }}
          </div>

          <q-btn round flat color="secondary">
            <q-avatar size="42px">
              <q-icon name="account_circle" size="42px" />
            </q-avatar>

            <q-menu transition-show="jump-down" transition-hide="jump-up" :dark="$q.dark.isActive">
              <q-list style="min-width: 150px" :class="$q.dark.isActive ? 'bg-dark' : ''">
                <q-item :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-grey-2' " class="text-center">
                  <q-item-section>
                    <div class="text-weight-bold text-secondary text-h6">
                      {{ user.korisnickoIme || user.Korisnicko_ime || user.korisnik }}
                    </div>
                  </q-item-section>
                </q-item>

                <q-separator :dark="$q.dark.isActive" />

                <q-item clickable v-close-popup @click="logout" class="text-negative">
                  <q-item-section avatar>
                    <q-icon name="logout" color="negative" />
                  </q-item-section>
                  <q-item-section>Odjava</q-item-section>
                </q-item>
                
                <q-item clickable @click="$router.push('/korisnik')" :dark="$q.dark.isActive">
                  <q-item-section :class="$q.dark.isActive ? 'text-white' : ''">Pregled</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </template>
    </div>

    <div class="content">
      <h5 class="title">
        <img 
          style="height: 275px; width: auto;" 
          src="../assets/logo.png" 
          alt="logo"
          :style="$q.dark.isActive ? 'filter: brightness(1.2);' : ''"
        >
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

  <div class="column items-start">
    <div class="text-subtitle2 text-grey-8 q-mb-xs">
      Godina izlaska
    </div>

    <q-range
      v-model="yearRange"
      :min="1900"
      :max="new Date().getFullYear()"
      label
      label-always
      color="secondary"
      class="genre-select"
      @update:model-value="fetchMovies"
    />
  </div>

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
          :class="$q.dark.isActive ? 'bg-grey-10 text-white' : 'bg-white'"
          @click="$router.push('/film/' + movie.Naziv_filma)"
          style="cursor: pointer; border: none;"
        >
          <div class="movie-icon-container" :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-f8f9fa'">
            <q-icon name="movie" size="100px" :color="$q.dark.isActive ? 'grey-6' : 'grey-7'" />
          </div>

          <q-card-section>
            <div class="movie-title text-weight-bold" :class="$q.dark.isActive ? 'text-white' : ''">
              {{ movie.Naziv_filma }}
            </div>
            <div class="movie-genre" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-7'">
              {{ movie.Zanr_filma }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import axios from "axios";
import videoSrc from 'src/assets/video/MovieTrack-help.mp4'

const $q = useQuasar();
const showVideo = ref(false)
const router = useRouter();
const search = ref("");
const selectedGenre = ref("");
const movies = ref([]);
const user = ref(null);

const genre_lokalno = 'invisibleGenres'
const hiddenGenres = ref([])

const genres = ["Akcija", "Komedija", "Drama", "Horor", "SF"];

const yearRange = ref({
    min: 1900,
    max: new Date().getFullYear()
});

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
      res = await axios.get(`${API_URL}/search`, {
        params: { query: search.value }
      });
    } else if (selectedGenre.value || yearRange.value) {
      res = await axios.get(`${API_URL}/filter`, {
        params: {
          zanr: selectedGenre.value || undefined,
          godinaOd: yearRange.value?.min,
          godinaDo: yearRange.value?.max
        }
      });
    } else {
      res = await axios.get(API_URL);
    }

    let filteredMovies = res.data;

    if (search.value) {
      filteredMovies = filteredMovies.filter(movie => {
        const year = new Date(movie.Godina_proizvodnje).getFullYear();

        const matchesYear =
          year >= yearRange.value.min &&
          year <= yearRange.value.max;

        const matchesGenre =
          !selectedGenre.value ||
          movie.Zanr_filma?.includes(selectedGenre.value);

        return matchesYear && matchesGenre;
      });
    }

    // filmovi sa zanrovima koje korisnik ne voli se nebum prikazivali
    const hidden = JSON.parse(localStorage.getItem(genre_lokalno) || '[]');

    movies.value = filteredMovies.filter(movie => {
      return !hidden.some(g => movie.Zanr_filma?.includes(g));
    });

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
  min-height: 100vh;
  transition: background-color 0.3s;
}

/* Svijetla pozadina */
.page:not(.bg-dark) {
  background-color: #f4f7f9;
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

.genre-select { width: 250px; }

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
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.2) !important;
}

.movie-icon-container {
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.movie-title {
  font-size: 1.1rem;
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