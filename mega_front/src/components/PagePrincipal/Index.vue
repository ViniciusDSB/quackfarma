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
import User from "@/model/User";


export default {
  name: 'IndexProdutos',
  components: {
    LoadingCircle,
    AlertMessage,
    cardProduto
  },
  watch: {
    '$route.query': {
      handler() {
        this.search(); // Executa a busca sempre que a query na URL mudar
      },
      immediate: true // Chama o handler imediatamente na primeira vez
    }
  },
  mounted() {
    this.search();

  },
  data() {
    return {
      products: [],
      loading: false,
      user : new User()
    }
  },
  methods: {
    async search() {
      if(this.user.is_adm){
        this.$router.push('/HomeAdm')
        return
      }
      this.loading = true

      try {

        let query = this.$route.query
        const response = await searchProducts(query)
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