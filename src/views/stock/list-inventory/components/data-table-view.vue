<template>
  <div class="list-data-table-container">
    <BaseDataTable
      :items="stocks"
      :columns="tableColumns"
      :totalRecords="totalRecords"
      :perPage="perPage"
      :paginator="true"
      :expandable="true"
      dataKey="stockNumber"
      :emptyMessage="$t('stockInventory.noData') || 'ไม่พบข้อมูล'"
      @page="onPageChange"
      @sort="onSortChange"
    >
      <!-- Stock Number Template -->
      <template #stockNumberTemplate="{ data }">
        <div class="list-name-cell">
          <i class="pi pi-box list-item-icon"></i>
          <span class="stock-number-text">{{ data.stockNumber }}</span>
        </div>
      </template>

      <!-- Product Code Template -->
      <template #productCodeTemplate="{ data }">
        <span class="product-code-text">{{ data.productCode || "-" }}</span>
      </template>

      <!-- Product Name Template -->
      <template #productNameThTemplate="{ data }">
        <div class="product-name-cell">
          <div class="product-name-th">{{ data.productNameTh }}</div>
          <div class="product-name-en">{{ data.productNameEn }}</div>
        </div>
      </template>

      <!-- Receipt Date Template -->
      <template #receiptDateTemplate="{ data }">
        <div class="list-date-cell">
          <i class="pi pi-calendar"></i>
          <span>{{ formatDate(data.receiptDate) }}</span>
        </div>
      </template>

      <!-- Quantity Template -->
      <template #qtyTemplate="{ data }">
        <div class="qty-cell">{{ data.qty }} {{ data.qtyUnit }}</div>
      </template>

      <!-- Price Template -->
      <template #productPriceTemplate="{ data }">
        <div class="price-cell">
          {{ formatCurrency(data.productPrice) }}
        </div>
      </template>

      <!-- Branch Template -->
      <template #branchNameThTemplate="{ data }">
        <div class="branch-cell">
          <i class="pi pi-building"></i>
          <span>{{ data.branchNameTh || "-" }}</span>
        </div>
      </template>

      <!-- Status Template -->
      <template #statusTemplate="{ data }">
        <div class="list-status-cell">
          <Tag
            :value="data.status"
            :severity="getStatusSeverity(data.status)"
          />
        </div>
      </template>

      <!-- Expanded Row Template (Materials) -->
      <template #expansion="{ data }">
        <div class="stock-material-expansion">
          <h4 class="material-section-title">
            <i class="pi pi-th-large"></i>
            {{ $t("stockInventory.materials.title") || "ส่วนประกอบวัตถุดิบ" }}
          </h4>

          <!-- Materials Table -->
          <div
            v-if="data.materials && data.materials.length > 0"
            class="materials-table"
          >
            <BaseDataTable
              :items="data.materials"
              :columns="materialColumns"
              :paginator="false"
              :showGridlines="true"
              class="nested-material-table"
            >
              <!-- Type Template -->
              <template #typeTemplate="{ data: material }">
                <Tag
                  :value="material.type"
                  :severity="
                    material.type.toLowerCase() === 'gold' ? 'warning' : 'info'
                  "
                />
              </template>

              <!-- Type Name Template -->
              <template #typeNameThTemplate="{ data: material }">
                <div class="type-name-cell">
                  <div>{{ material.typeNameTh }}</div>
                  <div class="type-name-en">{{ material.typeNameEn }}</div>
                </div>
              </template>

              <!-- Size/Shape Template -->
              <template #typeNameTh2Template="{ data: material }">
                <div class="size-shape-cell">
                  {{ material.typeNameTh2 || "-" }}
                </div>
              </template>

              <!-- Weight Template -->
              <template #weightTemplate="{ data: material }">
                <div class="weight-cell">
                  {{ material.weight }} {{ material.weightUnit }}
                </div>
              </template>

              <!-- Quantity Template -->
              <template #qtyTemplate="{ data: material }">
                <div class="qty-cell">
                  {{ material.qty }} {{ material.qtyUnit }}
                </div>
              </template>

              <!-- Price Template -->
              <template #priceTemplate="{ data: material }">
                <div class="price-cell">
                  {{ formatCurrency(material.price) }}
                </div>
              </template>
            </BaseDataTable>
          </div>

          <!-- Empty State -->
          <div v-else class="no-materials">
            <i class="pi pi-inbox"></i>
            <p>
              {{
                $t("stockInventory.materials.noMaterials") ||
                "ไม่มีข้อมูลวัตถุดิบ"
              }}
            </p>
          </div>
        </div>
      </template>
    </BaseDataTable>
  </div>
</template>

<script>
import BaseDataTable from "@/components/prime-vue/data-table.vue";
import Tag from "primevue/tag";

