<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Approve GRN (Goods Received Note)</h2>
    </CCol>
  </CRow>
  
  <CCard class="mb-5">
    <CCardHeader>
      <strong><span class="h5">{{Number(this.totalCount)}}</span> GRN pending for approval</strong>
    </CCardHeader>

    <CCardBody v-if="this.multiSelectOptions.length > 0">
      <CRow class="mb-4">
        <CCol :md="4">
          <p class="text-medium-emphasis small">Choose GRN to Approve / Reject</p>
          <CMultiSelect :options="this.multiSelectOptions" :multiple="false" v-on:change="getGrnDetails($event)" />

          <!-- <span class="mx-2" v-for="(grn, counter) in this.allGrn">
            <CButton color="dark" shape="rounded-pill" class="p-2 px-4" variant="outline" v-on:click="getGrnDetails(grn.grnId)">
              <CIcon icon="cil-arrow-thick-from-left" class="me-2" />
              {{grn.asnId}} / {{grn.grnId}}
            </CButton>
          </span> -->
        </CCol>
      </CRow>

      <CRow v-if="selectedGRN">
        <CCol :md="12">
          <CAccordion :active-item-key="1" always-open>
            <CForm class="needs-validation" novalidate :validated="validatedCustom01" @submit="handleSubmitCustom01" @submit.prevent=";">
              <CAccordionItem :item-key="1">
                <CAccordionHeader>{{selectedGRN.grnId}}, {{selectedGRN.createddate}} &nbsp;&nbsp;
                  <CBadge color="warning">Needs approval</CBadge>
                </CAccordionHeader>
                <CAccordionBody>
                  <CRow class="mb-1">
                    <CCol :md="4" class="mb-1">
                      <p class="mb-1"><strong>ASN:</strong> {{selectedGRN.asnId}}</p>
                      <p><strong>Created:</strong> {{selectedASN.createddate}}&nbsp;{{selectedASN.createdtime}}</p>
                    </CCol>
                    <CCol :md="4">
                      <p class="mb-1"><strong>Shipment from:</strong></p>
                      <strong>{{selectedASN.payload.shipFromDetails.name}}</strong><br>
                      <span class="text-medium-emphasis small">
                        {{selectedASN.payload.shipFromDetails.address.address}}, 
                        {{selectedASN.payload.shipFromDetails.address.city}}, 
                        {{selectedASN.payload.shipFromDetails.address.zip}}, 
                        {{selectedASN.payload.shipFromDetails.address.state}}, 
                        {{selectedASN.payload.shipFromDetails.address.country}}
                        <br>
                        Email: {{selectedASN.payload.shipFromDetails.address.email}}
                        <br>
                        Phone: {{selectedASN.payload.shipFromDetails.address.phone}}
                      </span>
                    </CCol>
                    <CCol :md="4">
                      <p class="mb-1"><strong>Destination:</strong></p>
                      <strong>{{selectedASN.payload.shipToDetails.warehouseDetails.name}}</strong><br>
                      <span class="text-medium-emphasis small">
                        {{selectedASN.payload.shipToDetails.warehouseDetails.address.address}}, 
                        {{selectedASN.payload.shipToDetails.warehouseDetails.address.city}}, 
                        {{selectedASN.payload.shipToDetails.warehouseDetails.address.zip}}, 
                        {{selectedASN.payload.shipToDetails.warehouseDetails.address.state}}, 
                        {{selectedASN.payload.shipToDetails.warehouseDetails.address.country}}
                        <br>
                        Email: {{selectedASN.payload.shipToDetails.warehouseDetails.address.email}}
                        <br>
                        Phone: {{selectedASN.payload.shipToDetails.warehouseDetails.address.phone}}
                      </span>
                    </CCol>
                  </CRow>

                  <CCard class="mb-3 border-top-3" v-for="(pallet, counter) in selectedGRN.payload.pallets" v-bind:key="counter">
                    <CCardHeader><strong>Pallet</strong>: {{pallet.palletNumber}}, <strong>Contents</strong>: {{pallet.palletContents}}</CCardHeader>
                    <CCardBody>
                      <CRow>
                        <CCol :md="12">
                          <CTable hover>
                            <CTableHead>
                              <CTableRow>
                                <CTableHeaderCell scope="col" width="30%">Package details</CTableHeaderCell>
                                <CTableHeaderCell scope="col" width="45%">Quality Check</CTableHeaderCell>
                                <CTableHeaderCell scope="col" width="25%">Approve / Reject</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>

                            <CTableBody>
                              <CTableRow v-for="(p_package, counter2) in pallet.packages" v-bind:key="counter2">
                                <CTableDataCell>
                                  <strong>SKU</strong>: {{p_package.packageSKU}}<br>
                                  <strong>Description</strong>: {{p_package.packageDescription}}<br>
                                  <strong>Package Number</strong>: {{p_package.packageNumber}}<br>
                                  <strong>Quantity</strong>: {{p_package.packageQuantity}}<br>
                                  <strong>Weight</strong>: {{p_package.packageWeight}}<br>
                                  <strong>Batch Number</strong>: {{p_package.packageBatchNumber}}<br>
                                  <strong>Expiry Date</strong>: {{p_package.packageExpiryDate}}<br>
                                </CTableDataCell>

                                <CTableDataCell>
                                  <CBadge class="mb-1" color="success" v-if="p_package.qc.actionQC === 'Accept complete package'">Accepted</CBadge>
                                  <CBadge class="mb-1" color="danger" v-else-if="p_package.qc.actionQC === 'Reject complete package'">Rejected</CBadge>
                                  <CBadge class="mb-1" color="warning" v-else-if="p_package.qc.actionQC === 'Partial accept'">Partially accepted</CBadge>
                                  <CBadge class="mb-1" color="dark" v-else></CBadge>

                                  <p class="mb-1" v-if="p_package.qc.acceptQuantity"><strong>Accepted quantity: </strong>{{p_package.qc.acceptQuantity}}</p>

                                  <p class="mb-1" v-if="p_package.qc.rejectQuantity"><strong>Rejected quantity: </strong>{{p_package.qc.rejectQuantity}}</p>

                                  <p class="mb-1" v-if="p_package.qc.reasonReject"><strong>Reject reason: </strong>{{p_package.qc.reasonReject}}</p>

                                  <p class="mb-1" v-if="p_package.qc.remarksQC"><strong>Remarks: </strong>{{p_package.qc.remarksQC}}</p>

                                </CTableDataCell>
                                <CTableDataCell>
                                  <CFormLabel>Approve / Reject action</CFormLabel>
                                  <CFormSelect class="mb-2" v-model="p_package.grnConfirm.action" required>
                                    <option value="">Choose</option>
                                    <option value="Approve">Approve</option>
                                    <option value="Reject">Reject (Recycle items at warehouse)</option>
                                    <option value="Reject">Reject (Return items back to supplier)</option>
                                  </CFormSelect>

                                  <div v-if="p_package.grnConfirm.action == 'Reject'">
                                    <CFormLabel>Reject remarks</CFormLabel>
                                    <CFormTextarea rows="1" v-model="p_package.grnConfirm.rejectRemarks" required></CFormTextarea>
                                  </div>

                                </CTableDataCell>

                              </CTableRow>

                            </CTableBody>
                          </CTable>
                        </CCol>
                      </CRow>

                    </CCardBody>
                  </CCard>


                  <CRow class="mb-2">
                    <CCol :md="12">
                      <CButton color="info" variant="outline" @click="this.approveAll()">Approve All</CButton>&nbsp;&nbsp;

                      <CButton color="primary" type="submit">Confirm</CButton>
                    </CCol>
                  </CRow>

                </CAccordionBody>
              </CAccordionItem>
            </CForm>
            </CAccordion>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>

