<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('workerGuide.editWorkerGuide') || 'แก้ไขไกด์'"
    :style="{ width: '800px' }"
    :modal="true"
    :draggable="false"
    class="list-form-modal"
  >
    <div v-if="isLoading" class="list-detail-loading">
      <ProgressSpinner />
      <p>{{ $t("common.loading") || "กำลังโหลด..." }}</p>
    </div>

    <div v-else class="list-form">
      <!-- Worker Guide Information Section -->
      <div class="form-section">
        <div class="section-title">
          <i class="pi pi-user"></i>
          <span>{{ $t('workerGuide.form.personalInfo') || 'ข้อมูลส่วนตัว' }}</span>
        </div>
        <div class="form-grid">
          <!-- Code (Read-only) -->
          <div class="form-group">
            <label>
              {{ $t('workerGuide.form.code') || 'รหัส' }}
            </label>
            <InputText
              v-model="form.code"
              :disabled="true"
              class="p-disabled"
            />
          </div>

          <!-- Spacer -->
          <div class="form-group"></div>

          <!-- Name (Thai) -->
          <div class="form-group">
            <label>
              {{ $t('workerGuide.form.nameTh') || 'ชื่อ (ไทย)' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.nameTh"
              :placeholder="$t('workerGuide.form.nameThPlaceholder') || 'กรอกชื่อภาษาไทย'"
              :class="{ 'p-invalid': errors.nameTh }"
            />
            <small v-if="errors.nameTh" class="p-error">{{ errors.nameTh }}</small>
          </div>

          <!-- Name (English) -->
          <div class="form-group">
            <label>
              {{ $t('workerGuide.form.nameEn') || 'ชื่อ (อังกฤษ)' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.nameEn"
              :placeholder="$t('workerGuide.form.nameEnPlaceholder') || 'กรอกชื่อภาษาอังกฤษ'"
              :class="{ 'p-invalid': errors.nameEn }"
            />
            <small v-if="errors.nameEn" class="p-error">{{ errors.nameEn }}</small>
          </div>

          <!-- Gender -->
          <div class="form-group">
            <label>
              {{ $t('workerGuide.form.gender') || 'เพศ' }}
              <span class="required">*</span>
            </label>
            <Dropdown
              v-model="form.gender"
              :options="genderOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('workerGuide.form.genderPlaceholder') || 'เลือกเพศ'"
              :class="{ 'p-invalid': errors.gender }"
            />
            <small v-if="errors.gender" class="p-error">{{ errors.gender }}</small>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label>
              {{ $t('workerGuide.form.email') || 'อีเมล' }}
            </label>
            <InputText
              v-model="form.email"
              type="email"
              :placeholder="$t('workerGuide.form.emailPlaceholder') || 'กรอกอีเมล'"
              :class="{ 'p-invalid': errors.email }"
            />
            <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
          </div>

          <!-- Tel -->
          <div class="form-group">
            <label>
              {{ $t('workerGuide.form.tel') || 'เบอร์โทร' }}
            </label>
            <InputText
              v-model="form.tel"
              :placeholder="$t('workerGuide.form.telPlaceholder') || 'กรอกเบอร์โทร'"
              :class="{ 'p-invalid': errors.tel }"
            />
            <small v-if="errors.tel" class="p-error">{{ errors.tel }}</small>
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
        <button class="btn-submit" @click="handleSave" :disabled="isSaving || isLoading">
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
import Dropdown from "primevue/dropdown";
import ProgressSpinner from "primevue/progressspinner";
import { useWorkerGuideApiStore } from "@/stores/api/worker-guide-api";
import { useToast } from "primevue/usetoast";

export default {
  name: "EditView",

  components: {
    Dialog,
    Button,
    InputText,
    Dropdown,
    ProgressSpinner
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    workerGuideId: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      workerGuideApiStore: useWorkerGuideApiStore(),
      toast: useToast(),
      form: {
        code: "",
        nameTh: "",
        nameEn: "",
        email: "",
        tel: "",
        gender: ""
      },
      errors: {},
      isLoading: false,
      isSaving: false,
      genderOptions: [
        { value: 'M', label: this.$t('workerGuide.gender.male') || 'ชาย' },
        { value: 'F', label: this.$t('workerGuide.gender.female') || 'หญิง' }
      ]
    };
  },

  watch: {
    visible(newVal) {
      if (newVal && this.workerGuideId) {
        this.loadWorkerGuideData();
      }
    }
  },

  methods: {
    async loadWorkerGuideData() {
      this.isLoading = true;

      try {
        const result = await this.workerGuideApiStore.getWorkerGuide({
          id: this.workerGuideId
        });

        if (result.success) {
          this.form.code = result.data.code;
          this.form.nameTh = result.data.nameTh;
          this.form.nameEn = result.data.nameEn;
          this.form.email = result.data.email || "";
          this.form.tel = result.data.tel || "";
          this.form.gender = result.data.gender;
        } else {
          this.toast.add({
            severity: "error",
            summary: this.$t("common.error") || "ผิดพลาด",
            detail: result.message || this.$t("workerGuide.loadError") || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
            life: 5000
          });
          this.$emit("update:visible", false);
        }
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || this.$t("workerGuide.loadError") || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
          life: 5000
        });
        this.$emit("update:visible", false);
      } finally {
        this.isLoading = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.form.nameTh || this.form.nameTh.trim() === "") {
        this.errors.nameTh = this.$t('workerGuide.validation.nameThRequired') || 'กรุณากรอกชื่อ (ไทย)';
      }

      if (!this.form.nameEn || this.form.nameEn.trim() === "") {
        this.errors.nameEn = this.$t('workerGuide.validation.nameEnRequired') || 'กรุณากรอกชื่อ (อังกฤษ)';
      }

      if (!this.form.gender) {
        this.errors.gender = this.$t('workerGuide.validation.genderRequired') || 'กรุณาเลือกเพศ';
      }

      if (this.form.email && !this.isValidEmail(this.form.email)) {
        this.errors.email = this.$t('workerGuide.validation.emailInvalid') || 'รูปแบบอีเมลไม่ถูกต้อง';
      }

      return Object.keys(this.errors).length === 0;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    async handleSave() {
      if (!this.validateForm()) {
        return;
      }

      this.isSaving = true;

      try {
        const result = await this.workerGuideApiStore.updateWorkerGuide({
          id: this.workerGuideId,
          nameTh: this.form.nameTh.trim(),
          nameEn: this.form.nameEn.trim(),
          email: this.form.email ? this.form.email.trim() : null,
          tel: this.form.tel ? this.form.tel.trim() : null,
          gender: this.form.gender
        });

        if (result.success) {
          this.$emit("updated");
          this.resetForm();
        } else {
          this.toast.add({
            severity: "error",
            summary: this.$t("common.error") || "ผิดพลาด",
            detail: result.message || this.$t("workerGuide.updateError") || "เกิดข้อผิดพลาดในการอัปเดตไกด์",
            life: 5000
          });
        }
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || this.$t("workerGuide.updateError") || "เกิดข้อผิดพลาดในการอัปเดตไกด์",
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
        email: "",
        tel: "",
        gender: ""
      };
      this.errors = {};
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/list-page-templete/modal-view.scss";
</style>
