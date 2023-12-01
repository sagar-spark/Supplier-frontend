<template>
  <CRow>
    <CCol :xs="12" class="mb-2">
      <h2>Orders</h2>
    </CCol>
  </CRow>

  <CRow>
    <CCol :xs="12">
      <CCard class="mb-4">
        <CCardHeader>
          <strong>All Orders</strong>
        </CCardHeader>
        <CCardBody>
          <span v-if="this.allOrders == null">
            <CSpinner component="span" size="sm" aria-hidden="true"/>&nbsp;Loading...
          </span>
          <CSmartTable
            cleaner
            :columns="this.ordersTableColumns"
            header
            :items-per-page="20"
            items-per-page-select
            :items="this.ordersTableData"
            pagination
            columnSorter
            table-filter
            :table-props="{
              hover: true,
            }"
            v-if="this.ordersTableData.length > 0"
          >

            <template #order_id="{ item }">
              <td>
                {{item.order_id.id}}
                <p class="text-medium-emphasis small">Ref: {{item.order_id.externalOrderId}}</p>
                <CIcon icon="cil-info" class="mb-2" alt="View order details" /><br>
              </td>
            </template>

            <template #dt_ts="{ item }">
              <td>
                {{item.dt_ts.dt}}
                <p class="text-medium-emphasis small" v-if="item.dt_ts.originalDate">Ref: {{item.dt_ts.originalDate}}</p>
              </td>
            </template>

            <template #source="{ item }">
              <td>
                {{getFriendlySource(item.source)}}
              </td>
            </template>

            <template #amount="{ item }">
              <td>
                {{item.amount.billing_currency}}&nbsp;{{item.amount.billingAmount}}
              </td>
            </template>

            <template #customer="{ item }">
              <td>
                <strong>{{item.customer.name}}</strong>
                <p class="text-medium-emphasis small">
                  Phone: {{item.customer.contact.phone}}<br>
                  Email: {{item.customer.contact.email}}<br>
                  Address: {{item.customer.shipping_address.addressline}}, {{item.customer.shipping_address.city}}, {{item.customer.shipping_address.state}}, {{item.customer.shipping_address.country}} - {{item.customer.shipping_address.zip}}
                </p>
              </td>
            </template>

            <template #items="{ item }">
              <td width="35%">
                <CRow v-for="(order_item, itemIndex) in item.items">
                  <CCol :md="7">
                    {{order_item.itemPayload.quantity}} x 
                    <strong>
                      <span v-html="order_item.itemPayload.title"></span>
                    </strong>
                    <br>
                    <span class="text-medium-emphasis small" v-if="order_item.itemPayload.variantTitle" v-html="order_item.itemPayload.variantTitle"></span>
                    <br>
                    <span class="text-medium-emphasis small" v-if="order_item.itemPayload.name" v-html="order_item.itemPayload.name"></span>
                  </CCol>
                  <CCol :md="3">
                    <span class="text-medium-emphasis small">
                      <CBadge class="mb-2" :color="getOrderStatusBadge(this.getRecentStatus(order_item.itemStatus))?.color">{{ getOrderStatusBadge(this.getRecentStatus(order_item.itemStatus))?.name }}</CBadge>
                    </span>
                  </CCol>
                  <CCol :md="2">
                    <CButton color="dark" size="sm" class="mt-1 mb-1" variant="outline" @click="this.showModalItemMovement(order_item.itemStatus)">
                      <CIcon icon="cil-running" class="mt-1" alt="Show details"/>
                    </CButton>
                  </CCol>
                  
                  <hr class="mt-1" style="dotted" v-if="item.items.length > 1 && itemIndex < item.items.length -1">
                </CRow>
              </td>
            </template>
          </CSmartTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

  <!-- Modal for item movement -->

  <CModal alignment="center" backdrop="static" :visible="this.viewModalItemMovement" @close="this.clearModalItemMovement()">

    <CModalHeader dismiss color="bg-primary" @close="this.clearModalItemMovement()">
      <CModalTitle>
        Item movement details
      </CModalTitle>
    </CModalHeader>

    <CModalBody>

      <CRow class="mb-0">
        <CCol :md="1">
          <CIcon icon="cil-cart" />
        </CCol>
        <CCol :md="11">
          <span v-if="this.selectedItemMovementDetails.created !== undefined">
            <span class="primary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('created').color">{{ getOrderStatusBadge('created').name }}</CBadge>&nbsp;&nbsp;
              <strong>Order Created</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">{{this.selectedItemMovementDetails.created.timestamp}}, {{this.selectedItemMovementDetails.created.userId.userId}}</p>
          </span>
          <span v-else>
            <span class="secondary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('created').color">{{ getOrderStatusBadge('created').name }}</CBadge>
              <br>
              <strong>Order Created</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">Pending</p>
          </span>
        </CCol>
      </CRow>

      <hr>
      <CRow class="mb-0">
        <CCol :md="1">
          <CIcon icon="cil-braille" />
        </CCol>
        <CCol :md="11">
          <span v-if="this.selectedItemMovementDetails.picked !== undefined">
            <span class="primary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('picked').color">{{ getOrderStatusBadge('picked').name }}</CBadge>&nbsp;&nbsp;
              <strong>Item picked at Warehouse</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">{{this.selectedItemMovementDetails.picked.timestamp}}, {{this.selectedItemMovementDetails.picked.userId.userId}}</p>
          </span>
          <span v-else>
            <span class="secondary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('picked').color">{{ getOrderStatusBadge('picked').name }}</CBadge>&nbsp;&nbsp;
              <strong>Item picked at Warehouse</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">Pending</p>
          </span>
        </CCol>
      </CRow>

      <hr>
      <CRow class="mb-0">
        <CCol :md="1">
          <CIcon icon="cil-hand-point-down" />
        </CCol>
        <CCol :md="11">
          <span v-if="this.selectedItemMovementDetails.sortdrop !== undefined">
            <span class="primary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('sortdrop').color">{{ getOrderStatusBadge('sortdrop').name }}</CBadge>&nbsp;&nbsp;
              <strong>Arrived at Sorting area</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">{{this.selectedItemMovementDetails.sortdrop.timestamp}}, {{this.selectedItemMovementDetails.sortdrop.userId.userId}}</p>
          </span>
          <span v-else>
            <span class="secondary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('sortdrop').color">{{ getOrderStatusBadge('sortdrop').name }}</CBadge>&nbsp;&nbsp;
              <strong>Arrived at Sorting area</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">Pending</p>
          </span>
        </CCol>
      </CRow>

      <hr>
      <CRow class="mb-0">
        <CCol :md="1">
          <CIcon icon="cil-blur-linear" />
        </CCol>
        <CCol :md="11">
          <span v-if="this.selectedItemMovementDetails.packed !== undefined">
            <span class="primary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('packed').color">{{ getOrderStatusBadge('packed').name }}</CBadge>&nbsp;&nbsp;
              <strong>Quality checked & Packed</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">{{this.selectedItemMovementDetails.packed.timestamp}}, {{this.selectedItemMovementDetails.packed.userId.userId}}</p>
          </span>
          <span v-else>
            <span class="secondary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('packed').color">{{ getOrderStatusBadge('packed').name }}</CBadge>&nbsp;&nbsp;
              <strong>Quality checked & Packed</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">Pending</p>
          </span>
        </CCol>
      </CRow>

      <hr>
      <CRow class="mb-0">
        <CCol :md="1">
          <CIcon icon="cil-blur-linear" />
        </CCol>
        <CCol :md="11">
          <span v-if="this.selectedItemMovementDetails.shipped !== undefined">
            <span class="primary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('shipped').color">{{ getOrderStatusBadge('shipped').name }}</CBadge>&nbsp;&nbsp;
              <strong>Shipped</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">{{this.selectedItemMovementDetails.shipped.timestamp}}, {{this.selectedItemMovementDetails.shipped.userId.userId}}</p>
          </span>
          <span v-else>
            <CBadge class="mb-2" :color="getOrderStatusBadge('shipped').color">{{ getOrderStatusBadge('shipped').name }}</CBadge>&nbsp;&nbsp;
            <span class="secondary">
              <strong>Shipped</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">Pending</p>
          </span>
        </CCol>
      </CRow>

      <hr>
      <CRow class="mb-0">
        <CCol :md="1">
          <CIcon icon="cil-truck" />
        </CCol>
        <CCol :md="11">
          <span v-if="this.selectedItemMovementDetails.delivered !== undefined">
            <span class="primary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('delivered').color">{{ getOrderStatusBadge('delivered').name }}</CBadge>&nbsp;&nbsp;
              <strong>Delivered</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">{{this.selectedItemMovementDetails.delivered.timestamp}}, {{this.selectedItemMovementDetails.delivered.userId.userId}}</p>
          </span>
          <span v-else>
            <span class="secondary">
              <CBadge class="mb-2" :color="getOrderStatusBadge('delivered').color">{{ getOrderStatusBadge('delivered').name }}</CBadge>&nbsp;&nbsp;
              <strong>Delivered</strong>
            </span>
            <p class="text-medium-emphasis small mb-0">Pending</p>
          </span>
        </CCol>
      </CRow>

      <div v-if="this.selectedItemMovementDetails.cancelled !== undefined">
        <hr>
        <CRow class="mb-0">
          <CCol :md="1">
            <CIcon icon="cil-truck" />
          </CCol>
          <CCol :md="11">
            <span v-if="this.selectedItemMovementDetails.cancelled !== undefined">
              <span class="primary">
                <CBadge class="mb-2" :color="getOrderStatusBadge('cancelled').color">{{ getOrderStatusBadge('cancelled').name }}</CBadge>&nbsp;&nbsp;
                <strong>Cancelled</strong>
              </span>
              <p class="text-medium-emphasis small mb-0">{{this.selectedItemMovementDetails.cancelled.timestamp}}, {{this.selectedItemMovementDetails.cancelled.userId.userId}}</p>
            </span>
            <span v-else>
              <span class="secondary">
                <CBadge class="mb-2" :color="getOrderStatusBadge('cancelled').color">{{ getOrderStatusBadge('cancelled').name }}</CBadge>&nbsp;&nbsp;
                <strong>Cancelled</strong>
              </span>
              <p class="text-medium-emphasis small mb-0">Pending</p>
            </span>
          </CCol>
        </CRow>
      </div>

      <hr style="dashed">
      
    </CModalBody>

    <CModalFooter>
      <CButton color="secondary" @click="this.clearModalItemMovement()">Close</CButton>
    </CModalFooter>

  </CModal>


