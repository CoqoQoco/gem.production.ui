<template>
  <div class="goods-receipt-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <i class="pi pi-box header-icon"></i>
          <div class="header-text">
            <h1 class="header-title">{{ $t("goodsReceipt.title") }}</h1>
            <p class="header-subtitle">{{ $t("goodsReceipt.subtitle") }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Page Content -->
    <div class="page-content">
      <!-- Product Shortcuts -->
      <div v-if="recommendedProducts.length > 0" class="product-shortcuts">
        <div class="shortcuts-header">
          <i class="pi pi-star"></i>
          <span>{{ $t('goodsReceipt.productShortcuts.title') }} ({{ $t('goodsReceipt.productShortcuts.subtitle') }})</span>
          <button
            class="btn-refresh"
            @click="loadRecommendedProducts"
            :disabled="isLoadingRecommended"
            :title="$t('goodsReceipt.productShortcuts.refresh')"
          >
            <i
              :class="['pi pi-refresh', { 'pi-spin': isLoadingRecommended }]"
            ></i>
          </button>
        </div>
        <div class="shortcuts-buttons">
          <button
            v-for="product in recommendedProducts"
            :key="product.stockNumber"
            @click="duplicateProduct(product)"
            class="btn-product-shortcut"
            :title="$t('goodsReceipt.productShortcuts.subtitle') + ': ' + (product.productNameTh || product.productNameEn)"
          >
            <i class="pi pi-copy"></i>
            <span>{{
              product.productNameTh ||
              product.productNameEn ||
              product.stockNumber
            }}</span>
          </button>
        </div>
      </div>

      <!-- Product Detail Section (Part 1) -->
      <ProductDetail ref="productDetailRef" v-model="productData" />

      <!-- Branch and Product Type Selection -->
      <BranchProductTypeSelection
        ref="branchProductTypeRef"
        v-model="branchProductTypeData"
      />

      <!-- Part 2: Product Components -->
      <ProductComponents ref="productComponentsRef" v-model="componentsData" />

      <!-- Action Buttons -->
      <div class="action-buttons">
        <Button
          :label="$t('common.cancel') || 'ยกเลิก'"
          icon="pi pi-times"
          class="p-button-secondary btn-clear"
          @click="handleClear"
          :disabled="isSaving"
        />
        <Button
          :label="$t('common.save') || 'บันทึก'"
          icon="pi pi-check"
          class="p-button-success btn-submit"
          @click="handleSave"
          :disabled="isSaving"
        />
      </div>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      v-model="showConfirmModal"
      :product-data="productData"
      :branch-product-type-data="branchProductTypeData"
      :components-data="componentsData"
      :is-saving="isSaving"
      @confirm="handleConfirmSave"
      @back="showConfirmModal = false"
    />

    <Toast />
  </div>
</template>

<script>
import ProductDetail from "./components/product-detail.vue";
import BranchProductTypeSelection from "./components/branch-product-type-selection.vue";
import ProductComponents from "./components/product-components-new.vue";
import ConfirmationModal from "./modal/confirmation-modal.vue";
import { useGoodsReceiptApiStore } from "@/stores/api/goods-receipt-api";
import { useStockApiStore } from "@/stores/api/stock-api";

import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";

export default {
  name: "GoodsReceiptIndex",

  components: {
    ProductDetail,
    BranchProductTypeSelection,
    ProductComponents,
    ConfirmationModal,
  },

  setup() {
    const goodsReceiptApiStore = useGoodsReceiptApiStore();
    const stockApiStore = useStockApiStore();
    return {
      goodsReceiptApiStore,
      stockApiStore,
      Toast,
    };
  },

  data() {
    return {
      productData: {
        originNumber: "",
        mold: "",
        productNameEn: "",
        productNameTH: "",
        qty: null,
        qtyUnit: "",
        price: null,
        unitPrice: "",
      },
      branchProductTypeData: {
        branchId: null,
        branchNameTh: "",
        branchNameEn: "",
        productTypeCode: "",
        productTypeNameTh: "",
        productTypeNameEn: "",
      },
      componentsData: {
        components: [],
        productImageUrl: "",
        productImageBlobName: "",
        costSummary: {
          actualCost: 0,
          usedCost: 0,
          discountPercent: 0,
          finalCost: 0,
        },
      },
      showConfirmModal: false,
      isSaving: false,
      recommendedProducts: [],
      isLoadingRecommended: false,
      toast: null,
    };
  },

  methods: {
    async loadRecommendedProducts() {
      this.isLoadingRecommended = true;
      try {
        const response = await this.stockApiStore.listStockInventory({
          pageIndex: 0,
          pageSize: 10,
          sort: [{ field: "receiptDate", dir: "desc" }],
          criteria: {},
        });

        if (response.success && response.data) {
          this.recommendedProducts = response.data;
          console.log("Loaded recommended products:", this.recommendedProducts);
        } else {
          console.warn(
            "Failed to load recommended products:",
            response.message,
          );
          this.recommendedProducts = [];
        }
      } catch (error) {
        console.error("Error loading recommended products:", error);
        this.recommendedProducts = [];
      } finally {
        this.isLoadingRecommended = false;
      }
    },

    duplicateProduct(product) {
      // Map stock data to form data for duplication
      this.productData = {
        originNumber: product.productNumber || "",
        mold: product.mold || "",
        productNameEn: product.productNameEn || "",
        productNameTH: product.productNameTh || "",
        qty: product.qty || null,
        qtyUnit: product.qtyUnit || "",
        price: product.price || null,
        unitPrice: product.priceUnit || "",

        productTypeCode: product.productTypeCode || "",
        productTypeNameTh: product.productTypeNameTh || "",
        productTypeNameEn: product.productTypeNameEn || "",
      };

      this.branchProductTypeData = {
        branchId: product.branchId || null,
        branchNameTh: product.branchNameTh || "",
        branchNameEn: product.branchNameEn || "",
        productTypeCode: product.productTypeCode || "",
        productTypeNameTh: product.productTypeNameTh || "",
        productTypeNameEn: product.productTypeNameEn || "",
      };

      // Map materials to components format
      const components = (product.materials || []).map((material) => ({
        type: material.type?.toLowerCase() || "gold",
        itemCode: material.typeCode || material.itemCode || "",
        itemNameTh: material.typeNameTh || material.itemNameTh || "",
        itemNameEn: material.typeNameEn || material.itemNameEn || "",
        shapeCode: material.typeCode2 || material.shapeCode || "",
        shapeNameTh: material.typeNameTh2 || material.shapeNameTh || "",
        shapeNameEn: material.typeNameEn2 || material.shapeNameEn || "",
        size: material.size || "",
        weight: material.weight || null,
        weightUnit: material.weightUnit || "g",
        wastePercent: material.wastePercent || null,
        labelWeight: material.labelWeight || null,
        qty: material.qty || null,
        qtyUnit: material.qtyUnit || "pc",
        price: material.price || null,
        cost: material.cost || null,
        region: material.region || material.origin || "",
        description: material.description || "",
      }));

      this.componentsData = {
        components: components,
        productImageUrl: product.productImageUrl || "",
        productImageBlobName: "",
        costSummary: {
          actualCost: product.costSummary?.actualCost || 0,
          usedCost: product.costSummary?.usedCost || 0,
          discountPercent: product.costSummary?.discountPercent || 0,
          finalCost: product.costSummary?.finalCost || 0,
        },
      };

      this.toast.add({
        severity: "success",
        summary: this.$t("common.success"),
        detail: this.$t("goodsReceipt.productShortcuts.duplicateSuccess", {
          productName: product.productNameTh || product.productNameEn,
        }),
        life: 3000,
      });

      console.log("Duplicated product data:", {
        productData: this.productData,
        branchProductTypeData: this.branchProductTypeData,
        componentsData: this.componentsData,
      });
    },

    async loadProductForDuplication(stockNumber) {
      try {
        this.toast.add({
          severity: "info",
          summary: this.$t("goodsReceipt.productShortcuts.loadingProduct"),
          detail: this.$t("goodsReceipt.productShortcuts.loadingProductDetail", {
            stockNumber: stockNumber,
          }),
          life: 2000,
        });

        const response = await this.stockApiStore.getStockInventory({
          stockNumber: stockNumber,
        });

        if (response.success && response.data) {
          // Use the duplicateProduct method to fill the form
          this.duplicateProduct(response.data);
        } else {
          this.toast.add({
            severity: "warn",
            summary: this.$t("goodsReceipt.productShortcuts.productNotFound"),
            detail: this.$t("goodsReceipt.productShortcuts.productNotFoundDetail", {
              stockNumber: stockNumber,
            }),
            life: 3000,
          });
        }
      } catch (error) {
        console.error("Error loading product for duplication:", error);
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error"),
          detail: this.$t("stockInventory.loadError"),
          life: 3000,
        });
      }
    },

    async handleSave() {
      // Validate all sections
      const productDetailRef = this.$refs.productDetailRef;
      const branchProductTypeRef = this.$refs.branchProductTypeRef;
      const productComponentsRef = this.$refs.productComponentsRef;

      if (!productDetailRef) {
        console.error("Product detail ref not found");
        return;
      }

      if (!branchProductTypeRef) {
        console.error("Branch product type ref not found");
        return;
      }

      if (!productComponentsRef) {
        console.error("Product components ref not found");
        return;
      }

      const isProductValid = productDetailRef.validate();
      const isBranchProductTypeValid = branchProductTypeRef.validate();
      const isComponentsValid = productComponentsRef.validate();

      if (!isProductValid || !isBranchProductTypeValid || !isComponentsValid) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error"),
          detail: "กรุณากรอกข้อมูลให้ครบถ้วน",
          life: 3000,
        });
        return;
      }

      console.log("All validations passed. Preparing to save data.");
      console.log("Product Data:", this.productData);
      console.log("Branch & Product Type Data:", this.branchProductTypeData);

      // Show confirmation modal instead of saving directly
      this.showConfirmModal = true;
    },

    async handleConfirmSave() {
      // Save logic here
      this.isSaving = true;

      try {
        // Components are already in the correct format from product-components.vue
        const components = this.componentsData.components || [];

        // Prepare API payload with new structure (without image URL first)
        const payload = {
          mold: this.productData.mold,
          originNumber: this.productData.originNumber,
          productNameTh: this.productData.productNameTH,
          productNameEn: this.productData.productNameEn,
          qty: this.productData.qty,
          qtyUnit: this.productData.qtyUnit,
          price: this.productData.price,
          priceUnit: this.productData.unitPrice,
          branchId: this.branchProductTypeData.branchId,
          branchNameTh: this.branchProductTypeData.branchNameTh,
          branchNameEn: this.branchProductTypeData.branchNameEn,
          productTypeCode: this.productData.productTypeCode,
          productTypeNameTh: this.productData.productTypeNameTh,
          productTypeNameEn: this.productData.productTypeNameEn,
          // New fields
          productImageUrl: "", // Will be updated after upload
          components: components,
          costSummary: this.componentsData.costSummary,
        };

        console.log("Sending payload to API:", payload);

        // Call API to save data first
        const result = await this.goodsReceiptApiStore.manualReceipt(payload);

        console.log("API response:", result);

        if (!result.success) {
          // Show error alert
          this.toast.add({
            severity: "error",
            summary: this.$t("common.error") || "เกิดข้อผิดพลาด",
            detail: result.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
            life: 5000,
          });
          throw new Error(result.message || "Failed to save goods receipt");
        }

        // Get stockNumber from API response
        const stockNumber = result.stockNumber || result.data?.stockNumber;
        console.log("Submit successful. Stock Number:", stockNumber);
        console.log("Full API response:", result);

        // Upload image after submit success (if any)
        const productComponentsRef = this.$refs.productComponentsRef;

        // Check if there's a pending image file to upload
        if (
          productComponentsRef &&
          productComponentsRef.pendingImageFile &&
          productComponentsRef.uploadPendingImage
        ) {
          if (!stockNumber) {
            console.warn(
              "⚠️ stockNumber is null/undefined. Backend needs to return stockNumber in response.",
            );
            console.warn(
              "Image will be uploaded with auto-generated name (GUID) instead.",
            );
          }

          console.log(
            "Uploading pending image with stock number:",
            stockNumber || "auto-generated",
          );
          try {
            // Upload image with stockNumber as filename (or auto-generated if null)
            const uploadResult =
              await productComponentsRef.uploadPendingImage(stockNumber);
            console.log("Image uploaded successfully:", uploadResult);

            // TODO: Update the record with image URL if needed
            // You might need to call another API to update the product with imageUrl
            if (uploadResult && uploadResult.blobUrl) {
              console.log("Image URL to update:", uploadResult.blobUrl);
              // await this.goodsReceiptApiStore.updateProductImage(stockNumber, uploadResult.blobUrl)
            }
          } catch (uploadError) {
            console.error("Image upload failed:", uploadError);
            // Show warning but don't fail the whole process
            this.toast.add({
              severity: "warn",
              summary: "คำเตือน",
              detail: `บันทึกข้อมูลสำเร็จ แต่อัพโหลดรูปภาพล้มเหลว: ${uploadError.message}`,
              life: 5000,
            });
          }
        } else {
          // No pending image file - use existing productImageUrl (from mock data or already uploaded)
          console.log(
            "No pending image file to upload. Using existing productImageUrl:",
            this.componentsData.productImageUrl,
          );
        }

        // Show success message
        this.toast.add({
          severity: "success",
          summary: this.$t("common.success") || "สำเร็จ",
          detail: result.message || "บันทึกข้อมูลสำเร็จ",
          life: 3000,
        });

        // Close modal and reset form after successful save
        this.showConfirmModal = false;
        this.resetForm();
      } catch (error) {
        console.error("Error saving product data:", error);

        // Make sure error alert shows
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "เกิดข้อผิดพลาด",
          detail: error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
          life: 5000,
        });
      } finally {
        this.isSaving = false;
      }
    },

    resetForm() {
      this.productData = {
        originNumber: "",
        mold: "",
        productNameEn: "",
        productNameTH: "",
        qty: null,
        qtyUnit: "",
        price: null,
        unitPrice: "",
      };

      this.branchProductTypeData = {
        branchId: null,
        branchNameTh: "",
        branchNameEn: "",
        productTypeCode: "",
        productTypeNameTh: "",
        productTypeNameEn: "",
      };

      this.componentsData = {
        components: [],
        productImageUrl: "",
        productImageBlobName: "",
        costSummary: {
          actualCost: 0,
          usedCost: 0,
          discountPercent: 0,
          finalCost: 0,
        },
      };

      const productDetailRef = this.$refs.productDetailRef;
      if (productDetailRef && productDetailRef.reset) {
        productDetailRef.reset();
      }

      const branchProductTypeRef = this.$refs.branchProductTypeRef;
      if (branchProductTypeRef && branchProductTypeRef.reset) {
        branchProductTypeRef.reset();
      }

      const productComponentsRef = this.$refs.productComponentsRef;
      if (productComponentsRef && productComponentsRef.reset) {
        productComponentsRef.reset();
      }
    },

    handleClear() {
      this.$confirm.require({
        message: "คุณต้องการล้างข้อมูลทั้งหมดหรือไม่?",
        header: "ยืนยันการล้างข้อมูล",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "ใช่",
        rejectLabel: "ไม่",
        accept: () => {
          this.resetForm();
          this.toast.add({
            severity: "info",
            summary: "ล้างข้อมูลสำเร็จ",
            detail: "ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว",
            life: 3000,
          });
        },
      });
    },
  },

  async mounted() {
    this.toast = useToast();
    // Load recommended products on page load
    await this.loadRecommendedProducts();

    // Check if there's a duplicate query parameter
    const duplicateStockNumber = this.$route.query.duplicate;
    if (duplicateStockNumber) {
      await this.loadProductForDuplication(duplicateStockNumber);
    }
  },
};
</script>

