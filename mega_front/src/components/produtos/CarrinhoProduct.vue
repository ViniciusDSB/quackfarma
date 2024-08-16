<template>
  <loading-circle v-model="loading"/>
  <div v-if="this.products.length > 0">
    <h1 class="ma-10 pr-10">
      Seu Carrinho
    </h1>
    <v-row>
      <v-col cols="8">
        <v-card variant="outlined" class="ml-10 mr-1 rounded-lg" color="#70A89E">
          <v-container>
            <div v-for="product in products" :key="product" class="my-5">
              <v-row>
                <v-col cols="8">
                  <card-produto :product="product" :loading="loading"/>
                </v-col>
                <v-row>
                  <v-btn @click="excluirItem(product.id)" icon="mdi-minus-circle-outline"
                         class="align-self-center mx-16" size="x-large" elevation="18">
                    <v-icon>
                      mdi-minus-circle-outline
                    </v-icon>
                  </v-btn>
                </v-row>
              </v-row>
            </div>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card color="#70A89E" variant="outlined" class="ml-10 mr-1 rounded-lg pa-4">
          <p class="text-color my-2">Valores</p>
          <v-data-table :items="this.shopping" class="cor-back " hide-default-footer
                        hide-default-header/>
          <v-select
              label="Método de pagamento"
              class="background-color my-5 "
              hide-details="auto"
              v-model="metodoPagamento"
              :items="['Cartão de crédito','Débito','Pix','Dinheiro']"/>

          <v-card-actions class="d-flex justify-center mt-10">
            <v-btn @click=finalizarCompra rounded="xl" size="large" block class="cor-btn">
              <p class="text-color">Finalizar compra</p></v-btn>

          </v-card-actions>


        </v-card>
      </v-col>
    </v-row>
  </div>
  <div v-else class="center">
    <p class="ma-16"> Carrinho Vazio</p>
  </div>

  <alert-message ref="alerta"/>
</template>
<script>
import LoadingCircle from "@/components/PagePrincipal/Loading.vue";
import User from "@/model/User";
import {deleteItemCarrinho, finalizarCompra, seachUnit, searchShopping} from "@/services/productsService";
import AlertMessage from "@/components/alertas/AlertMessage.vue";
import CardProduto from "@/components/produtos/CardProduto.vue";
import Product from "@/model/Product";

export default {
  name: 'CarrinhoProduct',
  components: {CardProduto, AlertMessage, LoadingCircle},
  mounted() {
    this.searchShopping();
  },
  methods: {
    findName(cod) {
      let nome = null
      for (const product of this.products) {
        if (product.code == cod) {
          nome = product.name
        }
      }
      return nome
    },
    async finalizarCompra() {
      this.loading = true;
      try{
        await finalizarCompra(this.user.id, Number.parseInt(this.user.sale_id),this.metodoPagamento)
      }catch (error){
        this.$refs.alerta.error(error.response?.data.message ?? error.message)
      } finally {
        this.loading = false
      }
    },
    async excluirItem(id) {
      this.loading = true;
      try {
        await deleteItemCarrinho(this.user.id, Number.parseInt(this.user.sale_id), id)
        this.products = null
        this.shopping = null
        await this.searchShopping()
      } catch (error) {
        this.$refs.alerta.error(error.response?.data.message ?? error.message)
      } finally {
        this.loading = false
      }
    },
    async searchShopping() {
      this.loading = true
      try {
        const response = await searchShopping(this.user.sale_id, this.user.id)
        let products = response.data.shopping_cart
        for (const product of products) {
          const response = await seachUnit(product.medicine_code)
          this.products.push((new Product()).persistente(response.data[0]))
          this.shopping.push({
            Nome: this.findName(product.medicine_code),
            Quantidade: product.sold_amount,
            Total: product.item_total
          })
        }
        this.shopping.push({
          Nome: 'Total',
          Quantidade: null,
          Total: response.data.total
        })
      } catch (error) {
        this.$refs.alerta.error(error.response?.data.message ?? error.message)
      } finally {
        this.loading = false
      }
    },
  },
  data() {
    return {
      loading: false,
      shopping: [],
      products: [],
      user: new User(),
      metodoPagamento: 'PIX'
    }
  }
}
</script>
<style scoped>

.cor-back {
  background-color: #A4E9C8;
}

.cor-btn {
  background-color: #70A89E;
}

.text-color {
  color: black;
}
</style>