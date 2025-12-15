<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('goldSize.addGoldSize') || 'เพิ่มขนาดทอง'"
    :style="{ width: '800px' }"
    :modal="true"
    :draggable="false"
    class="list-form-modal"
  >
    <div class="list-form">
      <!-- Gold Size Information Section -->
      <div class="form-section">
        <div class="section-title">
          <i class="pi pi-arrows-h"></i>
          <span>{{ $t('goldSize.form.goldSizeInfo') || 'ข้อมูลขนาดทอง' }}</span>
        </div>
        <div class="form-grid">
          <!-- Code -->
          <div class="form-group">
            <label>
              {{ $t('goldSize.form.code') || 'รหัสขนาดทอง' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.code"
              :placeholder="$t('goldSize.form.codePlaceholder') || 'กรอกรหัสขนาดทอง'"
              :class="{ 'p-invalid': errors.code }"
            />
            <small v-if="errors.code" class="p-error">{{ errors.code }}</small>
          </div>

          <!-- Name (Thai) -->
          <div class="form-group">
            <label>
              {{ $t('goldSize.form.nameTh') || 'ชื่อขนาดทอง (ไทย)' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.nameTh"
              :placeholder="$t('goldSize.form.nameThPlaceholder') || 'กรอกชื่อขนาดทองภาษาไทย'"
              :class="{ 'p-invalid': errors.nameTh }"
            />
            <small v-if="errors.nameTh" class="p-error">{{ errors.nameTh }}</small>
          </div>

          <!-- Name (English) -->
          <div class="form-group">
            <label>
              {{ $t('goldSize.form.nameEn') || 'ชื่อขนาดทอง (อังกฤษ)' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.nameEn"
              :placeholder="$t('goldSize.form.nameEnPlaceholder') || 'กรอกชื่อขนาดทองภาษาอังกฤษ'"
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
import { useGoldSizeApiStore } from "@/stores/api/gold-size-api";
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
      goldSizeApiStore: useGoldSizeApiStore(),
      toast: useToast(),
      form: {
        code: "",
        nameTh: "",
        nameEn: ""
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
        this.errors.code = this.$t('goldSize.validation.codeRequired') || 'กรุณากรอกรหัสขนาดทอง';
      }

      if (!this.form.nameTh || this.form.nameTh.trim() === "") {
        this.errors.nameTh = this.$t('goldSize.validation.nameThRequired') || 'กรุณากรอกชื่อขนาดทอง (ไทย)';
      }

      if (!this.form.nameEn || this.form.nameEn.trim() === "") {
        this.errors.nameEn = this.$t('goldSize.validation.nameEnRequired') || 'กรุณากรอกชื่อขนาดทอง (อังกฤษ)';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleSave() {
      if (!this.validateForm()) {
        return;
      }

      this.isSaving = true;

      try {
        const result = await this.goldSizeApiStore.createGoldSize({
          code: this.form.code.trim(),
          nameTh: this.form.nameTh.trim(),
          nameEn: this.form.nameEn.trim()
        });

        if (result.success) {
          this.$emit("created");
          this.resetForm();
        } else {
          this.toast.add({
            severity: "error",
            summary: this.$t("common.error") || "ผิดพลาด",
            detail: result.message || this.$t("goldSize.createError") || "เกิดข้อผิดพลาดในการเพิ่มขนาดทอง",
            life: 5000
          });
        }
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || this.$t("goldSize.createError") || "เกิดข้อผิดพลาดในการเพิ่มขนาดทอง",
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
