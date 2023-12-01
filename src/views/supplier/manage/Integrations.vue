<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Manage Integrations & SKUs</h2>
    </CCol>
  </CRow>
  
  <CForm class="needs-validation" novalidate :validated="validatedCustom01" @submit="handleSubmitCustom01" @submit.prevent=";">
    <CCard class="mb-3" v-if="this.isShopifyConnected == true" >
      <CCardHeader>
        <strong>Integrate Shopify</strong>
      </CCardHeader>
      <CCardBody>

        <div v-if="this.isShopifyConnected == true">
          <CAlert color="success">
            <CAlertHeading tag="h4">Shopify is integrated</CAlertHeading>
            <p>
              Your Shopify URL: 
              <strong>
                <CNavLink :href="this.connectedShopifyDetails.shopUrl" target="_new" active>
                  {{this.connectedShopifyDetails.shopUrl}}
                </CNavLink>
              </strong>
              is connected and working. We're receiving Order alerts.
            </p>
            <hr />
            <p class="mb-0">
              Integration added on: {{this.connectedShopifyDetails.date.substring(0, 10)}}
            </p>
          </CAlert>
        </div>

      </CCardBody>
    </CCard>
  </CForm>


  <!-- <CRow> -->
  <CRow v-if="this.emailIntegrationFlag" class="mb-3">
    <CForm class="needs-validation">
      <CCard>
        <CCardHeader>
          <strong>Upload New SKUs</strong>
        </CCardHeader>
        <CCardBody>
          <p class="text-medium-emphasis small mb-3">Download <a href="/downloadable/bulk_sku_upload.csv" download>this</a> template (in CSV format) to prepare your SKUs & upload here for bulk addition</p>
          <input type="file" ref="file" class="mb-3" />
          <br>
          <CButton color="primary" class="text-end" size="sm" @click="this.uploadSkuFile()">Upload</CButton>
        </CCardBody>
      </CCard>
    </CForm>
  </CRow>

  <CCard>
    <CCardHeader>
      <CRow>
        <CCol :md="6">
          <strong>Current SKUs</strong>
        </CCol>
        <CCol :md="6" class="text-end" v-if="this.isShopifyConnected">
          <CButton color="primary" size="sm" @click="this.refreshShopifySKUs()">Refresh SKUs from Shopify</CButton>
        </CCol>
      </CRow>
      
    </CCardHeader>
    <CCardBody>
      <span v-if="this.allSKUs == null">
        <CSpinner component="span" size="sm" aria-hidden="true"/>&nbsp;Loading...
      </span>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">SKU #</CTableHeaderCell>
            <CTableHeaderCell scope="col">Print</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Variant #</CTableHeaderCell>
            <CTableHeaderCell scope="col">Variant Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Description</CTableHeaderCell>
            <CTableHeaderCell scope="col">Category</CTableHeaderCell>
            <CTableHeaderCell scope="col">Packaging</CTableHeaderCell>
            <CTableHeaderCell scope="col">Composition</CTableHeaderCell>
            <!-- <CTableHeaderCell scope="col">Width</CTableHeaderCell>
            <CTableHeaderCell scope="col">Length</CTableHeaderCell>
            <CTableHeaderCell scope="col">Height</CTableHeaderCell> -->
            <!-- <CTableHeaderCell scope="col">Manufacturer</CTableHeaderCell>
            <CTableHeaderCell scope="col">Other info</CTableHeaderCell> -->
          </CTableRow>
        </CTableHead>

        <CTableBody>
          <CTableRow v-for="sku in this.allSKUs">
            <CTableDataCell scope="col" width="12%" class="text-center align-center">
              <!-- {{sku.skuNumber}} -->
              <CCardImage orientation="top" :src=sku.barcode />
            </CTableDataCell>
            <CTableHeaderCell scope="col">
              <CNavLink :href="'/#/print/sku-barcode?barcodePath=' + sku.barcode" target="_blank">
                <CIcon icon="cil-print" />
              </CNavLink>
            </CTableHeaderCell>
            <CTableDataCell scope="col">{{sku.productName}}</CTableDataCell>
            <CTableDataCell scope="col">{{sku.variantId}}</CTableDataCell>
            <CTableDataCell scope="col">{{sku.variantName}}</CTableDataCell>
            <CTableDataCell scope="col">
              <span v-html="sku.description"></span>
            </CTableDataCell>
            <CTableDataCell scope="col">{{sku.packaging}}</CTableDataCell>
            <CTableDataCell scope="col">{{sku.productCategory}}</CTableDataCell>
            <CTableDataCell scope="col">{{sku.composition}}</CTableDataCell>
            <!-- <CTableDataCell scope="col">{{sku.size_width}}</CTableDataCell>
            <CTableDataCell scope="col">{{sku.size_length}}</CTableDataCell>
            <CTableDataCell scope="col">{{sku.size_height}}</CTableDataCell> -->
            <!-- <CTableDataCell scope="col">{{sku.manufacturer_name}}</CTableDataCell>
            <CTableDataCell scope="col">{{sku.other_information}}</CTableDataCell> -->
          </CTableRow>
        </CTableBody>
      </CTable>
    </CCardBody>
  </CCard>
