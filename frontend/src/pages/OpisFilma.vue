<template>
  <q-page class="page-detail">
    <div class="content q-pa-lg">

      <q-btn
        flat
        no-caps
        icon="arrow_back"
        label="Povratak"
        @click="$router.push('/pretraga-filmova')"
        color="secondary"
        class="back-btn q-mb-lg"
      />

      <q-card v-if="movie" class="movie-detail-card shadow-24">

        <div class="hero-section row items-center q-pa-xl q-gutter-lg">
          <div class="detail-icon-container shadow-10">
            <q-icon name="movie_filter" size="100px" color="white" />
          </div>

          <div class="column">
            <div class="text-h2 text-bold text-white leading-tight">
              {{ movie.Naziv_filma }}
            </div>

            <div class="row q-gutter-sm q-mt-sm">
              <q-badge
                v-for="g in (movie.Zanr_filma ? movie.Zanr_filma.split(',') : [])"
                :key="g"
                color="orange-10"
                class="q-pa-sm text-subtitle2"
              >
                {{ g.trim() }}
              </q-badge>
            </div>
          </div>
        </div>

        <q-card-section class="q-pa-xl bg-white text-grey-9">
          <div class="row q-col-gutter-xl">

            <div class="col-12 col-md-4">

              <div class="info-card">
                <q-icon name="event" color="primary" size="sm" />
                <div class="q-ml-md">
                  <div class="info-label">Godina proizvodnje</div>
                  <div class="info-value text-weight-bolder">
                    {{ formatYear(movie.Godina_proizvodnje) }}.
                  </div>
                </div>
              </div>

              <div class="info-card q-mt-md">
                <q-icon name="translate" color="primary" size="sm" />
                <div class="q-ml-md">
                  <div class="info-label">Jezik filma</div>
                  <div class="info-value text-weight-bolder">
                    {{ movie.Jezik_filma }}
                  </div>
                </div>
              </div>

              <q-separator class="q-my-lg" />

              <q-btn
                unelevated
                color="primary"
                icon="add_circle"
                label="Dodaj u moju listu"
                class="full-width q-py-md text-weight-bold"
                @click="addToMyList"
              />

            </div>

            <div class="col-12 col-md-8">
              <div class="row items-center q-mb-md">
                <q-icon name="notes" color="primary" size="sm" class="q-mr-sm" />
                <div class="text-h5 text-weight-bold">Sadržaj filma</div>
              </div>

              <p class="movie-description">
                {{ movie.Opis_filma }}
              </p>
            </div>

          </div>
        </q-card-section>
      </q-card>

      <div v-else class="column flex-center q-mt-xl">
        <q-spinner-dots color="primary" size="5em" />
        <div class="text-h6 text-grey-6 q-mt-md">
          Učitavanje filmskih podataka...
        </div>
      </div>

    </div>

    <!-- DIALOG -->
    <q-dialog v-model="dialog">
      <q-card style="width:444px">

        <q-card-section>
          <div>Odaberi listu</div>
        </q-card-section>

        <q-card-section>
          <q-select
            v-model="selectedList"
            :options="lists"
            option-label="Naziv_liste"
            option-value="id_osobne_liste"
            emit-value
            map-options
            label="Ime liste:"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn color="primary" label="Dodaj" @click="confirmAddToList" />
        </q-card-actions>

      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const lists = ref([])
const selectedList = ref(null)
const dialog = ref(false)
const movie = ref(null);

const fetchLists = async () => {
  const user = JSON.parse(localStorage.getItem("user"))

  const res = await axios.get(
    `http://localhost:4200/lista/user/${user.Email}`
  )

  lists.value = res.data
}

// Dohvaćanje detalja filma
const fetchMovieDetail = async () => {
  try {
    const filmNaziv = route.params.naziv;
    const res = await axios.get(`http://localhost:4200/film/${filmNaziv}`);
    
    if (res.data) {
      movie.value = Array.isArray(res.data) ? res.data[0] : res.data;
    }
  } catch (err) {
    console.error("Greška pri dohvaćanju filma:", err);
  }
};

// Logika za dodavanje u listu s provjerom prijave
const addToMyList = () => {
  // Dohvaćamo podatak iz localStorage
  const user = localStorage.getItem("user");

  // STROŽA PROVJERA: 
  // Provjeravamo je li null, undefined ili prazan string
  if (!user || user === "null" || user === "undefined" || user === "") {
    
    $q.notify({
      type: 'negative',
      message: 'Potrebna prijava!', // Naslov koji si tražila
      caption: 'Morate biti prijavljeni da biste dodali film u listu.',
      icon: 'lock',
      position: 'top',
      timeout: 4000,
      actions: [
        { 
          label: 'Prijavi se', 
          color: 'white', 
          handler: () => { router.push('/login') } 
        }
      ]
    });
    return; // Ovdje stajemo, ne ide se na "Uspješno!"
  }
dialog.value=true
/*
  // Ako je prošao provjeru (znači da je prijavljen):
  $q.notify({
    type: 'positive',
    message: 'Uspješno!',
    caption: `Film "${movie.value.Naziv_filma}" je dodan u tvoju listu.`,
    icon: 'check_circle',
    position: 'top'
  });
  */
};

// Formatiranje godine
const formatYear = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).getFullYear();
};

const confirmAddToList = async () => {
  try {
    await axios.post('http://localhost:4200/lista/film', {
      id_osobne_liste: selectedList.value,
      nazivFilma: movie.value.Naziv_filma
    })

    $q.notify({
      type: 'positive',
      message: 'Film dodan u listu!'
    })

    dialog.value = false
    selectedList.value = null

  } catch (err) {
    console.error(err)
    $q.notify({
      type: 'negative',
      message: 'Greška pri dodavanju filma'
    })
  }
}

onMounted(() => {
  fetchMovieDetail()
  fetchLists()
})
</script>

<style scoped>
.page-detail {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.content {
  max-width: 1100px;
  margin: 0 auto;
}

.movie-detail-card {
  border-radius: 20px !important;
  overflow: hidden;
  border: none;
}

.hero-section {
  background: linear-gradient(to right, #243b55, #141e30);
  min-height: 250px;
}

.detail-icon-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.info-card {
  display: flex;
  align-items: center;
  background: #fdfdfd;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #edf2f7;
  transition: transform 0.2s ease;
}

.info-card:hover {
  transform: translateY(-3px);
  border-color: #3b82f6;
}

.info-label {
  font-size: 0.75rem;
  color: #a0aec0;
  text-transform: uppercase;
  font-weight: bold;
}

.info-value {
  font-size: 1.1rem;
  color: #2d3748;
}

.movie-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4a5568;
}

.back-btn {
  font-weight: 600;
}

.leading-tight {
  line-height: 1.1;
}
</style>