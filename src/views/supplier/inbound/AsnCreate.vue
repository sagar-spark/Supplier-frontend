<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>New ASN (Advance Shipment Notice)</h2>
    </CCol>
  </CRow>

  <CRow id="newAsnForm" v-if="visibleAsnDetailsDiv">

    <CForm
        class="row needs-validation"
        novalidate
        :validated="validatedCustom01"
        @submit="handleSubmitCustom01"
        @submit.prevent=";"
    >

      <CCol :xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Ship From (Origin)</strong>
          </CCardHeader>
          <CCardBody>
            <p class="mb-2"><strong>Your details</strong></p>
            <CRow class="mb-3" v-if="shipFromDetails">
              <CCol :md="3">
                <span class="text-medium-emphasis small">Name</span>
                <br>
                <span>{{shipFromDetails.name}}</span>
              </CCol>


              <CCol :md="3">
                <span class="text-medium-emphasis small">Email</span>
                <br>
                <span>{{shipFromDetails.email}}</span>
              </CCol>


              <CCol :md="3">
                <span class="text-medium-emphasis small">Phone</span>
                <br>
                <span>{{shipFromDetails.phone}}</span>
              </CCol>
            </CRow>
            <CRow class="mb-3" v-if="shipFromAddresses">
              <CCol :md="12">
                <CFormLabel for="shipFromAddressSelected"><strong>Choose your address</strong></CFormLabel>
                <CFormSelect aria-label="Shipment from address selection" v-model="shipFromAddressSelected" required>
                  <option value="">Choose</option>
                  <option v-for="(address, counter) in this.shipFromAddresses" :value=counter>
                    {{address.address}}, {{address.city}}, {{address.zip}}, {{address.state}}, {{address.country}}, Email: {{address.email}}, Phone: {{address.phone}}
                  </option>
                </CFormSelect>
              </CCol>
            </CRow>

          </CCardBody>
        </CCard>
      </CCol>


      <CCol :xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Ship To (Destination)</strong>
          </CCardHeader>

          <CCardBody>
            <CRow class="mb-3">
              <CCol :md="4">
                <CFormLabel for="shipmentType"><strong>Choose shipment type</strong></CFormLabel>
                <CFormSelect aria-label="Shipment type selection" v-model="shipmentType" v-on:input="getWarehouseOrRetailerDetails($event)" required>
                  <option value="" selected>Choose</option>
                  <option value="Send to ConnectCo warehouse">Send to ConnectCo warehouse</option>
