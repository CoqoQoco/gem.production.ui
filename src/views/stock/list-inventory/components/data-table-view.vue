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
          <!-- Product Image Section -->
          <div v-if="data.stockNumber" class="product-image-section">
            <h4 class="material-section-title">
              <i class="pi pi-image"></i>
              {{ $t("stockInventory.productImage") || "รูปภาพสินค้า" }}
            </h4>
            <div class="product-image-container">
              <img
                :src="getProductImageUrl(data.stockNumber)"
                :alt="data.productNameTh || 'Product Image'"
                @error="handleImageError"
                class="product-image"
              />
            </div>
          </div>

          <!-- Materials Section -->
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
                  :severity="getMaterialTypeSeverity(material.type)"
                />
              </template>

              <!-- Item Name Template -->
              <template #itemNameThTemplate="{ data: material }">
                <div class="type-name-cell">
                  <div>{{ material.itemNameTh || "-" }}</div>
                  <div class="type-name-en">{{ material.itemNameEn || "-" }}</div>
                </div>
              </template>

              <!-- Shape Name Template -->
              <template #shapeNameThTemplate="{ data: material }">
                <div class="size-shape-cell">
                  {{ material.shapeNameTh || "-" }}
                </div>
              </template>

              <!-- Weight Template -->
              <template #weightTemplate="{ data: material }">
                <div class="weight-cell">
                  {{ material.weight || "-" }} {{ material.weightUnit || "" }}
                </div>
              </template>

              <!-- Quantity Template -->
              <template #qtyTemplate="{ data: material }">
                <div class="qty-cell">
                  {{ material.qty || "-" }} {{ material.qtyUnit || "" }}
                </div>
              </template>

              <!-- Price Template -->
              <template #priceTemplate="{ data: material }">
                <div class="price-cell">
                  {{ formatCurrency(material.price) }}
                </div>
              </template>

              <!-- Cost Template -->
              <template #costTemplate="{ data: material }">
                <div class="price-cell">
                  {{ formatCurrency(material.cost) }}
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

          <!-- Cost Summary Section -->
          <div v-if="data.costSummary" class="cost-summary-section">
            <h4 class="material-section-title">
              <i class="pi pi-money-bill"></i>
              {{ $t("stockInventory.costSummary.title") || "สรุปต้นทุน" }}
            </h4>
            <div class="cost-summary-grid">
              <div class="cost-summary-item">
                <label>{{ $t("stockInventory.costSummary.actualCost") || "ต้นทุนจริง" }}</label>
                <span class="cost-value">{{ formatCurrency(data.costSummary.actualCost) }}</span>
              </div>
              <div class="cost-summary-item">
                <label>{{ $t("stockInventory.costSummary.usedCost") || "ต้นทุนที่ใช้" }}</label>
                <span class="cost-value">{{ formatCurrency(data.costSummary.usedCost) }}</span>
              </div>
              <div class="cost-summary-item">
                <label>{{ $t("stockInventory.costSummary.discount") || "ส่วนลด" }}</label>
                <span class="cost-value">{{ data.costSummary.discountPercent }}%</span>
              </div>
              <div class="cost-summary-item final-cost">
                <label>{{ $t("stockInventory.costSummary.finalCost") || "ต้นทุนสุดท้าย" }}</label>
                <span class="cost-value">{{ formatCurrency(data.costSummary.finalCost) }}</span>
              </div>
            </div>
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
          field: "itemNameTh",
          header: this.$t("stockInventory.materials.itemName") || "Item Name",
          sortable: false,
          minWidth: "150px",
        },
        {
          field: "shapeNameTh",
          header: this.$t("stockInventory.materials.shape") || "Shape",
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
        {
          field: "cost",
          header: this.$t("stockInventory.materials.cost") || "Cost",
          sortable: false,
          minWidth: "100px",
          align: "right",
        },
      ],
      azureBlobBaseUrl: import.meta.env.VITE_AZURE_BLOB_URL || 'https://gemproduction.blob.core.windows.net/image-gem/',
      placeholderImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='
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

    getMaterialTypeSeverity(type) {
      const typeMap = {
        gold: "warning",
        gem: "info",
        labor: "secondary",
      };
      return typeMap[type?.toLowerCase()] || "secondary";
    },

    /**
     * Get product image URL from Azure Blob Storage
     * @param {string} stockNumber - Stock number (e.g., "SN-2601-016")
     * @returns {string} Full image URL
     */
    getProductImageUrl(stockNumber) {
      if (!stockNumber) return this.placeholderImage;

      // Try .jpg first (most common)
      return `${this.azureBlobBaseUrl}${stockNumber}.jpg`;
    },

    /**
     * Handle image load error - try different extensions
     * @param {Event} event - Image error event
     */
    handleImageError(event) {
      const img = event.target;
      const currentSrc = img.src;

      // If already tried all extensions or is placeholder, stop
      if (currentSrc === this.placeholderImage || !currentSrc.includes(this.azureBlobBaseUrl)) {
        img.src = this.placeholderImage;
        return;
      }

      // Try different extensions
      if (currentSrc.endsWith('.jpg')) {
        img.src = currentSrc.replace('.jpg', '.jpeg');
      } else if (currentSrc.endsWith('.jpeg')) {
        img.src = currentSrc.replace('.jpeg', '.png');
      } else {
        // All extensions failed, use placeholder
        img.src = this.placeholderImage;
      }
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
  border-top: 2px solid #e7de99;

  .material-section-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #e7de99;

    i {
      color: #e7de99;
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
    color: #e7de99;
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

// Product Image Section
.product-image-section {
  margin-bottom: 1.5rem;

  .product-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    .product-image {
      max-width: 400px;
      max-height: 400px;
      width: auto;
      height: auto;
      border-radius: 8px;
      object-fit: contain;
      display: block;
    }
  }
}

// Cost Summary Section
.cost-summary-section {
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .cost-summary-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    .cost-summary-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      label {
        font-size: 0.875rem;
        color: #6b7280;
        font-weight: 500;
      }

      .cost-value {
        font-size: 1.125rem;
        font-weight: 600;
        color: #111827;
      }

      &.final-cost {
        .cost-value {
          color: #e7de99;
          font-size: 1.25rem;
        }
      }
    }
  }
}
</style>
