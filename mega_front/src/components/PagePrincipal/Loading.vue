<script >
 export default {
   name : 'LoadingCircle'
 }
</script>

<template>
  <v-overlay style="text-align: center" class="align-center justify-center" v-model="loading" persistent>

    <div style="color: white; font-size: 18px" class="pa-4 ma-2 rounded">
      <v-progress-circular
          indeterminate
          width="4"
          size="64"
      ></v-progress-circular>
    </div>
  </v-overlay>
</template>

<style scoped>

</style>