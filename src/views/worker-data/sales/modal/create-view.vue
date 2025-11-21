<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('workerSale.addWorkerSale') || 'เพิ่มพนักงานขาย'"
    :style="{ width: '800px' }"
    :modal="true"
    :draggable="false"
    class="list-form-modal"
  >
    <div class="list-form">
      <!-- Worker Sale Information Section -->
      <div class="form-section">
        <div class="section-title">
          <i class="pi pi-user"></i>
          <span>{{ $t('workerSale.form.personalInfo') || 'ข้อมูลส่วนตัว' }}</span>
        </div>
        <div class="form-grid">
          <!-- Name (Thai) -->
          <div class="form-group">
            <label>
              {{ $t('workerSale.form.nameTh') || 'ชื่อ (ไทย)' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.nameTh"
              :placeholder="$t('workerSale.form.nameThPlaceholder') || 'กรอกชื่อภาษาไทย'"
              :class="{ 'p-invalid': errors.nameTh }"
            />
            <small v-if="errors.nameTh" class="p-error">{{ errors.nameTh }}</small>
          </div>

          <!-- Name (English) -->
          <div class="form-group">
            <label>
              {{ $t('workerSale.form.nameEn') || 'ชื่อ (อังกฤษ)' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.nameEn"
              :placeholder="$t('workerSale.form.nameEnPlaceholder') || 'กรอกชื่อภาษาอังกฤษ'"
              :class="{ 'p-invalid': errors.nameEn }"
            />
            <small v-if="errors.nameEn" class="p-error">{{ errors.nameEn }}</small>
          </div>

          <!-- Gender -->
          <div class="form-group">
            <label>
              {{ $t('workerSale.form.gender') || 'เพศ' }}
              <span class="required">*</span>
            </label>
            <Dropdown
              v-model="form.gender"
              :options="genderOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('workerSale.form.genderPlaceholder') || 'เลือกเพศ'"
              :class="{ 'p-invalid': errors.gender }"
            />
            <small v-if="errors.gender" class="p-error">{{ errors.gender }}</small>
          </div>

          <!-- Branch -->
          <div class="form-group">
            <label>
              {{ $t('workerSale.form.branch') || 'สาขา' }}
              <span class="required">*</span>
            </label>
            <Dropdown
              v-model="form.branch"
              :options="branches"
              optionLabel="nameTh"
              optionValue="branchId"
              :placeholder="$t('workerSale.form.branchPlaceholder') || 'เลือกสาขา'"
              :class="{ 'p-invalid': errors.branch }"
              :loading="loadingBranches"
            />
            <small v-if="errors.branch" class="p-error">{{ errors.branch }}</small>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label>
              {{ $t('workerSale.form.email') || 'อีเมล' }}
            </label>
            <InputText
              v-model="form.email"
              type="email"
              :placeholder="$t('workerSale.form.emailPlaceholder') || 'กรอกอีเมล'"
              :class="{ 'p-invalid': errors.email }"
            />
            <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
          </div>

          <!-- Tel -->
          <div class="form-group">
            <label>
              {{ $t('workerSale.form.tel') || 'เบอร์โทร' }}
            </label>
            <InputText
              v-model="form.tel"
              :placeholder="$t('workerSale.form.telPlaceholder') || 'กรอกเบอร์โทร'"
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
import Dropdown from "primevue/dropdown";
import { useWorkerSaleApiStore } from "@/stores/api/worker-sale-api";
import { useBranchApiStore } from "@/stores/api/branch-api";
import { useToast } from "primevue/usetoast";

export default {
  name: "CreateView",

  components: {
    Dialog,
    Button,
    InputText,
    Dropdown
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      workerSaleApiStore: useWorkerSaleApiStore(),
      branchApiStore: useBranchApiStore(),
      toast: useToast(),
      form: {
        nameTh: "",
        nameEn: "",
        email: "",
        tel: "",
        gender: "",
        branch: null
      },
      errors: {},
      isSaving: false,
      branches: [],
      loadingBranches: false,
      genderOptions: [
        { value: 'M', label: this.$t('workerSale.gender.male') || 'ชาย' },
        { value: 'F', label: this.$t('workerSale.gender.female') || 'หญิง' }
      ]
    };
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.resetForm();
        this.loadBranches();
      }
    }
  },

  methods: {
    async loadBranches() {
      this.loadingBranches = true;
      try {
        const result = await this.branchApiStore.listBranches({
          pageIndex: 0,
          pageSize: 100,
          criteria: { searchText: null }
        });

        if (result.success) {
          this.branches = result.data.filter(b => b.isActive);
        }
      } catch (error) {
        console.error('Failed to load branches:', error);
      } finally {
        this.loadingBranches = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.form.nameTh || this.form.nameTh.trim() === "") {
        this.errors.nameTh = this.$t('workerSale.validation.nameThRequired') || 'กรุณากรอกชื่อ (ไทย)';
      }

      if (!this.form.nameEn || this.form.nameEn.trim() === "") {
        this.errors.nameEn = this.$t('workerSale.validation.nameEnRequired') || 'กรุณากรอกชื่อ (อังกฤษ)';
      }

      if (!this.form.gender) {
        this.errors.gender = this.$t('workerSale.validation.genderRequired') || 'กรุณาเลือกเพศ';
      }

      if (!this.form.branch) {
        this.errors.branch = this.$t('workerSale.validation.branchRequired') || 'กรุณาเลือกสาขา';
      }

      if (this.form.email && !this.isValidEmail(this.form.email)) {
        this.errors.email = this.$t('workerSale.validation.emailInvalid') || 'รูปแบบอีเมลไม่ถูกต้อง';
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
        const result = await this.workerSaleApiStore.createWorkerSale({
          nameTh: this.form.nameTh.trim(),
          nameEn: this.form.nameEn.trim(),
          email: this.form.email ? this.form.email.trim() : null,
          tel: this.form.tel ? this.form.tel.trim() : null,
          gender: this.form.gender,
          branch: this.form.branch
        });

        if (result.success) {
          this.$emit("created");
          this.resetForm();
        } else {
          this.toast.add({
            severity: "error",
            summary: this.$t("common.error") || "ผิดพลาด",
            detail: result.message || this.$t("workerSale.createError") || "เกิดข้อผิดพลาดในการเพิ่มพนักงานขาย",
            life: 5000
          });
        }
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || this.$t("workerSale.createError") || "เกิดข้อผิดพลาดในการเพิ่มพนักงานขาย",
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
        email: "",
        tel: "",
        gender: "",
        branch: null
      };
      this.errors = {};
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/list-page-templete/modal-view.scss";
</style>
