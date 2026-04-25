<template>
<q-page class="q-pa-md">

  <div class="row items-center q-mb-md">
    <q-btn
      label="Kreiraj listu"
      @click="dialog = true"
      unelevated
      style="background:#26A69A; color:white;"
    />
  </div>

  <div class="column q-gutter-sm">
    <q-card
      v-for="list in lists"
      :key="list.id_osobne_liste"
      class="full-width"
      style="background: #F4F5F4;"
    >
      <q-card-section class="row items-center justify-between">

        <div>
          <div class="text-h6">{{ list.Naziv_liste }}</div>
          <div class="text-caption">{{ list.Opis_liste }}</div>
        </div>

<q-badge>
  <q-icon
    :name="list.Status_vidljivosti === 'Privatna' ? 'lock' : 'visibility'"
  />
</q-badge>

      </q-card-section>
    </q-card>

  </div>

  <q-dialog v-model="dialog">
    <q-card style="min-width:350px">

      <q-card-section>
        <div>Stvaranje nove liste:</div>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-input v-model="naziv" label="Naziv liste" />
        <q-input v-model="opis" label="Opis liste"/>
        <q-checkbox v-model="isPrivate" label="Privatna lista" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Odustani" v-close-popup />
        <q-btn color="primary" label="Spremi" @click="createLista" />
      </q-card-actions>

    </q-card>
  </q-dialog>

</q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

defineOptions({
  name: 'MojeListe'
})

const dialog = ref(false)
const naziv = ref('')
const opis = ref('')
const isPrivate = ref(false)
const user = ref(null)
const lists =ref([])

const fetchLists = async () => {
  console.log("radi")
  try {
    const email = user.value.Email

    const res = await axios.get(
      `http://localhost:4200/lista/user/${email}`)

    lists.value = res.data
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  const storedUser = localStorage.getItem("user")

  if (!storedUser) return

  user.value = JSON.parse(storedUser)

  fetchLists()
})

const createLista = async () => {
  try {
    const status = isPrivate.value ? 'Privatna' : 'Javna'
    const res = await axios.post('http://localhost:4200/lista', {
      email: user.value.Email,
      naziv: naziv.value,
      opis: opis.value,
      status
    })

    console.log(res.data)

    //nakon sta je poslano, reset
    naziv.value = ''
    opis.value = ''
    isPrivate.value = false
    dialog.value = false

  } catch (err) {
    console.error(err)
  }
}
</script>