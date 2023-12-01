 <template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Manage Subscription & Invoices</h2>
    </CCol>
  </CRow>

  <CRow class="mb-4">
  	<CCol :xs="12">
  		<CCard>
  			<CCardHeader>
  				<span class="h4">Your subscription</span>
  				<!-- <CButton class="me-1 float-end" color="primary" size="sm">
		        <CIcon icon="cil-list-high-priority" /> Change subscription
		      </CButton> -->
  			</CCardHeader>
  			<CCardBody v-if="this.vendor_info">
  				<CRow class="mb-4">
  					<CCol :xs="12" :md="3">
  						<p class="text-medium-emphasis mb-0">Package</p>
  						<span class="h4">{{this.vendor_info.billing.billPackage}}</span>
  					</CCol>
  					<CCol :xs="12" :md="3">
  						<p class="text-medium-emphasis mb-0">Model</p>
  						<span class="h4">{{this.vendor_info.billing.model}}</span>
  					</CCol>
  					<CCol :xs="12" :md="3">
  						<p class="text-medium-emphasis mb-0">Frequency</p>
  						<span class="h4">{{this.vendor_info.billing.frequency}}</span>
  					</CCol>
  					<CCol :xs="12" :md="3">
  						<p class="text-medium-emphasis mb-0">Price</p>
  						<span class="h4">KWD {{this.vendor_info.billing.categoryPrice}}</span>
  					</CCol>
  				</CRow>
  				<CRow>
  					<CCol :xs="12" :md="6">
  						<span class="h6">Covered services:</span>
  						<p class="text-medium-emphasis mb-2">
  							<ul>
  								<li v-for="service in this.subscription_features[this.vendor_info.billing.billPackage].services">{{service}}</li>
  							</ul>
  						</p>
  					</CCol>
  				</CRow>
  			</CCardBody>
  		</CCard>
  	</CCol>
  </CRow>

  <!-- unpaid invoices -->
  <CRow class="mb-2" v-if="this.unPaidBills.length > 0">
  	<CCol :xs="12">
  		<CCard class="border-top-5 border-top-warning border-bottom-warning border-bottom-1 mb-3">
		    <CCardHeader>
		    	<span class="h4">{{this.unPaidBills.length}} Unpaid invoices</span>
		    </CCardHeader>
		    <CCardBody>
		      <CRow>
		      	<CCol :xs="3" v-for="(unpaid, counter) in this.unPaidBills">
		      		<CCard class="mb-3" style="border: 1px solid #f0f4f7;">
						    <CCardBody>
						      <CWidgetStatsB 
						      	class="mb-3" 
						      	:progress="{ color: 'warning', value: 100}"
							      :title="'Invoice date :' + unpaid.createddate"
							      :value="'KWD ' + unpaid.billTotal.total"
							   	/>
							   	<CButton color="primary" size="sm" class="ms-2 me-2" @click="this.showBillDetailsModal(unpaid)">Make Payment</CButton>
						    </CCardBody>
						  </CCard>
		      	</CCol>
		      </CRow>
		    </CCardBody>
		  </CCard>
  	</CCol>
  </CRow>

  <!-- paid invoices -->
  <CRow class="mb-2" v-if="this.paidBills.length > 0">
  	<CCol :xs="12">
  		<CCard class="border-top-5 border-top-success border-bottom-success border-bottom-1 mb-3">
		    <CCardHeader>
		    	<span class="h4">{{this.paidBills.length}} Paid invoices</span>
		    </CCardHeader>
		    <CCardBody>
		      <CRow>
		      	<CCol :xs="3" v-for="(paid, counter) in this.paidBills">
		      		<CCard class="mb-3" style="border: 1px solid #f0f4f7;">
						    <CCardBody>
						      <CWidgetStatsB 
						      	class="mb-3" 
						      	:progress="{ color: 'success', value: 100}"
							      :title="'Invoice date :' + paid.createddate"
							      :value="'KWD ' + paid.billTotal.total"
							   	/>
							   	<CButton color="secondary" size="sm" class="ms-2 me-2" @click="this.showBillDetailsModal(paid)">
				            <CIcon icon="cil-info" />&nbsp;&nbsp;Details
				          </CButton>
						    </CCardBody>
						  </CCard>
		      	</CCol>
		      </CRow>
		    </CCardBody>
		  </CCard>
  	</CCol>
  </CRow>

  <CModal alignment="center" scrollable size="xl" backdrop="static" :visible="viewBillDetailsModal" @close="this.closeBillDetailsModal()">

    <CModalHeader dismiss @close="this.closeBillDetailsModal()">
      <CModalTitle>
      	Invoice for <strong>{{this.selectedBillDetails.year * 100 + this.selectedBillDetails.month}}</strong>
      </CModalTitle>
    </CModalHeader>

    <CModalBody>
    	<CRow class="mb-4">
        <CCol :sm="4">
          <h6 class="mb-3">From:</h6>
          <div>
            <strong>ConnectCo</strong>
          </div>
          <div>Amghara Industrial Area</div>
          <div>Amghara, Jahra, Kuwait, 13085</div>
          <div>Email: contact@connectco.me</div>
        </CCol>
        <CCol :sm="4">
          <h6 class="mb-3">To:</h6>
          <div>
            <strong>{{this.selectedBillDetails.vendorId.payload.name}}</strong>
          </div>
          <div>{{this.selectedBillDetails.billTo.address}}</div>
          <div>{{this.selectedBillDetails.billTo.city}}, {{this.selectedBillDetails.billTo.state}}</div>
          <div>{{this.selectedBillDetails.billTo.country}}, {{this.selectedBillDetails.billTo.zip}}</div>
          <div>Email: {{this.selectedBillDetails.billTo.email}}</div>
          <div>Phone: {{this.selectedBillDetails.billTo.phone}}</div>
        </CCol>
        <CCol :sm="4">
          <h6 class="mb-3">Details:</h6>
          <div>Invoice # <strong>{{this.selectedBillDetails.year * 100 + this.selectedBillDetails.month}}-{{this.selectedBillDetails.id}}</strong></div>
          <div>Date: <strong>{{this.selectedBillDetails.createddate}} {{this.selectedBillDetails.createdtime}}</strong></div>
          
        </CCol>
      </CRow>
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell class="text-center">#</CTableHeaderCell>
            <CTableHeaderCell>Item</CTableHeaderCell>
            <CTableHeaderCell>Description</CTableHeaderCell>
            <CTableHeaderCell class="text-center">Quantity</CTableHeaderCell>
            <CTableHeaderCell class="text-end">Unit Cost</CTableHeaderCell>
            <CTableHeaderCell class="text-end">Discount</CTableHeaderCell>
            <CTableHeaderCell class="text-end">Total</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow v-for="(line_item, counter) in this.selectedBillDetails.lineItems">
            <CTableDataCell class="text-center">{{counter+1}}</CTableDataCell>
            <CTableDataCell class="text-start">Warehouse and Fulfillment services subscription</CTableDataCell>
            <CTableDataCell class="text-start"
              >{{line_item.item}}</CTableDataCell
            >
            <CTableDataCell class="text-center">{{line_item.quantity}}</CTableDataCell>
            <CTableDataCell class="text-end">KWD {{line_item.price}}</CTableDataCell>
            <CTableDataCell class="text-end">KWD {{line_item.discount}}</CTableDataCell>
            <CTableDataCell class="text-end">KWD {{line_item.totalPrice}}</CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
      
      <CRow class="mt-4 mb-3">
        <CCol lg="{4}" sm="{5}" class="ms-auto">
          <CTable striped>
            <CTableBody>
              <CTableRow>
                <CTableDataCell class="text-start">
                  <strong>Total</strong>
                </CTableDataCell>
                <CTableDataCell class="text-end">
                  <strong>KWD {{this.selectedBillDetails.billTotal.total}}</strong>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>

      <CRow class="mb-4" v-if="this.needPayment == true & this.showPaymentOptions == false & this.paymentStarted == false">
      	<CCol :xs="3">
      		<CButton color="success" @click="this.initiateTransaction()" >
            Pay KWD {{this.selectedBillDetails.billTotal.total}} Now
          </CButton>
      	</CCol>
      </CRow>

	    <CRow class="mb-4" v-if="this.showPaymentOptions == true & this.paymentStarted == false">
	    	<CCol :xs="12">
	    		<h5>Choose Payment mode</h5>
	    	</CCol>
	    	<CCol :xs="6">
	    		<CFormSelect v-model="this.selectedPaymentMethod" v-on:input="choosePaymentMode($event)" required>
	          <option value="">Choose payment mode</option>
	          <option v-for="item in this.paymentModes" :value="item.PaymentMethodId">{{item.PaymentMethodEn}}</option>
	        </CFormSelect>
	    	</CCol>
	    	<CCol :xs="6" v-if="this.selectedPaymentMethod != null">
	    		<CButton color="success" @click="this.executeTransaction()" >
	          <CIcon icon="cil-arrow-right" /> Proceed to Payment Gateway
	        </CButton>
	    	</CCol>
	    </CRow>

	    <CRow class="mb-4" v-if="this.paymentStarted == true">
	    	<CCol :xs="12">
	    		<CAlert color="info">
	    			<strong>The payment page is opening in new window. Please enter your payment details.</strong>
	    			<br><br>
	    			Use close button window to close this and refresh payment status
	    			<br><br>
	    			<strong>It may take-up to 1 day for payment status to reflect</strong>
	    		</CAlert>
	    	</CCol>
	    </CRow>

      <CRow v-if="this.transactionLogData.length > 0">
      	<CCol :xs="12">
      		<hr>
      		<span class="h5">Transaction history</span>
      	</CCol>
      	<CCol :xs="12">
      		<CTable>
      			<CTableHead>
		          <CTableRow>
		            <CTableHeaderCell>Transaction Id</CTableHeaderCell>
		            <CTableHeaderCell>Status</CTableHeaderCell>
		          </CTableRow>
		        </CTableHead>
		        <CTableBody>
            	<CTableRow v-for="t in this.transactionLogData">
            		<CTableDataCell>{{t.transactionId}}</CTableDataCell>
            		<CTableDataCell>
            			<span class="h5">
	            			<CBadge :color=this.getTransactionLogStatus(t.status).color>
	            				{{this.getTransactionLogStatus(t.status).message}}
	            			</CBadge>
	            		</span>
            		</CTableDataCell>
            	</CTableRow>
            </CTableBody>
      		</CTable>
      	</CCol>
      </CRow>

	  </CModalBody>

    <CModalFooter>
      <CButton color="secondary" @click="this.closeBillDetailsModal()">Close</CButton>
    </CModalFooter>
  </CModal>

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'


