<template>
  <q-page class="q-pa-md">

    <div class="text-h5 q-mb-md">
      🛡️ Admin Dashboard
    </div>

    <div class="row q-col-gutter-md">

      <q-card class="col">
        <q-card-section>
          <div>Ukupno filmova</div>
          <div class="text-h6">{{ filmsCount }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col">
        <q-card-section>
          <div>Ukupno komentara</div>
          <div class="text-h6">{{ commentsCount }}</div>
        </q-card-section>
      </q-card>

    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"

const filmsCount = ref(0)
const commentsCount = ref(0)

onMounted(async () => {
  const films = await axios.get("http://localhost:4200/film")
  const comments = await axios.get("http://localhost:4200/komentar")

  filmsCount.value = films.data.length
  commentsCount.value = comments.data.length
})
</script>