</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'

export default {
  name: "Approve GRN",
  
  data: () => {
    return {
      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': vueCookies.get('accessToken')
      },

      // All Grn details area
      totalCount: null,
      allGrn: null,

      // Individual Grn details area
      selectedGRN: null,
      selectedASN: null,
      grnConfirm: {
        action: null,
        rejectRemarks: null,
      },

      // multi-select options
      multiSelectOptions: [],

      // visibility markets
      validatedCustom01: null,

    }
  }, //end of Data

  methods: {
    handleSubmitCustom01(event) {
      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.confirmAsnGrn()
      }
      this.validatedCustom01 = true
    },

    approveAll() {
      let numPallets = this.selectedGRN.payload.pallets.length
      for (var palletIndex=0; palletIndex<numPallets; palletIndex++) {
        let numPackages = this.selectedGRN.payload.pallets[palletIndex].packages.length
        for (var packageIndex=0; packageIndex<numPackages; packageIndex++) {
          this.selectedGRN.payload.pallets[palletIndex].packages[packageIndex]['grnConfirm'].action = "Approve"
        }
      }
    },

    getAllGrnDetails() {

      axios.get(this.APIHOST + '/inbound/get-all-grn/', {
        params: {
          grnConfirmed: false,
          // page_seq
          // page_size
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.totalCount = response.data.response.totalCount
        this.allGrn = response.data.response.payloads

        // prepare multi select options
        for (let counter=0; counter<this.allGrn.length; counter++) {
          let selectOption = {
            value: this.allGrn[counter].grnId,
            text: this.allGrn[counter].grnId + " / " + this.allGrn[counter].asnId
          }

          this.multiSelectOptions.push(selectOption)
        }
        
      })
      // .catch(error => {
      //   alert(JSON.stringify(error.response.data))
      //   console.log(error)
      // })
      
    },

    getGrnDetails(event) {

      console.log(JSON.stringify(event))
      let grnId = event[0].value

      axios.get(this.APIHOST + '/inbound/get-grn/', {
        params: {
          id: grnId
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.selectedGRN = response.data.response.grn
        this.selectedASN = response.data.response.asn


        // Add GRN approve flag
        let numPallets = this.selectedGRN.payload.pallets.length
        for (var palletIndex=0; palletIndex<numPallets; palletIndex++) {
          let numPackages = this.selectedGRN.payload.pallets[palletIndex].packages.length
          for (var packageIndex=0; packageIndex<numPackages; packageIndex++) {
            this.selectedGRN.payload.pallets[palletIndex].packages[packageIndex]['grnConfirm'] = {
              action: null,
              rejectRemarks: null,
            }
          }
        }

        console.log(this.selectedGRN)
      })
      .catch(error => {
        console.log(error)
        alert(JSON.stringify(error.response.data))
      })
      
    },

    confirmAsnGrn() {
      axios.post(this.APIHOST + '/inbound/confirm-grn/', {
        payload: {
          asnNumber: this.selectedASN.asnId,
          grnNumber: this.selectedGRN.grnId,
          confirm: true,
          grnPayload: this.selectedGRN,
        },
      }, {
        headers: this.headers
      })
      .then(response => {
        if (response.status == 200) {
          console.log(response.data.response)
          if (alert("GRN Approved: " + response.data.response)) {}
            else { this.reloadPage() }
        }
      })
      .catch(error => {
        console.log(error)
        alert(JSON.stringify(error.response.data))
      })
    },

    reloadPage() {
      location.reload()
    },

  }, // end of methods

  created() {
    this.getAllGrnDetails()
  }, // end created

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate
  
}

</script>


<style scoped>

</style>