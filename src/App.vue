<template>
  <div id="app">
    <router-view/>
    <AddToHomeScreenView />
    <OfflineWarningView />
  </div>
</template>

<script>
import AddToHomeScreenView from './views/AddToHomeScreenView.vue'
import OfflineWarningView from './views/OfflineWarningView.vue'

export default {
  name : 'app',
  components : {
    AddToHomeScreenView,
    OfflineWarningView,
  }
}
</script>

<style>
#app {
  font-family: "Roboto", sans-serif;
  background-image: url("./assets/bg.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
