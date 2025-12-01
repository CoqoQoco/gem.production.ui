<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('customer.addCustomer') || 'เพิ่มลูกค้า'"
    :style="{ width: '800px' }"
    :modal="true"
    :draggable="false"
    class="list-form-modal"
  >
    <div class="list-form">
      <!-- Customer Basic Information Section -->
      <div class="form-section">
        <div class="section-title">
          <i class="pi pi-user"></i>
          <span>{{ $t('customer.form.basicInfo') || 'ข้อมูลพื้นฐาน' }}</span>
        </div>
        <div class="form-grid">
          <!-- Customer Number -->
          <div class="form-group">
            <label>
              {{ $t('customer.form.customerNumber') || 'รหัสลูกค้า' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.customerNumber"
              :placeholder="$t('customer.form.customerNumberPlaceholder') || 'กรอกรหัสลูกค้า'"
              :class="{ 'p-invalid': errors.customerNumber }"
            />
            <small v-if="errors.customerNumber" class="p-error">{{ errors.customerNumber }}</small>
          </div>

          <!-- Customer Name -->
          <div class="form-group">
            <label>
              {{ $t('customer.form.customerName') || 'ชื่อลูกค้า' }}
              <span class="required">*</span>
            </label>
            <InputText
              v-model="form.customerName"
              :placeholder="$t('customer.form.customerNamePlaceholder') || 'กรอกชื่อลูกค้า'"
              :class="{ 'p-invalid': errors.customerName }"
            />
            <small v-if="errors.customerName" class="p-error">{{ errors.customerName }}</small>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label>
              {{ $t('customer.form.email') || 'อีเมล' }}
            </label>
            <InputText
              v-model="form.email"
              type="email"
              :placeholder="$t('customer.form.emailPlaceholder') || 'กรอกอีเมล'"
              :class="{ 'p-invalid': errors.email }"
            />
            <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
          </div>

          <!-- Phone -->
          <div class="form-group">
            <label>
              {{ $t('customer.form.phone') || 'เบอร์โทร' }}
            </label>
            <InputText
              v-model="form.phone"
              :placeholder="$t('customer.form.phonePlaceholder') || 'กรอกเบอร์โทร'"
              :class="{ 'p-invalid': errors.phone }"
            />
            <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
          </div>

          <!-- Address 1 (Full Width) -->
          <div class="form-group form-grid-full">
            <label>
              {{ $t('customer.form.address1') || 'ที่อยู่ 1' }}
            </label>
            <Textarea
              v-model="form.address1"
              :placeholder="$t('customer.form.address1Placeholder') || 'กรอกที่อยู่'"
              rows="2"
              :class="{ 'p-invalid': errors.address1 }"
            />
            <small v-if="errors.address1" class="p-error">{{ errors.address1 }}</small>
          </div>

          <!-- Address 2 (Full Width) -->
          <div class="form-group form-grid-full">
            <label>
              {{ $t('customer.form.address2') || 'ที่อยู่ 2' }}
            </label>
            <Textarea
              v-model="form.address2"
              :placeholder="$t('customer.form.address2Placeholder') || 'กรอกที่อยู่เพิ่มเติม'"
              rows="2"
              :class="{ 'p-invalid': errors.address2 }"
            />
            <small v-if="errors.address2" class="p-error">{{ errors.address2 }}</small>
          </div>

          <!-- Country -->
          <div class="form-group">
            <label>
              {{ $t('customer.form.country') || 'ประเทศ' }}
            </label>
            <InputText
              v-model="form.country"
              :placeholder="$t('customer.form.countryPlaceholder') || 'กรอกประเทศ'"
              :class="{ 'p-invalid': errors.country }"
            />
            <small v-if="errors.country" class="p-error">{{ errors.country }}</small>
          </div>

          <!-- Postcode -->
          <div class="form-group">
            <label>
              {{ $t('customer.form.postcode') || 'รหัสไปรษณีย์' }}
            </label>
            <InputText
              v-model="form.postcode"
              :placeholder="$t('customer.form.postcodePlaceholder') || 'กรอกรหัสไปรษณีย์'"
              :class="{ 'p-invalid': errors.postcode }"
            />
            <small v-if="errors.postcode" class="p-error">{{ errors.postcode }}</small>
          </div>

          <!-- Discount -->
          <div class="form-group">
            <label>
              {{ $t('customer.form.discount') || 'ส่วนลด' }}
            </label>
            <InputText
              v-model="form.discount"
              :placeholder="$t('customer.form.discountPlaceholder') || 'กรอกส่วนลด'"
              :class="{ 'p-invalid': errors.discount }"
            />
            <small v-if="errors.discount" class="p-error">{{ errors.discount }}</small>
          </div>

          <!-- Remark (Full Width) -->
          <div class="form-group form-grid-full">
            <label>
              {{ $t('customer.form.remark') || 'หมายเหตุ' }}
            </label>
            <Textarea
              v-model="form.remark"
              :placeholder="$t('customer.form.remarkPlaceholder') || 'กรอกหมายเหตุ'"
              rows="3"
              :class="{ 'p-invalid': errors.remark }"
            />
            <small v-if="errors.remark" class="p-error">{{ errors.remark }}</small>
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
import { useCustomerApiStore } from "@/stores/api/customer-api";
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
      customerApiStore: useCustomerApiStore(),
      toast: useToast(),
      form: {
        customerNumber: "",
        customerName: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        country: "",
        postcode: "",
        discount: "",
        remark: ""
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

      if (!this.form.customerNumber || this.form.customerNumber.trim() === "") {
        this.errors.customerNumber = this.$t('customer.validation.customerNumberRequired') || 'กรุณากรอกรหัสลูกค้า';
      }

      if (!this.form.customerName || this.form.customerName.trim() === "") {
        this.errors.customerName = this.$t('customer.validation.customerNameRequired') || 'กรุณากรอกชื่อลูกค้า';
      }

      if (this.form.email && !this.isValidEmail(this.form.email)) {
        this.errors.email = this.$t('customer.validation.emailInvalid') || 'รูปแบบอีเมลไม่ถูกต้อง';
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
        const result = await this.customerApiStore.createCustomer({
          customerNumber: this.form.customerNumber.trim(),
          customerName: this.form.customerName.trim(),
          email: this.form.email ? this.form.email.trim() : null,
          phone: this.form.phone ? this.form.phone.trim() : null,
          address1: this.form.address1 ? this.form.address1.trim() : null,
          address2: this.form.address2 ? this.form.address2.trim() : null,
          country: this.form.country ? this.form.country.trim() : null,
          postcode: this.form.postcode ? this.form.postcode.trim() : null,
          discount: this.form.discount ? this.form.discount.trim() : null,
          remark: this.form.remark ? this.form.remark.trim() : null
        });

        if (result.success) {
          this.$emit("created");
          this.resetForm();
        } else {
          this.toast.add({
            severity: "error",
            summary: this.$t("common.error") || "ผิดพลาด",
            detail: result.message || this.$t("customer.createError") || "เกิดข้อผิดพลาดในการเพิ่มลูกค้า",
            life: 5000
          });
        }
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || this.$t("customer.createError") || "เกิดข้อผิดพลาดในการเพิ่มลูกค้า",
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
        customerNumber: "",
        customerName: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        country: "",
        postcode: "",
        discount: "",
        remark: ""
      };
      this.errors = {};
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/list-page-templete/modal-view.scss";
</style>
