<template>
  <v-dialog v-model="dialog" max-width="600" color="light-green-lighten-4" persistent>
    <v-card>
      <v-card-title>
        <v-btn
            icon="mdi-close-circle-outline"
            variant="text"
            @click="close()"
        ></v-btn>
        <div class="font-weight-medium text-h3 d-flex justify-center">Criar Conta</div>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" class="mx-10">
          <div v-show="firstPage">
            <v-text-field label="Nome" v-model="formData.name" :rules="nameRules" class="background-color my-5 rounded-lg"
                          hide-details="auto" required/>
            <v-text-field label="CPF" placeholder="000.000.000-00" v-model="formData.cpf" :rules="cpfRules"
                          hide-details="auto"
                          maxlength="14" v-mask="['###.###.###-##']" class="background-color my-5 rounded-lg" required/>
            <v-text-field label="RG"  v-model="formData.rg" maxlength="9" class="background-color my-5 rounded-lg"
                          hide-details="auto" />
            <v-text-field label="E-mail" type="email" placeholder="seu_email@email.com" v-model="formData.email"
                          :rules="emailRules" required class="background-color my-5 rounded-lg" hide-details="auto"/>
            <v-text-field label="Telefone" placeholder="(XX) XXXXX-XXXX" v-model="formData.phone" maxlength="15"
                          v-mask="['(##) #####-####']" class="background-color my-5 rounded-lg" hide-details="auto"
            />
            <v-text-field label="Endereço" hide-details="auto" class="background-color my-5 rounded-lg"
                          v-model="formData.address"/>
          </div>
        </v-form>
        <v-form ref="senhaForm" class="mx-10">
          <div v-show="!firstPage">
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
            <v-alert color="error" variant="outlined" text="Senha deve conter de 6 a 10 caracteres, contendo pelo menos
            uma letra maiúscula, uma letra minuscula, um número e um caractere especial.">
            </v-alert>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn rounded="xl" v-show="!firstPage" prepend-icon="mdi-arrow-left-thin"
               class="bg-green-lighten-3" @click="rollback()">
          Voltar
        </v-btn>
        <v-btn rounded="xl" class="ma-2 pa-2 btn-color d-flex justify-space-between"
               append-icon="mdi-arrow-right-thin" @click="continueBtn">
          Continuar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <AlertMessage ref="alerta"/>
</template>

<script>
import {mask} from 'vue-the-mask'
import AlertMessage from "@/components/alertas/AlertMessage.vue";
import {createUser} from "@/services/UserService";
import {emailRules} from "@/utils/rules";
export default {
  name: 'CreateAccount',
  components: {AlertMessage},
  directives: {mask},
  methods: {
    open() {
      this.dialog = true
    },
    close() {
      this.dialog = false;
      this.firstPage = true;
    },
    rollback() {
      this.firstPage = true;
    },
    async criarUsuario(){
      try{
        await createUser(this.formData)
        this.$refs.alerta.sucess('Usuário criado com sucesso')
        this.close()
      }catch (error){
        this.$refs.alerta.error(error.response.data.message)
      }
    },
    async continueBtn() {
      if (this.firstPage) {
        const {valid} = await this.$refs.form.validate()
        if (valid) {
          this.firstPage = false
        }
      } else {
        const {valid} = await this.$refs.senhaForm.validate()
        if (valid) {
          this.formData.password = this.senha;
          this.formData.passwordRepeat = this.confirmarSenha;
          await this.criarUsuario()

        }
      }
    },
  },
  data() {
    return {
      dialog: false,
      firstPage: true,
      visible: false,
      senha: null,
      confirmarSenha: null,
      formData: {
        name: null,
        cpf: null,
        email: null,
        password: null,
        passwordRepeat : null,
        phone: null,
        rg: null,
        address: null
      },
      nameRules: [
        v => !!v || 'Nome é obrigatório',
        v => (v.length > 3) || 'Nome muito curto',
      ],
      cpfRules: [
        v => !!v || 'CPF é obrigatório',
        v => (v && v.length === 14) || 'CPF deve ter 11 caracteres',
      ],
      emailRules: emailRules,
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
  },
}


</script>
<style scoped>
input {
  margin: 10rem 0 10rem 0;
}

</style>