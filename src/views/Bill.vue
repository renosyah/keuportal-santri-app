<template>
      <div class="bill">
    <HeaderComponent />
    <br /><br />
    <div class="container">
      <div class="row">
        <div class="col s12">
            <h6><b>Tagihan</b></h6>
            <div class="row">
              <div class="col s4">Nis</div><div class="col s8">: {{ student.nis }} </div><br />
              <div class="col s4">Nama</div><div class="col s8">:  {{ student.first_name +' '+student.last_name }}</div><br />
              <div class="col s4">Tahun Ajaran</div><div class="col s8">:  {{ '-' }}</div><br />
              <div class="col s4">Kelas</div><div class="col s8">:  {{ '-' }}</div><br />
              <div class="col s4">Bulan</div><div class="col s8">:  {{ '-' }}</div><br /><br />
              <p class="center" v-show="bills.length == 0">- Kosong -</p>
                <table class="highlight striped" v-show="bills.length > 0">
                  <thead>
                    <tr>
                      <td><b>No</b></td>
                      <td><b>Jenis</b></td>
                      <td><b>Total</b></td>
                      <td><b>Keterangan</b></td>
                      <td><b>Status</b></td>
                      <td><b>Aksi</b></td>
                    </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(bill, index) in bills" :key="bill.id">
                      <td> {{ index + 1 }} </td>
                      <td> {{ bill.name }} </td>
                      <td> Rp {{ bill.amount }} </td>
                      <td> {{ bill.detail }} </td>
                      <td> {{ bill.bill_status == 2 ? 'Lunas' : bill.bill_status == 1 ? 'Menunggu' : 'Belum Lunas' }} </td>
                      <td> <a v-on:click="openPaymentDialog(bill.id)" :disabled="bill.bill_status == 2" class="center button-small waves-effect waves-light btn blue lighten-2">Bayar</a> </td>
                  </tr>
                  </tbody>
              </table>

              
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
          <router-link to="/dashboard" id="button-menu" class="center button-small waves-effect waves-light btn blue">Kembali</router-link> 
          <a id="button-menu" class="center button-small waves-effect waves-light btn blue disabled">Cara Pembayaran SPP</a> 
        </div>
        <div class="center col s12"> 
          <br /><br />
          <TextDescriptionComponent />
        </div>
      </div>
    </div>
    <ModalListComponent ref="select_payment"
    v-on:on-item-choosed="pay"
        v-bind="{
          'title' : 'Pilih metode pembayaran',
          'items' : [{
            'id' : '1',
            'type':'normal',
            'name' : 'Transfer bank, cc dll'
          },
          {
            'id' : '2',
            'type':'cstore',
            'name' : 'Indomaret'
          },
          {
            'id' : '3',
            'type':'cstore',
            'name' : 'alfamart'
          }]
          }"
     />
    <LoadingComponent ref="loading_view" />
  </div>
</template>

<script>