<style lang="scss" scoped>
.goods-receipt-page {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

.page-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 2.5rem;
  color: #e7de99;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(231, 222, 153, 0.1) 0%,
    rgba(255, 20, 147, 0.1) 100%
  );
  border-radius: 12px;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.header-subtitle {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
}

.page-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.product-shortcuts {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  //background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(231, 222, 153, 0.3);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .shortcuts-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: white;
    font-weight: 700;
    font-size: 1.125rem;

    i {
      font-size: 1.25rem;
    }

    span {
      flex: 1;
    }

    .btn-refresh {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.5);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      i {
        font-size: 1rem;
      }
    }
  }

  .shortcuts-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .btn-product-shortcut {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: white;
    color: #c0ab28;
    border: 2px solid white;
    border-radius: 8px;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 300px;

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &:hover {
      background: #fff5f7;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    }

    &:active {
      transform: translateY(0);
    }

    i {
      font-size: 1rem;
      flex-shrink: 0;
    }
  }
}

.action-buttons {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse;

    :deep(.p-button) {
      width: 100%;
      justify-content: center;
    }
  }
}

.btn-clear {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s;
  background: white;
  color: #6b7280;
  border: 2px solid #d1d5db;

  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
    color: #374151;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-submit {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

:deep(.p-button-success) {
  background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(135deg, #c0ab28 0%, #91801e 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(231, 222, 153, 0.3);
  }

  &:disabled {
    background: #d1d5db;
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
