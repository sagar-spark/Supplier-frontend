<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Manage Retailer</h2>
    </CCol>
  </CRow>
  
  <CForm class="needs-validation" novalidate :validated="validatedCustom01" @submit="handleSubmitCustom01" @submit.prevent=";">

    <CCard class="mb-3">
      <CCardHeader>
        <strong>Add new retailer</strong>
      </CCardHeader>
      <CCardBody>
        <CRow class="mb-3">
          <CCol :md="4">
            <CFormFloating>
              <CFormInput type="input" placeholder="Name" v-model="newRetailer.name" required/>
              <CFormLabel>Name</CFormLabel>
            </CFormFloating>
          </CCol>

          <CCol :md="3">
            <CFormFloating>
              <CFormInput type="input" placeholder="Phone" v-model="newRetailer.phone" required />
              <CFormLabel >Phone</CFormLabel>
            </CFormFloating>
          </CCol>

          <CCol :md="3">
            <CFormFloating>
              <CFormInput type="input" placeholder="Email" v-model="newRetailer.email" required />
              <CFormLabel>Email</CFormLabel>
            </CFormFloating>
          </CCol>

          <CCol :md="2">
            <CFormFloating>
              <CFormInput type="input" placeholder="Tax ID" v-model="newRetailer.taxid" required />
              <CFormLabel>Tax ID</CFormLabel>
            </CFormFloating>
          </CCol>
        </CRow>

        <CRow class="mb-3">

          <CCol :md="12">
            <CFormFloating>
              <CFormInput type="input" placeholder="Address Line" v-model="newRetailer.address.addressline" required />
              <CFormLabel>Address Line</CFormLabel>
            </CFormFloating>
          </CCol>

        </CRow>

        <CRow class="mb-4">

          <CCol :md="3">
            <CFormFloating>
              <CFormInput type="input" placeholder="City" v-model="newRetailer.address.city" required />
              <CFormLabel>City</CFormLabel>
            </CFormFloating>
          </CCol>

          <CCol :md="3">
            <CFormFloating>
              <CFormInput type="input" placeholder="State" v-model="newRetailer.address.state" required />
              <CFormLabel>State</CFormLabel>
            </CFormFloating>
          </CCol>

          <CCol :md="3">
            <CFormFloating>
              <CFormInput type="input" placeholder="Zip" v-model="newRetailer.address.zip" required />
              <CFormLabel>Zip</CFormLabel>
            </CFormFloating>
          </CCol>

          <CCol :md="3">
            <CFormFloating>
              <CFormInput type="input" placeholder="Country" v-model="newRetailer.address.country" required />
              <CFormLabel>Country</CFormLabel>
            </CFormFloating>
          </CCol>
          
        </CRow>

        <CRow>
          <CCol :xs="12" class="mb-0">
            <CButton color="primary" size="sm" type="submit">Add Retailer</CButton>
          </CCol>
        </CRow>

      </CCardBody>
    </CCard>

  </CForm>

  <CRow v-if="this.retailers">
    <CCol :md="4" v-for="(retailer, counter) in this.retailers" v-bind:key="counter" class="mb-3">
      <CCard class="border-primary">
        <CCardBody>
          <CCardTitle>
            <CRow>
              <CCol :md="10" class="h5">
                {{retailer.payload.name}}
              </CCol>
              <CCol :md="2" class="text-end">
                <CIcon icon="cil-trash" class="text-danger" color="danger" @click="deleteRetailer(retailer.id, retailer.payload.name)" />
              </CCol>
            </CRow>
          </CCardTitle>
          <CCardText>
            <CRow>
              <CCol :md="12" class="mb-2">
                <span class="text-medium-emphasis small">Address</span>
                <br>
                <span>
                  {{retailer.payload.address.addressline}}<br>
                  {{retailer.payload.address.city}}, {{retailer.payload.address.state}}, 
                  {{retailer.payload.address.country}}, {{retailer.payload.address.zip}}
                </span>
              </CCol>
              <CCol :md="12" class="mb-2">
                <span class="text-medium-emphasis small">Email, Phone</span>
                <br>
                <span>{{retailer.payload.email}},{{retailer.payload.phone}}</span>
              </CCol>
              <CCol :md="6" class="mb-2">
                <span class="text-medium-emphasis small">Tax ID</span>
                <br>
                <span>{{retailer.payload.taxid}}</span>
              </CCol>
            </CRow>
          </CCardText>


        </CCardBody>
      </CCard>
    </CCol>
  </CRow>


  <!-- <CRow class="mb-3">
    <CCol :md="12">
      <CCard>
        <CCardHeader>
          <strong>All Retailers</strong>
        </CCardHeader>

        <CCardBody>
          <CTable hover>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Tax ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">Phone, Email</CTableHeaderCell>
                <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody v-if="this.retailers">
              <CTableRow v-for="retailer in this.retailers">
                <CTableDataCell scope="col">{{retailer.payload.name}}</CTableDataCell>
                <CTableDataCell scope="col">{{retailer.payload.taxid}}</CTableDataCell>
                <CTableDataCell scope="col">{{retailer.payload.phone}}<br>{{retailer.payload.email}}</CTableDataCell>
                <CTableDataCell scope="col">
                  {{retailer.payload.address.addressline}}<br>
                  {{retailer.payload.address.city}}, {{retailer.payload.address.state}}, {{retailer.payload.address.country}}, {{retailer.payload.address.zip}}
                </CTableDataCell>
                <CTableDataCell scope="col">
                  <code class="highlighter-rouge">
                    <CIcon icon="cil-trash" size="lg" color="danger" @click="deleteRetailer(retailer.id, retailer.payload.name)" />
                </code>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>

      </CCard>
      
    </CCol>
  </CRow> -->

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'


export default {
  name: "Manage Retailer",
  
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
      retailers: null,

      newRetailer: {
        name: null,
        taxid: null,
        phone: null,
        email: null,
        address:
        {
          zip: null,
          city: null,
          state: null,
          country: null,
          addressline: null,
        },
      },
      
    }
  }, //end of Data

  methods: {

    getRetailers() {

      axios.get(this.APIHOST + '/inbound/get-all-retailers/', {
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.retailers = response.data.response
        
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })

    },

    handleSubmitCustom01(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.addNewRetailer()
      }
      this.validatedCustom01 = true
    },

    addNewRetailer() {
      
      axios.post(this.APIHOST + '/inbound/add-retailer/', {
        payload: this.newRetailer,
      }, {
        headers: this.headers
      })
      .then(response => {
        if (response.status == 200) {
          if (alert("Addition of retailer successful")) {} 
          else {
            this.reloadPage() 
            // this.getRetailers()
          }
        }
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      });

    },

    deleteRetailer(retailerId, retailerName) {
      let response = confirm("This will delete retailer: " + retailerName + ". Are you sure?")
      
      if (response == true) {
        axios.post(this.APIHOST + '/inbound/toggle-retailer/', {
          "active": false,
          "retailerId": retailerId
        }, {
          headers: this.headers
        })
        .then(response => {
          if (response.status == 200) {
            // this.shipFromAddresses.splice(counter, 1)
            if (alert("Retailer deleted!")) {} 
            else {
              this.reloadPage() 
            }
          }
        })
        .catch(error => {
          alert(JSON.stringify(error.response.data))
          console.log(error)
        });
      }

    },

    reloadPage() {
      location.reload()
    },

  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
    this.getRetailers()
  }, // end created

}

</script>


<style scoped>

</style>