<template>
    <div class="login">
        <HeaderComponent />
        <br /><br /><br />
        <div class="container">
            <br />
            <h5 class="center">Login Wali Siswa</h5>
            <div class="row">
                <div class="center col s1 m3 l4"></div>
                <div class="center col s10 m6 l4"> 
                    <form @submit.prevent="login">
                        <div class="input-field">
                            <label for="nis" class="black-text">Nis <span class="red-text">*</span></label>
                            <input id="nis" v-model="query.nis" type="text" required/>
                        </div>
                        <div class="input-field white-text">
                            <label for="password" class="black-text">Password <span class="red-text">*</span></label>
                            <input id="password" v-model="query.password" type="password" required/>
                        </div>
                        <button type="submit" id="download-button" class="btn-small waves-effect waves-light blue col s6">Login</button>
                    </form>
                </div>
                <div class="center col s1 m3 l4"></div>
            </div>
            <div class="row">
                <div class="center col s12"> 
                    <br /><br />
                    <TextDescriptionComponent />
                    <br /><br />
                </div>
            </div>
        </div>

        <ModalComponent ref="error_login" v-bind="{ title : 'Gagal Login', message : 'Nis atau password tidak sesuai!' }"/>
        <LoadingComponent ref="loading_view" />
    </div>
</template>

<script>

import HeaderComponent from '../components/HeaderComponent.vue'
import TextDescriptionComponent from '../components/TextDescriptionComponent.vue'
import ModalComponent from '../components/util/ModalMessageComponent.vue'
import LoadingComponent from '../components/util/LoadingComponent.vue'

export default {
    name : 'login',
    components: {
        HeaderComponent,
        TextDescriptionComponent,
        ModalComponent,
        LoadingComponent
    },
    data() {
        return {
            query : {
                nis : "",
                password : ""
            }
        }
    },
    methods : {
        saveSession(data){
            const parsed = JSON.stringify(data);
            localStorage.setItem('mbs_session', parsed);
        },
        login(){

            this.$refs.loading_view.show()
            
            this.$apollo.query({
                query : require('../graphql/login.gql'),
                variables : this.query 
                }).then(result => {

                    this.saveSession(result.data.student_login)
                    this.$refs.loading_view.close()

                    this.$router.push({name: "Dashboard"})
                    

                }).catch(error => {
                    
                    this.$refs.error_login.showModal()
                    this.$refs.loading_view.close()
                    console.log(error)
                })
        }
    }
}
</script>