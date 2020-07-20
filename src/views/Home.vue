<template>
  <div class="home">
    <HeaderComponent />
    <br /><br /><br />
    <div class="container">
      <div class="row">
        <div class="center col s12">
            <img class="responsive-img" width=200 height=200 src="../assets/mbs.png" />
        </div>
        <div class="center col s12"> 
          <br /><br />
          <router-link to="/login" class="waves-effect waves-light btn blue">Login</router-link>
        </div>
        <div class="col s12">  
          <br /><br /> 
          <div class="row">
            <div class="col m2 l3"></div>
            <div class="col s12 m8 l6">

              <div id="box">
                <input class="col s8" type="text" placeholder="Ketik nama,minimum 3 karakter..." >
                <a class="col s1"></a>
                <a class="center button-small waves-effect waves-light btn green col s3">Cari</a>
                <br /><br />
                <p>Silahkan masukkan nama santri</p>
              </div>

            </div>
            <div class="col m2 l3"></div>
          </div>

        </div>
        <div class="center col s12"> 
          <br /><br />
          <TextDescriptionComponent />
        </div>
      </div>
    </div>
  </div>
</template>

<script>


import HeaderComponent from '../components/HeaderComponent.vue'
import TextDescriptionComponent from '../components/TextDescriptionComponent.vue'

export default {
  name: 'Home',
  components: {
    HeaderComponent,
    TextDescriptionComponent
  },
  created(){
    this.loadSession()
  },
  methods : {
    loadSession(){
      if (localStorage.getItem('mbs_session')) {
          this.$router.push({name: "Dashboard"})
      }
    },
  }
}
</script>

<style scoped>
#box {
  padding: 15px;
  border: 1px solid orange;
}
</style>
