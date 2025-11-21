<template>
  <div class="list-data-table-container">
    <DataTableComponent
      :items="branches"
      :columns="columns"
      :total-records="totalRecords"
      :per-page="perPage"
      :rows-per-page-options="[10, 20, 50, 100]"
      :empty-message="$t('branch.noData') || 'ไม่พบข้อมูลสาขา'"
      data-key="branchId"
      :show-gridlines="true"
      :paginator="true"
      @page="handlePageChange"
      @sort="handleSortChange"
    >
      <!-- Name (Thai) Template -->
      <template #nameThTemplate="{ data }">
        <div class="list-name-cell">
          <i class="pi pi-building list-item-icon"></i>
          <span>{{ data.nameTh }}</span>
        </div>
      </template>

      <!-- Name (English) Template -->
      <template #nameEnTemplate="{ data }">
        <div class="list-username-cell">
          <span>{{ data.nameEn }}</span>
        </div>
      </template>

      <!-- Address Template -->
      <template #addressTemplate="{ data }">
        <div class="list-email-cell">
          <i class="pi pi-map-marker"></i>
          <span>{{ data.address || '-' }}</span>
        </div>
      </template>

      <!-- Status Template -->
      <template #isActiveTemplate="{ data }">
        <div class="list-status-cell">
          <Tag
            :value="
              data.isActive
                ? $t('branch.columns.active') || 'ใช้งาน'
                : $t('branch.columns.inactive') || 'ไม่ใช้งาน'
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
    branches: {
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
          field: "branchId",
          header: this.$t("branch.columns.id") || "ID",
          sortable: true,
          width: "80px",
          align: "center"
        },
        {
          field: "nameTh",
          header: this.$t("branch.columns.nameTh") || "ชื่อสาขา (ไทย)",
          sortable: true,
          minWidth: "200px"
        },
        {
          field: "nameEn",
          header: this.$t("branch.columns.nameEn") || "ชื่อสาขา (อังกฤษ)",
          sortable: true,
          minWidth: "200px"
        },
        {
          field: "address",
          header: this.$t("branch.columns.address") || "ที่อยู่",
          sortable: false,
          minWidth: "250px"
        },
        {
          field: "isActive",
          header: this.$t("branch.columns.status") || "สถานะ",
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
      this.$emit("page-change", {
        pageIndex: event.first / event.rows,
        pageSize: event.rows
      });
    },

    handleSortChange(event) {
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
