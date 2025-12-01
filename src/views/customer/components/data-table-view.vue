<template>
  <div class="list-data-table-container">
    <DataTableComponent
      :items="customers"
      :columns="columns"
      :total-records="totalRecords"
      :per-page="perPage"
      :rows-per-page-options="[10, 20, 50, 100]"
      :empty-message="$t('customer.noData') || 'ไม่พบข้อมูลลูกค้า'"
      data-key="customerId"
      :show-gridlines="true"
      :paginator="true"
      @page="handlePageChange"
      @sort="handleSortChange"
    >
      <!-- Customer Number Template -->
      <template #customerNumberTemplate="{ data }">
        <div class="list-name-cell">
          <i class="pi pi-id-card list-item-icon"></i>
          <span>{{ data.customerNumber }}</span>
        </div>
      </template>

      <!-- Customer Name Template -->
      <template #customerNameTemplate="{ data }">
        <div class="list-name-cell">
          <i class="pi pi-user list-item-icon"></i>
          <span>{{ data.customerName }}</span>
        </div>
      </template>

      <!-- Email Template -->
      <template #emailTemplate="{ data }">
        <div class="list-email-cell">
          <i class="pi pi-envelope"></i>
          <span>{{ data.email || '-' }}</span>
        </div>
      </template>

      <!-- Phone Template -->
      <template #phoneTemplate="{ data }">
        <div class="list-email-cell">
          <i class="pi pi-phone"></i>
          <span>{{ data.phone || '-' }}</span>
        </div>
      </template>

      <!-- Country Template -->
      <template #countryTemplate="{ data }">
        <div class="list-username-cell">
          <span>{{ data.country || '-' }}</span>
        </div>
      </template>

      <!-- Status Template -->
      <template #isActiveTemplate="{ data }">
        <div class="list-status-cell">
          <Tag
            :value="
              data.isActive
                ? $t('customer.columns.active') || 'ใช้งาน'
                : $t('customer.columns.inactive') || 'ไม่ใช้งาน'
            "
            :severity="data.isActive ? 'success' : 'danger'"
          />
        </div>
      </template>

      <!-- Actions Template -->
      <template #actionsTemplate="{ data }">
        <div class="list-action-buttons">
          <!-- Edit Button -->
          <Button
            icon="pi pi-pencil"
            class="p-button-text p-button-info"
            v-tooltip.top="$t('common.edit') || 'แก้ไข'"
            @click="$emit('edit', data)"
          />
        </div>
      </template>
    </DataTableComponent>
  </div>
</template>

<script>
import DataTableComponent from "@/components/prime-vue/data-table.vue";
import Tag from "primevue/tag";
import Button from "primevue/button";

export default {
  name: "DataTableView",

  components: {
    DataTableComponent,
    Tag,
    Button
  },

  props: {
    customers: {
      type: Array,
      default: () => []
    },
    totalRecords: {
      type: Number,
      default: 0
    },
    perPage: {
      type: Number,
      default: 10
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      columns: [
        {
          field: "customerId",
          header: this.$t("customer.columns.id") || "ID",
          sortable: true,
          width: "80px",
          align: "center"
        },
        {
          field: "customerNumber",
          header: this.$t("customer.columns.customerNumber") || "รหัสลูกค้า",
          sortable: true,
          width: "150px"
        },
        {
          field: "customerName",
          header: this.$t("customer.columns.customerName") || "ชื่อลูกค้า",
          sortable: true,
          minWidth: "200px"
        },
        {
          field: "email",
          header: this.$t("customer.columns.email") || "อีเมล",
          sortable: false,
          minWidth: "200px"
        },
        {
          field: "phone",
          header: this.$t("customer.columns.phone") || "เบอร์โทร",
          sortable: false,
          width: "130px"
        },
        {
          field: "country",
          header: this.$t("customer.columns.country") || "ประเทศ",
          sortable: true,
          width: "120px"
        },
        {
          field: "isActive",
          header: this.$t("customer.columns.status") || "สถานะ",
          sortable: true,
          width: "120px",
          align: "center"
        },
        {
          field: "actions",
          header: this.$t("common.actions") || "จัดการ",
          sortable: false,
          width: "100px",
          align: "center"
        }
      ]
    };
  },

  methods: {
    handlePageChange(event) {
      console.log('Page change event:', event);
      this.$emit("page-change", {
        pageIndex: event.first / event.rows,
        pageSize: event.rows
      });
    },

    handleSortChange(event) {
      console.log('Sort change event:', event);
      const sortMeta = event.multiSortMeta;
      if (sortMeta && sortMeta.length > 0) {
        const primarySort = sortMeta[0];
        this.$emit("sort-change", {
          sortBy: primarySort.field,
          isDescending: primarySort.order === -1,
          pageIndex: event.first / event.rows,
          pageSize: event.rows
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/list-page-templete/data-table-view.scss";
</style>
