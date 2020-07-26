<template>
  <div class="report">
    <HeaderComponent />
    <br /><br />
    <div class="container">
      <div class="row">
        <div class="col s12">
            <h5><b>Laporan Tagihan Per Siswa </b></h5>
            <br /><br />
            
            <table class="highlight striped">
              <tbody>
              <tr>
                  <td>NIS</td>
                  <td> {{ student.nis }} </td>
              </tr>
              <tr>
                  <td>Nama</td>
                  <td> {{ student.first_name  + ' ' + student.last_name  }} </td>
              </tr>
              <tr>
                  <td>Kelas</td>
                  <td> - </td>
              </tr>
              <tr>
                  <td>Unit</td>
                  <td> - </td>
              </tr>
              </tbody>
            </table>

        </div>
        <div class="col s12"> 
          <br /><br />
          <p class="center" v-show="bills.length == 0">- Kosong -</p>
            <table class="highlight striped" v-show="bills.length > 0">
              <thead>
                <tr>
                  <td><b>No</b></td>
                  <td><b>Jenis</b></td>
                  <td><b>Total</b></td>
                  <td><b>Keterangan</b></td>
                  <td><b>Status</b></td>
                </tr>
              </thead>
              <tbody>
              <tr v-for="(bill, index) in bills" :key="bill.id">
                  <td> {{ index + 1 }} </td>
                  <td> {{ bill.name }} </td>
                  <td> Rp {{ bill.amount }} </td>
                  <td> {{ bill.detail }} </td>
                  <td> {{ bill.bill_status == 2 ? 'Lunas' : bill.bill_status == 1 ? 'Menunggu' : 'Belum Lunas' }} </td>
              </tr>
              </tbody>
          </table>

        </div>
        <div class="col s12"> 
            <h5><b> History Pembayaran </b></h5>
            <br /><br />
            <p class="center" v-show="transactions.length == 0">- Kosong -</p>
            <table class="highlight striped" v-show="transactions.length > 0">
              <thead>
                <tr>
                  <td><b>Tgl</b></td>
                  <td><b>Total</b></td>
                  <td><b>Keterangan</b></td>
                  <td><b>Detail</b></td>
                </tr>
              </thead>
              <tbody>
              <tr v-for="transaction in transactions" :key="transaction.id">
                  <td> {{ transaction.payment_time ? transaction.payment_time : '-' }} </td>
                  <td> Rp {{ transaction.amount }} </td>
                  <td> {{ transaction.payment_status == 0 ? "Sukses" :  transaction.payment_status == 1 ? "Menunggu" : "Gagal"}} </td>
                  <td> <a v-on:click="openModal(transaction)">Detail</a> </td>
              </tr>
              </tbody>
          </table>

        </div>
        <div class="center col s12"> 
          <br /><br />
            <router-link to="/dashboard" id="button-menu" class="center button-small waves-effect waves-light btn blue lighten-2">Kembali</router-link>
        </div>
        <div class="center col s12"> 
          <br /><br />
          <TextDescriptionComponent />
        </div>
      </div>
    </div>

    <LoadingComponent ref="loading_view" />
    <div id="detail-transaction" class="modal">
      <div class="modal-content">
        <h4>Detail Transaksi</h4>
        <div class="row">
        <div class="col s4">Tgl</div><div class="col s8"> : {{  detail_transaction.payment_time ?  detail_transaction.payment_time : '-' }}</div>
        <div class="col s4">Total</div><div class="col s8"> : Rp {{ detail_transaction.amount }}</div>
        <div class="col s4">Keterangan</div><div class="col s8"> : {{ detail_transaction.payment_status == 0 ? "Sukses" :  detail_transaction.payment_status == 1 ? "Menunggu" : "Gagal"}}</div>
        <div class="col s4">Jenis</div><div class="col s8"> : {{ detail_transaction.payment_type == 0 ? 'Normal' : 'Over The Counter'}} </div>
        
        <div v-show="detail_transaction.payment_type == 1" class="center col s12">
          <div class="container">
            <div class="row">
              <div class="center col s12">
                <img class="responsive-img" width=200 height=200 :src="getLogo()" />
              </div>
              <div class="center col s12"> 
                <h6>Code Pembayaran</h6> 
                <h5><b>{{ otc.counter_code }}</b></h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <div class="modal-footer">
        <a href="#!" class="modal-close waves-effect waves-green btn-flat">Tutup</a>
      </div>
    </div>
  </div>
</template>

<script>


import HeaderComponent from '../components/HeaderComponent.vue'
import TextDescriptionComponent from '../components/TextDescriptionComponent.vue'
import LoadingComponent from '../components/util/LoadingComponent.vue'

export default {
  name: 'Report',
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
            nis : '',
            email : '',
            phone_number : ''
        },
        bills : [],
        query_bills : {
          show_actual_total : false,
          search_by:"name",
          search_value:"",
          order_by:"name",
          order_dir:"asc",
          offset:0,
          limit:10
        },
        transactions : [],
        query_transactions : {
          search_by:"approval_code",
          search_value:"",
          order_by:"create_at",
          order_dir:"asc",
          offset:0,
          limit:10
        },
        detail_transaction : {
          id : "",
          bill_id : "",
          student_id : "",
          amount : "",
          payment_status : 0,
          payment_id : "",
          payment_time : "",
          approval_code : "",
          payment_type : 0,
        },
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
      this.getStudentDetail()
      this.getListBill()
      this.getListTransaction()
      window.$('.modal').modal()
    },
    methods : {
        openModal(transaction){
          this.detail_transaction = transaction
          this.loadOtcData(transaction.id)
          window.$('#detail-transaction').modal('open')
        },
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

        },
        getListTransaction(){

          this.$refs.loading_view.show()

          this.$apollo.query({
              query : require('../graphql/listTransaction.gql'),
              variables : this.query_transactions
              }).then(result => {

                 this.transactions = result.data.transaction_list
                this.$refs.loading_view.close()
                  
              }).catch(error => {
                  
                console.log(error)
                this.$refs.loading_view.close()

              })
        },
        loadOtcData(transaction_id){

            this.$apollo.query({
              query : require('../graphql/otcDetailByTransactionId.gql'),
              variables : {
                  transaction_id : transaction_id
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
a {
  cursor: pointer;
}
</style>