</template>

<script>

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'


export default {
  name: "Orders",

  setup() {

    const getFriendlySource = (source) => {
      switch (source) {
        case 'ORDER_FORM': return 'Order Form'
        case 'SHOPIFY': return 'Shopify'
        default: return source
      }
    }

    const getOrderStatusBadge = (order_status) => {
      switch (order_status) {
        case 'created': return {name: 'CREATED', color: 'dark'}
        case 'cancelled': return {name: 'CANCELLED', color: 'warning'}
        case 'packed': return {name: 'PACKED', color: 'info'}
        case 'picked': return {name: 'FULFILLMENT', color: 'info'}
        case 'sortdrop': return {name: 'FULFILLMENT', color: 'info'}
        case 'shipped': return {name: 'SHIPPED', color: 'primary'}
        case 'delivered': return {name: 'DELIVERED', color: 'success'}
      }
    }

    return {
      getFriendlySource,
      getOrderStatusBadge,
    }

  },
  
  data: () => {
    return {

      // headerToken
      APIHOST: process.env.VUE_APP_APIS_HOST === undefined ? '' : process.env.VUE_APP_APIS_HOST,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': vueCookies.get('accessToken')
      },


      // models
      allOrders: null,

      ordersTableData: [],
      ordersTableColumns: [
        {
          key: 'order_id',
          label: 'Order ID',
        },
        {
          key: 'dt_ts',
          label: 'Date',
        },
        {
          key: 'source',
          label: 'Source',
        },
        {
          key: 'amount',
          label: 'Amount',
        },
        {
          key: 'customer',
          label: 'Customer details',
        },
        {
          key: 'items',
          label: 'Items',
        },
      ],

      // item movement details
      viewModalItemMovement: false,
      selectedItemMovementDetails: null,
      
    }
  }, //end of Data

  methods: {
    getRecentStatus(itemStatus) {
      let max_timestamp = null
      let recentStatus = null
      Object.keys(itemStatus).forEach(function(key) {
        if (max_timestamp == null) {
          recentStatus = key
          max_timestamp = itemStatus[key].timestamp
        }
        else if (itemStatus[key].timestamp == null) {
          // pass
        }
        else if (itemStatus[key].timestamp > max_timestamp) {
          recentStatus = key
          max_timestamp = itemStatus[key].timestamp
        }
      })

      return recentStatus.toLowerCase()
    },
    getAllOrders() {
      axios.get(this.APIHOST + '/infra/getOrderItems/', {
        params: {
          page_seq: 1,
          page_size: 1000,
        },
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.allOrders = response.data.response.payloads

        // prepare data for Smart table
        for (let counter = 0; counter < this.allOrders.length; counter++) {
          let orderDetails = {
            order_id: {
              id: this.allOrders[counter].id,
              externalOrderId: this.allOrders[counter].externalOrderId,
            },
            dt_ts: {
              'dt': this.allOrders[counter].createdDate,
              'originalDate': this.allOrders[counter].originalDate,
            },
            source: this.allOrders[counter].source,
            items: this.allOrders[counter].orderItems,
            customer: this.allOrders[counter].customer,
            amount: {
              'billing_currency': this.allOrders[counter].billing_currency,
              'billingAmount': this.allOrders[counter].billingAmount,
            },
          }

          this.ordersTableData.push(orderDetails)

        }
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data.response))
        console.log(error)
      })
    },

    cancelOrderItem(orderItemId, item_name, variant_name, quantity) {
      if (confirm('Are you sure you want to cancel order item of\n\n ' + quantity + ' x ' + item_name + ', ' + variant_name + " ?")) {
        // else item to be canceled
      } 
    },

    showModalItemMovement(movementDetails) {
      this.selectedItemMovementDetails = movementDetails
      this.viewModalItemMovement = true
    },

    clearModalItemMovement() {
      this.selectedItemMovementDetails = null
      this.viewModalItemMovement = false
    },

  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
    this.getAllOrders()
  }, // end created

}

</script>


<style scoped>

</style>