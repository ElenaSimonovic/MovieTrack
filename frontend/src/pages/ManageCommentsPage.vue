<template>
  <q-page class="q-pa-md">

    <div class="text-h6 q-mb-md">💬 Upravljanje komentarima</div>

    <q-card
      v-for="c in comments"
      :key="c.id_komentara"
      class="q-mb-md"
    >
      <q-card-section>

        <div class="row justify-between">
          <div>
            <div class="text-weight-bold">{{ c.Email_korisnika }}</div>
            <div class="text-caption text-grey">
              Film: {{ c.Naziv_filma }}
            </div>
          </div>

          <q-btn
            flat
            icon="delete"
            color="negative"
            @click="deleteComment(c.id_komentara)"
          />
        </div>

        <div class="q-mt-sm">
          {{ c.Sadrzaj_komentara }}
        </div>

        <div class="q-mt-sm">
          ⭐ {{ c.Ocjena }}
        </div>

      </q-card-section>
    </q-card>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { Notify } from "quasar"

const comments = ref([])

const fetchComments = async () => {
  const res = await axios.get("http://localhost:4200/komentar")
  comments.value = res.data
}

const deleteComment = async (id) => {
  await axios.delete(`http://localhost:4200/komentar/${id}`)
  Notify.create({ type: "positive", message: "Komentar obrisan" })
  fetchComments()
}

onMounted(fetchComments)
</script>
