<template>
  <v-dialog v-model="dialog" max-width="600" color="light-green-lighten-4">
    <v-card>
      <v-card-title>
        <v-btn
            icon="mdi-close-circle-outline"
            variant="text"
            @click="dialog = false"
        ></v-btn>
        <div class="font-weight-medium text-h3 d-flex justify-center">Criar Conta</div>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <div v-show="firstPage">
            <v-text-field label="Nome" v-model="formData.nome" :rules="nameRules"/>
            <v-text-field label="CPF" placeholder="000.000.000-00" v-model="formData.cpf" :rules="cpfRules"
                          maxlength="11"/>

            <v-text-field label="RG" v-model="formData.rg"/>
            <v-text-field label="E-mail" type="email" placeholder="seu_email@email.com" v-model="formData.email"
                          :rules="emailRules"/>
            <v-text-field label="Telefone" placeholder="(XX) XXXXX-XXXX" v-model="formData.telefone" maxlength="11"/>
            <v-text-field label="Endereço" v-model="formData.endereco"/>
          </div>
          <div v-show="secondPage">
            <v-text-field
                v-model="formData.senha"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                placeholder="Senha"
                @click:append-inner="visible = !visible"
            ></v-text-field>
            <v-text-field
                v-model="formData.connfirmarSenha"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                placeholder="Confirme a senha"
                @click:append-inner="visible = !visible"
            ></v-text-field>
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn rounded="xl" class="ma-2 pa-2 bg-green-lighten-1" append-icon="mdi-arrow-right-thin" @click="validate">
          Continuar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CreateAccount',
  methods: {
    open() {
      this.dialog = true
    },
    async validate() {
      const {valid} = await this.$refs.form.validate()
      if (valid) {
        this.firstPage = false;
        this.secondPage = true;
      }
    }
  },
  data() {
    return {
      dialog: false,
      firstPage: true,
      secondPage: false,
      visible: false,
      formData: {
        nome: null,
        cpf: null,
        email: null,
        senha: null,
        connfirmarSenha: null,
        telefone: null,
        rg: null,
        endereco: null
      },
      nameRules: [
        v => !!v || 'Nome é obrigatório',
        v => (v.length > 3) || 'Nome muito curto',
      ],
      cpfRules: [
        v => !!v || 'CPF é obrigatório',
        v => (v && v.length === 11) || 'CPF deve ter 11 caracteres',
      ],
      emailRules: [
        v => !!v || 'E-mail é obrigatório',
      ]
    }
  },
}


</script>
<style scoped>

</style>