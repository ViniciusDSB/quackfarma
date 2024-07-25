<template>
  <v-dialog v-model="dialog" max-width="600" color="light-green-lighten-4">
    <v-card>
      <v-card-title>
        <v-btn
            icon="mdi-close-circle-outline"
            variant="text"
            @click="dialog = false"
        ></v-btn>
        <div class="font-weight-medium text-h3 d-flex justify-center">Login</div>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field label="Email" type="email"></v-text-field>
          <v-text-field
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'"
              placeholder="Senha"
              @click:append-inner="visible = !visible"
          ></v-text-field>
          <v-card-actions>
            <a class="flex-1-0 ma-2 pa-2" href="">Esqueceu a senha?</a>
            <v-btn rounded="xl" class="ma-2 pa-2 bg-green-lighten-1" append-icon="mdi-arrow-right-thin">
              Continuar
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>

    </v-card>
    <v-divider/>
    <v-card>
      <v-card-title>
        <div class="font-weight-medium text-h6 d-flex justify-center">Ainda não tem conta?</div>
      </v-card-title>
      <v-card-actions class="d-flex justify-center">
        <v-btn rounded="xl" size="large" class="bg-green-lighten-1" @click="$refs.createAccount.open(),this.dialog = false">
          Criar Conta
        </v-btn>
      </v-card-actions>
      <v-divider/>
    </v-card>
  </v-dialog>
  <create-account ref="createAccount"/>

</template>

<script>

import CreateAccount from "@/components/usuario/CreateAccount.vue";

export default {
  name: 'LoginUsuario',
  components: {
    CreateAccount
  },
  methods: {
    open() {
      this.dialog = true
    },
  },
  data() {
    return {
      dialog: false,
      visible: false
    }
  },
}


</script>
<style scoped>

</style>