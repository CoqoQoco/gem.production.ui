<template>
  <div class="list-data-table-container">
    <DataTableComponent
      :items="goldSizes"
      :columns="columns"
      :total-records="totalRecords"
      :per-page="perPage"
      :rows-per-page-options="[10, 20, 50, 100]"
      :empty-message="$t('goldSize.noData') || 'ไม่พบข้อมูลขนาดทอง'"
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
          <i class="pi pi-arrows-h list-item-icon"></i>
          <span>{{ data.nameTh }}</span>
        </div>
      </template>

      <!-- Name (English) Template -->
      <template #nameEnTemplate="{ data }">
        <div class="list-username-cell">
          <span>{{ data.nameEn }}</span>
        </div>
      </template>

      <!-- Status Template -->
      <template #isActiveTemplate="{ data }">
        <div class="list-status-cell">
          <Tag
            :value="
              data.isActive
                ? $t('goldSize.columns.active') || 'ใช้งาน'
                : $t('goldSize.columns.inactive') || 'ไม่ใช้งาน'
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
    goldSizes: {
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
          header: this.$t("goldSize.columns.id") || "ID",
          sortable: true,
          width: "80px",
          align: "center"
        },
        {
          field: "code",
          header: this.$t("goldSize.columns.code") || "รหัสขนาดทอง",
          sortable: true,
          width: "150px"
        },
        {
          field: "nameTh",
          header: this.$t("goldSize.columns.nameTh") || "ชื่อขนาดทอง (ไทย)",
          sortable: true,
          minWidth: "200px"
        },
        {
          field: "nameEn",
          header: this.$t("goldSize.columns.nameEn") || "ชื่อขนาดทอง (อังกฤษ)",
          sortable: true,
          minWidth: "200px"
        },
        {
          field: "isActive",
          header: this.$t("goldSize.columns.status") || "สถานะ",
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
