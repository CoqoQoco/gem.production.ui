<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('productType.addProductType') || 'เพิ่มประเภทสินค้า'"
    :style="{ width: '800px' }"
    :modal="true"
    :draggable="false"
    class="list-form-modal"
  >
    <div class="list-form">
      <!-- Product Type Information Section -->
      <div class="form-section">
        <div class="section-title">
          <i class="pi pi-circle"></i>
          <span>{{ $t('productType.form.productTypeInfo') || 'ข้อมูลประเภทสินค้า' }}</span>
        </div>
        <div class="form-grid">
          <!-- Code -->
          <div class="form-group">
            <label>
              {{ $t('productType.form.code') || 'รหัสประเภทสินค้า' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.code"
              :placeholder="$t('productType.form.codePlaceholder') || 'กรอกรหัสประเภทสินค้า'"
              :class="{ 'p-invalid': errors.code }"
            />
            <small v-if="errors.code" class="p-error">{{ errors.code }}</small>
          </div>

          <!-- Name (Thai) -->
          <div class="form-group">
            <label>
              {{ $t('productType.form.nameTh') || 'ชื่อประเภทสินค้า (ไทย)' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.nameTh"
              :placeholder="$t('productType.form.nameThPlaceholder') || 'กรอกชื่อประเภทสินค้าภาษาไทย'"
              :class="{ 'p-invalid': errors.nameTh }"
            />
            <small v-if="errors.nameTh" class="p-error">{{ errors.nameTh }}</small>
          </div>

          <!-- Name (English) -->
          <div class="form-group">
            <label>
              {{ $t('productType.form.nameEn') || 'ชื่อประเภทสินค้า (อังกฤษ)' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.nameEn"
              :placeholder="$t('productType.form.nameEnPlaceholder') || 'กรอกชื่อประเภทสินค้าภาษาอังกฤษ'"
              :class="{ 'p-invalid': errors.nameEn }"
            />
            <small v-if="errors.nameEn" class="p-error">{{ errors.nameEn }}</small>
          </div>

          <!-- Product Code -->
          <div class="form-group">
            <label>
              {{ $t('productType.form.productCode') || 'รหัสสินค้า' }}
            </label>
            <InputText
              v-model="form.productCode"
              :placeholder="$t('productType.form.productCodePlaceholder') || 'กรอกรหัสสินค้า'"
            />
          </div>

          <!-- Silver Code -->
          <div class="form-group">
            <label>
              {{ $t('productType.form.silverCode') || 'รหัสเงิน' }}
            </label>
            <InputText
              v-model="form.silverCode"
              :placeholder="$t('productType.form.silverCodePlaceholder') || 'กรอกรหัสเงิน'"
            />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="form-buttons">
        <button class="btn-cancel" @click="handleCancel">
          <i class="pi pi-times"></i>
          <span>{{ $t('common.cancel') || 'ยกเลิก' }}</span>
        </button>
        <button class="btn-submit" @click="handleSave" :disabled="isSaving">
          <i class="pi pi-check"></i>
          <span>{{ $t('common.save') || 'บันทึก' }}</span>
        </button>
      </div>
    </template>
  </Dialog>
</template>

<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { useProductTypeApiStore } from "@/stores/api/product-type-api";
import { useToast } from "primevue/usetoast";

export default {
  name: "CreateView",

  components: {
    Dialog,
    Button,
    InputText
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      productTypeApiStore: useProductTypeApiStore(),
      toast: useToast(),
      form: {
        code: "",
        nameTh: "",
        nameEn: "",
        productCode: "",
        silverCode: ""
      },
      errors: {},
      isSaving: false
    };
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.resetForm();
      }
    }
  },

  methods: {
    validateForm() {
      this.errors = {};

      if (!this.form.code || this.form.code.trim() === "") {
        this.errors.code = this.$t('productType.validation.codeRequired') || 'กรุณากรอกรหัสประเภทสินค้า';
      }

      if (!this.form.nameTh || this.form.nameTh.trim() === "") {
        this.errors.nameTh = this.$t('productType.validation.nameThRequired') || 'กรุณากรอกชื่อประเภทสินค้า (ไทย)';
      }

      if (!this.form.nameEn || this.form.nameEn.trim() === "") {
        this.errors.nameEn = this.$t('productType.validation.nameEnRequired') || 'กรุณากรอกชื่อประเภทสินค้า (อังกฤษ)';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleSave() {
      if (!this.validateForm()) {
        return;
      }

      this.isSaving = true;

      try {
        const result = await this.productTypeApiStore.createProductType({
          code: this.form.code.trim(),
          nameTh: this.form.nameTh.trim(),
          nameEn: this.form.nameEn.trim(),
          productCode: this.form.productCode.trim() || null,
          silverCode: this.form.silverCode.trim() || null
        });

        if (result.success) {
          this.$emit("created");
          this.resetForm();
        } else {
          this.toast.add({
            severity: "error",
            summary: this.$t("common.error") || "ผิดพลาด",
            detail: result.message || this.$t("productType.createError") || "เกิดข้อผิดพลาดในการเพิ่มประเภทสินค้า",
            life: 5000
          });
        }
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || this.$t("productType.createError") || "เกิดข้อผิดพลาดในการเพิ่มประเภทสินค้า",
          life: 5000
        });
      } finally {
        this.isSaving = false;
      }
    },

    handleCancel() {
      this.$emit("update:visible", false);
      this.resetForm();
    },

    resetForm() {
      this.form = {
        code: "",
        nameTh: "",
        nameEn: "",
        productCode: "",
        silverCode: ""
      };
      this.errors = {};
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/list-page-templete/modal-view.scss";
</style>
