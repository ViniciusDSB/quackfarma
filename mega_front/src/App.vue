<template>
  <v-card class="mx-auto">
    <v-toolbar color="green-lighten-1">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>QuackFarma</v-toolbar-title>
      <v-text-field
          variant="solo"
          hide-details
          append-inner-icon="mdi-magnify"
      ></v-text-field>
      <v-btn size="x-large" append-icon="mdi-account-circle">
        Log in
      </v-btn>
      <v-btn size="x-large">
        <v-icon>mdi-cart</v-icon>
      </v-btn>
    </v-toolbar>
    <v-tabs align-tabs="categorias" bg-color="green-lighten-2" fixed-tabs  color="white">
      <v-tab v-for="item in categorias" :text="item.text" :value="item.value" :key="item"/>
    </v-tabs>
  </v-card>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      categorias: [
        {text: 'Medicamentos', value: 'medicamento'},
        {text: 'Higiene', value: 'higiene'},
        {text: 'Suplemento', value: 'suplemento'}
      ]
    }
  }
}
</script>