export default {
  name: "DataTableView",

  components: {
    BaseDataTable,
    Tag,
  },

  props: {
    stocks: {
      type: Array,
      default: () => [],
    },
    totalRecords: {
      type: Number,
      default: 0,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      tableColumns: [
        {
          field: "stockNumber",
          header: this.$t("stockInventory.table.stockNumber") || "Stock Number",
          sortable: true,
          minWidth: "150px",
        },
        {
          field: "productCode",
          header: this.$t("stockInventory.table.productCode") || "Product Code",
          sortable: true,
          minWidth: "120px",
        },
        {
          field: "productNameTh",
          header: this.$t("stockInventory.table.productName") || "Product Name",
          sortable: true,
          minWidth: "200px",
        },
        {
          field: "receiptDate",
          header: this.$t("stockInventory.table.receiptDate") || "Receipt Date",
          sortable: true,
          minWidth: "120px",
        },
        {
          field: "qty",
          header: this.$t("stockInventory.table.qty") || "Qty",
          sortable: true,
          minWidth: "100px",
          align: "center",
        },
        {
          field: "productCost",
          header: this.$t("stockInventory.table.price") || "Price",
          sortable: true,
          minWidth: "120px",
          align: "right",
        },
        {
          field: "branchNameTh",
          header: this.$t("stockInventory.table.branch") || "Branch",
          sortable: true,
          minWidth: "150px",
        },
        {
          field: "status",
          header: this.$t("stockInventory.table.status") || "Status",
          sortable: true,
          minWidth: "100px",
          align: "center",
        },
      ],
      materialColumns: [
        {
          field: "type",
          header: this.$t("stockInventory.materials.type") || "Type",
          minWidth: "80px",
          sortable: false,
          align: "center",
        },
        {
          field: "typeNameTh",
          header: this.$t("stockInventory.materials.typeName") || "Type Name",
          sortable: false,
          minWidth: "150px",
        },
        {
          field: "typeNameTh2",
          header: this.$t("stockInventory.materials.sizeShape") || "Size/Shape",
          sortable: false,
          minWidth: "120px",
        },
        {
          field: "weight",
          header: this.$t("stockInventory.materials.weight") || "Weight",
          sortable: false,
          minWidth: "100px",
          align: "center",
        },
        {
          field: "qty",
          header: this.$t("stockInventory.materials.qty") || "Qty",
          sortable: false,
          minWidth: "100px",
          align: "center",
        },
        {
          field: "price",
          header: this.$t("stockInventory.materials.price") || "Price",
          sortable: false,
          minWidth: "100px",
          align: "right",
        },
      ],
    };
  },

  methods: {
    onPageChange(event) {
      console.log("DataTable page event:", event);
      // BaseDataTable emits { first, rows }
      const pageIndex = event.first / event.rows;
      const pageSize = event.rows;
      this.$emit("page-change", { pageIndex, pageSize });
    },

    onSortChange(event) {
      console.log("DataTable sort event:", event);
      // BaseDataTable already converts to { first, rows, sort: [{ field, dir }] }
      this.$emit("sort-change", {
        sort: event.sort,
        first: event.first,
        rows: event.rows,
      });
    },

    formatDate(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },

    formatCurrency(amount) {
      if (amount === null || amount === undefined) return "-";
      return new Intl.NumberFormat("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    },

    getStatusSeverity(status) {
      const statusMap = {
        active: "success",
        inactive: "danger",
        pending: "warning",
      };
      return statusMap[status?.toLowerCase()] || "info";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/list-page-templete/data-table-view.scss";

// Override row height for this table
:deep(.base-datatable) {
  .p-datatable-tbody > tr > td {
    padding: 0.5rem 0.75rem !important;
  }
}

// Expand Row Styles
.stock-material-expansion {
  padding: 1.5rem;
  background: #f9fafb;
  border-top: 2px solid #ff69b4;

  .material-section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #ff69b4;

    i {
      color: #ff69b4;
      font-size: 1.125rem;
    }
  }

  .materials-table {
    background: white;
    border-radius: 8px;
    overflow: hidden;

    // Nested table uses lighter header to differentiate from parent
    :deep(.base-datatable) {
      .p-datatable-thead > tr > th {
        background: linear-gradient(
          135deg,
          #f3f4f6 0%,
          #f9fafb 100%
        ) !important;
        color: #374151 !important;
        font-weight: 600;
        font-size: 0.875rem;
      }

      .p-datatable-tbody > tr > td {
        font-size: 0.875rem;
      }
    }
  }

  .no-materials {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    color: #9ca3af;

    i {
      font-size: 2rem;
      color: #d1d5db;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
  }
}

// Additional Cell Styles
.stock-number-text {
  font-weight: 600;
  color: #111827;
}

.product-code-text {
  font-family: monospace;
  color: #6b7280;
  font-size: 0.875rem;
}

.product-name-cell {
  .product-name-th {
    font-weight: 500;
    color: #111827;
  }

  .product-name-en {
    font-size: 0.8125rem;
    color: #6b7280;
    margin-top: 0.125rem;
  }
}

.qty-cell,
.price-cell,
.weight-cell {
  font-weight: 500;
  color: #374151;
}

.branch-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    color: #ff69b4;
  }
}

.type-name-cell {
  .type-name-en {
    font-size: 0.8125rem;
    color: #6b7280;
    margin-top: 0.125rem;
  }
}

.size-shape-cell {
  color: #6b7280;
}
</style>
