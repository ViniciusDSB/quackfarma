<template>

  <v-card color="#70A89E" class="pl-16">
    <v-card-title>
      Cadastro de Produto
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-row>
          <v-col cols="6">
            <v-text-field hide-details="auto" placeholder="Nome do produto"
                          class="background-color w-50 my-5 rounded-lg"
                          :rules="rules"/>
            <v-text-field hide-details="auto" placeholder="Código do Produto" type="number"
                          class="background-color  my-5 rounded-lg w-50" :rules="rules"/>
            <v-text-field placeholder="Valor do produto"
                          v-mask="['#,##','##,##','###,##','####,##','#####,##']"
                          class="background-color my-5 rounded-lg w-50"
                          hide-details="auto" :rules="rules"/>
            <v-text-field
                label="Quantidade em estoque"
                type="number"
                min="1" control-variant="split"
                class="background-color my-5 rounded-lg w-50" hide-details="auto"/>

            <v-textarea placeholder="Descrição do Produto" class="background-color rounded-lg w-75 my-2"
                        hide-details="auto"
                        clearable
                        maxlength="256"
                        no-resize
                        clear-icon="mdi-close-circle" :rules="rules"/>

            <v-textarea placeholder="Instruções de uso do produto" class="background-color w-75 rounded-lg my-2"
                        hide-details="auto" clearable
                        maxlength="256"
                        no-resize
                        clear-icon="mdi-close-circle"/>
            <v-textarea placeholder="Sintomas para quais o produto é recomendado"
                        class="background-color rounded-lg my-2 w-75 "
                        hide-details="auto" clearable
                        maxlength="256"
                        clear-icon="mdi-close-circle"/>
          </v-col>
          <v-col cols="6">
            <div class="mr-16">
              <v-card v-if="imageUrl === null" rounded="lg" height="200" max-width="auto"
                      color="grey-lighten-1">
                <v-file-input

                    v-model="img"
                    class="pa-6 my-6  h-100 "
                    :show-size="1000"
                    accept="image/*"
                    label="Anexe a imagem do produto"
                    variant="outlined"
                    counter
                    multiple
                    @change="onFileChange"
                />

              </v-card>
              <v-card color="#70A89E" elevation="0">
                <v-img v-if="imageUrl"
                       cover
                       :src="imageUrl"
                       alt="Imagem Selecionada"
                       class="d-flex justify-center my-5 "
                       max-height="500"/>
                <v-card-actions>
                  <v-btn v-if="imageUrl" rounded="xl" class="bg-red-accent-4" size="large" block
                         prepend-icon="mdi-delete"
                         @click="removeImage">
                    Remover imagem
                  </v-btn>

                </v-card-actions>
              </v-card>
            </div>
          </v-col>
        </v-row>
        <v-sheet color="#70A89E"
            class="d-flex align-end flex-column mr-16 ">
        <v-btn  rounded="xl" size="x-large" class="background-color" @click="cadastrar">
          Cadastrar
        </v-btn>
        </v-sheet>
      </v-form>
    </v-card-text>
  </v-card>

</template>

<script>
import {mask} from 'vue-the-mask';

export default {
  name: 'AddProduct',
  components: {},
  directives: {mask},
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageUrl = URL.createObjectURL(file); // Criar URL da imagem
      }
    },
    removeImage() {
      this.imageUrl = null;
      this.img = null
    },
    async cadastrar() {
      const {valid} = await this.$refs.form.validate()
      if (!valid) {
        return
      }
    }
  },
  data() {
    return {
      img: null,
      imageUrl: null,
      rules: [
        v => !!v || 'Campo é obrigatório',
        v => (v.length > 3) || 'Muito curto',
      ]
    }
  }
}
</script>

<style scoped>
.btn-color {
  background-color: #70A89E;
}

</style>