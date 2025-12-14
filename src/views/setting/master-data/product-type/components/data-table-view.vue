<template>
  <div class="list-data-table-container">
    <DataTableComponent
      :items="productTypes"
      :columns="columns"
      :total-records="totalRecords"
      :per-page="perPage"
      :rows-per-page-options="[10, 20, 50, 100]"
      :empty-message="$t('productType.noData') || 'ไม่พบข้อมูลประเภทสินค้า'"
      data-key="id"
      :show-gridlines="true"
      :paginator="true"
      @page="handlePageChange"
      @sort="handleSortChange"
    >
      <!-- Code Template -->
      <template #codeTemplate="{ data }">
        <div class="list-name-cell">
          <i class="pi pi-tag list-item-icon"></i>
          <span>{{ data.code }}</span>
        </div>
      </template>

      <!-- Name (Thai) Template -->
      <template #nameThTemplate="{ data }">
        <div class="list-name-cell">
          <i class="pi pi-circle list-item-icon"></i>
          <span>{{ data.nameTh }}</span>
        </div>
      </template>

      <!-- Name (English) Template -->
      <template #nameEnTemplate="{ data }">
        <div class="list-username-cell">
          <span>{{ data.nameEn }}</span>
        </div>
      </template>

      <!-- Product Code Template -->
      <template #productCodeTemplate="{ data }">
        <div class="list-username-cell">
          <span>{{ data.productCode || '-' }}</span>
        </div>
      </template>

      <!-- Silver Code Template -->
      <template #silverCodeTemplate="{ data }">
        <div class="list-username-cell">
          <span>{{ data.silverCode || '-' }}</span>
        </div>
      </template>

      <!-- Status Template -->
      <template #isActiveTemplate="{ data }">
        <div class="list-status-cell">
          <Tag
            :value="
              data.isActive
                ? $t('productType.columns.active') || 'ใช้งาน'
                : $t('productType.columns.inactive') || 'ไม่ใช้งาน'
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
    productTypes: {
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
          field: "id",
          header: this.$t("productType.columns.id") || "ID",
          sortable: true,
          width: "80px",
          align: "center"
        },
        {
          field: "code",
          header: this.$t("productType.columns.code") || "รหัสประเภทสินค้า",
          sortable: true,
          width: "150px"
        },
        {
          field: "nameTh",
          header: this.$t("productType.columns.nameTh") || "ชื่อประเภทสินค้า (ไทย)",
          sortable: true,
          minWidth: "200px"
        },
        {
          field: "nameEn",
          header: this.$t("productType.columns.nameEn") || "ชื่อประเภทสินค้า (อังกฤษ)",
          sortable: true,
          minWidth: "200px"
        },
        {
          field: "productCode",
          header: this.$t("productType.columns.productCode") || "รหัสสินค้า",
          sortable: true,
          width: "150px"
        },
        {
          field: "silverCode",
          header: this.$t("productType.columns.silverCode") || "รหัสเงิน",
          sortable: true,
          width: "150px"
        },
        {
          field: "isActive",
          header: this.$t("productType.columns.status") || "สถานะ",
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
      // Forward the event directly from data-table.vue which already has the correct format
      this.$emit("sort-change", event);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/list-page-templete/data-table-view.scss";
</style>
