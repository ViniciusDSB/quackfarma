<template>
<v-card max-width="600" :color="!loading ? '#A4E9C8' : 'grey-lighten-2' " rounded="xl" max-height="240">
  <v-container class="py-8 px-3" v-if="!loading">
    <v-row>
      <v-col>
        <v-img  max-width="300"/>
      </v-col>
      <v-col>
        <p class="text-h5">Nome</p>
        <p class="text-subtitle-1">Código</p>
        <p class="mt-6">Valor</p>
        <v-btn rounded="lg"  block prepend-icon="mdi-shopping-search-outline" class="mt-14" color="#70A89E">
          Ver mais
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-if="loading">
    <v-row>
      <v-col>
        <v-skeleton-loader type="image" class="mx-auto border" color="grey-lighten-2"/>
      </v-col>
      <v-col>
        <v-skeleton-loader type="list-item-three-line" />
        <v-skeleton-loader type="button"/>

      </v-col>
    </v-row>


  </v-container>
</v-card>
</template>
<script >

export default {
  name : 'CardProduto',
  data () {
    return {
      loading : false
    }
  }
}

</script>

<style scoped>

</style>