<template>
    <v-snackbar
        v-model="snackbar"
        :top="true"
        :color=this.color
        location="top right"
        :timeout=timeout
    >
      <v-card :color="this.color" outlined elevation="0">
        <v-card-text >
          {{ text }}

        </v-card-text>
      </v-card>


      <template v-slot:actions>
        <v-btn
           icon="mdi-close"
            @click="snackbar = false"
        />
      </template>
    </v-snackbar>
</template>
<script>
export default {
  name : 'AlertMessage',
  methods : {
    message(message){
      this.snackbar = true;
      this.text = message
    },
    sucess(message){
      this.color = 'success';
      this.timeout = 5000;
      this.message(message)
    },
    warming(message){
      this.color = 'warning';
      this.timeout = 5000;
      this.message(message)
    },
    error(message){
      this.color = 'error';
      this.timeout = 7500;
      this.message(message)
    }

  },
  data: () => ({
    snackbar: false,
    text: `Obrigado por usar nossos sistemas`,
    color : 'primary',
    timeout : '5000',
  }),

}
</script>