<template>
  <q-page class="q-pa-md" style="background-color: #f9f9f9;">
    
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h4 text-weight-bold text-teal-8">Moje Liste</div>
      <q-btn
        label="Kreiraj novu listu"
        icon="add"
        @click="dialog = true"
        unelevated
        color="teal-7"
      />
    </div>

    <div class="column q-gutter-md">
      <q-expansion-item
        v-for="list in lists"
        :key="list.id_osobne_liste"
        group="moje-liste"
        class="bg-white shadow-2"
        style="border-radius: 8px"
        header-class="text-teal-9"
        @show="fetchMoviesForList(list.id_osobne_liste)"
      >
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon :name="list.Status_vidljivosti === 'Privatna' ? 'lock' : 'public'" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">{{ list.Naziv_liste }}</q-item-label>
            <q-item-label caption>{{ list.Opis_liste }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn 
              flat 
              round 
              color="red-4" 
              icon="delete" 
              @click.stop="confirmDeleteList(list)" 
            />
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">Filmovi u listi:</div>
            
            <q-list dense separator v-if="moviesInList[list.id_osobne_liste] && moviesInList[list.id_osobne_liste].length > 0">
              <q-item v-for="film in moviesInList[list.id_osobne_liste]" :key="film.Naziv_filma">
                <q-item-section>
                  {{ film.Naziv_filma }}
                </q-item-section>
                <q-item-section side>
                  <q-btn 
                    flat 
                    round 
                    size="sm" 
                    icon="close" 
                    color="grey-7" 
                    @click="confirmRemoveMovie(list.id_osobne_liste, film.Naziv_filma)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            
            <div v-else class="text-grey-6 q-pa-sm italic">
              Ova lista je prazna.
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>

    <div class="text-h5 text-weight-bold text-blue-grey-8 q-mt-xl q-mb-md">
      Javne liste
    </div>

    <div class="row q-col-gutter-md">
      <div v-for="pub in publicLists" :key="pub.id_osobne_liste" class="col-12 col-sm-6 col-md-4">
        <q-card flat bordered class="my-card bg-white">
          <q-card-section class="bg-blue-grey-1">
            <div class="text-h6">{{ pub.Naziv_liste }}</div>
            <div class="text-caption text-weight-medium text-primary">
              Autor: {{ pub.Korisnicko_ime }}
            </div>
          </q-card-section>

          <q-card-section>
            {{ pub.Opis_liste }}
          </q-card-section>

          <q-expansion-item
            label="Pogledaj filmove"
            dense
            header-class="text-primary"
            @show="fetchMoviesForList(pub.id_osobne_liste)"
          >
            <q-list dense class="q-px-md q-pb-sm">
              <template v-if="moviesInList[pub.id_osobne_liste] && moviesInList[pub.id_osobne_liste].length > 0">
                <q-item v-for="f in moviesInList[pub.id_osobne_liste]" :key="f.Naziv_filma">
                  <q-item-section>• {{ f.Naziv_filma }}</q-item-section>
                </q-item>
              </template>
              <div v-else class="text-caption q-pa-sm text-grey">Prazna lista</div>
            </q-list>
          </q-expansion-item>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="dialog">
      <q-card style="min-width:350px">
        <q-card-section class="bg-teal text-white">
          <div class="text-h6">Stvaranje nove liste</div>
        </q-card-section>

        <q-card-section class="q-gutter-md q-pt-md">
          <q-input v-model="naziv" label="Naziv liste" outlined dense />
          <q-input v-model="opis" label="Opis liste" type="textarea" outlined dense />
          <q-checkbox v-model="isPrivate" label="Privatna lista" />
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md q-pr-md">
          <q-btn flat label="Odustani" v-close-popup />
          <q-btn unelevated color="teal" label="Spremi" @click="createLista" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'

defineOptions({ name: 'MojeListe' })

const $q = useQuasar()
const dialog = ref(false)
const naziv = ref('')
const opis = ref('')
const isPrivate = ref(false)
const user = ref(null)

const lists = ref([])
const publicLists = ref([])
const moviesInList = ref({})

const fetchData = async () => {
  const storedUser = localStorage.getItem("user")
  if (!storedUser) return
  user.value = JSON.parse(storedUser)
  await fetchMyLists()
  await fetchAllPublic()
}

const fetchMyLists = async () => {
  try {
    const res = await axios.get(`http://localhost:4200/lista/user/${user.value.Email}`)
    lists.value = res.data
  } catch (err) { console.error(err) }
}

const fetchAllPublic = async () => {
  try {
    const res = await axios.get(`http://localhost:4200/lista/javne`) 
    publicLists.value = res.data.filter(l => l.Email_korisnika !== user.value.Email)
  } catch (err) { console.error(err) }
}

const fetchMoviesForList = async (id) => {
  try {
    const res = await axios.get(`http://localhost:4200/lista/lista/${id}`)
    moviesInList.value[id] = res.data
  } catch (err) { console.error(err) }
}

// --- POPRAVLJENE FUNKCIJE ZA BRISANJE ---

const confirmDeleteList = (list) => {
  $q.dialog({
    title: 'Potvrda brisanja',
    message: `Jeste li sigurni da želite obrisati listu "${list.Naziv_liste}"?`,
    cancel: { label: 'Odustani', flat: true },
    ok: { label: 'Obriši', color: 'negative', unelevated: true },
    persistent: true
  }).onOk(() => {
    deleteLista(list.id_osobne_liste)
  })
}

const confirmRemoveMovie = (listaId, filmNaziv) => {
  $q.dialog({
    title: 'Ukloni film',
    message: `Želite li ukloniti film "${filmNaziv}"?`,
    cancel: { label: 'Odustani', flat: true },
    ok: { label: 'Ukloni', color: 'orange-9', unelevated: true },
    persistent: true
  }).onOk(() => {
    removeMovie(listaId, filmNaziv)
  })
}

const createLista = async () => {
  if (!naziv.value) return
  try {
    const status = isPrivate.value ? 'Privatna' : 'Javna'
    await axios.post('http://localhost:4200/lista', {
      email: user.value.Email,
      naziv: naziv.value,
      opis: opis.value,
      status
    })
    naziv.value = ''; opis.value = ''; isPrivate.value = false; dialog.value = false
    await fetchMyLists()
    $q.notify({ color: 'positive', message: 'Lista kreirana!', icon: 'check' })
  } catch (err) { console.error(err) }
}

const deleteLista = async (id) => {
  try {
    // VRAĆENO NA DATA OBJEKT (req.body na backendu)
    await axios.delete('http://localhost:4200/lista', {
      data: { id_osobne_liste: id }
    })
    await fetchMyLists()
    await fetchAllPublic()
    $q.notify({ color: 'negative', message: 'Lista obrisana.', icon: 'delete' })
  } catch (err) { 
    console.error(err)
    $q.notify({ color: 'warning', message: 'Greška pri brisanju.' })
  }
}

const removeMovie = async (listaId, filmNaziv) => {
  try {
    // VRAĆENO NA DATA OBJEKT (req.body na backendu)
    await axios.delete('http://localhost:4200/lista/film', {
      data: { id_osobne_liste: listaId, nazivFilma: filmNaziv }
    })
    await fetchMoviesForList(listaId)
    $q.notify({ color: 'orange-8', message: 'Film uklonjen.', icon: 'link_off' })
  } catch (err) { console.error(err) }
}

onMounted(fetchData)
</script>

<style scoped>
.my-card {
  transition: transform 0.2s;
  border-radius: 12px;
}
.my-card:hover {
  transform: translateY(-4px);
}
</style>