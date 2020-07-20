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


// // status transaction
// const FLAG_TRANSACTION_SUCCESS = 0
// const FLAG_TRANSACTION_PENDING = 1
// const FLAG_TRANSACTION_FAILED = 2
// const FLAG_TRANSACTION_UNKNOWN = 3

// // status bill
// const FLAG_BILL_UNPAY = 0
// const FLAG_BILL_NOT_ENOUGH = 1
// const FLAG_BILL_PAYED = 2 
// const FLAG_BILL_UNKNOWN = 3

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
      this.getOneUnpayBill()
      this.prepareMidtransLibrary()
  },
  methods : {

    pay(){

      this.$apollo.mutate({
            mutation : require('../graphql/createTransaction.gql'),
            variables : {
              santri_id : this.santri.id,
              bill_id : this.bill.id
            }
            }).then(result => {

                this.openSnap(result.data.payment_transaction_create.snap_token)
                this.$refs.loading_view.close()
                
            }).catch(error => {
                
                console.log(error)
                this.$refs.loading_view.close()
            })

    },
    openSnap(snap_token){

      if (window.snap){

        let addTransaction = this.addTransaction

        window.snap.pay(snap_token, {
          onSuccess: function(result){

            addTransaction(
              result.order_id,
              result.gross_amount,
              0,
              result.transaction_id,
              result.transaction_time,
              result.approval_code
            )
          },

          onPending: function(result){

            addTransaction(
              result.order_id,
              result.gross_amount,
              1,
              result.transaction_id,
              result.transaction_time,
              result.approval_code
            )
            
            console.log(result) 
          },
          // Optional
          onError: function(result){

            // send result transaction to BE
            console.log(result)
          }
        });
      }

    },
    prepareMidtransLibrary(){
        
        this.santri.id = this.session.santri_id
        this.$refs.loading_view.show()

        this.$apollo.query({
            query : require('../graphql/paymentGatewayKey.gql'),
            variables : {
              santri_id : this.santri.id
            }
            }).then(result => {

                // midtrans JS
                const plugin = document.createElement("script");
                plugin.setAttribute(
                  "src",
                  "https://app.sandbox.midtrans.com/snap/snap.js"
                );
                plugin.setAttribute(
                  "data-client-key",
                  result.data.payment_gateway_key_detail.client_key || process.env.MIDTRANS_CLIENT_KEY
                );
                plugin.async = true;
                document.head.appendChild(plugin);
                
            }).catch(error => {
                
                console.log(error)
                this.$refs.loading_view.close()
            })

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
    addTransaction(payment_order_id,amountPayed,payment_status,payment_id,payment_time,approval_code){

      let transaction = {
            bill_id : this.bill.id,
            amount : amountPayed,
            payment_status : payment_status,
            payment_id : payment_id,
            payment_time : payment_time,
            approval_code : approval_code,
            payment_order_id : payment_order_id
      }

      this.$apollo.mutate({
            mutation : require('../graphql/addTransaction.gql'),
            variables : transaction
            }).then(result => {

                this.$router.push({name: "Dashboard"})
                console.log(result)
                
            }).catch(error => {
                
                console.log(error)
                
            })
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
    getOneUnpayBill(){

      this.$refs.loading_view.show()

      this.$apollo.query({
              query : require('../graphql/unpayBill.gql'),
              variables : {
                santri_id : this.santri.id
              }
              }).then(result => {

              this.bill = result.data.unpay_bill_detail
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