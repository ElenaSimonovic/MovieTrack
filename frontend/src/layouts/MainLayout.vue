<template>
  <q-layout view="lHh Lpr lFf">
    <q-header 
      elevated 
      :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-primary text-white'"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title
          @click="$router.push('/pretraga-filmova')"
          style="cursor: pointer;"
        >
          MovieTrack
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-1'"
    >
      <q-list>
        <q-item-label header>
          Glavni Izbornik
        </q-item-label>

        <q-item
          v-for="link in linksList"
          :key="link.title"
          clickable
          :to="link.link"
        >
          <q-item-section avatar v-if="link.icon">
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
            <q-item-label caption>{{ link.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar' // Ovo je važno za Dark mod

defineOptions({
  name: 'MainLayout'
})

const $q = useQuasar() // Inicijalizacija Quasara

const linksList = [
  {
    title: 'Pretraga filmova',
    caption: 'Pogledaj našu bazu filmova',
    icon: 'movie',
    link: '/pretraga-filmova'
  },
  {
    title: 'Moje liste',
    caption: 'Upravljaj svojim listama filmova',
    icon: 'note',
    link: '/mylists'
  },
  {
    title: 'Login',
    caption: 'Prijavi se na svoj račun',
    icon: 'login',
    link: '/login'
  },
  {
    title: 'Registracija',
    caption: 'Kreiraj novi račun',
    icon: 'person_add',
    link: '/register'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
/* Tvoj originalni stil za naslov */
.q-toolbar-title {
  font-weight: bold;
  letter-spacing: 1px;
}
</style>