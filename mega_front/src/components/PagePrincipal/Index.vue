<template>
  <loading-circle v-model="loading"/>
  <div class="card-container">
    <card-produto
        v-for="produto in products"
        :loading="loading"
        :product="produto"
        :key="produto.id"
        class="card-item my-5 mx-5"
    />
    <AlertMessage ref="alerta"/>
  </div>
</template>

<script>

import cardProduto from "@/components/produtos/CardProduto.vue";
import {searchProducts} from "@/services/productsService";
import AlertMessage from "@/components/alertas/AlertMessage.vue";
import LoadingCircle from "@/components/PagePrincipal/Loading.vue";


export default {
  name: 'IndexProdutos',
  components: {
    LoadingCircle,
    AlertMessage,
    cardProduto
  },
  mounted() {
    this.search()
  },
  data() {
    return {
      products: [],
      loading: true
    }
  },
  methods: {
    async search() {
      try {
        const response = await searchProducts()
        this.products = response.data
        this.loading = false
      } catch (error) {
        this.$refs.alerta.error(error.message)
      }
    }
  }
}

</script>
<style scoped>

.card-container {
  display: flex;
  flex-wrap: wrap;
   /* Espaçamento entre os cards */
}

.card-item {
  flex: 1 1 30rem; /* Cards vão ocupar pelo menos 200px e crescer conforme o espaço */
  max-width: 300px; /* Limite máximo de largura dos cards */
}
</style>