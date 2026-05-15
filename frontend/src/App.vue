<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useQuasar } from 'quasar'

defineOptions({
  name: 'App'
});

const $q = useQuasar()

onMounted(() => {
  // Čitamo vrijednost iz localStorage-a (koju postavlja gumb na profilu)
  const isDark = localStorage.getItem('darkMode') === 'true'
  
  // Postavljamo tamnu temu globalno pri svakom učitavanju aplikacije
  $q.dark.set(isDark)
})
</script>