<!--                  <option value="Deliver to Retailer without stocking">Deliver to Retailer without stocking</option>-->
                </CFormSelect>
              </CCol>
            </CRow>

            <!-- Stock in Warehouse / Send to ConnectCo warehouse -->
            <CRow class="mb-3" v-if="this.shipmentType === 'Send to ConnectCo warehouse'">
              <CCol :md="12">

                <CRow v-if="warehouseDetails">
                  <CCol :md="12">
                    <CFormLabel for="warehouseSelected"><strong>Choose warehouse</strong></CFormLabel>
                    <CFormSelect v-model="warehouseSelected" required>
                      <option value="">Choose</option>
                      <option v-for="(warehouse, counter) in this.warehouseDetails" :value=counter>
                        {{warehouse.name}}, {{warehouse.address.address}}, {{warehouse.address.city}}, {{warehouse.address.state}}, {{warehouse.address.country}}, {{warehouse.address.zip}}
                      </option>
                    </CFormSelect>
                  </CCol>
                </CRow>

              </CCol>
            </CRow>


            <!-- Deliver to Retailer directly (without stocking) / Deliver to Retailer without stocking -->
            <CRow class="mb-3" v-if="this.shipmentType === 'Deliver to Retailer without stocking'">
              <CCol :md="12">
                <CRow v-if="this.retailers">
                  <CCol :md="12">
                    <CFormLabel for="retailerSelected"><strong>Choose retailer</strong></CFormLabel>
                    <CFormSelect aria-label="Shipment to address selection" v-model="retailerSelected" required>
                      <option value="">Choose</option>
                      <option v-for="(retailer, counter) in this.retailers" :value=counter>
                        {{retailer.payload.name}}, {{retailer.payload.address.addressline}}, {{retailer.payload.address.city}}, {{retailer.payload.address.state}}, {{retailer.payload.address.country}}, {{retailer.payload.address.zip}}
                      </option>
                    </CFormSelect>
                  </CCol>
                </CRow>

              </CCol>
            </CRow>

          </CCardBody>
        </CCard>
      </CCol>

      <CCol :xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Shipment details</strong>
          </CCardHeader>
          <CCardBody>

            <CRow class="mb-3">
              <CCol :md="4">
                <CFormLabel for="courierType"><strong>Choose courier</strong></CFormLabel>
                <CFormSelect v-model="courierType" required>
                  <option value="">Choose</option>
                  <option value="Use ConnectCo delivery">Use ConnectCo delivery</option>
                  <option value="Use other 3rd party delivery">Use other 3rd party delivery</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow v-if="this.courierType == 'Use other 3rd party delivery'">

              <CCol :md="4">
                <CFormLabel for="ownShipmentCarrier">Carrier</CFormLabel>
                <CFormInput v-model="ownShipmentCarrier" value="" />
              </CCol>

              <CCol :md="4">
                <CFormLabel for="ownShipmentTrackingNum">Tracking #</CFormLabel>
                <CFormInput v-model="ownShipmentTrackingNum" value="" required />
              </CCol>

              <CCol :md="4">
                <CFormLabel for="ownShipmentDate">Shipment Date</CFormLabel>
                <CDatePicker v-model="ownShipmentDate" footer locale="en-US" />
              </CCol>

            </CRow>

            <CRow v-if="this.courierType == 'Use ConnectCo delivery'">

              <CCol :md="4">
                <CFormLabel for="warehouseCourierPickupDate">Pickup Date</CFormLabel>
                <CDatePicker v-model="warehouseCourierPickupDate" footer locale="en-US" />
              </CCol>

              <CCol :md="4">
                <CFormLabel for="warehouseCourierPickupSlot">Pickup slot</CFormLabel>
                <CFormSelect v-model="warehouseCourierPickupSlot" required>
                  <option value="">Choose</option>
                  <option v-for="slot in this.warehouseCourierPickupSlots" :value=slot>{{slot}}</option>
                </CFormSelect>
              </CCol>

            </CRow>


          </CCardBody>
        </CCard>
      </CCol>



      <CCol :xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Packing & Item details</strong>
          </CCardHeader>
          <CCardBody>
            <CRow class="mb-3">
              <CCol :md="4">
                <CFormLabel for="packingType"><strong>Choose packing type</strong></CFormLabel>
                <CFormSelect v-model="packingType" required>
                  <option value="Box" selected>Box</option>
                  <option value="Pallet">Pallet</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CCard class="mb-3 border-top-3" v-for="(pallet, counter) in this.pallets" v-bind:key="counter">
              <CCardHeader>
                <CRow>
                  <CCol :md="9">
                    <strong>{{this.packingType}} - {{counter+1}}</strong>
                  </CCol>
                  <CCol class="text-end">
                    <CButton color="danger" size="sm" @click="deletePallet(counter)"> Delete entire {{this.packingType}} - {{counter+1}} </CButton>
                  </CCol>
                </CRow>
              </CCardHeader>
              <CCardBody>
                <CCardTitle>{{this.packingType}} details</CCardTitle>
                <CRow class="mb-2">

                  <CCol :md="3">
                    <CFormLabel class="text-medium-emphasis small">{{this.packingType}} # or barcode</CFormLabel>
                    <CFormInput v-model="pallet.palletNumber" required />
                  </CCol>

                  <CCol :md="6">
                    <CFormLabel class="text-medium-emphasis small">Contents (optional)</CFormLabel>
                    <CFormInput v-model="pallet.palletContents" />
                  </CCol>
                </CRow>

                <CRow class="mb-4">

                  <CCol :md="3">
                    <CFormLabel class="text-medium-emphasis small">Weight (kgs)</CFormLabel>
                    <CFormInput v-model="pallet.palletWeight" />
                  </CCol>

                  <CCol :md="3">
                    <CFormLabel class="text-medium-emphasis small">Length (mtrs)</CFormLabel>
                    <CFormInput v-model="pallet.palletLength" />
                  </CCol>

                  <CCol :md="3">
                    <CFormLabel class="text-medium-emphasis small">Width (mtrs)</CFormLabel>
                    <CFormInput v-model="pallet.palletWidth" />
                  </CCol>

                  <CCol :md="3">
                    <CFormLabel class="text-medium-emphasis small">Height (mtrs)</CFormLabel>
                    <CFormInput v-model="pallet.palletHeight" />
                  </CCol>
                </CRow>
                <hr style="height: 4px;">

                <CCardTitle v-if="pallet.packages.length > 0">Items in this {{this.packingType}}</CCardTitle>
                <div v-for="(p_package, counter2) in pallet.packages" v-bind:key="counter2">

                  <CRow class="mb-2" v-if="p_package.packageSKU">
                    <CCol :md="3">

                      <CFormLabel class="text-medium-emphasis small">Item SKU or Name</CFormLabel>
                      <CFormInput v-model="p_package.packageSKU" required disabled/>
                    </CCol>

                    <CCol :md="3">
                      <CFormLabel class="text-medium-emphasis small">Item details</CFormLabel>
                      <CFormInput v-model="p_package.packageDescription" required disabled/>
                    </CCol>

                    <CCol :md="1">
                      <CFormLabel class="text-medium-emphasis small">Quantity</CFormLabel>
                      <CFormInput v-model="p_package.packageQuantity" required/>
                    </CCol>

                    <CCol :md="2">
                      <CFormLabel class="text-medium-emphasis small">Batch number</CFormLabel>
                      <CFormInput v-model="p_package.packageBatchNumber"/>
                    </CCol>

                    <CCol :md="2">
                      <CFormLabel class="text-medium-emphasis small">Expiry date</CFormLabel>
                      <CDatePicker v-model="p_package.packageExpiryDate" :date=p_package.packageExpiryDate footer locale="en-US" required />
                    </CCol>

                    <CCol :md="1">
                      <p></p>
                      <code class="highlighter-rouge">
                        <CIcon class="mt-3 align-right" icon="cil-trash" size="lg" color="danger" @click="deletePackageDetails(counter, counter2)" />
                      </code>
                    </CCol>

                  </CRow>

                  <hr style="border: dotted">
                </div>

                <p class="mb-3" v-if="pallet.packages.length > 0">
                  Total items in this {{this.packingType}}: {{pallet.packages.length}}
                </p>

                <p class="mb-2">
                  <CButton color="success" size="sm" @click="addPackageDetails(counter)"> Add Item in {{this.packingType}} - {{counter+1}}</CButton>
                  &nbsp;&nbsp;
                  <CButton color="success" size="sm" @click="showBulkAddItems(counter)"> Bulk add Items in {{this.packingType}} - {{counter+1}}</CButton>
                  &nbsp;&nbsp;
                  <CButton color="success" size="sm" @click="showBulkFileAdd(counter)"> Bulk add using CSV in {{this.packingType}} - {{counter+1}}</CButton>
                </p>
              </CCardBody>
            </CCard>

            <p>
              <CButton color="success" size="sm" @click="addPallet()"> Add another {{this.packingType}} </CButton>
            </p>



          </CCardBody>
        </CCard>
      </CCol>


      <CCol :xs="12">
        <CCard class="mb-4">
          <CCardHeader>
            <strong>Shipping instructions</strong>
          </CCardHeader>
          <CCardBody>
            <p class="text-medium-emphasis small">
              Provide shipping instructions, if any
            </p>

            <CRow class="mb-3">
              <CCol :md="12">
                <CFormTextarea
                    v-model="shippingInstructions"
                    rows="2"
                ></CFormTextarea>
              </CCol>
            </CRow>


          </CCardBody>
        </CCard>
      </CCol>


      <CCol :xs="12" class="mb-5">
        <CButton color="primary" type="submit">Create ASN</CButton>
      </CCol>

    </CForm>

  </CRow>


  <CRow v-if="visibleAsnSuccess">
    <CCol :xs="12" class="mb-4">
        <CAlert color="success">
          {{successAsn}}
        </CAlert>
    </CCol>

    <CCol :xs="12" class="mb-5">
      <CButton color="primary" v-on:click="reloadPage()">Create Another</CButton>
    </CCol>

  </CRow>


  <!-- Modal for SKU variant -->
  <CModal
    alignment="center"
    scrollable
    size="xl"
    backdrop="static"
    :visible="skuVariantModelView"
    @close="this.cancelVariantSelection()">

    <CModalHeader
      dismiss
      @close="this.cancelVariantSelection()">
      <CModalTitle>
        Choose SKU or Variant
      </CModalTitle>
    </CModalHeader>

    <CModalBody>
      <CRow class="mb-3">
        <CCol :md="3">
          <CFormLabel class="text-medium-emphasis small">Item SKU or Name</CFormLabel>
          <CFormInput v-model="skuSearch" required @keyup.enter="this.getSKUbyID(counter, counter2)" />
        </CCol>
        <CCol :md="1">
          <CFormLabel class="text-medium-emphasis small">&nbsp;</CFormLabel><br>
          <CButton color="primary" @click="this.getSKUbyID(counter, counter2)">
            <CIcon icon="cil-search" class="" />
          </CButton>
        </CCol>
      </CRow>
      <hr>
      <CRow>
        <CCol :xs="12">
          <div v-if="this.skuVariants != null">
            <div v-if="this.skuVariants.length > 0">
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Choose</CTableHeaderCell>
                    <CTableHeaderCell scope="col">SKU</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Product Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Variant ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Variant Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Packaging</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Color</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Images</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  <CTableRow v-for="(variant, indexVariant) in this.skuVariants">
                    <CTableDataCell scope="col">
                      <CFormCheck
                        type="radio"
                        name="skuVariantIndexSelected"
                        :id="variant.skuNumber+indexVariant"
                        :value="indexVariant"
                        v-on:input="selectVariantIndex($event)" />
                    </CTableDataCell>
                    <CTableDataCell scope="col" v-on:click="this.selectRadio(variant.skuNumber, indexVariant)">{{variant.skuNumber}}</CTableDataCell>
                    <CTableDataCell scope="col" v-on:click="this.selectRadio(variant.skuNumber, indexVariant)">
                      {{variant.productName}}<br>
                      <span class="text-medium-emphasis" v-html="variant.description"></span>
                    </CTableDataCell>
                    <CTableDataCell scope="col" v-on:click="this.selectRadio(variant.skuNumber, indexVariant)">{{variant.variantId}}</CTableDataCell>
                    <CTableDataCell scope="col" v-on:click="this.selectRadio(variant.skuNumber, indexVariant)">{{variant.variantName}}</CTableDataCell>
                    <CTableDataCell scope="col" v-on:click="this.selectRadio(variant.skuNumber, indexVariant)">{{variant.packaging}}</CTableDataCell>
                    <CTableDataCell scope="col" v-on:click="this.selectRadio(variant.skuNumber, indexVariant)">{{variant.colour}}</CTableDataCell>
                    <CTableDataCell scope="col">
                      <CNavLink :href="image" target="_new" active v-for="image in variant.images">
                        <CIcon icon="cil-image" alt="View images" />
                      </CNavLink>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>

            <div v-if="this.skuVariants == 0">
              <span class="text-medium-emphasis warning">No SKUs found.</span>
            </div>

          </div>
        </CCol>
      </CRow>
    </CModalBody>

    <CModalFooter>

      <CButton
        color="secondary"
        @click="this.cancelVariantSelection()">
        Cancel
      </CButton>

      <CButton
        color="primary"
        v-if="this.skuVariantIndexSelected !== null"
        @click="this.selectSKUVariant()">
        Finish
      </CButton>

    </CModalFooter>

  </CModal>


  <!-- Modal for bulk add -->
   <CModal alignment="center" scrollable size="xl" backdrop="static" :visible="bulkAddItemsModal" @close="this.cancelBulkAddItems()">

    <CModalHeader dismiss @close="this.cancelBulkAddItems()">
      <CModalTitle>Bulk add items</CModalTitle>
    </CModalHeader>

    <CModalBody>
      <span v-if="this.bulkSKUs == null">
        <CSpinner component="span" size="sm" aria-hidden="true"/>&nbsp;Loading SKUs...
      </span>

      <CSmartTable
            v-if="this.bulkSKUs"
            cleaner
            :columns="this.bulkAddTableColumns"
            header
            :items-per-page="10"
            items-per-page-select
            :items="this.bulkSKUs"
            pagination
            columnSorter
            table-filter
            :table-props="{
              hover: true,
            }"
          >

          <template #productName="{ item }">
            <td>
              {{item.productName}}<br>
              <span class="text-medium-emphasis" v-html="item.description"></span>
            </td>
          </template>

          <template #images="{ item }">
            <td>
              <CNavLink :href="image" target="_new" active v-for="image in item.images">
                <CIcon icon="cil-image" alt="View images" />
              </CNavLink>
            </td>
          </template>

          <template #quantity="{ item }">
            <td>
              <CFormInput v-model.number="this.bulkSKUs[item._id].quantity" />
            </td>
          </template>

      </CSmartTable>

      <!-- <CTable hover v-if="this.bulkSKUs">
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">SKU</CTableHeaderCell>
            <CTableHeaderCell scope="col">Product Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Variant Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Packaging</CTableHeaderCell>
            <CTableHeaderCell scope="col">Color</CTableHeaderCell>
            <CTableHeaderCell scope="col">Images</CTableHeaderCell>
            <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
          </CTableRow>
        </CTableHead>

        <CTableBody>
          <CTableRow v-for="(sku, indexSKU) in this.bulkSKUs">
            <CTableDataCell scope="col">{{sku.skuNumber}}</CTableDataCell>
            <CTableDataCell scope="col">
              {{sku.productName}}<br>
              <span class="text-medium-emphasis" v-html="sku.description"></span>
            </CTableDataCell>
            <CTableDataCell scope="col">{{sku.variantName}}</CTableDataCell>
            <CTableDataCell scope="col">{{sku.packaging}}</CTableDataCell>
            <CTableDataCell scope="col">{{sku.colour}}</CTableDataCell>
            <CTableDataCell scope="col">
              <CNavLink :href="image" target="_new" active v-for="image in sku.images">
                <CIcon icon="cil-image" alt="View images" />
              </CNavLink>
            </CTableDataCell>
            <CTableDataCell scope="col">
              <CFormInput v-model.number="sku.quantity" />
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable> -->
    </CModalBody>

    <CModalFooter> 
      <CButton color="secondary" @click="this.cancelBulkAddItems()">Cancel</CButton>
      <CButton color="primary" @click="this.addBulkItems()">Finish</CButton>
    </CModalFooter>

  </CModal>

  <!-- Modal for bulk upload using file -->
  
  <CModal alignment="center" scrollable size="xl" backdrop="static" :visible="bulkAddFileModal" @close="this.cancelBulkAddItemsFile()">

    <CModalHeader dismiss @close="this.cancelBulkAddItems()">
      <CModalTitle>Bulk add items with CSV</CModalTitle>
    </CModalHeader>

    <CModalBody>
      <CCardText class="mb-2">
        <CAlert color="dark">
          <p class="mb-1 text-medium-emphasis"><strong>Instructions for bulk file preparation - Bulk upload will not work if these instructions are not met</strong></p>
          <ul class="mb-0">
            <li>Download <a href="/downloadable/bulk_asnitems_upload.csv" download>this</a> template (CSV format) to prepare your Items & upload here for bulk addition.
            </li>
            <li>Do not delete first row of template (header row)</li>
            <li>Columns: <code>skuNumber, variantId, quantity</code> are mandatory.</li>
            <li>Rest two columns: <code>batchNumber, expiryDate</code> are not-mandatory. If values are not available, keep it blank. Do not enter NA or space or anything else.</li>
            <li><code>expiryDate</code> has to be in <code>yyyy/mm/dd</code> format, else it will not be detected.</li>
          </ul>
        </CAlert>
      </CCardText>
      <CCardText>
        <input type="file" ref="file" id="bulk_upload_file" class="mb-3" />
        <br>
        <CButton color="primary" class="text-end" size="sm" @click="this.processBulkUploadFile()">Upload</CButton>
      </CCardText>

      <CCardText v-if="this.bulkFileDataRaw">
        <CAlert color="dark" class="mb-2">{{this.bulkFileSKUsRaw.length}} records in file (excluding header row). Matching with existing SKUs and processing further..</CAlert>
        <CAlert color="danger" class="mb-2" v-if="this.bulkFileUnmatchedRows.length > 0">{{this.bulkFileUnmatchedRows.length}} records were not processed. See details below.
          <p class="mb-1 text-medium-emphasis small" v-for="item in this.bulkFileUnmatchedRows">
            <strong>Row</strong>: {{item.row}}, 
            <strong>Reason</strong>: {{item.reason}}, 
            <strong>Data</strong>: {{item.data}}
          </p>
        </CAlert>
        <CSmartTable
            v-if="this.bulkFileSKUs"
            cleaner
            :columns="this.bulkFileAddTableColumns"
            header
            :items-per-page="10"
            items-per-page-select
            :items="this.bulkFileSKUs"
            pagination
            columnSorter
            table-filter
            :table-props="{
              hover: true,
            }"
          >

          <template #productName="{ item }">
            <td>
              {{item.productName}}<br>
              <span class="text-medium-emphasis" v-html="item.description"></span>
            </td>
          </template>

          <template #images="{ item }">
            <td>
              <CNavLink :href="image" target="_new" active v-for="image in item.images">
                <CIcon icon="cil-image" alt="View images" />
              </CNavLink>
            </td>
          </template>

          <template #quantity="{ item }">
            <td>
              <!-- <CFormInput v-model.number="this.bulkFileSKUs[item._id].quantity" /> -->
              {{item.quantity}}
            </td>
          </template>

        </CSmartTable>
      </CCardText>
      
    </CModalBody>

    <CModalFooter> 
      <CButton color="secondary" @click="this.cancelBulkAddItemsFile()">Cancel</CButton>
      <CButton color="primary" @click="this.addBulkItemsFile()" v-if="this.bulkFileSKUs.length > 0">Finish</CButton>
    </CModalFooter>
  </CModal>