export default {
  name: "Manage Subscriptions and Invoices",
  
  data: () => {
    return {

      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': vueCookies.get('accessToken')
      },

      //markers
      validatedCustom01: null,

      // models
      vendor_info: null,
      paidBills: [],
      unPaidBills: [],

      //Payment details

      	// selected bill
	      selectedBillIndex: null,
	      selectedBillDetails: null,

	      // transaction logs
	      transactionLogColumns: ["transactionId", "status"],
	      transactionLogData: [],
      
      	// payment
      	needPayment: false,
	      showPaymentOptions: false,
	      paymentModes: [],
	      selectedPaymentMethod: null,
	      internalTransactionId: null,
	      proceedPayment: false,
	      paymentStarted: false,

      // bill modal
      viewBillDetailsModal: false,

      //subscription features
      subscription_features: {
      	"STARTUP": {
      		services: [
      			'Upto 5 SKUs including variants', 
      			'Stock quantity-149 pc total quantity upto 1 cbm', 
      			'Unlimited next day delivery'
      		],
      	},
      	"BASIC": {
      		services: [
      			'Upto 10 SKUs including variants', 
      			'Stock quantity-299 pc total quantity upto 2 cbm', 
      			'Unlimited next day delivery'
      		],
      	},
      	"STANDARD": {
      		services: [
      			'Upto 25 SKUs including variants', 
      			'Stock quantity-499 pc total quantity upto 3 cbm', 
      			'Unlimited next day delivery'
      		],
      	},
      	"PRO": {
      		services: [
      			'Upto 50 SKUs including variants', 
      			'Stock quantity-999 pc total quantity upto 4 cbm', 
      			'Unlimited next day delivery'
      		],
      	},
      	"ELITE": {
      		services: [
      			'Upto 50 SKUs including variants', 
      			'Stock quantity-999 pc total quantity upto 4 cbm', 
      			'Unlimited next day delivery'
      		],
      	},
      	"PRIVELEDGE": {
      		services: [
      			'Unlimited SKUs', 
      			'Unlimited stock quantity upto 10 cbm', 
      			'Unlimited next day delivery',
      			'Special order packaging service'
      		],
      	},
      },
      
    }
  }, //end of Data

  methods: {

  	getVendorDetails() {

  		this.vendor_info = null
      this.paidBills = []
      this.unPaidBills = []

  		axios.post(this.APIHOST + '/infra/get-vendor-details/', {}, {
        headers: this.headers
      })
      .then(response => {
        console.log(response.data.response)
        this.vendor_info = response.data.response

        // call API to get all Invoices / Bills
        axios.get(this.APIHOST + '/infra/getAllBills/', {
	        params: {
	          page_seq: 1,
	          page_size: 1000,
	          vendorId: this.vendor_info.vendorId,
	        },
	        headers: this.headers,
	      })
	      .then(response => {
	        console.log(response.data.response)
	        let bills = response.data.response.payloads

	        for (let counter = 0; counter < bills.length; counter++) {
	        	if (bills[counter].status == 'APPROVE') {
	        		this.unPaidBills.push(bills[counter])
	        	} else if (bills[counter].status == 'PAID') {
	        		this.paidBills.push(bills[counter])
	        	}
	        }

	        console.log("Paid bills:")
	        console.log(this.paidBills)
	        console.log("Unpaid bills:")
	        console.log(this.unPaidBills)
	      })
	      .catch(error => {
	        alert(JSON.stringify(error.response.data.response))
	        console.log(error)
	      })


      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })

    },

    getTransactionsLogs() {
    	console.log("Getting the Transaction Logs");
    	let data = JSON.stringify({
			  "billId": this.selectedBillDetails.billId
			});
			// 	3be50a02-ffaa-44f5-8aee-2cadbedb353b
    	let config = {
			  method: 'post',
			  url: this.APIHOST + '/infra/getTransactionsForABill/',
			  headers: this.headers,
			  data : data
			};
			axios.request(config)
			.then((response) => {
				this.transactionLogData = response.data.response
			  console.log(this.transactionLogData)
          if (this.selectedBillDetails.status == "PAID") {
          	this.needPayment = false
          }
          else {
          	this.needPayment = true
          }
			})
			.catch((error) => {
			  console.log(error);
			});

    },

    initiateTransaction() {
    	console.log("Initiating Transaction");
    	let data = JSON.stringify({
			  "billId": this.selectedBillDetails.billId
			});
    	let config = {
			  method: 'post',
			  url: this.APIHOST + '/infra/initiatePayment/',
			  headers: this.headers,
			  data : data
			};
			axios.request(config)
			.then((response) => {
				this.internalTransactionId = response.data.response.internalTransactionId
				this.paymentModes = response.data.response.paymentMethods
				this.showPaymentOptions = true
			  console.log(this.transactionLogColumns);
			  console.log(this.transactionLogData);
			})
			.catch((error) => {
			  console.log(error);
			});
    },

    executeTransaction() {
    	console.log("Executing Transaction");
    	console.log("Internal Transaction ID: ", this.internalTransactionId);
    	let data = JSON.stringify({
			  "internalTransactionId": this.internalTransactionId,
			  "paymentMethodId": this.selectedPaymentMethod
			});
    	let config = {
			  method: 'post',
			  url: this.APIHOST + '/infra/executePayment/',
			  headers: this.headers,
			  data : data
			};
			axios.request(config)
			.then((response) => {
				this.paymentStarted = true
				window.open(response.data.response.paymentDetails.PaymentURL, '_blank').focus()
			})
			.catch((error) => {
			  console.log(error);
			});    	
    },

    reloadPage() {
      location.reload()
    },

    closeBillDetailsModal() {
    	this.viewBillDetailsModal = false
    	this.selectedBillDetails = null
    	this.needPayment = false
    	this.transactionLogData = []
    	this.showPaymentOptions = false
    	this.paymentModes = []
	    this.selectedPaymentMethod = null
	    this.internalTransactionId = null
	    this.proceedPayment = false
	    this.paymentStarted = false
	    this.getVendorDetails()
    },

    showBillDetailsModal(bill) {
    	this.viewBillDetailsModal = true
    	this.selectedBillDetails = bill
    	this.getTransactionsLogs()
    },

    getTransactionLogStatus(status) {
    	if (status == 'CREATED') {
    		return {message: "Payment initiated - not completed", color: "info"}
    	} else if (status == "PAID") {
    		return {message: "Payment successful", color: "success"}
    	} else {
    		return {message: status, color: "info"} 
    	}
    },

    choosePaymentMode(event) {
    	console.log("selected method:")
    	console.log(event)
    	this.selectedPaymentMethod = event.target.value
    },

  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
  	this.getVendorDetails()
  }, // end created

}

</script>


<style scoped>

</style>
