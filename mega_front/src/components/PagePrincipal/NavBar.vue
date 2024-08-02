<template>
  <v-card class="mx-auto">
    <v-toolbar color="#70A89E">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title class="mr-2">QuackFarma</v-toolbar-title>
      <v-text-field
          hide-details
          append-inner-icon="mdi-magnify"
          class="mx-16 background-color rounded-lg"
      ></v-text-field>
      <v-sheet color="#A4E9C8" class="rounded-xl mx-16" >
        <v-btn size="x-large" append-icon="mdi-account-circle-outline" @click="$refs.login.open()">
          Log in
        </v-btn>
      </v-sheet>
        <v-btn class="rounded-xl mx-16 pl-10 background-color" size="x-large"  prepend-icon="mdi-cart-outline"/>

    </v-toolbar>
    <v-tabs align-tabs="categorias" bg-color="#A4E9C8" fixed-tabs color="white">
      <v-tab v-for="item in categorias" :text="item.text" :value="item.value" :key="item">
        <router-link :to="item.path"> {{ item.text }}</router-link>
      </v-tab>
    </v-tabs>
  </v-card>
  <login ref="login"/>

</template>

<script>
import Login from "@/components/usuario/Login.vue";

export default {
  components: {
    Login
  },
  name: 'App',
  methods: {},
  data() {
    return {
      categorias: [
        {text: 'Medicamentos', value: 'medicamento', path: '/search?medicamento'},
        {text: 'Higiene', value: 'higiene', path: '/search?higiene'},
        {text: 'Suplemento', value: 'suplemento', path: '/search?suplemento'},
        {text: 'Recomendações', value: 'recomendacoes', path: '/recommendation'},
      ],
      abrirLogin: false
    }
  }
}
</script>
<style>
.background-color {
  background-color: #A4E9C8;
  color: black;
}


.btn-color {
  background-color: #70A89E;
}
</style>