<template>
  <div class="dashboard">
    <HeaderComponent />
    <br /><br /><br />
    <div class="container">
      <div class="row">
        <div class="center col s12">
            <img class="responsive-img" width=200 height=200 src="../assets/smk.png" />
        </div>
        <div class="center col s12"> 
          <br /><br />
          <h6>Assalamu'alaikum....</h6>
          <h6>Bapak/ibu/wali siswa ananda : </h6>
          <h5> <b>{{ student.first_name.toUpperCase() + ' ' + student.last_name.toUpperCase() }}</b> </h5>
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
            id : ''
        },
        student : {
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
      this.getStudentDetail()
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

        // force page to refresh
        if (localStorage.getItem('hass_login') && navigator.onLine){
            localStorage.removeItem('hass_login')
            window.location.reload()
          } else {
            localStorage.setItem('hass_login','ok')
          }

        },
        getStudentDetail(){

            this.$apollo.query({
                query : require('../graphql/studentDetail.gql'),
                variables : {
                    id : ""
                }
                }).then(result => {

                    this.student = result.data.student_detail
                   
                }).catch(error => {
                    
                    console.log(error)
                })
        },
        logout(){
            if (localStorage.getItem('mbs_session')) {
                localStorage.removeItem('mbs_session')
            }
            if (localStorage.getItem('status_install')) {
                localStorage.removeItem('status_install')
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
                  this.$router.push({name: "Login"})
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
