<template>
  <CRow class="mb-3">
    <CCol :md="12">
      <h2>Dashboard</h2>
    </CCol>
  </CRow>
  
  <CRow class="mb-4">
    <CCol :md="12">
      <CCard style="max=width: 540px">
        <CRow class="g-0">
          <CCol :md="4">
            <CCardImage class="rounded-0" src="/images/general/new-setup.jpg" />
          </CCol>
          <CCol :md="8" class="p-3">
            <CCardBody>
              <CCardTitle class="h3">Welcome to ConnectCo Supplier Portal</CCardTitle>
              <CCardText>Create Advance shipment notices, track quality checks & inventory details in real-time as they move through our warehouse using this portal. You can follow our guided workflow to help you get started.
              </CCardText>
              <CCardText class="mt-4">
                <CNavLink href="/#/manage/getting-started" active>
                  <CButton color="primary">Get started</CButton>
                </CNavLink>
              </CCardText>
            </CCardBody>
          </CCol>
        </CRow>
      </CCard>
    </CCol>
  </CRow>

  <!-- Charts -->
  <CRow v-if="this.stats == null">
    <CCol :xs="12">
      <CSpinner component="span" size="sm" aria-hidden="true"/>&nbsp;Fetching insights...
    </CCol>
  </CRow>

  <div v-if="this.stats">

    <CRow>
      <CCol :xs="12">
        <h4 class="mb-2">Since your onboarding...</h4>
      </CCol>

      <CCol :xs="3" class="me-4">
        <CWidgetStatsB class="mb-4" :progress="{ color: 'info', value: 100 }">
          <template #text>
            <h6 class="mb-3">Advance Shipment Notices created by you</h6>
            <div>
              <CLink class="btn btn-sm btn-primary" href="/#/inbound/asn-create">Create ASN</CLink>
              <CLink class="btn btn-sm btn-primary me-0 float-end" href="/#/inbound/asn">View all</CLink>
            </div>
          </template>
          <template #title><h5>ASN Created</h5></template>
          <template #value>{{this.format_number(this.stats.asn.totalCount, 0)}}</template>
        </CWidgetStatsB>
      </CCol>

      <CCol :xs="3" class="me-4">
        <CWidgetStatsB class="mb-4" :progress="{ color: 'info', value: this.calcRatio(this.stats.asn.grnCreated, this.stats.asn.totalCount) }">
          <template #text>
            <h6 class="mb-3">Goods Receipt Notes created by Warehouse</h6>
            <div>
              <CLink class="btn btn-sm btn-primary" href="/#/" disabled>Nudge warehouse</CLink>
            </div>
          </template>
          <template #title><h5>GRN Created</h5></template>
          <template #value>{{this.format_number(this.stats.asn.grnCreated, 0)}}</template>
        </CWidgetStatsB>
      </CCol>

      <CCol :xs="3" class="me-4">
        <CWidgetStatsB class="mb-4" :progress="{ color: 'info', value: this.calcRatio(this.stats.asn.grnConfirmed, this.stats.asn.grnCreated) }">
          <template #text>
            <h6 class="mb-3">Goods Receipt Notes confirmed by you</h6>
            <div>
              <CLink class="btn btn-sm btn-primary" href="/#/inbound/approve-grn">Approve GRN</CLink>
            </div>
          </template>
          <template #title><h5>GRN Approved</h5></template>
          <template #value>{{this.format_number(this.stats.asn.grnConfirmed, 0)}}</template>
        </CWidgetStatsB>
      </CCol>
    </CRow>

   <CRow>
    <CCol :xl="4">
      <CRow>

        <!-- Total orders -->
        <CCol :lg="6">
          <CCard class="mb-4">
            <CCardBody>
              <div class="d-flex justify-content-between">
                <CCardTitle component="div">
                  <CIcon icon="cil-cart" class="text-primary mb-2" size="xl" />
                  <h5>Fulfilled Orders</h5>
                </CCardTitle>
              </div>
              <div class="fs-3 fw-semibold pb-1">
                {{this.format_number(this.calcTotal(this.stats.orders.data.fullfilledCounts), 0)}}
              </div>
              <!-- <small class="text-danger">
                (-12.4% <CIcon icon="cil-arrow-bottom" />)
              </small> -->
            </CCardBody>
          </CCard>
        </CCol>

        <CCol :lg="6">
          <CCard class="mb-4">
            <CCardBody>
              <div class="d-flex justify-content-between">
                <CCardTitle component="div">
                  <CIcon icon="cil-cart" class="text-danger mb-2" size="xl" />
                  <h5>Returned Orders</h5>
                </CCardTitle>
              </div>
              <div class="fs-3 fw-semibold pb-1">
                {{this.format_number(this.calcTotal(this.stats.orders.data.cancelledCounts), 0)}}
              </div>
              <!-- <small class="text-success">
                (17.2% <CIcon icon="cil-arrow-top" />)
              </small> -->
            </CCardBody>
          </CCard>
        </CCol>

        <CCol :lg="12">
          <CCard class="mb-4">
            <CCardBody class="p-4">
              <CRow>

                <!-- Order value -->
                <CCol>
                  <CCardTitle class="fs-4 fw-semibold">Order amount</CCardTitle>
                  <CCardSubtitle class="fw-normal text-disabled">
                    Fulfilled orders
                  </CCardSubtitle>
                </CCol>
                <CCol class="text-end text-primary fs-4 fw-semibold">
                  KWD {{this.format_number(this.calcTotal(this.stats.orders.data.fullfilledAmounts), 0)}}
                </CCol>
              </CRow>
            </CCardBody>
            <CChart
              type="line"
              class="mt-3"
              style="height: 150px"
              :data="{
                labels: this.stats.orders.labels,
                datasets: [
                  {
                    label: 'Orders',
                    backgroundColor: `rgba(${getStyle(
                      '--cui-primary-rgb',
                    )}, .1)`,
                    borderColor: getStyle('--cui-primary'),
                    borderWidth: 3,
                    data: this.stats.orders.data.fullfilledAmounts,
                    fill: true,
                  },
                ],
              }"
              :options="{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                maintainAspectRatio: false,
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    beginAtZero: true,
                    display: false,
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    tension: 0.4,
                  },
                  point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                  },
                },
              }"
            />
          </CCard>
        </CCol>

        

      </CRow>
    </CCol>
    <CCol :xl="8">
      <CCard class="mb-4">
        <CCardBody class="p-4">
          <CCardTitle class="fs-4 fw-semibold">Fulfilled and Returned orders</CCardTitle>
          <CCardSubtitle class="fw-normal text-disabled">
            Total count of orders
          </CCardSubtitle>
          <CChart
            type="bar"
            style="height: 300px; margin-top: 40px"
            :data="{
              labels: this.stats.orders.labels,
              datasets: [
                {
                  label: 'Fulfilled orders',
                  backgroundColor: getStyle('--cui-primary'),
                  borderRadius: 6,
                  borderSkipped: false,
                  data: this.stats.orders.data.fullfilledCounts,
                  barPercentage: 0.6,
                  categoryPercentage: 0.5,
                },
                {
                  label: 'New users',
                  backgroundColor: getStyle('--cui-gray-100'),
                  borderRadius: 6,
                  borderSkipped: false,
                  data: this.stats.orders.data.cancelledCounts,
                  barPercentage: 0.6,
                  categoryPercentage: 0.5,
                },
              ],
            }"
            :options="{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                    drawBorder: false,
                    drawTicks: false,
                  },
                  ticks: {
                    color: getStyle('--cui-text-disabled'),
                    font: {
                      size: 14,
                    },
                    padding: 16,
                  },
                },
                y: {
                  grid: {
                    drawBorder: false,
                    borderDash: [2, 4],
                  },
                  gridLines: {
                    borderDash: [8, 4],
                    color: '#348632',
                  },
                  ticks: {
                    beginAtZero: true,
                    color: getStyle('--cui-text-disabled'),
                    font: {
                      size: 14,
                    },
                    maxTicksLimit: 5,
                    padding: 16,
                    stepSize: Math.ceil(100 / 20),
                  },
                },
              },
            }"
          />
        </CCardBody>
      </CCard>
    </CCol>
   </CRow>
  </div>

  <div v-if="this.stats" class="mb-4">
    <CRow>
      <CCol :xs="2" v-if="this.order_stats[0].total_orders !== undefined && this.order_stats[0].total_orders > 0">
        <CNavLink href="/#/order-processing/all-orders">
          <CWidgetStatsE title="Orders Created" :value="this.order_stats[0].total_orders">
            <CIcon icon="cil-cart" size="xl" class="mb-1" />
          </CWidgetStatsE>
        </CNavLink>
      </CCol>
      
      <CCol :xs="2" v-if="this.order_stats[0].total_order_items > 0">
        <CNavLink href="/#/order-processing/all-orders">
          <CWidgetStatsE title="Orders Items" :value="this.order_stats[0].total_order_items">
            <CIcon icon="cil-braille" size="xl" class="mb-1" />
          </CWidgetStatsE>
        </CNavLink>
      </CCol>

      <CCol :xs="2" v-if="this.order_stats[0].count_processing > 0">
        <CNavLink href="/#/order-processing/all-orders?filter=processing">
          <CWidgetStatsE title="Items Processing / Delivered" :value="this.order_stats[0].count_processing">
            <CIcon icon="cil-blur-linear" size="xl" class="mb-1" />
          </CWidgetStatsE>
        </CNavLink>
      </CCol>

      <CCol :xs="2" v-if="this.order_stats[0].count_shipped > 0">
        <CNavLink href="/#/order-processing/all-orders?filter=shipped">
          <CWidgetStatsE title="Items Shipped" :value="this.order_stats[0].count_shipped">
            <CIcon icon="cil-truck" size="xl" class="mb-1" />
          </CWidgetStatsE>
        </CNavLink>
      </CCol>

      <CCol :xs="2" v-if="this.order_stats[0].count_delivered > 0">
        <CNavLink href="/#/order-processing/all-orders?filter=delivered">
          <CWidgetStatsE title="Items Delivered" :value="this.order_stats[0].count_delivered">
            <CIcon icon="cil-truck" size="xl" class="mb-1" />
          </CWidgetStatsE>
        </CNavLink>
      </CCol>

      <CCol :xs="2" v-if="this.order_stats[0].count_cancelled > 0">
        <CNavLink href="/#/order-processing/all-orders?filter=cancelled">
          <CWidgetStatsE title="Items Cancelled" :value="this.order_stats[0].count_cancelled">
            <CIcon icon="cil-truck" size="xl" class="mb-1" />
          </CWidgetStatsE>
        </CNavLink>
      </CCol>
    </CRow>
  </div>

  <div v-if="this.stats">
    <CRow>
      
      <CCol :xs="12" class="mb-3">
        <CCard text-color="dark" class="mb-1 border border-secondary">
          <CCardHeader>
            <h5>SKUs to go out of stock soon</h5>
          </CCardHeader>
          <CCardBody>
            <CSmartTable header columnSorter
              :columns="this.days_remaining_columns"
              :items="this.days_remaining_data"
              :table-props="{ hover: true, }"
              v-if="this.days_remaining_data.length > 0"
              pagination
              :items-per-page="5"
            >
            </CSmartTable>
          </CCardBody>
        </CCard>
      </CCol>

      <CCol :xs="6" class="mb-3">
        <CCard text-color="dark" class="mb-1 border border-secondary">
          <CCardHeader>
            <span class="h5">Top selling SKUs</span>
            <!-- <CLink v-if="this.csv_ready == true" class="btn btn-primary me-1 float-end" :href=downloadCSV_top_skus download="top_selling_skus.csv" target="_blank">
              <CIcon icon="cil-cloud-download" /> CSV
            </CLink> -->
          </CCardHeader>
          <CCardBody>
            <CSmartTable header columnSorter
              :columns="this.top_skus_columns"
              :items="this.top_skus_data"
              :table-props="{ hover: true, }"
              v-if="this.top_skus_data.length > 0"
              pagination
              :items-per-page="5"
            >
            </CSmartTable>

          </CCardBody>
        </CCard>
      </CCol>

      <CCol :xs="6" class="mb-3">
        <CCard text-color="dark" class="mb-1 border border-secondary">
          <CCardHeader>
            <h5>SKUs with low inventory</h5>
          </CCardHeader>
          <CCardBody>
            <CSmartTable header columnSorter
              :columns="this.low_stock_columns"
              :items="this.low_stock_data"
              :table-props="{ hover: true, }"
              v-if="this.low_stock_data.length > 0"
              pagination
              :items-per-page="5"
            >
            </CSmartTable>
          </CCardBody>
        </CCard>
      </CCol>

    </CRow>
  </div>


