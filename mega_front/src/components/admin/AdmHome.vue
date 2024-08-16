<template>
  <v-card color="#70A89E" class="pl-16">
    <div class="pa-16">
      <v-btn rounded="xl" @click="cadastrarProduto" size="large" block class="w-25 background-color">
        <p class="text-color">Cadastrar Produto</p></v-btn>
      <v-divider/>
      <v-btn rounded="xl" size="large" @click="cadastrarAdmin" block class="w-25 background-color">
        <p class="text-color">Cadastrar Administrador</p></v-btn>
    </div>
  </v-card>
</template>

<script>

import User from "@/model/User";

export default {
  name: 'AdmHome',
  mounted(){
    if(!this.user.is_adm){
      this.$router.push('/')
    }
  },
  methods: {
    cadastrarProduto() {
      this.$router.push('/addProduct')
    },
    cadastrarAdmin() {
      this.$router.push('/newAdmin')
    }
  },
  data(){
    return {
      user : new User()
    }
  }
}
</script>

<style scoped>
</style>