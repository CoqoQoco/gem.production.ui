<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('gold.editGold') || 'แก้ไขทอง'"
    :style="{ width: '800px' }"
    :modal="true"
    :draggable="false"
    class="list-form-modal"
  >
    <div v-if="isLoading" class="list-detail-loading">
      <ProgressSpinner />
    </div>

    <div v-else-if="!gold" class="list-detail-no-data">
      <i class="pi pi-info-circle"></i>
      <p>{{ $t('gold.noData') || 'ไม่พบข้อมูลทอง' }}</p>
    </div>

    <div v-else class="list-form">
      <!-- Gold Information Section -->
      <div class="form-section">
        <div class="section-title">
          <i class="pi pi-circle"></i>
          <span>{{ $t('gold.form.goldInfo') || 'ข้อมูลทอง' }}</span>
        </div>
        <div class="form-grid">
          <!-- Code (Read-only) -->
          <div class="form-group">
            <label>
              {{ $t('gold.form.code') || 'รหัสทอง' }}
            </label>
            <InputText
              v-model="form.code"
              :disabled="true"
            />
          </div>

          <!-- Name (Thai) -->
          <div class="form-group">
            <label>
              {{ $t('gold.form.nameTh') || 'ชื่อทอง (ไทย)' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.nameTh"
              :placeholder="$t('gold.form.nameThPlaceholder') || 'กรอกชื่อทองภาษาไทย'"
              :class="{ 'p-invalid': errors.nameTh }"
            />
            <small v-if="errors.nameTh" class="p-error">{{ errors.nameTh }}</small>
          </div>

          <!-- Name (English) -->
          <div class="form-group">
            <label>
              {{ $t('gold.form.nameEn') || 'ชื่อทอง (อังกฤษ)' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.nameEn"
              :placeholder="$t('gold.form.nameEnPlaceholder') || 'กรอกชื่อทองภาษาอังกฤษ'"
              :class="{ 'p-invalid': errors.nameEn }"
            />
            <small v-if="errors.nameEn" class="p-error">{{ errors.nameEn }}</small>
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
        <button v-if="gold" class="btn-submit" @click="handleSave" :disabled="isSaving">
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
import ProgressSpinner from "primevue/progressspinner";
import { useGoldApiStore } from "@/stores/api/gold-api";
import { useToast } from "primevue/usetoast";

export default {
  name: "EditView",

  components: {
    Dialog,
    Button,
    InputText,
    ProgressSpinner
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    goldId: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      goldApiStore: useGoldApiStore(),
      toast: useToast(),
      gold: null,
      form: {
        code: "",
        nameTh: "",
        nameEn: ""
      },
      errors: {},
      isLoading: false,
      isSaving: false
    };
  },

  watch: {
    visible(newVal) {
      if (newVal && this.goldId) {
        this.loadGold();
      }
    }
  },

  methods: {
    async loadGold() {
      this.isLoading = true;

      try {
        const result = await this.goldApiStore.getGold({ id: this.goldId });

        if (result.success) {
          this.gold = result.data;
          this.form = {
            code: result.data.code || "",
            nameTh: result.data.nameTh || "",
            nameEn: result.data.nameEn || ""
          };
        } else {
          this.toast.add({
            severity: "error",
            summary: this.$t("common.error") || "ผิดพลาด",
            detail: result.message || this.$t("gold.loadError") || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
            life: 5000
          });
        }
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || this.$t("gold.loadError") || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
          life: 5000
        });
      } finally {
        this.isLoading = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.form.nameTh || this.form.nameTh.trim() === "") {
        this.errors.nameTh = this.$t('gold.validation.nameThRequired') || 'กรุณากรอกชื่อทอง (ไทย)';
      }

      if (!this.form.nameEn || this.form.nameEn.trim() === "") {
        this.errors.nameEn = this.$t('gold.validation.nameEnRequired') || 'กรุณากรอกชื่อทอง (อังกฤษ)';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleSave() {
      if (!this.validateForm()) {
        return;
      }

      this.isSaving = true;

      try {
        const result = await this.goldApiStore.updateGold({
          id: this.goldId,
          nameTh: this.form.nameTh.trim(),
          nameEn: this.form.nameEn.trim()
        });

        if (result.success) {
          this.$emit("updated");
          this.resetForm();
        } else {
          this.toast.add({
            severity: "error",
            summary: this.$t("common.error") || "ผิดพลาด",
            detail: result.message || this.$t("gold.updateError") || "เกิดข้อผิดพลาดในการอัปเดตทอง",
            life: 5000
          });
        }
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || this.$t("gold.updateError") || "เกิดข้อผิดพลาดในการอัปเดตทอง",
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
      this.gold = null;
      this.form = {
        code: "",
        nameTh: "",
        nameEn: ""
      };
      this.errors = {};
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/list-page-templete/modal-view.scss";
</style>
