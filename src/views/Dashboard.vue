<template>
  <div class="dashboard">
    <HeaderComponent />
    <br /><br /><br />
    <div class="container">
      <div class="row">
        <div class="center col s12">
            <img class="responsive-img" width=200 height=200 src="../assets/mbs.png" />
        </div>
        <div class="center col s12"> 
          <br /><br />
          <h6>Assalamu'alaikum....</h6>
          <h6>Bapak/ibu/wali santri ananda : </h6>
          <h5> <b>{{ santri.first_name.toUpperCase() + ' ' + santri.last_name.toUpperCase() }}</b> </h5>
        </div>
        <div class="col s12">  
          <br /><br /> 
          <div class="row">
            <div class="col m2 l3"></div>
            <div class="center col s12 m8 l6">

              <router-link to="/bill" id="button-menu" class="center button-small waves-effect waves-light btn blue">Tagihan Spp</router-link> 
              <a id="button-menu" class="center button-small waves-effect waves-light btn blue disabled">Uang Saku</a> 
              <router-link to="/report" id="button-menu" class="center button-small waves-effect waves-light btn blue">History Pembayaran</router-link> 
              <a v-on:click="logout" id="button-menu" class="center button-small waves-effect waves-light btn red">Logout</a> 

            </div>
            <div class="col m2 l3"></div>
          </div>
        </div>
        <div class="center col s12"> 
          <br />
          <a href="#">[Unduh petunjuk pembayaran]</a>
          <br />
          <TextDescriptionComponent />
        </div>
      </div>
    </div>
    <LoadingComponent ref="loading_view" />
  </div>
</template>
<script>

import LoadingComponent from '../components/util/LoadingComponent.vue'
import HeaderComponent from '../components/HeaderComponent.vue'
import TextDescriptionComponent from '../components/TextDescriptionComponent.vue'

export default {
  name: 'Dashboard',
  components: {
    HeaderComponent,
    TextDescriptionComponent,
    LoadingComponent
  },
  data() {
      return {
        session : {
            id : '',
            santri_id : ''
        },
        santri : {
            id : '',
            first_name : '',
            last_name : '',
        }
      }
    },
    created(){
      this.loadSession()
    },
    mounted(){
      this.getSantriDetail()
    },
    methods : {
        loadSession(){
            if (localStorage.getItem('mbs_session')) {
                try {
                   this.session = JSON.parse(localStorage.getItem('mbs_session'));
                } catch(e) {
                    console.log(e)
                }
            } else {
              this.$router.push({name: "Home"})
            }
        },
        getSantriDetail(){

            this.santri.id = this.session.santri_id
            
            this.$apollo.query({
                query : require('../graphql/santriDetail.gql'),
                variables : {
                    id : this.santri.id
                }
                }).then(result => {

                    this.santri = result.data.santri_detail
                   
                }).catch(error => {
                    
                    console.log(error)
                })
        },
        logout(){
            if (localStorage.getItem('mbs_session')) {
                localStorage.removeItem('mbs_session')
            }      
             
            this.$refs.loading_view.show()
            
            this.$apollo.mutate({
                mutation : require('../graphql/deleteSession.gql'),
                variables : {
                    id : this.session.id
                }
                }).then(result => {

                  console.log(result)
                  this.$refs.loading_view.close()
                  this.$router.push({name: "Login"})

                }).catch(error => {
                    
                  this.$refs.loading_view.close()
                  console.log(error)

                })   
        }
    }   
}
</script>

<style scoped>
#box {
  padding: 15px;
  border: 1px solid orange;
}

#button-menu{
  text-transform: none;
  font-size: 14px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
