<template>
  <q-page class="flex flex-center column">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />

    <q-btn
      label="Kreiraj listu"
      color="primary"
      @click="dialog = true"
      class="q-mt-md"
    />

    <!-- DIALOG -->
    <q-dialog v-model="dialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nova lista</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input v-model="naziv" label="Naziv liste" />
          <q-input v-model="opis" label="Opis liste" type="textarea" />

          <q-checkbox
            v-model="isPrivate"
            label="Privatna lista"
          />
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

onMounted(() => {
  const storedUser = localStorage.getItem("user")
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser)
    } catch {
      user.value = null
    }
  }
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

    //nakon sta je poslano reset
    naziv.value = ''
    opis.value = ''
    isPrivate.value = false
    dialog.value = false

  } catch (err) {
    console.error(err)
  }
}
</script>