</template>

<script>
import { CChart } from '@coreui/vue-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils/src'

import axios from "axios"
import vueCookies from 'vue-cookies'
import {validateSession} from '@/store/session'

export default {
  name: 'Dashboard',
  components: {
    CChart,
  },
  setup() {

    return {
      getStyle,
      hexToRgba,
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
      stats: null,

      top_skus_columns: [
        {key: 'item_title', label: 'Item name'},
        {key: 'item_varianttitle', label: 'Variant name'},
        {key: 'total_item_quantity', label: 'Quantity'},
        {key: 'item_price', label: 'Item price'},
      ],
      top_skus_data: null,


      low_stock_columns: [
        {key: 'productName', label: 'Item name'},
        {key: 'variantName', label: 'Variant name'},
        {key: 'total_quantity', label: 'Current quantity'},
        {key: 'name', label: 'Warehouse'},
      ],
      low_stock_data: null,

      days_remaining_columns: [
        {key: 'productName', label: 'Item name'},
        {key: 'variantName', label: 'Variant name'},
        {key: 'currentQuantity', label: 'Current quantity'},
        {key: 'name', label: 'Warehouse'},
        {key: 'stock_available_for_days', label: 'Days till stock last'},
      ],
      days_remaining_data: null,

      order_stats: null,

    }
  }, //end of Data

  methods: {

    getStats() {
      axios.get(this.APIHOST + '/inbound/get-stats/', {
        params: {},
        headers: this.headers,
      })
      .then(response => {
        console.log(response.data.response)
        this.stats = response.data.response

        // distribute stats
        this.top_skus_data = this.stats.inventory.itemsSellTop
        this.low_stock_data = this.stats.inventory.itemsStockLow
        this.days_remaining_data = this.stats.inventory.itemsStockLowSoon
        this.order_stats = this.stats.inventory.itemsOrderStat
      })
      .catch(error => {
        alert(JSON.stringify(error.response.data))
        console.log(error)
      })

    },

    calcRatio(num, den) {
      console.log(num)
      console.log(den)
      console.log(Math.round(num / den * 100, 0))
      if (den != 0) {
        return Math.round(num / den * 100, 0)
      } else {
        return 0
      }
    },

    calcTotal(list) {
      return list.reduce((partSum, el) => partSum + el, 0);
    },

    format_number(num, precision) {
      num = Math.round(num, precision);
      let nStr = '' + num;
      let x = nStr.split('.');
      let x1 = x[0];
      let x2 = x.length > 1 ? '.' + x[1] : '';
      let rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
    },

  }, // end of methods

  beforeCreate() {
    validateSession(this.$router)
  }, // end beforeCreate

  created() {
    this.getStats()

  },
}
</script>
