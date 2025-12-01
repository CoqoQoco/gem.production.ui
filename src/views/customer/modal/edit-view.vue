<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="$t('customer.editCustomer') || 'แก้ไขลูกค้า'"
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
      <!-- Customer Basic Information Section -->
      <div class="form-section">
        <div class="section-title">
          <i class="pi pi-user"></i>
          <span>{{ $t('customer.form.basicInfo') || 'ข้อมูลพื้นฐาน' }}</span>
        </div>
        <div class="form-grid">
          <!-- Customer Number (Read-only) -->
          <div class="form-group">
            <label>
              {{ $t('customer.form.customerNumber') || 'รหัสลูกค้า' }}
            </label>
            <InputText
              v-model="form.customerNumber"
              :disabled="true"
              class="p-disabled"
            />
          </div>

          <!-- Customer Name (Read-only) -->
          <div class="form-group">
            <label>
              {{ $t('customer.form.customerName') || 'ชื่อลูกค้า' }}
            </label>
            <InputText
              v-model="form.customerName"
              :disabled="true"
              class="p-disabled"
            />
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

          <!-- Active Status -->
          <div class="form-group">
            <label>
              {{ $t('customer.form.status') || 'สถานะ' }}
            </label>
            <div class="flex align-items-center" style="height: 40px;">
              <Checkbox
                v-model="form.isActive"
                :binary="true"
                inputId="isActive"
              />
              <label for="isActive" class="ml-2 cursor-pointer">
                {{ form.isActive ? ($t('customer.columns.active') || 'ใช้งาน') : ($t('customer.columns.inactive') || 'ไม่ใช้งาน') }}
              </label>
            </div>
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
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";
import ProgressSpinner from "primevue/progressspinner";
import { useCustomerApiStore } from "@/stores/api/customer-api";
import { useToast } from "primevue/usetoast";

export default {
  name: "EditView",

  components: {
    Dialog,
    Button,
    InputText,
    Textarea,
    Checkbox,
    ProgressSpinner
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    customerId: {
      type: Number,
      default: null
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
        isActive: true
      },
      errors: {},
      isLoading: false,
      isSaving: false
    };
  },

  watch: {
    visible(newVal) {
      if (newVal && this.customerId) {
        this.loadCustomerData();
      }
    }
  },

  methods: {
    async loadCustomerData() {
      this.isLoading = true;

      try {
        const result = await this.customerApiStore.getCustomer({
          id: this.customerId
        });

        if (result.success) {
          this.form.customerNumber = result.data.customerNumber;
          this.form.customerName = result.data.customerName;
          this.form.email = result.data.email || "";
          this.form.phone = result.data.phone || "";
          this.form.address1 = result.data.address1 || "";
          this.form.address2 = result.data.address2 || "";
          this.form.country = result.data.country || "";
          this.form.postcode = result.data.postcode || "";
          this.form.discount = result.data.discount || "";
          this.form.isActive = result.data.isActive;
        } else {
          this.toast.add({
            severity: "error",
            summary: this.$t("common.error") || "ผิดพลาด",
            detail: result.message || this.$t("customer.loadError") || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
            life: 5000
          });
          this.$emit("update:visible", false);
        }
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || this.$t("customer.loadError") || "เกิดข้อผิดพลาดในการโหลดข้อมูล",
          life: 5000
        });
        this.$emit("update:visible", false);
      } finally {
        this.isLoading = false;
      }
    },

    validateForm() {
      this.errors = {};

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
        const result = await this.customerApiStore.updateCustomer({
          id: this.customerId,
          email: this.form.email ? this.form.email.trim() : null,
          phone: this.form.phone ? this.form.phone.trim() : null,
          address1: this.form.address1 ? this.form.address1.trim() : null,
          address2: this.form.address2 ? this.form.address2.trim() : null,
          country: this.form.country ? this.form.country.trim() : null,
          postcode: this.form.postcode ? this.form.postcode.trim() : null,
          discount: this.form.discount ? this.form.discount.trim() : null,
          isActive: this.form.isActive
        });

        if (result.success) {
          this.$emit("updated");
          this.resetForm();
        } else {
          this.toast.add({
            severity: "error",
            summary: this.$t("common.error") || "ผิดพลาด",
            detail: result.message || this.$t("customer.updateError") || "เกิดข้อผิดพลาดในการอัปเดตลูกค้า",
            life: 5000
          });
        }
      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: this.$t("common.error") || "ผิดพลาด",
          detail: error.message || this.$t("customer.updateError") || "เกิดข้อผิดพลาดในการอัปเดตลูกค้า",
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
        isActive: true
      };
      this.errors = {};
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/list-page-templete/modal-view.scss";
</style>
