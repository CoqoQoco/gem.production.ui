<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('gem.addGem') || 'เพิ่มพลอย'"
    :style="{ width: '800px' }"
    :modal="true"
    :draggable="false"
    class="list-form-modal"
  >
    <div class="list-form">
      <!-- Gem Information Section -->
      <div class="form-section">
        <div class="section-title">
          <i class="pi pi-diamond"></i>
          <span>{{ $t('gem.form.gemInfo') || 'ข้อมูลพลอย' }}</span>
        </div>
        <div class="form-grid">
          <!-- Code -->
          <div class="form-group">
            <label>
              {{ $t('gem.form.code') || 'รหัสพลอย' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.code"
              :placeholder="$t('gem.form.codePlaceholder') || 'กรอกรหัสพลอย'"
              :class="{ 'p-invalid': errors.code }"
            />
            <small v-if="errors.code" class="p-error">{{ errors.code }}</small>
          </div>

          <!-- Name (Thai) -->
          <div class="form-group">
            <label>
              {{ $t('gem.form.nameTh') || 'ชื่อพลอย (ไทย)' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.nameTh"
              :placeholder="$t('gem.form.nameThPlaceholder') || 'กรอกชื่อพลอยภาษาไทย'"
              :class="{ 'p-invalid': errors.nameTh }"
            />
            <small v-if="errors.nameTh" class="p-error">{{ errors.nameTh }}</small>
          </div>

          <!-- Name (English) -->
          <div class="form-group">
            <label>
              {{ $t('gem.form.nameEn') || 'ชื่อพลอย (อังกฤษ)' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.nameEn"
              :placeholder="$t('gem.form.nameEnPlaceholder') || 'กรอกชื่อพลอยภาษาอังกฤษ'"
              :class="{ 'p-invalid': errors.nameEn }"
            />
            <small v-if="errors.nameEn" class="p-error">{{ errors.nameEn }}</small>
          </div>

          <!-- Color -->
          <div class="form-group">
            <label>
              {{ $t('gem.form.color') || 'สี' }}
            </label>
            <InputText
              v-model="form.color"
              :placeholder="$t('gem.form.colorPlaceholder') || 'กรอกสีของพลอย'"
              :class="{ 'p-invalid': errors.color }"
            />
            <small v-if="errors.color" class="p-error">{{ errors.color }}</small>
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
import { useGemApiStore } from "@/stores/api/gem-api";
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
      gemApiStore: useGemApiStore(),
      toast: useToast(),
      form: {
        code: "",
        nameTh: "",
        nameEn: "",
        color: ""
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
        this.errors.code = this.$t('gem.validation.codeRequired') || 'กรุณากรอกรหัสพลอย';
      }

      if (!this.form.nameTh || this.form.nameTh.trim() === "") {
        this.errors.nameTh = this.$t('gem.validation.nameThRequired') || 'กรุณากรอกชื่อพลอย (ไทย)';
      }

      if (!this.form.nameEn || this.form.nameEn.trim() === "") {
        this.errors.nameEn = this.$t('gem.validation.nameEnRequired') || 'กรุณากรอกชื่อพลอย (อังกฤษ)';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleSave() {
      if (!this.validateForm()) {
        return;
      }

      this.isSaving = true;

      try {
        const result = await this.gemApiStore.createGem({
          code: this.form.code.trim(),
          nameTh: this.form.nameTh.trim(),
          nameEn: this.form.nameEn.trim(),
          color: this.form.color ? this.form.color.trim() : null
        });

        if (result.success) {
          this.$emit("created");
          this.resetForm();
        } else {
          this.toast.add({
            severity: "error",
            summary: this.$t("common.error") || "ผิดพลาด",
            detail: result.message || this.$t("gem.createError") || "เกิดข้อผิดพลาดในการเพิ่มพลอย",
            life: 5000
          });
        }
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || this.$t("gem.createError") || "เกิดข้อผิดพลาดในการเพิ่มพลอย",
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
        color: ""
      };
      this.errors = {};
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/list-page-templete/modal-view.scss";
</style>
