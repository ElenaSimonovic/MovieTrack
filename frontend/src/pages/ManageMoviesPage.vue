<template>
  <q-page class="q-pa-md">

    <!-- HEADER -->
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h6">🎬 Upravljanje filmovima</div>
      <q-btn color="primary" icon="add" label="Dodaj film" @click="showAdd = true"/>
    </div>

    <!-- LISTA -->
    <div class="row q-col-gutter-md">
      <q-card
        v-for="film in films"
        :key="film.Naziv_filma"
        class="col-12 col-md-4"
      >
        <q-card-section>

          <div class="row justify-between">
            <div>
              <div class="text-weight-bold">{{ film.Naziv_filma }}</div>
              <div class="text-caption text-grey">{{ film.Godina_proizvodnje }}</div>
            </div>

            <q-btn flat icon="delete" color="negative" @click="deleteFilm(film.Naziv_filma)" />
          </div>

          <div class="q-mt-sm">{{ film.Opis_filma }}</div>

          <div class="q-mt-sm">
            <q-chip>{{ film.Zanr_filma }}</q-chip>
          </div>

        </q-card-section>
      </q-card>
    </div>

    <!-- DIALOG -->
    <q-dialog v-model="showAdd">
      <q-card style="min-width: 400px">
        <q-card-section class="text-h6">Dodaj film</q-card-section>

        <q-card-section>
          <q-input v-model="newFilm.naziv" label="Naziv" />
          <q-input v-model="newFilm.godina" label="Godina" />
          <q-input v-model="newFilm.opis" label="Opis" />
          <q-input v-model="newFilm.zanr" label="Žanr" />
          <q-input v-model="newFilm.jezik" label="Jezik" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="primary" label="Spremi" @click="addFilm"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { Notify } from "quasar"

const films = ref([])
const showAdd = ref(false)

const newFilm = ref({
  naziv: "",
  godina: "",
  opis: "",
  zanr: "",
  jezik: ""
})

const fetchFilms = async () => {
  const res = await axios.get("http://localhost:4200/film")
  films.value = res.data
}

const deleteFilm = async (naziv) => {
  await axios.delete(`http://localhost:4200/film/${naziv}`)
  Notify.create({ type: "positive", message: "Film obrisan" })
  fetchFilms()
}

const addFilm = async () => {
  await axios.post("http://localhost:4200/film", newFilm.value)
  Notify.create({ type: "positive", message: "Film dodan" })
  showAdd.value = false
  fetchFilms()
}

onMounted(fetchFilms)
</script>
