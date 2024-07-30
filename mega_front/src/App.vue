<template>
  <header>
    <NavBar/>
  </header>
  <main>
    <router-view></router-view>
  </main>
</template>

<script>
import NavBar from "@/components/PagePrincipal/NavBar.vue";
export default {
  components: {
    NavBar
  },
  name: 'App',
}
</script>