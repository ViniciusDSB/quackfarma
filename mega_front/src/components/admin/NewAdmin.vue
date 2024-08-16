<template>
  <loading-circle v-model="loading"/>
  <v-card-title>
    <div class="font-weight-medium text-h3 d-flex justify-center">Criar Conta Administrador</div>
  </v-card-title>
  <v-card-text>
    <v-form ref="form" class="mx-10">
      <div>
        <v-text-field label="Nome" v-model="formData.name" :rules="nameRules" class="background-color my-5 rounded-lg"
                      hide-details="auto" required/>
        <v-text-field label="E-mail" type="email" placeholder="seu_email@email.com" v-model="formData.email"
                      :rules="emailRules()" required class="background-color my-5 rounded-lg" hide-details="auto"/>
      </div>
    </v-form>
    <v-form ref="senhaForm" class="mx-10">
      <div>
        <v-text-field
            v-model="senha"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            placeholder="Senha"
            @click:append-inner="visible = !visible"
            :rules="senhaRules"
            maxlength="10"
            class="background-color my-5 rounded-lg" hide-details="auto"
        ></v-text-field>
        <v-text-field
            v-model="confirmarSenha"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            placeholder="Confirme a senha"
            @click:append-inner="visible = !visible"
            :rules="senhaRules"
            maxlength="10"
            class="background-color my-5 rounded-lg" hide-details="auto"
        ></v-text-field>
        <v-alert color="error" text="Senha deve conter de 6 a 10 caracteres, contendo pelo menos
            uma letra maiúscula, uma letra minuscula, um número e um caractere especial.">
        </v-alert>
      </div>
    </v-form>
  </v-card-text>
  <v-card-actions>

  </v-card-actions>
  <v-sheet color="#70A89E"
           class="d-flex align-end flex-column mr-16 ">
    <v-btn rounded="xl" size="x-large" class="background-color" @click="cadastrar">
      Cadastrar
    </v-btn>
  </v-sheet>
  <AlertMessage ref="alerta"/>
</template>

<script>

import {emailRules} from "@/utils/rules";
import AlertMessage from "@/components/alertas/AlertMessage.vue";
import {createAdmin} from "@/services/adminService";
import LoadingCircle from "@/components/PagePrincipal/Loading.vue";
import User from "@/model/User";

export default {
  name: 'NewAdmin',
  components: {LoadingCircle, AlertMessage},
  mounted(){
    if(!this.user.is_adm){
      this.$router.push('/')
    }
  },
  methods: {
    emailRules() {
      return emailRules
    },
    async cadastrar() {
      const {valid} = await this.$refs.form.validate()
      if (valid) {
        const {valid} = await this.$refs.senhaForm.validate()
        if (valid) {
          this.formData.password = this.senha;
          this.formData.passwordRepeat = this.confirmarSenha;
          await this.criarAdmin()
        }
      }
    },
    async criarAdmin() {
      this.loading = true
      try {
        await createAdmin(this.formData)
        this.$refs.alerta.sucess('Admin criado com sucesso')
        this.formData.email = null
        this.formData.name = null
        this.senha = null
        this.confirmarSenha = null
      } catch (error) {
        this.$refs.alerta.error(error.response?.data.message ?? error.message)
      } finally {
        this.loading = false
      }
    }
  }
  ,
  data() {
    return {
      user : new User(),
      formData: {
        name: null,
        email: null
      },
      loading: false,
      senha: null,
      confirmarSenha: null,
      visible: false,
      nameRules: [
        v => !!v || 'Nome é obrigatório',
        v => (v.length > 3) || 'Nome muito curto',
      ],
      senhaRules: [
        v => !!v || 'A senha deve ser preenchida',
        v => v.length >= 6 || 'Mínimo 6 caracteres',
        v => v.length <= 10 || 'Máximo 10 caracteres',
        v => (/[a-z]/.test(v)) || 'Deve conter caracter minúsculo.',
        v => (/[A-Z]/.test(v)) || 'Deve conter caracter maiúsculo',
        v => /[^a-zA-Z0-9]/.test(v) || 'Deve conter caracter especial',
        v => /[0-9]/.test(v) || 'Deve conter um número',
        v => {
          if (v) {
            if (this.senha !== this.confirmarSenha) {
              return 'As senhas devem ser iguais'
            }
            return true
          }
        }

      ]
    }
  }
}
</script>

<style scoped>

</style>