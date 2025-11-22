<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('workerDriver.editWorkerDriver') || 'แก้ไขพนักงานขับรถ'"
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
      <!-- Worker Driver Information Section -->
      <div class="form-section">
        <div class="section-title">
          <i class="pi pi-user"></i>
          <span>{{ $t('workerDriver.form.personalInfo') || 'ข้อมูลส่วนตัว' }}</span>
        </div>
        <div class="form-grid">
          <!-- Code (Read-only) -->
          <div class="form-group">
            <label>
              {{ $t('workerDriver.form.code') || 'รหัส' }}
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
              {{ $t('workerDriver.form.nameTh') || 'ชื่อ (ไทย)' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.nameTh"
              :placeholder="$t('workerDriver.form.nameThPlaceholder') || 'กรอกชื่อภาษาไทย'"
              :class="{ 'p-invalid': errors.nameTh }"
            />
            <small v-if="errors.nameTh" class="p-error">{{ errors.nameTh }}</small>
          </div>

          <!-- Name (English) -->
          <div class="form-group">
            <label>
              {{ $t('workerDriver.form.nameEn') || 'ชื่อ (อังกฤษ)' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.nameEn"
              :placeholder="$t('workerDriver.form.nameEnPlaceholder') || 'กรอกชื่อภาษาอังกฤษ'"
              :class="{ 'p-invalid': errors.nameEn }"
            />
            <small v-if="errors.nameEn" class="p-error">{{ errors.nameEn }}</small>
          </div>

          <!-- Gender -->
          <div class="form-group">
            <label>
              {{ $t('workerDriver.form.gender') || 'เพศ' }}
              <span class="required">*</span>
            </label>
            <Dropdown
              v-model="form.gender"
              :options="genderOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('workerDriver.form.genderPlaceholder') || 'เลือกเพศ'"
              :class="{ 'p-invalid': errors.gender }"
            />
            <small v-if="errors.gender" class="p-error">{{ errors.gender }}</small>
          </div>

          <!-- Tel -->
          <div class="form-group">
            <label>
              {{ $t('workerDriver.form.tel') || 'เบอร์โทร' }}
            </label>
            <InputText
              v-model="form.tel"
              :placeholder="$t('workerDriver.form.telPlaceholder') || 'กรอกเบอร์โทร'"
              :class="{ 'p-invalid': errors.tel }"
            />
            <small v-if="errors.tel" class="p-error">{{ errors.tel }}</small>
          </div>

          <!-- Vehicle Registration -->
          <div class="form-group">
            <label>
              {{ $t('workerDriver.form.vehicleRegistration') || 'ทะเบียนรถ' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.vehicleRegistration"
              :placeholder="$t('workerDriver.form.vehicleRegistrationPlaceholder') || 'กรอกทะเบียนรถ'"
              :class="{ 'p-invalid': errors.vehicleRegistration }"
            />
            <small v-if="errors.vehicleRegistration" class="p-error">{{ errors.vehicleRegistration }}</small>
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
import { useWorkerDriverApiStore } from "@/stores/api/worker-driver-api";
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
    workerDriverId: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      workerDriverApiStore: useWorkerDriverApiStore(),
      toast: useToast(),
      form: {
        code: "",
        nameTh: "",
        nameEn: "",
        tel: "",
        gender: "",
        vehicleRegistration: ""
      },
      errors: {},
      isLoading: false,
      isSaving: false,
      genderOptions: [
        { value: 'M', label: this.$t('workerDriver.gender.male') || 'ชาย' },
        { value: 'F', label: this.$t('workerDriver.gender.female') || 'หญิง' }
      ]
    };
  },

  watch: {
    visible(newVal) {
      if (newVal && this.workerDriverId) {
        this.loadWorkerDriverData();
      }
    }
  },

  methods: {
    async loadWorkerDriverData() {
      this.isLoading = true;

      try {
        const result = await this.workerDriverApiStore.getWorkerDriver({
          id: this.workerDriverId
        });

        if (result.success) {
          this.form.code = result.data.code;
          this.form.nameTh = result.data.nameTh;
          this.form.nameEn = result.data.nameEn;
          this.form.tel = result.data.tel || "";
          this.form.gender = result.data.gender;
          this.form.vehicleRegistration = result.data.vehicleRegistration || "";
        } else {
          this.toast.add({
            severity: "error",
            summary: this.$t("common.error") || "ผิดพลาด",
            detail: result.message || this.$t("workerDriver.loadError") || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
            life: 5000
          });
          this.$emit("update:visible", false);
        }
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || this.$t("workerDriver.loadError") || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
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
        this.errors.nameTh = this.$t('workerDriver.validation.nameThRequired') || 'กรุณากรอกชื่อ (ไทย)';
      }

      if (!this.form.nameEn || this.form.nameEn.trim() === "") {
        this.errors.nameEn = this.$t('workerDriver.validation.nameEnRequired') || 'กรุณากรอกชื่อ (อังกฤษ)';
      }

      if (!this.form.gender) {
        this.errors.gender = this.$t('workerDriver.validation.genderRequired') || 'กรุณาเลือกเพศ';
      }

      if (!this.form.vehicleRegistration || this.form.vehicleRegistration.trim() === "") {
        this.errors.vehicleRegistration = this.$t('workerDriver.validation.vehicleRegistrationRequired') || 'กรุณากรอกทะเบียนรถ';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleSave() {
      if (!this.validateForm()) {
        return;
      }

      this.isSaving = true;

      try {
        const result = await this.workerDriverApiStore.updateWorkerDriver({
          id: this.workerDriverId,
          nameTh: this.form.nameTh.trim(),
          nameEn: this.form.nameEn.trim(),
          tel: this.form.tel ? this.form.tel.trim() : null,
          gender: this.form.gender,
          vehicleRegistration: this.form.vehicleRegistration.trim()
        });

        if (result.success) {
          this.$emit("updated");
          this.resetForm();
        } else {
          this.toast.add({
            severity: "error",
            summary: this.$t("common.error") || "ผิดพลาด",
            detail: result.message || this.$t("workerDriver.updateError") || "เกิดข้อผิดพลาดในการอัปเดตพนักงานขับรถ",
            life: 5000
          });
        }
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || this.$t("workerDriver.updateError") || "เกิดข้อผิดพลาดในการอัปเดตพนักงานขับรถ",
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
        tel: "",
        gender: "",
        vehicleRegistration: ""
      };
      this.errors = {};
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/list-page-templete/modal-view.scss";
</style>
