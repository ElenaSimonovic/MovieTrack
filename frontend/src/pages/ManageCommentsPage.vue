<template>
  <q-page class="q-pa-md">

    <div class="text-h6 q-mb-md">💬 Upravljanje komentarima</div>

    <q-card
      v-for="c in comments"
      :key="c.id_komentara"
      class="q-mb-md cursor-pointer"
      @click="openComment(c)"
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
            @click.stop="deleteComment(c.id_komentara)"
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

    <!-- Dialog -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 400px">

        <q-card-section class="text-h6">
          Detalji komentara
        </q-card-section>

        <q-card-section>
          <div><b>Korisnik:</b> {{ selectedComment?.Email_korisnika }}</div>
          <div><b>Film:</b> {{ selectedComment?.Naziv_filma }}</div>
          <div class="q-mt-sm">{{ selectedComment?.Sadrzaj_komentara }}</div>
          <div class="q-mt-sm">⭐ {{ selectedComment?.Ocjena }}</div>
        </q-card-section>

        <q-card-actions align="between">

          <q-btn
            color="negative"
            label="Blokiraj korisnika"
            @click="blockUser"
          />

          <q-btn flat label="Zatvori" v-close-popup />

        </q-card-actions>

      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import { Notify,useQuasar } from "quasar"
import { api } from "boot/axios";


const selectedComment = ref(null)
const showDialog = ref(false)
const comments = ref([])
const $q = useQuasar()
const loadingDelete = ref(false)

const fetchComments = async () => {
  try {
    const res = await axios.get("http://localhost:4200/komentar")
    comments.value = res.data
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Greška pri dohvaćanju komentara'
    })
  }
}

const deleteComment = (id) => {
  $q.dialog({
    title: 'Potvrda',
    message: 'Obrisati komentar?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    loadingDelete.value = true
    try {
      await api.delete(`http://localhost:4200/komentar/${id}`)
      Notify.create({ type: "positive", message: "Komentar obrisan" })
      fetchComments()
    } catch (err) {
      Notify.create({ type: "negative", message: "Greška pri brisanju" })
    } finally {
      loadingDelete.value = false
    }
  })
}

const openComment = (c) => {
  selectedComment.value = c
  showDialog.value = true
}

const blockUser = async () => {
  if (!selectedComment.value) return

  try {
    await api.put(`http://localhost:4200/korisnik/blokiraj/${selectedComment.value.Email_korisnika}`)

    Notify.create({
      type: "warning",
      message: "Korisnik blokiran"
    })

    showDialog.value = false

  } catch (err) {
    Notify.create({
      type: "negative",
      message: "Greška pri blokiranju"
    })
  }
}



onMounted(() => {
  const user = JSON.parse(localStorage.getItem("user"))

  if (!user || !user.admin) {
    $q.notify({
      type: 'negative',
      message: 'Nemaš pristup'
    })
    window.location.href = '/'
    return
  }

  fetchComments()
})
</script>