</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'

export default {
  name: "Advance Shipment Notice (Create)",
  data: () => {
    return {
      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': vueCookies.get('accessToken')
      },


      validatedCustom01: null,

      // visibility markers
      visibleAsnDetailsDiv: true,
      visibleAsnSuccess: false,
      visibleBillingAddress: true,

      // ship From address
      shipFromDetails: null,
      shipFromAddresses: null,
      shipFromAddressSelected: null,

      // shipment details
      shipmentType: null,

      // retailers
      retailers: null,
      retailerSelected: null,

      // destination details
      warehouseDetails: null,
      warehouseSelected: null,

      //courier
      courierType: null,
      ownShipmentCarrier: null,
      ownShipmentTrackingNum: null,
      ownShipmentDate: new Date(),


      warehouseCourierPickupDate: new Date(),
      warehouseCourierPickupSlots: ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"],
      warehouseCourierPickupSlot: null,

      // shipmentSalesOrderId: null,
      // shipmentOrderDate: new Date(),
      // shipmentOrderEmail: null,
      // shipmentPO: null,

      // billing address
      // billingAddressSame: null,
      // billingName: null,
      // billingCompanyName: null,
      // billingPhone: null,
      // billingAddress: null,
      // billingCity: null,
      // billingState: null,
      // billingZip: null,

      // pallet details
      packingType: "Box", // default
      skuSearchStatus: "a",

      pallets: [
        {
          palletNumber: null,
          palletContents: null,
          palletWeight: null,
          palletLength: null,
          palletWidth: null,
          palletHeight: null,
          packages: [],
        },
      ],

      skuVariantModelView: false,
      skuSearch: null,
      skuVariants: null,
      skuSearchPalletIndex: null,
      skuSearchPackageIndex: null,
      skuVariantIndexSelected: null,

      // TODO: payload of SKU/variant selection to be sent to API call
      // skuNumber: null,
      // variantId: null,
      // productId: null,

      // shipping instructions
      shippingInstructions: null,

      // Success message
      successAsn: null,

      // Bulk items add
      bulkAddItemsModal: false,
      selectedPalletIndex: null,
      bulkSKUs: null,
      bulkAddTableColumns: [
        { key: 'skuNumber', label: 'SKU',},
        { key: 'productName', label: 'Product Name',},
        { key: 'variantId', label: 'Variant Id',},
        { key: 'variantName', label: 'Variant Name',},
        { key: 'colour', label: 'Color',},
        { key: 'images', label: 'Images',},
        { key: 'quantity', label: 'Quantity',},
      ],

      //Bulk add using file
      bulkAddFileModal: false,
      templateNumColumns: 5, // update this if new columns are added in the template
      // selectedPalletIndex can be used from above
      allSKUsForMatch: [],
      bulkFileDataRaw: null,
      bulkFileSKUsRaw: [],
      bulkFileSKUs: [],
      bulkFileUnmatchedRows: [],
      bulkFileAddTableColumns: [
        { key: 'skuNumber', label: 'SKU',},
        { key: 'productName', label: 'Product Name',},
        { key: 'variantId', label: 'Variant Id',},
        { key: 'variantName', label: 'Variant Name',},
        { key: 'colour', label: 'Color',},
        { key: 'images', label: 'Images',},
        { key: 'quantity', label: 'Quantity',},
        { key: 'batchNumber', label: 'Batch',},
        { key: 'expiryDate', label: 'Expiry',},
      ],
    }
  },
  methods: {
    handleSubmitCustom01(event) {

      //for test purposes
      //this.submitData()

      const form = event.currentTarget
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        this.submitData()
      }
      this.validatedCustom01 = true
    },

    cancelVariantSelection() {
      // remove newly added package
      this.pallets[this.skuSearchPalletIndex].packages.splice(this.skuSearchPackageIndex, 1)

      // clear all
      this.clearVariantSelection()
    },

    clearVariantSelection() {
      // clear all
      this.skuSearch = null
      this.skuVariants = null
      this.skuVariantIndexSelected = null
      this.skuSearchPalletIndex = null
      this.skuSearchPackageIndex = null
      this.skuVariantModelView = false
    },

    selectVariantIndex(event) {
      this.skuVariantIndexSelected = event.target.value
      //console.log(this.skuVariantIndexSelected)
    },

    selectSKUVariant() {

      if (this.skuVariantIndexSelected == null) {
        alert("Select SKU to proceed.")
      } else {
        // set values in package index and make it visible
        this.pallets[this.skuSearchPalletIndex].packages[this.skuSearchPackageIndex].packageSKU = this.skuVariants[this.skuVariantIndexSelected].skuNumber
        this.pallets[this.skuSearchPalletIndex].packages[this.skuSearchPackageIndex].packageDescription = this.skuVariants[this.skuVariantIndexSelected].productName + "," + this.skuVariants[this.skuVariantIndexSelected].variantName
        this.pallets[this.skuSearchPalletIndex].packages[this.skuSearchPackageIndex].variantId = this.skuVariants[this.skuVariantIndexSelected].variantId
        this.pallets[this.skuSearchPalletIndex].packages[this.skuSearchPackageIndex].productId = this.skuVariants[this.skuVariantIndexSelected].productId
        this.pallets[this.skuSearchPalletIndex].packages[this.skuSearchPackageIndex].barcode = this.skuVariants[this.skuVariantIndexSelected].barcode

        // clear everything related to modal
        this.clearVariantSelection()

        console.log(this.pallets)
      }

    },

    addPallet() {
      this.pallets.push({
        palletNumber: null,
          palletContents: null,
          palletWeight: null,
          palletLength: null,
          palletWidth: null,
          palletHeight: null,
          packages: [],
      })
    },

    deletePallet(counter) {
      let response = confirm("This will delete entire " + this.packingType +" - " + (counter + 1) + " (contains " + this.pallets[counter].packages.length + " items). Are you sure?")
      if (response === true) {
        this.pallets.splice(counter, 1)
      }
    },


    addPackageDetails(palletIndex) {
      this.pallets[palletIndex].packages.push({
        packageDescription: null,
        packageSKU: null,
        packageQuantity: null,
        packageWeight: null,
        packageDimensions: null,
        packageBatchNumber: null,
        packageExpiryDate: null,
        variantId: null,
        productId: null,
        barcode: null,
      })

      this.skuVariantModelView = true
      this.skuSearchPalletIndex = palletIndex
      this.skuSearchPackageIndex = this.pallets[palletIndex].packages.length - 1

    },

    deletePackageDetails(palletIndex, counter2) {
      let response = confirm("This will remove current item details. Are you sure?")
      if (response === true) {
        this.pallets[palletIndex].packages.splice(counter2, 1)
      }
    },

    getVendorDetails() {

      axios.post(this.APIHOST + '/infra/get-vendor-details/', {}, {
        headers: this.headers
      })
      .then(response => {
        console.log(response.data.response)
        this.shipFromDetails = response.data.response.payload
        this.shipFromAddresses = response.data.response.address

        if (this.shipFromAddresses.length == 0) {
          if (confirm("You've not added any addresses from where your products would be shipped. \n\nWould you like to add one?")) {
            this.$router.push('/manage/address')
          } else {
            alert('You need to add an address to create ASN.')
          }
        }

      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })

    },

    getWarehouseDetails() {

      axios.get(this.APIHOST + '/infra/get-warehouse-details/', {
        headers: this.headers
      })
      .then(response => {
        console.log(response.data.response)
        this.warehouseDetails = response.data.response.payload

      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })

    },

    getWarehouseOrRetailerDetails(event) {
      this.shipmentType = event.target.value

      let url = null
      if (event.target.value === 'Send to ConnectCo warehouse') {

        axios.get(this.APIHOST + '/infra/get-warehouse-details/', {
          headers: this.headers,
        })
        .then(response => {
          console.log(response.data.response)
          this.warehouseDetails = response.data.response.payload

        })
        .catch(error => {
          alert(JSON.stringify(error.response.data))
          console.log(error)
        })

      } else if (event.target.value === 'Deliver to Retailer without stocking') {

        axios.get(this.APIHOST + '/inbound/get-all-retailers/', {
          headers: this.headers
        })
        .then(response => {
          console.log(response.data.response)
          this.retailers = response.data.response

          if (this.retailers.length == 0) {
            if (confirm("You've not added any retailers yet. \n\nWould you like to add one?")) {
              this.$router.push('/manage/retailer')
            } else {
              alert('You need to add a retailer to Deliver to Retailer directly (without stocking in Warehouse), else you will not be able to create this ASN. \n\nChoose Send to ConnectCo warehouse otherwise.')
            }
          }

        })
        .catch(error => {
          alert(JSON.stringify(error.response.data))
          console.log(error)
        })

      }

    },

    //getSKUbyID(palletIndex, packageIndex) {
    getSKUbyID() {

      axios.get(this.APIHOST + '/inbound/getVendorSkuById/', {
        params: {
          // skuNumber: this.pallets[palletIndex].packages[packageIndex].packageSKU
          skuNumber: this.skuSearch
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.skuVariants = response.data.response
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data.response))
        console.log(error)
      })

    },


    submitData() {

      let payload = {}

      // shipment From details & attach address
      payload['shipFromDetails'] = this.shipFromDetails
      payload.shipFromDetails['address'] = this.shipFromAddresses[this.shipFromAddressSelected]

      payload['shipToDetails'] = {
        shipmentType: this.shipmentType,
      }

      if (this.shipmentType === 'Send to ConnectCo warehouse') {
        payload.shipToDetails['warehouseDetails'] = this.warehouseDetails[this.warehouseSelected]

      } else if (this.shipmentType === 'Deliver to Retailer without stocking') {
        payload.shipToDetails['retailerDetails'] = this.retailers[this.retailerSelected]
      }

      payload['shipmentDetails'] = {
        courierType: this.courierType,
      }

      if (this.courierType === 'Use ConnectCo delivery') {
        payload.shipmentDetails['warehouseCourierPickupDate'] = this.warehouseCourierPickupDate
        payload.shipmentDetails['warehouseCourierPickupSlot'] = this.warehouseCourierPickupSlot
      } else if (this.courierType === 'Use other 3rd party delivery') {
        payload.shipmentDetails['ownShipmentCarrier'] = this.ownShipmentCarrier
        payload.shipmentDetails['ownShipmentTrackingNum'] = this.ownShipmentTrackingNum
        payload.shipmentDetails['ownShipmentDate'] = this.ownShipmentDate
      }

      payload['packingType'] = this.packingType
      payload['pallets'] = this.pallets
      payload['shippingInstructions'] = this.shippingInstructions
      payload['warehouseId'] = this.warehouseDetails[this.warehouseSelected].id


      console.log(JSON.stringify(payload))

      axios.post(this.APIHOST + '/inbound/add-asn/', {
        payload: payload,
      }, {
        headers: this.headers
      })
      .then(response => {
        if (response.status == 200) {
          alert(response.data.response)
          this.successAsn = response.data.response
          this.visibleAsnDetailsDiv = false
          this.visibleAsnSuccess = true
        }
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      });

    },

    showBulkAddItems(palletIndex) {
      this.bulkAddItemsModal = true
      this.selectedPalletIndex = palletIndex

      axios.get(this.APIHOST + '/inbound/getAllVendorSKUs/', {
        params: {
          page_size: 10000,
          page_seq: 1
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        let allSKUs = response.data.response.payloads
        this.bulkSKUs = []
        for (let counter = 0; counter<allSKUs.length; counter++) {
          let sku = {
            skuNumber: allSKUs[counter].skuNumber,
            productName: allSKUs[counter].productName,
            description: allSKUs[counter].description,
            variantId: allSKUs[counter].variantId,
            variantName: allSKUs[counter].variantName,
            packaging: allSKUs[counter].packaging,
            colour: allSKUs[counter].colour,
            images: allSKUs[counter].images,
            quantity: null,
            barcode: allSKUs[counter].barcode,
          }
          this.bulkSKUs.push(sku)
        }
        console.log(this.bulkSKUs)
        
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })
    },

    cancelBulkAddItems() {
      this.bulkAddItemsModal = false
      this.selectedPalletIndex = null
      this.bulkSKUs = null
    },

    addBulkItems() {

      for (let counter=0; counter<this.bulkSKUs.length; counter++) {
        if (this.bulkSKUs[counter].quantity !== null && this.bulkSKUs[counter].quantity > 0) {
          
          // add items to Box
          this.pallets[this.selectedPalletIndex].packages.push({
            packageDescription: this.bulkSKUs[counter].productName + "," + this.bulkSKUs[counter].variantName,
            packageSKU: this.bulkSKUs[counter].skuNumber,
            packageQuantity: this.bulkSKUs[counter].quantity,
            packageWeight: null,
            packageDimensions: null,
            packageBatchNumber: null,
            packageExpiryDate: null,
            variantId: this.bulkSKUs[counter].variantId,
            productId: this.bulkSKUs[counter].productId,
            barcode: this.bulkSKUs[counter].barcode,
          })
        }
      }

      // close modal and de-initialize
      this.cancelBulkAddItems()
    },

    showBulkFileAdd(palletIndex) {
      this.bulkAddFileModal = true
      this.selectedPalletIndex = palletIndex

      axios.get(this.APIHOST + '/inbound/getAllVendorSKUs/', {
        params: {
          page_size: 10000,
          page_seq: 1
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        let allSKUs = response.data.response.payloads
        this.allSKUsForMatch = []
        for (let counter = 0; counter<allSKUs.length; counter++) {
          let sku = {
            skuNumber: allSKUs[counter].skuNumber,
            productName: allSKUs[counter].productName,
            description: allSKUs[counter].description,
            variantId: allSKUs[counter].variantId,
            variantName: allSKUs[counter].variantName,
            packaging: allSKUs[counter].packaging,
            colour: allSKUs[counter].colour,
            images: allSKUs[counter].images,
            quantity: null,
            barcode: allSKUs[counter].barcode,
          }
          this.allSKUsForMatch.push(sku)
        }
        console.log(this.allSKUsForMatch)
        
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })
    },

    cancelBulkAddItemsFile() {
      this.bulkAddFileModal = false
      this.selectedPalletIndex = null
      this.bulkFileDataRaw = null
      this.bulkFileSKUsRaw = []
      this.bulkFileSKUs = []
      this.bulkFileUnmatchedRows = []
      this.allSKUsForMatch = []
    },

    processBulkUploadFile() {

      this.bulkFileDataRaw = null
      this.bulkFileSKUsRaw = []
      this.bulkFileSKUs = []
      this.bulkFileUnmatchedRows = []

      const file = document.getElementById('bulk_upload_file').files[0]

      if (file == undefined) {
        alert("No file selected")

      } else {

        const textType = /text.*/      

        if (file.type.match(textType)) {
          var reader = new FileReader()
          reader.addEventListener('load', () => {
            this.bulkFileDataRaw = reader.result

            // process data

            let list_of_items = this.bulkFileDataRaw.split(/\r?\n/)
            console.log(list_of_items)

            if (list_of_items == undefined || list_of_items == null) {
              alert("Check file format - unable to process")
            }

            else if (list_of_items.length == 1) {
              alert("Only 1 record in file - cannot process further. Do not lose header.")
            } 

            else {
              this.bulkFileSKUsRaw = list_of_items.splice(1)
              console.log(this.bulkFileSKUsRaw)

              // loop and match SKUs
              for (let counter = 0; counter < this.bulkFileSKUsRaw.length; counter++) {

                let item = this.bulkFileSKUsRaw[counter]
                let item_clean = item.replace('"\"').replace('"').replace('\'')
                let item_elements = item_clean.split(",")
                console.log(item_elements)

                // if ((item_elements.length == this.templateNumColumns) || (item_elements.length == this.templateNumColumns + 1)) {
                  // added a buffer 1 for blank space added by Excel

                console.log(item_elements.length)
                console.log(this.templateNumColumns)

                if (item_elements.length !== 5) {

                  this.bulkFileUnmatchedRows.push({
                    row: counter+1,
                    data: item,
                    reason: 'Number of columns do not match. Expected: 5, Present: ' + item_elements.length
                  })
                } else {
                  let skuMatch = 0

                  for (let skuCounter = 0; skuCounter < this.allSKUsForMatch.length; skuCounter++) {
                    // match skuNumber and VariantID
                    
                    if (this.allSKUsForMatch[skuCounter].skuNumber == item_elements[0] && this.allSKUsForMatch[skuCounter].variantId == item_elements[1]) {
                      // match - so add sku to bulk add
                      skuMatch = 1
                      this.bulkFileSKUs.push({
                        skuNumber: this.allSKUsForMatch[skuCounter].skuNumber,
                        productName: this.allSKUsForMatch[skuCounter].productName,
                        description: this.allSKUsForMatch[skuCounter].description,
                        variantId: this.allSKUsForMatch[skuCounter].variantId,
                        variantName: this.allSKUsForMatch[skuCounter].variantName,
                        packaging: this.allSKUsForMatch[skuCounter].packaging,
                        colour: this.allSKUsForMatch[skuCounter].colour,
                        images: this.allSKUsForMatch[skuCounter].images,
                        barcode: this.allSKUsForMatch[skuCounter].barcode,
                        quantity: item_elements[2],
                        batchNumber: item_elements[3],
                        expiryDate: item_elements[4],
                      })
                    } // end of SKU match

                  } // end pf SKU match for

                  // item didn't match in the entire SKU base
                  if (skuMatch == 0) {
                    this.bulkFileUnmatchedRows.push({
                      row: counter+1,
                      data: item,
                      reason: 'SKU/VariantId not present in your existing SKU base'
                    })
                  } // end of no match in base


                } // end of else - SKU match

              } // end of item loop
            }

            // end: process data
          })
          reader.readAsText(file, 'UTF-8')

        } else {
          alert('File is not supported')
        } // end of text type match

      } // end of no file selected
      
    },

    addBulkItemsFile() {
      for (let counter=0; counter<this.bulkFileSKUs.length; counter++) {
          
        // add items to Box
        this.pallets[this.selectedPalletIndex].packages.push({
          packageDescription: this.bulkFileSKUs[counter].productName + "," + this.bulkFileSKUs[counter].variantName,
          packageSKU: this.bulkFileSKUs[counter].skuNumber,
          packageQuantity: this.bulkFileSKUs[counter].quantity,
          packageWeight: null,
          packageDimensions: null,
          packageBatchNumber: this.bulkFileSKUs[counter].batchNumber,
          packageExpiryDate: this.bulkFileSKUs[counter].expiryDate,
          variantId: this.bulkFileSKUs[counter].variantId,
          productId: this.bulkFileSKUs[counter].productId,
          barcode: this.bulkFileSKUs[counter].barcode,
        })
        
      }

      // close modal and de-initialize
      this.cancelBulkAddItemsFile()
    },

    reloadPage() {
      location.reload()
    },

    toggleBillingAddress() {
      this.visibleBillingAddress = !this.visibleBillingAddress
    },

    selectRadio(elementId, indexVariant) {
      document.getElementById(elementId+indexVariant).checked = true
      this.skuVariantIndexSelected = indexVariant // for bug fix: enable Confirm button on selection, mimic function: selectVariantIndex(event) from above
      console.log(this.skuVariantIndexSelected)
    },

  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
    this.getVendorDetails()
    // this.getWarehouseDetails()
  }, // end created
}

</script>

<style scoped>

</style>
