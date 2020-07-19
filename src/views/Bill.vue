<template>
      <div class="bill">
    <HeaderComponent />
    <br /><br />
    <div class="container">
      <div class="row">
        <div class="col s12">
            <h6><b>Tagihan</b></h6>
            <div class="row">
              <div class="col s4">Nis</div><div class="col s8">: {{ bill.id ? santri.nis : '' }} </div><br />
              <div class="col s4">Nama</div><div class="col s8">:  {{ bill.id ? santri.first_name +' '+santri.last_name : '' }}</div><br />
              <div class="col s4">Tahun Ajaran</div><div class="col s8">:  {{ bill.id ? '-' : '' }}</div><br />
              <div class="col s4">Kelas</div><div class="col s8">:  {{ bill.id ? '-' : '' }}</div><br />
              <div class="col s4">Bulan</div><div class="col s8">:  {{ bill.id ? '-' : '' }}</div><br /><br />
              <div class="col s3"> </div>
              <div class="center col s6 blue lighten-4"><h6><b>Total Tagihan : {{ bill.amount ? bill.amount : '' }}</b></h6></div>
              <div class="col s3"> </div>
              <br /><br /><br />
              <div class="col s4">Status</div><div class="col s8">:  <span v-bind:class="{ 'green-text': !bill.id ,'red-text': bill.id }"><b>{{ bill.id ? 'ADA TAGIHAN' : 'TIDAK ADA TAGIHAN' }}</b></span></div><br /><br />
              
              <div class="col s4"> </div>
              <div class="center col s4">
                <a v-on:click="pay"  v-show="bill.id" id="button-menu" class="button-small waves-effect waves-light btn green col s12">Bayar</a> 
              </div>
              <div class="col s4"> </div>
            </div>
        </div>
        <div class="col s12"> 
            <div class="card-panel orange lighten-4">
              <span class="grey-text">
                  <p>
                    * Lakukan pembayaran sesuai nominal tagihan (jangan dilebihkan jangan dikurangi)
                  </p>
                  <p>
                    * Jika melakukan pembayaran lebih segera hubungi bagian keuangan
                  </p>
              </span>
          </div>
          <router-link to="/dashboard" id="button-menu" class="center button-small waves-effect waves-light btn blue lighten-2">Kembali</router-link> 
          <a id="button-menu" class="center button-small waves-effect waves-light btn blue">Cara Pembayaran SPP</a> 
        </div>
        <div class="center col s12"> 
          <br /><br />
          <TextDescriptionComponent />
        </div>
      </div>
    </div>

    <LoadingComponent ref="loading_view" />
  </div>
</template>

<script>

import HeaderComponent from '../components/HeaderComponent.vue'
import TextDescriptionComponent from '../components/TextDescriptionComponent.vue'
import LoadingComponent from '../components/util/LoadingComponent.vue'

export default {
  name : 'bill',
  components: {
    HeaderComponent,
    TextDescriptionComponent,
    LoadingComponent
  },
  data(){
    return {
      session : {
          id : '',
          santri_id : ''
      },
      santri : {
          id : '',
          first_name : '',
          last_name : '',
          nis : '',
          email : '',
          phone_number : ''
      },
      query : {
        santri_id : "",
        search_by:"name",
        search_value:"",
        order_by:"create_at",
        order_dir:"desc",
        offset:0,
        limit:1
      },
      bill : 	{
        id : '',
        santri_id : '',
        name : '',
        detail : '',
        amount : '',
        due_date : '',
        bill_status : 0
      }
    }
  },
  created(){
    this.loadSession()
  },
  mounted(){
      this.getSantriDetail()
      this.getOneBill()
  },
  methods : {

    pay(){

    },
    loadSession(){
      if (localStorage.getItem('mbs_session')) {
          try {
              this.session = JSON.parse(localStorage.getItem('mbs_session'));
          } catch(e) {
              console.log(e)
          }
      }
    },
    getSantriDetail(){

        this.santri.id = this.session.santri_id
         this.$refs.loading_view.show()

        this.$apollo.query({
            query : require('../graphql/santriDetail.gql'),
            variables : {
                id : this.santri.id
            }
            }).then(result => {

                this.santri = result.data.santri_detail
                this.$refs.loading_view.close()
                
            }).catch(error => {
                
                console.log(error)
                this.$refs.loading_view.close()
            })
    },
    getOneBill(){

      this.query.santri_id = this.session.santri_id
       this.$refs.loading_view.show()

      this.$apollo.query({
              query : require('../graphql/listBill.gql'),
              variables : this.query
              }).then(result => {

              let bill_holder = {}
              if (result.data.bill_list){
                  result.data.bill_list.forEach(function(item){
                    bill_holder.id = item.id
                    bill_holder.santri_id = item.santri_id
                    bill_holder.name = item.name
                    bill_holder.detail = item.detail
                    bill_holder.amount = item.amount
                    bill_holder.due_date = item.due_date
                    bill_holder.bill_status = item.bill_status
                  })
              }
              this.bill = bill_holder
              this.$refs.loading_view.close()
                  
              }).catch(error => {
                  
                  console.log(error)
                  this.$refs.loading_view.close()
              })
    }
  }
}
</script>

<style scoped>
#button-menu{
  text-transform: none;
  font-size: 12px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>