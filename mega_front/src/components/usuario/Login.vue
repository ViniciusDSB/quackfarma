<template>

  <v-dialog v-model="dialog" max-width="600" color="light-green-lighten-4" persistent>
    <v-card>
      <loading v-model="loading"/>
      <v-card-title>
        <v-btn
            icon="mdi-close-circle-outline"
            variant="text"
            @click="dialog = false"
        ></v-btn>
        <div class="font-weight-medium text-h3 d-flex justify-center">Login</div>
      </v-card-title>
      <v-card-text>
        <v-form ref="login" class="mx-10">
          <v-text-field class="background-color rounded-lg my-10" hide-details="auto" label="Email" type="email"
                        v-model="email" :rules="emailRules()"/>
          <v-text-field class="background-color rounded-lg" hide-details
                        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="visible ? 'text' : 'password'"
                        placeholder="Senha"
                        @click:append-inner="visible = !visible"
                        v-model="password"
          ></v-text-field>
          <v-card-actions>
            <a class="flex-1-0 ma-2 pa-2" href="">Esqueceu a senha?</a>
            <v-btn rounded="xl" class="ma-2 pa-2 btn-color" append-icon="mdi-arrow-right-thin" @click="fazerlogin()">
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
        <v-btn rounded="xl" size="large" class="btn-color" @click="$refs.createAccount.open(),this.dialog = false">
          Criar Conta
        </v-btn>
      </v-card-actions>
      <v-divider/>
    </v-card>
  </v-dialog>
  <create-account ref="createAccount"/>
  <AlertMessage ref="alerta"/>

</template>

<script>

import CreateAccount from "@/components/usuario/CreateAccount.vue";
import {login} from "@/services/UserService";
import AlertMessage from "@/components/alertas/AlertMessage.vue";
import Loading from "@/components/PagePrincipal/Loading.vue";
import {emailRules} from "@/utils/rules";
import User from "@/model/User";

export default {
  name: 'LoginUsuario',
  components: {
    Loading,
    AlertMessage,
    CreateAccount
  },
  methods: {
    emailRules() {
      return emailRules
    },
    async fazerlogin() {
      const {valid} = await this.$refs.login.validate()
      if (!valid) {
        return
      }
      this.loading = true;
      try {
        const response = await login(this.email, this.password);
        this.$refs.alerta.sucess('Login efetuado com sucesso')
        this.user.persistir(response.data)
        this.dialog = false
        this.email = null;
        this.password = null
        window.location.reload();

      } catch (error) {
        this.$refs.alerta.error(error.response.data.message)
      } finally {
        this.loading = false;
      }

    },
    open() {
      this.dialog = true
    },
  },
  data() {
    return {
      dialog: false,
      email: null,
      password: null,
      loading: false,
      visible: false,
      user: new User()
    }
  },
}


</script>