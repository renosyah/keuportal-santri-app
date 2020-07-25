<template>
  <div class="cstore">
    <HeaderComponent />
    <br /><br /><br />
    <div class="container">
      <div class="row">
        <div class="center col s12">
           <img class="responsive-img" width=200 height=200 :src="getLogo()" />
        </div>
        <div class="center col s12"> 
          <br /><br />
          <h5>Code Pembayaran</h5><br />
          <h4><b>{{ otc.counter_code }}</b></h4>
         </div>
        <div class="center col s12">  
          <br /><br /> 
          <router-link to="/report" class="waves-effect waves-light btn blue">History Transaksi</router-link>  
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
  name: 'Cstore',
  components: {
    HeaderComponent,
    TextDescriptionComponent
  },
  data() {
    return {
      otc :{
            id : "",
            transaction_id : "",
            counter_code : "",
            counter_name : "",
            expired : ""
      }
    }
  },
  created(){
    this.loadSession()
  },
  mounted(){
    this.loadOtcData()
  },
  methods : {
    loadSession(){
      if (!localStorage.getItem('mbs_session')) {
          this.$router.push({name: "Home"})
      }
    },
    loadOtcData(){

       this.$apollo.query({
          query : require('../graphql/otcDetailByTransactionId.gql'),
          variables : {
              transaction_id : this.$route.query.transaction_id
          }
          }).then(result => {

              this.otc = result.data.otc_detail_by_transaction_id
              this.$refs.loading_view.close()
              
          }).catch(error => {
              
              console.log(error)

          })
          
    },
    getLogo(){
      return this.otc.counter_name == "Indomaret" ? 
      "https://upload.wikimedia.org/wikipedia/id/2/28/Indomaret.png" :
       this.otc.counter_name == "alfamart" ?
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/ALFAMART_LOGO_BARU.png/1200px-ALFAMART_LOGO_BARU.png"
         : ""
    }
  }
}
</script>

<style scoped>

</style>