import HeaderComponent from '../components/HeaderComponent.vue'
import TextDescriptionComponent from '../components/TextDescriptionComponent.vue'
import LoadingComponent from '../components/util/LoadingComponent.vue'
import ModalListComponent from '../components/util/ModalListComponent.vue'

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
    LoadingComponent,
    ModalListComponent
  },
  data(){
    return {
      payment_gateway : "midtrans",
      session : {
          id : ''
      },
      student : {
          id : '',
          first_name : '',
          last_name : '',
          nis : '',
          email : '',
          phone_number : ''
      },
      bills : [],
      query_bills : {
        search_by:"name",
        search_value:"",
        order_by:"name",
        order_dir:"asc",
        offset:0,
        limit:10
      },
      bill_to_pay : {
        id : ""
      }
    }
  },
  created(){
    this.loadSession()
  },
  mounted(){
    this.getStudentDetail()
    this.getListBill()

  },
  methods : {

    pay(choice){
      if (choice.type == "normal"){
        this.normalPayment()
      } else if (choice.type == "cstore"){
        this.otcPayment(choice.name)
      }
    },
    openPaymentDialog(bill_id){
      this.bill_to_pay.id = bill_id
      this.$refs.select_payment.showModal()
    },
    otcPayment(counterName){

      this.$apollo.mutate({
            mutation : require('../graphql/createOtcTransaction.gql'),
            variables : {
              student_id : "",
              bill_id : this.bill_to_pay.id,
              cstore : counterName
            }
            }).then(result => {

              let payload = {
                'transaction_id' : result.data.payment_cstore_transaction_create.order_id
              }
              
              this.$router.push({name: "Cstore",query : payload })
 
                
            }).catch(error => {
                
                console.log(error)
                this.$refs.loading_view.close()
            })
    },
    normalPayment(){

      this.$apollo.mutate({
            mutation : require('../graphql/createTransaction.gql'),
            variables : {
              student_id : "",
              bill_id : this.bill_to_pay.id,
              use : this.payment_gateway
            }
            }).then(result => {

              console.log(result)
              this.$refs.loading_view.close()
              if (this.payment_gateway == "midtrans"){
                this.openSnap(result.data.payment_transaction_create.snap_token)
              } else if (this.payment_gateway == "ipaymu"){
                window.location.href = result.data.payment_transaction_create.redirect_url
              }   
                
            }).catch(error => {
                
                console.log(error)
                this.$refs.loading_view.close()
            })
    },
    openSnap(snap_token){

      if (window.snap && navigator.onLine){

        let updateTransaction = this.updateTransaction

        window.snap.pay(snap_token, {
          onSuccess: function(result){

            updateTransaction(
              result.order_id,
              result.gross_amount,
              0,
              result.transaction_id,
              result.transaction_time,
              result.approval_code
            )
          },

          onPending: function(result){

            updateTransaction(
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

        if (this.payment_gateway == "midtrans"){
          
          this.$refs.loading_view.show()

          this.$apollo.query({
              query : require('../graphql/paymentGatewayKey.gql'),
              variables : {
                student_id : ""
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

                  this.$refs.loading_view.close()
                  
              }).catch(error => {
                  
                  console.log(error)
                  this.$refs.loading_view.close()
              })

          }

    },
    loadSession(){
      if (localStorage.getItem('mbs_session')) {
          try {
              this.session = JSON.parse(localStorage.getItem('mbs_session'));
          } catch(e) {
              console.log(e)
          }
      }

      // force page to refresh
      if (localStorage.getItem('hass_pay') && navigator.onLine){
        localStorage.removeItem('hass_pay')
        window.location.reload()
      } else {
        localStorage.setItem('hass_pay','ok')
      }


    },
    updateTransaction(payment_order_id,amountPayed,payment_status,payment_id,payment_time,approval_code){

      let transaction = {
          id : payment_order_id,
          student_id : this.student.id,
          bill_id : this.bill.id,
          amount : amountPayed,
          payment_status : payment_status,
          payment_id : payment_id,
          payment_time : payment_time,
          approval_code : approval_code,
          payment_order_id : payment_order_id
      }

      this.$apollo.mutate({
            mutation : require('../graphql/updateTransaction.gql'),
            variables : transaction
            }).then(result => {

                this.$router.push({name: "Dashboard"})
                console.log(result)
                
            }).catch(error => {
                
                console.log(error)
                
            })
    },
    getStudentDetail(){

        this.$refs.loading_view.show()

        this.$apollo.query({
            query : require('../graphql/studentDetail.gql'),
            variables : {
                id : ""
            }
            }).then(result => {

                this.student = result.data.student_detail
                this.$refs.loading_view.close()
                
            }).catch(error => {
                
                console.log(error)
                this.$refs.loading_view.close()
            })
    },
    getListBill(){

    this.$refs.loading_view.show()

    this.$apollo.query({
        query : require('../graphql/listBill.gql'),
        variables : this.query_bills
        }).then(result => {

            this.bills = result.data.bill_list
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