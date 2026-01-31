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
      <!-- Status Template -->
      <template #statusTemplate="{ data }">
        <div class="list-status-cell">
          <Tag
            :value="data.status"
            :severity="getStatusSeverity(data.status)"
          />
        </div>
      </template>

      <!-- Actions Template -->
      <template #actionsTemplate="{ data }">
        <div class="action-buttons-cell">
          <button
            class="btn-action btn-duplicate"
            @click="handleDuplicate(data)"
            :title="$t('stockInventory.table.duplicateTooltip', { productName: data.productNameTh || data.productNameEn })"
          >
            <i class="pi pi-copy"></i>
            <span>{{ $t('stockInventory.table.duplicate') }}</span>
          </button>
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

              <!-- Description Template -->
              <template #descriptionTemplate="{ data: material }">
                {{ material.description || "-" }}
              </template>

              <!-- Calculation Formula Template -->
              <template #calculationFormulaTemplate="{ data: material }">
                <span
                  v-if="material.type === 'gem' && material.calculationFormula === 'price_x_weight'"
                  class="formula-badge"
                >ราคา × น้ำหนัก</span>
                <span
                  v-else-if="material.type === 'gem' && material.calculationFormula === 'price_x_qty'"
                  class="formula-badge"
                >ราคา × จำนวน</span>
                <span v-else>-</span>
              </template>

              <!-- Size Template -->
              <template #sizeTemplate="{ data: material }">
                {{ material.size || "-" }}
              </template>

              <!-- Source Template -->
              <template #sourceTemplate="{ data: material }">
                {{ material.source || "-" }}
              </template>

              <!-- Color/Clarity Template -->
              <template #colorClarityTemplate="{ data: material }">
                {{ material.colorClarity || "-" }}
              </template>

              <!-- Origin Template -->
              <template #originTemplate="{ data: material }">
                {{ material.origin || "-" }}
              </template>

              <!-- Waste Percent Template -->
              <template #wastePercentTemplate="{ data: material }">
                <span v-if="material.type === 'gold' && material.wastePercent !== null && material.wastePercent !== undefined">
                  {{ formatNumber(material.wastePercent) }}%
                </span>
                <span v-else>-</span>
              </template>

              <!-- Label Weight Template -->
              <template #labelWeightTemplate="{ data: material }">
                {{ material.labelWeight ? formatNumber(material.labelWeight) : "-" }}
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
          field: "actions",
          header: this.$t("stockInventory.table.actions") || "Actions",
          sortable: false,
          minWidth: "160px",
          align: "center",
        },
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
          header: "ประเภท",
          width: "80px",
          align: "center",
          sortable: false
        },
        {
          field: "itemNameTh",
          header: "ชื่อรายการ",
          width: "150px",
          sortable: false
        },
        {
          field: "shapeNameTh",
          header: "รูปร่าง",
          width: "120px",
          sortable: false
        },
        {
          field: "description",
          header: "รายละเอียด",
          width: "150px",
          sortable: false
        },
        {
          field: "calculationFormula",
          header: "สูตร",
          width: "140px",
          align: "center",
          sortable: false
        },
        {
          field: "size",
          header: "ขนาด",
          width: "80px",
          sortable: false
        },
        {
          field: "source",
          header: "แหล่งซื้อ",
          width: "120px",
          sortable: false
        },
        {
          field: "colorClarity",
          header: "Color/Clarity",
          width: "120px",
          sortable: false
        },
        {
          field: "origin",
          header: "Origin",
          width: "100px",
          sortable: false
        },
        {
          field: "qty",
          header: "จำนวน",
          width: "80px",
          align: "right",
          format: "decimal2",
          sortable: false
        },
        {
          field: "qtyUnit",
          header: "หน่วยนับ",
          width: "80px",
          align: "center",
          sortable: false
        },
        {
          field: "weight",
          header: "น้ำหนัก",
          width: "90px",
          align: "right",
          format: "decimal2",
          sortable: false
        },
        {
          field: "weightUnit",
          header: "หน่วย",
          width: "60px",
          align: "center",
          sortable: false
        },
        {
          field: "wastePercent",
          header: "%waste",
          width: "80px",
          align: "right",
          sortable: false
        },
        {
          field: "labelWeight",
          header: "น้ำหนักป้าย",
          width: "100px",
          align: "right",
          format: "decimal2",
          sortable: false
        },
        {
          field: "price",
          header: "ราคา",
          width: "100px",
          align: "right",
          format: "currency",
          sortable: false
        },
        {
          field: "cost",
          header: "ต้นทุน (บาท)",
          width: "120px",
          align: "right",
          format: "currency",
          sortable: false
        }
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

    formatNumber(value) {
      if (!value && value !== 0) return "0.00";
      return parseFloat(value).toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
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

    /**
     * Handle duplicate product - redirect to goods-receipt page with product data
     * @param {Object} product - Product data to duplicate
     */
    handleDuplicate(product) {
      // Navigate to goods-receipt page with stockNumber as query parameter
      this.$router.push({
        path: '/inventory/goods-receipt',
        query: {
          duplicate: product.stockNumber
        }
      });

      console.log('Duplicating product:', product.stockNumber);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/list-page-templete/data-table-view.scss";

// Override for compact sizing
:deep(.base-datatable) {
  .p-datatable-thead > tr > th {
    padding: 0.375rem 0.5rem !important; // Compact header
    font-size: 0.75rem !important; // 12px
  }

  .p-datatable-tbody > tr > td {
    padding: 0.375rem 0.5rem !important; // Compact cells
    font-size: 0.75rem !important; // 12px
  }
}

// Expand Row Styles - Compact sizing
.stock-material-expansion {
  padding: 1rem; // Reduced from 1.5rem
  background: #f9fafb;
  border-top: 2px solid #e7de99;

  .material-section-title {
    display: flex;
    align-items: center;
    gap: 0.375rem; // Reduced from 0.5rem
    font-size: 0.875rem; // Reduced from 1rem
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.75rem 0; // Reduced from 1rem
    padding-bottom: 0.5rem; // Reduced from 0.75rem
    border-bottom: 2px solid #e7de99;

    i {
      color: #e7de99;
      font-size: 0.9375rem; // Reduced from 1.125rem
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
        font-size: 0.75rem !important; // Reduced from 0.875rem (12px)
        padding: 0.375rem 0.5rem !important; // Compact
      }

      .p-datatable-tbody > tr > td {
        font-size: 0.75rem !important; // Reduced from 0.875rem (12px)
        padding: 0.375rem 0.5rem !important; // Compact
      }
    }
  }

  .no-materials {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem; // Reduced from 2rem
    color: #9ca3af;

    i {
      font-size: 1.5rem; // Reduced from 2rem
      color: #d1d5db;
      margin-bottom: 0.375rem; // Reduced from 0.5rem
    }

    p {
      font-size: 0.75rem; // Reduced from 0.875rem (12px)
      color: #6b7280;
      margin: 0;
    }
  }
}

// Action Buttons Cell - Compact sizing
.action-buttons-cell {
  display: flex;
  gap: 0.375rem; // Reduced from 0.5rem
  justify-content: center;
  align-items: center;

  .btn-action {
    display: flex;
    align-items: center;
    gap: 0.375rem; // Reduced from 0.5rem
    padding: 0.375rem 0.75rem; // Reduced from 0.5rem 1rem
    border: none;
    border-radius: 6px;
    font-size: 0.75rem; // Reduced from 0.875rem (12px)
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    height: 30px; // Compact height

    i {
      font-size: 0.75rem; // Reduced from 0.875rem (12px)
    }

    &.btn-duplicate {
      background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
      color: white;

      &:hover {
        background: linear-gradient(135deg, #c0ab28 0%, #91801e 100%);
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(231, 222, 153, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

// Additional Cell Styles - Compact sizing
.stock-number-text {
  font-weight: 600;
  color: #111827;
  font-size: 0.75rem; // 12px
}

.product-code-text {
  font-family: monospace;
  color: #6b7280;
  font-size: 0.75rem; // Reduced from 0.875rem (12px)
}

.product-name-cell {
  .product-name-th {
    font-weight: 500;
    color: #111827;
    font-size: 0.75rem; // 12px
  }

  .product-name-en {
    font-size: 0.6875rem; // Reduced from 0.8125rem (11px)
    color: #6b7280;
    margin-top: 0.125rem;
  }
}

.qty-cell,
.price-cell,
.weight-cell {
  font-weight: 500;
  color: #374151;
  font-size: 0.75rem; // 12px
}

.branch-cell {
  display: flex;
  align-items: center;
  gap: 0.375rem; // Reduced from 0.5rem

  i {
    color: #e7de99;
    font-size: 0.75rem; // 12px
  }

  span {
    font-size: 0.75rem; // 12px
  }
}

.type-name-cell {
  .type-name-en {
    font-size: 0.6875rem; // Reduced from 0.8125rem (11px)
    color: #6b7280;
    margin-top: 0.125rem;
  }
}

.size-shape-cell {
  color: #6b7280;
  font-size: 0.75rem; // 12px
}

.formula-badge {
  display: inline-block;
  padding: 0.125rem 0.375rem;
  background: #e0e7ff;
  color: #4338ca;
  border-radius: 4px;
  font-size: 0.6875rem; // 11px
  font-weight: 600;
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

// Cost Summary Section - Compact sizing
.cost-summary-section {
  margin-top: 1rem; // Reduced from 1.5rem
  padding: 0.75rem; // Reduced from 1rem
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .cost-summary-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem; // Reduced from 1rem

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    .cost-summary-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      label {
        font-size: 0.75rem; // Reduced from 0.875rem (12px)
        color: #6b7280;
        font-weight: 500;
      }

      .cost-value {
        font-size: 0.9375rem; // Reduced from 1.125rem (15px)
        font-weight: 600;
        color: #111827;
      }

      &.final-cost {
        .cost-value {
          color: #e7de99;
          font-size: 1rem; // Reduced from 1.25rem (16px)
        }
      }
    }
  }
}
</style>
