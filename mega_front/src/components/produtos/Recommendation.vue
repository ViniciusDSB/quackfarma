<template>
  <v-container class="ma-5">
    <v-card color="#70A89E">
      <v-form class="pa-4 text-color">
        <p class="font-weight-black black">Descreva aqui o que você está sentindo:</p>
        <v-textarea placeholder="..." class="color-back rounded-lg my-2" hide-details="auto" clearable
                    maxlength="256"
                    counter
                    no-resize
                    clear-icon="mdi-close-circle"/>
        <v-checkbox v-model="selected" v-for="question in questions" :label="question.label" :value="question.value"
                    :key="question"/>
        <v-expand-x-transition>
          <v-combobox v-show="selected.includes('medicamentos')"
                      ref="remedios"
                      label="Quais medicamentos utilizou?"
                      v-model="medicine"
                      chips
                      clearable
                      multiple
                      class="color-back rounded-xl"
                      hide-details="auto"
                      rounded-lg
          >
          </v-combobox>
        </v-expand-x-transition>
        <p class="my-3">Caso os sintomas persistam consulte um profissional</p>
        <v-col class="text-right">
          <v-btn type="submit" color="#A4E9C8" prepend-icon="mdi-magnify" class="rounded-lg">
            Pesquisar
          </v-btn>
        </v-col>
      </v-form>
    </v-card>
  </v-container>

</template>
<script>

export default {
  name: 'RecommendationProducts',
  data() {
    return {
      selected: [],
      medicine: [],
      questions: [
        {
          label: 'Tem diabetes?',
          value: 'diabetes'
        },
        {
          label: 'É gestante?',
          value: 'gestante'
        },
        {
          label: 'Tem mais de 18 anos?',
          value: 'maior de idade'
        },
        {
          label: 'Tem mais de 60 anos?',
          value: 'idoso'
        },
        {
          label: 'Realizou uma cirurgia recentemente?',
          value: 'cirurgia'
        },
        {
          label: 'Já utiliza outros medicamentos? Quais?',
          value: 'medicamentos'
        },

      ]
    }
  }
}
</script>

<style scoped>

.text-color {
  color: black;
}

.color-back {
  background-color: #A4E9C8;
}
</style>