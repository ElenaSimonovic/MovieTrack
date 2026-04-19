<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
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
      show-if-above
      bordered
      class="bg-grey-1"
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

defineOptions({
  name: 'MainLayout'
})

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
    title: 'Community',
    caption: 'Chat with the community',
    icon: 'chat',
    link: '/community'
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
/* Dodatni stil za naslov da izgleda profesionalnije */
.q-toolbar-title {
  font-weight: bold;
  letter-spacing: 1px;
}
</style>