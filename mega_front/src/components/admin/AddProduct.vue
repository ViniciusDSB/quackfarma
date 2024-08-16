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
                          :rules="rules" v-model="form.nome"/>
            <v-text-field hide-details="auto" placeholder="Código do Produto" type="number"
                          class="background-color  my-5 rounded-lg w-50" :rules="rules" v-model="form.codigo"/>
            <v-text-field placeholder="Valor do produto"
                          v-mask="['#,##','##,##','###,##','####,##','#####,##']"
                          class="background-color my-5 rounded-lg w-50"
                          hide-details="auto" :rules="rules" v-model="form.valor"/>
            <v-text-field
                v-model="form.qtd"
                label="Quantidade em estoque"
                type="number"
                min="1" control-variant="split"
                class="background-color my-5 rounded-lg w-50" hide-details="auto"/>
            <v-select
                label="Precisa de receita"
                class="background-color my-5 rounded-lg w-50"
                hide-details="auto"
                :items="resposta"
                v-model="form.receita"
            ></v-select>
            <v-select
                label="Categoria"
                class="background-color my-5 rounded-lg w-50"
                hide-details="auto"
                item-text="text"
                item-value="value"
                :items="['MEDICAMENTO','HIGIENE','SUPLEMENTOS','VITAMINAS','BELEZA','PERFUMARIA']"
                v-model="form.categoria"
                :rules="rules"
            ></v-select>

            <v-textarea placeholder="Descrição do Produto" class="background-color rounded-lg w-75 my-2"
                        hide-details="auto"
                        clearable
                        maxlength="256"
                        no-resize
                        clear-icon="mdi-close-circle" :rules="rules" v-model="form.descricao"/>

            <v-textarea placeholder="Instruções de uso do produto" class="background-color w-75 rounded-lg my-2"
                        hide-details="auto" clearable
                        maxlength="256"
                        no-resize
                        clear-icon="mdi-close-circle" v-model="form.descricao"/>
            <v-textarea placeholder="Sintomas para quais o produto é recomendado"
                        class="background-color rounded-lg my-2 w-75 "
                        hide-details="auto" clearable
                        maxlength="256"
                        clear-icon="mdi-close-circle" v-model="form.sintomas"/>
          </v-col>
          <v-col cols="6">
            <div class="mr-16">
              <v-card v-if="imageUrl === null" rounded="lg" height="200" max-width="auto"
                      color="grey-lighten-1">
                <v-file-input
                    hide-details="auto"
                    :rules="ruleImage"
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
          <v-btn rounded="xl" size="x-large" class="background-color" @click="cadastrar">
            Cadastrar
          </v-btn>
        </v-sheet>
      </v-form>
    </v-card-text>
  </v-card>
  <alert-message ref="alerta"/>
</template>

<script>
import {mask} from 'vue-the-mask';
import AlertMessage from "@/components/alertas/AlertMessage.vue";
import User from "@/model/User";
import {cadastrarMedicamento} from "@/services/productsService";

export default {
  name: 'AddProduct',
  mounted(){
    if(!this.user.is_adm){
      this.$router.push('/')
    }
  },

  components: {AlertMessage},
  directives: {mask},

  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageUrl = URL.createObjectURL(file); // Criar URL da imagem
        const reader = new FileReader();
        reader.onload = (e) => {
          this.binario = e.target.result;
        };
        reader.readAsArrayBuffer(file);
      }
    },
    removeImage() {
      this.imageUrl = null;
      this.img = null
    },
    async cadastrar() {
      const {valid} = await this.$refs.form.validate()
      if (this.img === null) {
        this.$refs.alerta.warming('Deve anexar uma imagem')
        return
      }
      if (!valid) {
        return
      }
      try {

        await cadastrarMedicamento(this.form, this.user,this.binario)
        this.$refs.alerta.sucess('Produto cadastrado com sucesso')

      } catch (error) {
        this.$refs.alerta.error(error.response?.data.message ?? error.message)
      }


    }
  },
  data() {
    return {
      img: null,
      imageUrl: null,
      binario : null,
      resposta: ['SIM', 'NÃO'],
      rules: [
        v => !!v || 'Campo é obrigatório',
        v => (v.length > 3) || 'Muito curto',
      ],
      ruleImage: [
        v => !!v || 'Imagem é obrigatória'
      ],
      user: new User(),
      form: {
        nome: null,
        descricao: null,
        codigo: null,
        valor: null,
        qtd: 1,
        instrucao: null,
        sintomas: null,
        receita: 'NÃO',
        categoria: null

      }
    }
  }
}
</script>

<style scoped>
.btn-color {
  background-color: #70A89E;
}

</style>