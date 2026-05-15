<template>
  <q-page class="flex flex-center bg-black">
    <q-card class="admin-logout-card q-pa-xl text-center shadow-24" dark>
      <q-card-section class="column items-center q-gutter-md">
        <!-- Ikona admin panela -->
        <q-icon name="admin_panel_settings" size="80px" color="primary" />
        
        <div class="text-h4 text-bold text-white q-mt-md">
          Admin Panel
        </div>
        <p class="text-grey-5 text-subtitle1">
          Trenutno ste prijavljeni kao administrator.
        </p>
      </q-card-section>

      <q-card-actions align="center" class="q-mt-lg">
        <!-- Gumb za odjavu -->
        <q-btn
          unelevated
          color="negative"
          icon="logout"
          label="Odjavi se"
          class="logout-btn q-px-xl q-py-md text-weight-bold"
          @click="handleLogout"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

defineOptions({
  name: 'RegistracijaPage' // Zadržano ime iz tvog primjera, iako je stranica za admina
});

const router = useRouter();
const $q = useQuasar();

const handleLogout = () => {
  // 1. Brišemo sve podatke o sesiji korisnika/admina iz localStorage
  localStorage.removeItem("user");
  localStorage.removeItem("token"); // Ako koristiš token, brišemo i njega
  
  // Opcionalno: Možeš očistiti cijeli localStorage ako ne čuvaš ništa drugo važno
  // localStorage.clear();

  // 2. Obavijest korisniku da je odjava uspjela
  $q.notify({
    type: 'positive',
    message: 'Uspješno ste se odjavili.',
    timeout: 2000,
    icon: 'done'
  });

  // 3. Preusmjeravanje na stranicu za prijavu
  router.push('/login'); // Prilagodi putanju ako ti se login stranica zove drugačije (npr. '/prijava')
};
</script>

<style scoped>
/* Kartica za odjavu u tamnom tonu */
.admin-logout-card {
  background: #0a0a0a;
  border: 1px solid #1f2937;
  border-radius: 16px;
  max-width: 450px;
  width: 100%;
}

/* Efekt na gumbu za odjavu */
.logout-btn {
  border-radius: 8px;
  font-size: 1rem;
  transition: transform 0.2s, background-color 0.2s;
}

.logout-btn:hover {
  transform: scale(1.02);
}
</style>