<template>
  <q-page class="flex flex-center page-register">
    <q-card style="width: 500px; border-radius: 20px;" class="shadow-24 q-my-lg">
      
      <q-card-section class="bg-secondary text-white text-center q-pa-xl">
        <q-icon name="person_add" size="80px" class="q-mb-md" />
        <div class="text-h4 text-bold">Registracija</div>
        <div class="text-subtitle1 q-mt-sm">Postanite član naše zajednice</div>
      </q-card-section>

      <q-card-section class="q-pa-xl bg-white">
        <q-form @submit="handleRegister" class="q-gutter-md">
          <q-input filled v-model="regData.korisnickoIme" label="Korisničko ime" color="secondary" required>
            <template v-slot:prepend><q-icon name="person" color="secondary" /></template>
          </q-input>

          <q-input filled v-model="regData.email" label="Email adresa" type="email" color="secondary" required>
            <template v-slot:prepend><q-icon name="alternate_email" color="secondary" /></template>
          </q-input>

          <q-input filled v-model="regData.lozinka" label="Lozinka" type="password" color="secondary" required>
            <template v-slot:prepend><q-icon name="vpn_key" color="secondary" /></template>
          </q-input>

          <q-input filled v-model="regData.datumRodjenja" label="Datum rođenja" type="date" stack-label color="secondary" required>
            <template v-slot:prepend><q-icon name="cake" color="secondary" /></template>
          </q-input>

          <div class="q-mt-xl">
            <q-btn 
              label="Registriraj se" 
              type="submit" 
              color="secondary" 
              class="full-width q-py-md text-weight-bold" 
              size="lg"
              rounded
              unelevated
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="text-center q-pb-xl bg-white">
        <div class="text-grey-7 text-subtitle1">
          Već imate račun? 
          <q-btn flat label="Prijavi se" color="secondary" to="/login" dense no-caps class="text-bold" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'

const router = useRouter()
const $q = useQuasar()

const regData = ref({
  korisnickoIme: '',
  email: '',
  lozinka: '',
  datumRodjenja: ''
})

const handleRegister = async () => {
  try {
    // VAŽNO: Ovaj URL mora odgovarati tvom index.js i routes na BACKENDU.
    // Budući da si u index.js stavila app.use('/korisnik', ...), 
    // a u routes router.post('/registracija', ...), onda je URL:
    const response = await axios.post('http://localhost:4200/korisnik/registracija', regData.value)
    
    // Provjeravamo je li server uopće vratio išta (ako je prošlo, ide u try)
    $q.notify({ 
      type: 'positive', 
      message: 'Uspješna registracija!', 
      caption: 'Sada se možete prijaviti.',
      position: 'top',
      timeout: 3000
    })

    // Pražnjenje polja
    regData.value = {
      korisnickoIme: '',
      email: '',
      lozinka: '',
      datumRodjenja: ''
    }

    // Prebacivanje na login. Ovdje koristiš ime ili putanju iz VUE ruta (obično '/login')
    setTimeout(() => {
      router.push('/login')
    }, 1500)

  } catch (err) {
    console.error("Detalji greške:", err.response);
    
    // Ovo će ti ispisati točan razlog (npr. "Greška baze: Unknown column...")
    const serverMessage = err.response?.data || 'Provjerite vezu sa serverom.';
    
    $q.notify({ 
      type: 'negative', 
      message: 'Registracija nije uspjela!', 
      caption: typeof serverMessage === 'string' ? serverMessage : 'Greška na serveru.',
      position: 'top' 
    })
  }
}
</script>