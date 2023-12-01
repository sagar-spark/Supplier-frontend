<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Manage Address</h2>
    </CCol>
  </CRow>
  
  <CForm class="needs-validation" novalidate :validated="validatedCustom01" @submit="handleSubmitCustom01" @submit.prevent=";">

    <CCard class="mb-3">
      <CCardHeader>
        <strong>Add new address</strong>
      </CCardHeader>
      <CCardBody>
        <CRow class="mb-3">
          <CCol :md="3">
            <CFormFloating>
              <CFormInput id="addressLine" type="input" placeholder="Address Line" v-model="newAddress.address" required/>
              <CFormLabel for="addressLine">Address Line</CFormLabel>
            </CFormFloating>
          </CCol>
          <CCol :md="3">
            <CFormFloating>
              <CFormInput id="addressCity" type="input" placeholder="City" v-model="newAddress.city" required/>
              <CFormLabel for="addressCity">City</CFormLabel>
            </CFormFloating>
          </CCol>
          <CCol :md="3">
            <CFormFloating>
              <CFormInput id="addressState" type="input" placeholder="State" v-model="newAddress.state" required/>
              <CFormLabel for="addressState">State</CFormLabel>
            </CFormFloating>
          </CCol>
          <CCol :md="3">
            <CFormFloating>
              <CFormInput id="addressZip" type="input" placeholder="Zip" v-model="newAddress.zip" required/>
              <CFormLabel for="addressZip">Zip</CFormLabel>
            </CFormFloating>
          </CCol>
        </CRow>

        <CRow class="mb-3">
          <CCol :md="3">
            <CFormFloating>
              <CFormInput id="addressCountry" type="input" placeholder="Country" v-model="newAddress.country" required/>
              <CFormLabel for="addressCountry">Country</CFormLabel>
            </CFormFloating>
          </CCol>
          <CCol :md="3">
            <CFormFloating>
              <CFormInput id="addressEmail" type="input" placeholder="Email" v-model="newAddress.email" required/>
              <CFormLabel for="addressEmail">Email</CFormLabel>
            </CFormFloating>
          </CCol>
          <CCol :md="3">
            <CFormFloating>
              <CFormInput id="addressPhone" type="input" placeholder="Phone" v-model="newAddress.phone" required/>
              <CFormLabel for="addressPhone">Phone</CFormLabel>
            </CFormFloating>
          </CCol>
        </CRow>

        <CRow>
          <CCol :xs="12" class="mb-0">
            <CButton color="primary" size="sm" type="submit">Add Address</CButton>
          </CCol>
        </CRow>

      </CCardBody>
    </CCard>

  </CForm>

<!--   <CCard class="mb-3">
    <CCardHeader>
      <strong>All Addresses</strong>
    </CCardHeader>
    <CCardBody>
      <CSmartTable
        cleaner
        :columns="this.shipFromAddressesColumns"
        header
        :items-per-page="5"
        items-per-page-select
        :items="this.shipFromAddresses"
        pagination
        table-filter
        clickable-rows
        :table-props="{
          hover: true,
        }"
        v-if="this.shipFromAddresses.length > 0"
      >
        <template #actions="{ item, index }">
          <td class="py-2 text-start">
            <CButton color="danger mb-2" variant="outline" size="sm" @click="deleteVendorAddress(index)">
              <CIcon icon="cil-trash" alt="Delete address" />
            </CButton>
          </td>
        </template>
      </CSmartTable>
    </CCardBody>
  </CCard> -->

  <CRow v-if="this.shipFromAddresses.length > 0">
    <CCol :md="4" v-for="(address, counter) in this.shipFromAddresses" v-bind:key="counter" class="mb-3">
      <CCard class="border-primary">
        <CCardBody>
          <CCardTitle>
            <CRow>
              <CCol :md="10">
                Address - {{counter+1}}
              </CCol>
              <!-- <CCol :md="2" class="text-end">
                <CIcon icon="cil-trash" class="text-danger" color="danger" @click="deleteVendorAddress(counter)" />
              </CCol> -->
            </CRow>
            
          </CCardTitle>
          <CCardText>
            <CRow>
              <CCol :md="12" class="mb-2">
                <span class="text-medium-emphasis small">Address</span>
                <br>
                <span>{{address.address}}</span>
              </CCol>

              <CCol :md="6" class="mb-2">
                <span class="text-medium-emphasis small">City, Zip</span>
                <br>
                <span>{{address.city}}, {{address.zip}}</span>
              </CCol>


              <CCol :md="6" class="mb-2">
                <span class="text-medium-emphasis small">State, Country</span>
                <br>
                <span>{{address.state}}, {{address.country}}</span>
              </CCol>

              <CCol :md="12" class="mb-2">
                <span class="text-medium-emphasis small">Email, Phone</span>
                <br>
                <span>{{address.email}}, {{address.phone}}</span>
              </CCol>
            </CRow>
          </CCardText>
          <!-- <CButton color="warning" size="sm" @click="deleteVendorAddress(counter)"> Delete this address</CButton> -->
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'


export default {
  name: "Manage Address",
  
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
      shipFromAddresses: [],
      // shipFromAddressesColumns: [
      //   'address', 'city', 'state', 'zip', 'country', 'email', 'phone', 

      //   // extra for actions
      //   {
      //     key: 'actions',
      //     label: 'Actions',
      //     _style: { width: '5%' },
      //     filter: false,
      //     sorter: false,
      //   }
      // ],

      newAddress: {
        zip: null,
        city: null,
        email: null,
        phone: null,
        state: null,
        address: null,
        country: null,
      },
      
    }
  }, //end of Data

  methods: {

    getVendorDetails() {

      axios.post(this.APIHOST + '/infra/get-vendor-details/', {}, {
        headers: this.headers
      })
      .then(response => {
        console.log(response.data.response)
        this.shipFromAddresses = response.data.response.address
        
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
        this.addNewAddress()
      }
      this.validatedCustom01 = true
    },

    addNewAddress() {
      // TODO: call APIs
      axios.post(this.APIHOST + '/infra/vendor-address-add/', {
        address: this.newAddress,
      }, {
        headers: this.headers
      })
      .then(response => {
        if (response.status == 200) {
          // this.shipFromAddresses.push(this.newAddress)
          if (alert("Addition of address successful")) {} 
          else {
            this.reloadPage() 
          }
        }
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      });

    },

    deleteVendorAddress(addressIndex) {

      let response = confirm("This will delete this address. Are you sure?")
      if (response == true) {
        axios.get(this.APIHOST + '/infra/vendor-address-del/', {
          params: {
            addressId: addressIndex
          },
          headers: this.headers,
        })
        .then(response => {
          if (response.status == 200) {
            // this.shipFromAddresses.splice(counter, 1)
            if (alert("Address deleted")) {} 
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
    this.getVendorDetails()
  }, // end created

}

</script>


<style scoped>

</style>