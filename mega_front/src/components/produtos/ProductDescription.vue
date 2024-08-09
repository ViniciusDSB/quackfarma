<template>
  <loading-circle v-model="loading"/>
  <v-card color="#A4E9C8" class="ma-3" rounded="lg">

    <v-row class="ma-3">
      <v-col>
        <v-img :src="produto.image_path"/>
      </v-col>
      <v-col>
        <v-row>
          <p class="text-h4 my-2 text-left font-weight-thin">
            {{ produto.name }}
          </p>
        </v-row>
        <v-row>
          <p class=" text-subtitle-2 text-justify">
            {{ produto.description }}
          </p>
        </v-row>
      </v-col>
      <v-col>
        <v-container class="container-color pa-2 rounded-lg">
          <v-row class="pa-2">
            <v-col cols="11"><p class="text-subtitle-1 font-weight-black">Quantidade em estoque </p></v-col>
            <v-col class="rounded-lg bg-teal-accent-1 mb-1 mr-1"><p class="text-justify">{{ produto.on_stock }}</p>
            </v-col>
          </v-row>
          <v-row class="pa-2">
            <v-col cols="4"><h1> {{ produto.unit_price }}</h1></v-col>
            <v-col>

              <v-number-input :model-value="qtd" :min="1" :max="produto.on_stock" control-variant="split"
                              class="bg-teal-accent-1 rounded-lg" hide-details="auto"/>
            </v-col>
          </v-row>
          <v-btn rounded="lg" block prepend-icon="mdi-shopping-search-outline " class="mt-14 bg-teal-accent-1"
                 color="black" @click="addCarrinho">
            Adicionar ao Carrinho
          </v-btn>
        </v-container>
        <v-card class="my-5" rounded="lg" v-if="produto.needs_recipe">
          <v-file-input class="pa-6"
                        :show-size="1000"
                        color="#70A89E"
                        label="Anexe sua receita médica"
                        placeholder="Selecione sua receita médica"
                        prepend-icon="mdi-medical-bag"
                        variant="outlined"
                        counter
                        multiple
                        v-model="file"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-card>
  <AlertMessage ref="alerta"/>
</template>

<script>
import {VNumberInput} from 'vuetify/labs/VNumberInput'
import {seachUnit} from "@/services/productsService";
import Product from "@/model/Product";
import AlertMessage from "@/components/alertas/AlertMessage.vue";
import LoadingCircle from "@/components/PagePrincipal/Loading.vue";

export default {
  name: 'ProductDescription',
  components: {
    LoadingCircle,
    AlertMessage,
    VNumberInput
  },
  mounted() {
    this.search()
  },
  data() {
    return {
      loading : false,
      produto: new Product(),
      file: null,
      qtd : 1
    }
  },
  methods: {
    addCarrinho() {
      if (this.produto.needs_recipe && this.file == null) {
        this.$refs.alerta.warming('Produto precisa de receita médica.Por favor anexe')
      }

    },
    async search() {
      this.loading = true
      try {
        const response = await seachUnit(this.$route.params.medCode)
        this.produto.persistente(response.data[0])
      } catch (error) {
        this.$refs.alerta.error(error.response.data.message ?? error.message)
      }finally {
        this.loading = false
      }
    }
  }
}


</script>

<style scoped>

.container-color {
  background-color: #70A89E;
}
</style>