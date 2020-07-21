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
                </tr>
              </thead>
              <tbody>
              <tr v-for="(bill, index) in bills" :key="bill.id">
                  <td> {{ index + 1 }} </td>
                  <td> {{ bill.name }} </td>
                  <td> Rp {{ bill.amount }} </td>
                  <td> {{ bill.detail }} </td>
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
                  <td><b>Tgl Bayar</b></td>
                  <td><b>Total</b></td>
                  <td><b>Keterangan</b></td>
                </tr>
              </thead>
              <tbody>
              <tr v-for="transaction in transactions" :key="transaction.id">
                  <td> {{ transaction.payment_time ? transaction.payment_time : '-' }} </td>
                  <td> Rp {{ transaction.amount }} </td>
                  <td> {{ transaction.payment_status == 0 ? "Sukses" :  transaction.payment_status == 1 ? "Menunggu" : "Gagal"}} </td>
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
        }
    }   
}
</script>

