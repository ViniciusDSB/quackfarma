<template>
  <v-card color="#70A89E">
    <loading-circle v-model="loading"/>
    <v-card-title>
      <div class="font-weight-medium text-h3 d-flex justify-center">Criar Conta Administrador</div>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" class="pa-16">
        <v-date-input  v-model="inicio" hide-details="auto" label="Data de inicio"  class="background-color my-5 rounded-lg "
                      :rules="[ v => !!v || 'Campo é obrigatório']"></v-date-input>
        <v-date-input v-model="fim" hide-details="auto" label="Data final" class="background-color my-5 rounded-lg"
                      :rules="[ v => !!v || 'Campo é obrigatório']"></v-date-input>
      </v-form>
    </v-card-text>
    <v-card-actions class="pa-16">
      <v-btn rounded="xl"  @click="baixarRelatorio" size="large" block class="w-25 background-color">
        <p class="text-color">Gerar Relatório</p></v-btn>
    </v-card-actions>
  </v-card>
  <alert-message ref="alerta"/>

</template>

<script>
import {VDateInput} from 'vuetify/labs/VDateInput'
import {relatorio} from "@/services/adminService";
import User from "@/model/User";
import AlertMessage from "@/components/alertas/AlertMessage.vue";
import LoadingCircle from "@/components/PagePrincipal/Loading.vue";

export default {
  components: {
    LoadingCircle,
    AlertMessage,
    VDateInput,
  },
  data() {
    return {
      inicio: null,
      fim: null,
      user: new User(),
      loading: false
    }
  },

  methods: {
    async baixarRelatorio() {
      const {valid} = await this.$refs.form.validate()
      console.log(valid)
      if (valid) {
        try {
          this.loading = true
          await relatorio(this.inicio, this.fim, this.user.id)
        } catch (error) {
          this.$refs.alerta.error(error.response?.data.message ?? error.message)
        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>


<style scoped>

</style>