<template>
  <q-page class="flex flex-center page-login" :class="$q.dark.isActive ? 'bg-dark' : ''">
    <q-card style="width: 500px; border-radius: 20px;" class="shadow-24">

      <q-card-section class="bg-secondary text-white text-center q-pa-xl">
        <q-icon name="account_circle" size="80px" class="q-mb-md" />
        <div class="text-h4 text-bold">Prijava</div>
        <div class="text-subtitle1 q-mt-sm">Dobrodošli natrag!</div>
      </q-card-section>

      <q-card-section class="q-pa-xl" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
        <q-form @submit="handleLogin" class="q-gutter-lg">
          <q-input
            filled
            v-model="loginData.email"
            label="Email adresa"
            type="email"
            color="secondary"
            required
            :dark="$q.dark.isActive"
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
            :dark="$q.dark.isActive"
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

      <q-card-section class="text-center q-pb-xl" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
        <div :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'" class="text-subtitle1">
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
      localStorage.setItem("user", JSON.stringify(res.data))

      $q.notify({
        type: 'positive',
        message: 'Prijava uspješna!',
        position: 'top',
        timeout: 2000
      })

      if (res.data.status === 'Blokiran') {
        $q.notify({
          type: 'negative',
          message: 'Račun je blokiran!'
        })
        return
      }
      
      if (res.data.admin) {
        router.push('/admin').then(() => {
          window.location.reload()
        })
      } else {
        router.push('/').then(() => {
          window.location.reload()
        })
      }
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
/* Gradient radi samo u svijetlom modu, u tamnom koristimo tamnu boju */
.page-login {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Ako je aktivan body--dark, pregazimo gradient */
:deep(.body--dark) .page-login {
  background: #121212 !important;
}
</style>