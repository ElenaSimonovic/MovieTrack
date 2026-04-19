<template>
  <q-page class="flex flex-center page-login">
    <q-card style="width: 500px; border-radius: 20px;" class="shadow-24">
      
      <q-card-section class="bg-secondary text-white text-center q-pa-xl">
        <q-icon name="account_circle" size="80px" class="q-mb-md" />
        <div class="text-h4 text-bold">Prijava</div>
        <div class="text-subtitle1 q-mt-sm">Dobrodošli natrag!</div>
      </q-card-section>

      <q-card-section class="q-pa-xl bg-white">
        <q-form @submit="handleLogin" class="q-gutter-lg">
          <q-input 
            filled 
            v-model="loginData.email" 
            label="Email adresa" 
            type="email" 
            color="secondary"
            required
          >
            <template v-slot:prepend>
              <q-icon name="email" color="secondary" />
            </template>
          </q-input>

          <q-input 
            filled 
            v-model="loginData.lozinka" 
            label="Lozinka" 
            type="password" 
            color="secondary"
            required
          >
            <template v-slot:prepend>
              <q-icon name="lock" color="secondary" />
            </template>
          </q-input>

          <div class="q-mt-xl">
            <q-btn 
              label="Prijavi se" 
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
          Nemate račun? 
          <q-btn flat label="Registrirajte se" color="secondary" to="/register" dense no-caps class="text-bold" />
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

// Podaci za prijavu
const loginData = ref({
  email: '',
  lozinka: ''
})

const handleLogin = async () => {
  try {
    const res = await axios.post('http://localhost:4200/korisnik/prijava', loginData.value)
    
    if (res.data) {
      // 1. Spremi podatke u localStorage
      localStorage.setItem("user", JSON.stringify(res.data))
      
      // 2. Obavijest o uspjehu
      $q.notify({ 
        type: 'positive', 
        message: 'Prijava uspješna!', 
        position: 'top',
        timeout: 2000 
      })

      // 3. Prebaci na početnu i osvježi da se ime učita u headeru
      router.push('/').then(() => {
        window.location.reload()
      })
    }
  } catch (err) {
    console.error("Greška pri prijavi:", err)
    
    let message = 'Pogrešan email ili lozinka!'
    if (err.response && err.response.data) {
      message = typeof err.response.data === 'string' ? err.response.data : 'Greška pri prijavi!'
    }

    $q.notify({ 
      type: 'negative', 
      message: message, 
      position: 'top' 
    })
  }
}
</script>

<style scoped>
.page-login {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>