<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('branch.addBranch') || 'เพิ่มสาขา'"
    :style="{ width: '800px' }"
    :modal="true"
    :draggable="false"
    class="list-form-modal"
  >
    <div class="list-form">
      <!-- Branch Information Section -->
      <div class="form-section">
        <div class="section-title">
          <i class="pi pi-building"></i>
          <span>{{ $t('branch.form.branchInfo') || 'ข้อมูลสาขา' }}</span>
        </div>
        <div class="form-grid">
          <!-- Branch Name (Thai) -->
          <div class="form-group">
            <label>
              {{ $t('branch.form.nameTh') || 'ชื่อสาขา (ไทย)' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.nameTh"
              :placeholder="$t('branch.form.nameThPlaceholder') || 'กรอกชื่อสาขาภาษาไทย'"
              :class="{ 'p-invalid': errors.nameTh }"
            />
            <small v-if="errors.nameTh" class="p-error">{{ errors.nameTh }}</small>
          </div>

          <!-- Branch Name (English) -->
          <div class="form-group">
            <label>
              {{ $t('branch.form.nameEn') || 'ชื่อสาขา (อังกฤษ)' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.nameEn"
              :placeholder="$t('branch.form.nameEnPlaceholder') || 'กรอกชื่อสาขาภาษาอังกฤษ'"
              :class="{ 'p-invalid': errors.nameEn }"
            />
            <small v-if="errors.nameEn" class="p-error">{{ errors.nameEn }}</small>
          </div>

          <!-- Address (Full Width) -->
          <div class="form-group form-grid-full">
            <label>
              {{ $t('branch.form.address') || 'ที่อยู่' }}
              <span class="required">*</span>
            </label>
            <Textarea
              v-model="form.address"
              :placeholder="$t('branch.form.addressPlaceholder') || 'กรอกที่อยู่สาขา'"
              :class="{ 'p-invalid': errors.address }"
              rows="3"
            />
            <small v-if="errors.address" class="p-error">{{ errors.address }}</small>
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
import Textarea from "primevue/textarea";
import { useBranchApiStore } from "@/stores/api/branch-api";
import { useToast } from "primevue/usetoast";

export default {
  name: "CreateView",

  components: {
    Dialog,
    Button,
    InputText,
    Textarea
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      branchApiStore: useBranchApiStore(),
      toast: useToast(),
      form: {
        nameTh: "",
        nameEn: "",
        address: ""
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

      if (!this.form.nameTh || this.form.nameTh.trim() === "") {
        this.errors.nameTh = this.$t('branch.validation.nameThRequired') || 'กรุณากรอกชื่อสาขา (ไทย)';
      }

      if (!this.form.nameEn || this.form.nameEn.trim() === "") {
        this.errors.nameEn = this.$t('branch.validation.nameEnRequired') || 'กรุณากรอกชื่อสาขา (อังกฤษ)';
      }

      if (!this.form.address || this.form.address.trim() === "") {
        this.errors.address = this.$t('branch.validation.addressRequired') || 'กรุณากรอกที่อยู่';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleSave() {
      if (!this.validateForm()) {
        return;
      }

      this.isSaving = true;

      try {
        const result = await this.branchApiStore.createBranch({
          nameTh: this.form.nameTh.trim(),
          nameEn: this.form.nameEn.trim(),
          address: this.form.address.trim()
        });

        if (result.success) {
          this.$emit("created");
          this.resetForm();
        } else {
          this.toast.add({
            severity: "error",
            summary: this.$t("common.error") || "ผิดพลาด",
            detail: result.message || this.$t("branch.createError") || "เกิดข้อผิดพลาดในการเพิ่มสาขา",
            life: 5000
          });
        }
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || this.$t("branch.createError") || "เกิดข้อผิดพลาดในการเพิ่มสาขา",
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
        nameTh: "",
        nameEn: "",
        address: ""
      };
      this.errors = {};
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/list-page-templete/modal-view.scss";
</style>
