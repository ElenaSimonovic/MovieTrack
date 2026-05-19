<template>
  <q-page class="q-pa-md">

    <div class="text-h5 q-mb-md">
      Korisnički profil
    </div>

    <q-card v-if="user" flat bordered class="q-pa-md">

      <div class="text-subtitle1">
        {{ user.korisnickoIme }}
      </div>

      <div class="text-caption text-grey">
        {{ user.email }}
      </div>

      <q-separator class="q-my-md" />

      <div class="q-mb-sm">
        <div><b>Uloga:</b> {{ user.admin ? 'Admin' : 'Korisnik' }}</div>
        <div><b>Status:</b> {{ user.status }}</div>
      </div>

      <q-separator class="q-my-md" />

      <div class="q-gutter-sm">

        <q-btn
          :color="$q.dark.isActive ? 'grey-9' : 'black'"
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          :label="$q.dark.isActive ? 'Prebaci na svijetlu temu' : 'Prebaci na tamnu temu'"
          class="full-width"
          @click="toggleTheme"
        />

        <q-btn
          color="primary"
          icon="lock"
          label="Promijeni lozinku"
          class="full-width"
          @click="passwordDialog = true"
        />

        <q-btn
          color="negative"
          icon="delete"
          label="Obriši račun"
          class="full-width"
          @click="deleteDialog = true"
        />

        <q-btn
          outline
          icon="visibility_off"
          label="Sakrij žanrove"
          class="full-width"
          @click="genreDialog = true"
        />

      </div>

    </q-card>

    <div v-else class="text-grey text-center q-mt-lg">
      Niste prijavljeni.
      <div>
        <q-btn flat color="primary" label="Prijava" @click="$router.push('/login')" />
      </div>
    </div>

    <q-dialog v-model="passwordDialog">
      <q-card style="min-width: 300px">

        <q-card-section>
          <div class="text-subtitle1">Promjena lozinke</div>
        </q-card-section>

        <q-card-section class="q-gutter-sm">
          <q-input v-model="oldPassword" type="password" label="Stara lozinka" />
          <q-input v-model="newPassword" type="password" label="Nova lozinka" />
          <q-input v-model="confirmPassword" type="password" label="Potvrdi lozinku" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn color="primary" label="Spremi" @click="changePassword" />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <q-dialog v-model="deleteDialog">
      <q-card style="min-width: 300px">

        <q-card-section>
          <div class="text-subtitle1 text-negative">Brisanje računa</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="deletePassword" type="password" label="Unesi lozinku" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn color="negative" label="Obriši" @click="deleteAccount" />
        </q-card-actions>

      </q-card>
    </q-dialog>

    <q-dialog v-model="genreDialog">
      <q-card style="min-width: 300px">

        <q-card-section>
          <div class="text-subtitle1">Žanrovi</div>
        </q-card-section>

        <q-card-section class="q-gutter-sm">

          <q-option-group
            v-model="selectedGenres"
            :options="genres.map(g => ({ label: g, value: g }))"
            type="checkbox"
          />

        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Zatvori" v-close-popup />
          <q-btn color="primary" label="Spremi" @click="saveGenres" />
        </q-card-actions>

      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from "boot/axios";


const $q = useQuasar()
const user = ref(null)
const token = ref(null)
const router = useRouter()

const passwordDialog = ref(false)
const deleteDialog = ref(false)
const genreDialog = ref(false)

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const deletePassword = ref('')

const genres = ["Akcija", "Komedija", "Drama", "SF", "Horor"]
const selectedGenres = ref([])
const genre_lokalno = 'invisibleGenres'

const toggleTheme = () => {
  $q.dark.toggle()
  localStorage.setItem('darkMode', $q.dark.isActive)
}

const changePassword = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    $q.notify({ type: 'warning', message: 'neko polje je prazno' })
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    $q.notify({ type: 'negative', message: 'lozinke nisu iste' })
    return
  }

  try {
    await api.post('http://localhost:4200/korisnik/password', {
      email: user.value.email,
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    })

    $q.notify({ type: 'positive', message: 'Lozinka promijenjena' })

    passwordDialog.value = false
    oldPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''

  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.response?.data || 'Greška pri promjeni lozinke'
    })
  }
}

const deleteAccount = async () => {
  if (!deletePassword.value) {
    $q.notify({ type: 'warning', message: 'potrebno je unjeti lozinku' })
    return
  }

  try {
    await api.delete(`http://localhost:4200/korisnik/${user.value.email}`, {
      data: {
        password: deletePassword.value
      }
    })

    $q.notify({ type: 'positive', message: 'Račun obrisan' })

    localStorage.removeItem('user')
    deleteDialog.value = false

    setTimeout(() => {
      window.location.href = '/login'
    }, 1000)

  } catch (err) {
    $q.notify({
      type: 'negative',
      message: err.response?.data || 'Greška pri brisanju računa'
    })
  }
}

const saveGenres = () => {
  localStorage.setItem(
    genre_lokalno,
    JSON.stringify(selectedGenres.value)
  )

  $q.notify({
    type: 'positive',
    message: 'Žanrovi spremljeni'
  })

  genreDialog.value = false
}

onMounted(() => {
  const isDark = localStorage.getItem('darkMode') === 'true'
  $q.dark.set(isDark)

  const stored = localStorage.getItem('user')
  if (stored) user.value = JSON.parse(stored)

  token.value = localStorage.getItem('token')
  if (!token.value) {
    router.push('/login')
  }

  const saved = localStorage.getItem(genre_lokalno)
  if (saved) {
    selectedGenres.value = JSON.parse(saved)
  }
})
</script>
