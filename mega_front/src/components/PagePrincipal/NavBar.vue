<template>
  <v-card class="mx-auto">
    <loading v-model="loading"/>
    <v-toolbar color="#70A89E">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title class="mr-2" @click="this.$router.push('/')">QuackFarma</v-toolbar-title>
      <v-text-field
          hide-details
          append-inner-icon="mdi-magnify"
          class="mx-16 background-color rounded-lg"
          v-model="nome"
          v-if="!user.is_adm"
          @keypress.enter="buscar"
      ></v-text-field>
      <v-sheet color="#A4E9C8" class="rounded-xl mx-16">
        <v-btn v-if="!user.login" size="x-large" append-icon="mdi-account-circle-outline" @click="$refs.login.open()">
          Log in
        </v-btn>
        <v-menu location="end" v-if="user.login">
          <template v-slot:activator="{ props }">
            <v-btn size="x-large" append-icon="mdi-account-circle-outline" v-bind="props">
              Olá {{ user.firstName }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="logout">Logout</v-list-item>
          </v-list>


        </v-menu>

      </v-sheet>
      <v-btn class="rounded-xl mx-16 pl-10 background-color" size="x-large"
             @click="this.$router.push('/shopping')"
             prepend-icon="mdi-cart-outline" v-if="!this.user.is_adm"/>

    </v-toolbar>
    <v-tabs align-tabs="categorias" bg-color="#A4E9C8" fixed-tabs color="white" v-if="!user.is_adm">
      <v-tab v-for="item in categorias" :text="item.text" :value="item.value" :key="item" @click="irPara(item.path)">
        {{ item.text }}
      </v-tab>
    </v-tabs>
  </v-card>
  <login ref="login"/>

</template>

<script>
import Login from "@/components/usuario/Login.vue";
import User from "@/model/User";
import Loading from "@/components/PagePrincipal/Loading.vue";

export default {
  computed: {
    user() {
      return new User()
    }
  },
  components: {
    Loading,
    Login
  },
  name: 'App',
  methods: {
    buscar() {
      this.irPara('/search?medName=' + this.nome)
    },
    logout() {
      this.loading = true
      this.user.logout();
      window.location.reload();
      this.loading = false
    },
    irPara(path) {
      this.$router.push(path)
    }
  },
  data() {
    return {
      loading: false,
      categorias: [
        {text: 'Medicamentos', value: 'medicamento', path: '/search?medCategory=Medicamento'},
        {text: 'Higiene', value: 'higiene', path: '/search?medCategory=Higiene'},
        {text: 'Suplemento', value: 'suplemento', path: '/search?medCategory=Suplemento'},
        {text: 'Recomendações', value: 'recomendacoes', path: '/recommendation'},
      ],
      abrirLogin: false,
      nome: null,
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