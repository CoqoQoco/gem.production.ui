<template>
  <div class="list-data-table-container">
    <DataTableComponent
      :items="workerDrivers"
      :columns="columns"
      :total-records="totalRecords"
      :per-page="perPage"
      :rows-per-page-options="[10, 20, 50, 100]"
      :empty-message="$t('workerDriver.noData') || 'ไม่พบข้อมูลพนักงานขับรถ'"
      data-key="id"
      :show-gridlines="true"
      :paginator="true"
      @page="handlePageChange"
      @sort="handleSortChange"
    >
      <!-- Code Template -->
      <template #codeTemplate="{ data }">
        <div class="list-name-cell">
          <i class="pi pi-id-card list-item-icon"></i>
          <span>{{ data.code }}</span>
        </div>
      </template>

      <!-- Name (Thai) Template -->
      <template #nameThTemplate="{ data }">
        <div class="list-name-cell">
          <i class="pi pi-user list-item-icon"></i>
          <span>{{ data.nameTh }}</span>
        </div>
      </template>

      <!-- Name (English) Template -->
      <template #nameEnTemplate="{ data }">
        <div class="list-username-cell">
          <span>{{ data.nameEn }}</span>
        </div>
      </template>

      <!-- Tel Template -->
      <template #telTemplate="{ data }">
        <div class="list-email-cell">
          <i class="pi pi-phone"></i>
          <span>{{ data.tel || '-' }}</span>
        </div>
      </template>

      <!-- Gender Template -->
      <template #genderTemplate="{ data }">
        <div class="list-status-cell">
          <Tag
            :value="getGenderLabel(data.gender)"
            :severity="data.gender === 'M' ? 'info' : 'warn'"
          />
        </div>
      </template>

      <!-- Vehicle Registration Template -->
      <template #vehicleRegistrationTemplate="{ data }">
        <div class="list-email-cell">
          <i class="pi pi-car"></i>
          <span>{{ data.vehicleRegistration || '-' }}</span>
        </div>
      </template>

      <!-- Status Template -->
      <template #isActiveTemplate="{ data }">
        <div class="list-status-cell">
          <Tag
            :value="
              data.isActive
                ? $t('workerDriver.columns.active') || 'ใช้งาน'
                : $t('workerDriver.columns.inactive') || 'ไม่ใช้งาน'
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
    workerDrivers: {
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
          header: this.$t("workerDriver.columns.id") || "ID",
          sortable: true,
          width: "80px",
          align: "center"
        },
        {
          field: "code",
          header: this.$t("workerDriver.columns.code") || "รหัส",
          sortable: true,
          width: "150px"
        },
        {
          field: "nameTh",
          header: this.$t("workerDriver.columns.nameTh") || "ชื่อ (ไทย)",
          sortable: true,
          minWidth: "180px"
        },
        {
          field: "nameEn",
          header: this.$t("workerDriver.columns.nameEn") || "ชื่อ (อังกฤษ)",
          sortable: true,
          minWidth: "180px"
        },
        {
          field: "tel",
          header: this.$t("workerDriver.columns.tel") || "เบอร์โทร",
          sortable: false,
          width: "130px"
        },
        {
          field: "gender",
          header: this.$t("workerDriver.columns.gender") || "เพศ",
          sortable: true,
          width: "100px",
          align: "center"
        },
        {
          field: "vehicleRegistration",
          header: this.$t("workerDriver.columns.vehicleRegistration") || "ทะเบียนรถ",
          sortable: true,
          width: "150px"
        },
        {
          field: "isActive",
          header: this.$t("workerDriver.columns.status") || "สถานะ",
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
    getGenderLabel(gender) {
      const genderMap = {
        'M': this.$t('workerDriver.gender.male') || 'ชาย',
        'F': this.$t('workerDriver.gender.female') || 'หญิง'
      }
      return genderMap[gender] || gender
    },

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