</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'
import {getSKURefreshStatus, setSKURefreshStatus} from '@/store/skuRefresh'



export default {
  name: "Manage SKUs",
  
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
      allSKUs: null,

      // Connected Shopify
      isShopifyConnected: false,
      connectedShopifyDetails: null,

      // Shopify SKUs refresh
      refreshedShopifySKUs: null,

      // Upload form
      emailIntegrationFlag: false,
      skuFilePath: null,

      //Integrate shopify
      shopifyDetails: {
        "shopUrl": "",
        "accessToken": "",
        "apiKey": "",
        "apiSecret": ""
      },
      
    }
  }, //end of Data

  methods: {

    handleSubmitCustom01(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.integrateShopify()
      }
      this.validatedCustom01 = true
    },

    getIntegrationStatus() {

      axios.post(this.APIHOST + '/infra/get-vendor-details/', {}, {
        headers: this.headers
      })
      .then(response => {
        console.log(response.data.response)

        if (response.data.response.external.shopify !== undefined) {
          this.isShopifyConnected = response.data.response.external.shopify.success
          this.connectedShopifyDetails = response.data.response.external.shopify
        }

        if (response.data.response.external.email !== undefined && response.data.response.external.email.mailbox.length > 0) {
          this.emailIntegrationFlag = true
        }

      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })

    },

    integrateShopify() {

      axios.post(this.APIHOST + '/infra/addShopifyForVendors/', {
        params: this.shopifyDetails
      }, {
        headers: this.headers,
      })
      .then(response => {
        if (response.status == 200) {
          this.connectedShopifyDetails = true
          this.connectedShopifyDetails.shopUrl = this.shopifyDetails.shopUrl
        }
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      });

    },

    uploadSkuFile() {

      let formData = new FormData();
      console.log(this.$refs.file.files[0])
      formData.append("uploadFile", this.$refs.file.files[0]);

      const http = axios.create({
        baseURL: this.APIHOST,
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Content-Type": "multipart/form-data",
          "Authorization": vueCookies.get('accessToken')
        }
      });

      http.post("/inbound/uploadSkus/", formData)
      .then(response => {
        console.log(response)
        if (alert("SKUs added successfully!")) {} 
        else {
          this.reloadPage() 
        }
      })
      .catch(error => {
        alert(JSON.stringify(error.response))
        console.log(error)
      })

    },

    refreshShopifySKUs() {
      if (this.refreshedShopifySKUs == 'y') {
        this.alreadyRefreshed()

      } else {
        this.refreshedShopifySKUs = 'y'
        setSKURefreshStatus() // set cookie to be true for next 2 hrs (/agreed time)
        alert("Request for refreshing SKUs from Shopify is being submitted.\n\nThis may take-up to 30 mins depending on number of SKUs and their details (data is usually heavy).\n\nVisit this page after 30 mins to view updated list of SKUs.\n\nDo not submit fresh requests multiple times.") 

        // call refresh API
        this.allSKUs = null
        axios.get(this.APIHOST + '/inbound/buildSKUsFromShopify/', {
          params: {},
          headers: this.headers,
        })
        .then(response => {
          console.log(response.data.response)
          this.getAllSKUs()
        })
        .catch(error => {
          alert(JSON.stringify(error.response.data))
          console.log(error)
        })
      }
      
    },

    alreadyRefreshed() {
      alert('You have already refreshed SKUs in last 3 hours / last refresh is in progress. \n\nRefreshing below SKU list from our backend.')
      this.getAllSKUs()
    },

    reloadPage() {
      location.reload()
    },

    getAllSKUs() {

      this.allSKUs = null

      axios.get(this.APIHOST + '/inbound/getAllVendorSKUs/', {
        params: {
          page_size: 1000,
          page_seq: 1
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.allSKUs = response.data.response.payloads
        
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })

    },

  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
    this.getIntegrationStatus()
    this.getAllSKUs()
    this.refreshedShopifySKUs = getSKURefreshStatus()
    console.log(this.refreshedShopifySKUs)
  }, // end created 

}

</script>


<style scoped>

</style>
