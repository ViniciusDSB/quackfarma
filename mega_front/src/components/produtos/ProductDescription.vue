<template>
  <v-card color="#A4E9C8" class="ma-3" rounded="lg">
    <v-row class="ma-3">
      <v-col>
        <v-img src="https://i.pinimg.com/736x/5c/ee/af/5ceeafdc811d2269821fb03df29374ff.jpg"/>
      </v-col>
      <v-col>
        <v-row>
          <p class="text-h4 my-2 text-left font-weight-thin">
            Lorem Ipsum
          </p>
          <p class=" text-subtitle-2 text-justify">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry's
            standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
            make a type specimen book. It has survived not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset
            sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
        </v-row>
      </v-col>
      <v-col>
        <v-container class="container-color pa-2 rounded-lg">
          <v-row class="pa-2">
            <v-col cols="11"><p class="text-subtitle-1 font-weight-black">Quantidade em estoque </p></v-col>
            <v-col class="rounded-lg bg-teal-accent-1 mb-1 mr-1"><p class="text-justify">10</p></v-col>
          </v-row>
          <v-row class="pa-2">
            <v-col cols="4"><h1> R$ 10,00</h1></v-col>
            <v-col>

              <v-number-input :model-value="1" :min="0" control-variant="split"
                              class="bg-teal-accent-1 rounded-lg" hide-details="auto"/>
            </v-col>
          </v-row>
          <v-btn rounded="lg" block prepend-icon="mdi-shopping-search-outline " class="mt-14 bg-teal-accent-1"
                 color="black">
            Adicionar ao Carrinho
          </v-btn>
        </v-container>
        <v-card class="my-5" rounded="lg">
          <v-file-input class="pa-6"
                        :show-size="1000"
                        color="#70A89E"
                        label="Anexe sua receita médica"
                        placeholder="Selecione sua receita médica"
                        prepend-icon="mdi-medical-bag"
                        variant="outlined"
                        counter
                        multiple
          />
        </v-card>

      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import {VNumberInput} from 'vuetify/labs/VNumberInput'

export default {
  name: 'ProductDescription',
  components: {
    VNumberInput
  }
}

</script>

<style scoped>

.container-color {
  background-color: #70A89E;
}
</style>