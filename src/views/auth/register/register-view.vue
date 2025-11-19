<template>
  <div class="auth-page">
    <LanguageSwitcher />

    <div class="auth-container register-container">
      <div class="auth-card register-card">
        <!-- Brand Section -->
        <div class="auth-brand">
          <img src="@/assets/images/logo.png" alt="Logo" class="brand-logo" />
          <h1 class="brand-name">{{ $t("auth.register.brandName") }}</h1>
        </div>

        <!-- Form Title -->
        <h2 class="form-title">{{ $t("auth.register.title") }}</h2>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="auth-form">
          <!-- First Name Field -->
          <div class="form-field">
            <label for="firstName" class="field-label">
              {{ $t("auth.register.firstName") || "ชื่อ" }}
            </label>
            <div class="input-wrapper">
              <i class="input-icon pi pi-user"></i>
              <input
                id="firstName"
                type="text"
                v-model="registerForm.firstName"
                :placeholder="
                  $t('auth.register.firstNamePlaceholder') || 'กรอกชื่อ'
                "
                :class="{ 'is-invalid': errors.firstName }"
                @input="clearError('firstName')"
              />
            </div>
            <InlineMessage
              v-if="errors.firstName"
              severity="error"
              class="w-full mt-2"
            >
              {{ errors.firstName }}
            </InlineMessage>
          </div>

          <!-- Last Name Field -->
          <div class="form-field">
            <label for="lastName" class="field-label">
              {{ $t("auth.register.lastName") || "นามสกุล" }}
            </label>
            <div class="input-wrapper">
              <i class="input-icon pi pi-user"></i>
              <input
                id="lastName"
                type="text"
                v-model="registerForm.lastName"
                :placeholder="
                  $t('auth.register.lastNamePlaceholder') || 'กรอกนามสกุล'
                "
                :class="{ 'is-invalid': errors.lastName }"
                @input="clearError('lastName')"
              />
            </div>
            <InlineMessage
              v-if="errors.lastName"
              severity="error"
              class="w-full mt-2"
            >
              {{ errors.lastName }}
            </InlineMessage>
          </div>

          <!-- Email Field -->
          <div class="form-field">
            <label for="email" class="field-label">
              {{ $t("auth.register.email") }}
            </label>
            <div class="input-wrapper">
              <i class="input-icon pi pi-envelope"></i>
              <input
                id="email"
                type="email"
                v-model="registerForm.email"
                :placeholder="$t('auth.register.emailPlaceholder')"
                :class="{ 'is-invalid': errors.email }"
                @input="clearError('email')"
              />
            </div>
            <InlineMessage
              v-if="errors.email"
              severity="error"
              class="w-full mt-2"
            >
              {{ errors.email }}
            </InlineMessage>
          </div>

          <!-- Phone Field (Tel) -->
          <div class="form-field">
            <label for="phone" class="field-label">
              {{ $t("auth.register.phone") }}
            </label>
            <div class="input-wrapper">
              <i class="input-icon pi pi-phone"></i>
              <InputMask
                id="phone"
                v-model="registerForm.tel"
                mask="999-999-9999"
                :placeholder="$t('auth.register.phonePlaceholder')"
                class="phone-input"
                :class="{ 'is-invalid': errors.tel }"
                @input="clearError('tel')"
              />
            </div>
            <InlineMessage
              v-if="errors.tel"
              severity="error"
              class="w-full mt-2"
            >
              {{ errors.tel }}
            </InlineMessage>
          </div>

          <!-- Branch Selection - COMMENTED OUT (Not in API) -->
          <!-- <div class="form-field">
            <label for="branch" class="field-label">
              {{ $t("auth.register.branch") }}
            </label>
            <FormDropdown
              v-model="registerForm.branchId"
              :options="branches"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('auth.register.branchPlaceholder')"
              :invalid="!!errors.branchId"
              @change="clearError('branchId')"
            />
            <InlineMessage
              v-if="errors.branchId"
              severity="error"
              class="w-full mt-2"
            >
              {{ errors.branchId }}
            </InlineMessage>
          </div> -->

          <!-- Role Selection - COMMENTED OUT (Not in API) -->
          <!-- <div class="form-field">
            <label for="role" class="field-label">
              {{ $t("auth.register.role") }}
            </label>
            <FormDropdown
              v-model="registerForm.roleId"
              :options="roles"
              optionLabel="label"
              optionValue="value"
              :placeholder="$t('auth.register.rolePlaceholder')"
              :invalid="!!errors.roleId"
              @change="clearError('roleId')"
            />
            <InlineMessage
              v-if="errors.roleId"
              severity="error"
              class="w-full mt-2"
            >
              {{ errors.roleId }}
            </InlineMessage>
          </div> -->

          <!-- Username Field -->
          <div class="form-field">
            <label for="username" class="field-label">
              {{ $t("auth.register.username") }}
            </label>
            <div class="input-wrapper">
              <i class="input-icon pi pi-at"></i>
              <input
                id="username"
                type="text"
                v-model="registerForm.username"
                :placeholder="$t('auth.register.usernamePlaceholder')"
                :class="{ 'is-invalid': errors.username }"
                @input="clearError('username')"
              />
            </div>
            <InlineMessage
              v-if="errors.username"
              severity="error"
              class="w-full mt-2"
            >
              {{ errors.username }}
            </InlineMessage>
          </div>

          <!-- Password Field -->
          <div class="form-field">
            <label for="password" class="field-label">
              {{ $t("auth.register.password") }}
            </label>
            <div class="input-wrapper">
              <i class="input-icon pi pi-lock"></i>
              <div class="password-input-wrapper">
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="registerForm.password"
                  :placeholder="$t('auth.register.passwordPlaceholder')"
                  :class="{ 'is-invalid': errors.password }"
                  @input="clearError('password')"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                >
                  <i
                    :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"
                  ></i>
                </button>
              </div>
            </div>
            <!-- Password Requirements Hint -->
            <div class="password-hint-box" v-if="registerForm.password">
              <p class="password-hint">
                {{ $t("auth.register.passwordHint") }}
              </p>
              <ul class="password-requirements">
                <li :class="{ met: registerForm.password.length >= 8 }">
                  {{ $t("auth.register.passwordRequirements.minLength") }}
                </li>
                <li :class="{ met: /[A-Z]/.test(registerForm.password) }">
                  {{ $t("auth.register.passwordRequirements.uppercase") }}
                </li>
                <li :class="{ met: /[a-z]/.test(registerForm.password) }">
                  {{ $t("auth.register.passwordRequirements.lowercase") }}
                </li>
                <li :class="{ met: /\d/.test(registerForm.password) }">
                  {{ $t("auth.register.passwordRequirements.number") }}
                </li>
                <li :class="{ met: /[\W_]/.test(registerForm.password) }">
                  {{ $t("auth.register.passwordRequirements.specialChar") }}
                </li>
              </ul>
            </div>
            <InlineMessage
              v-if="errors.password"
              severity="error"
              class="w-full mt-2"
            >
              {{ errors.password }}
            </InlineMessage>
          </div>

          <!-- Confirm Password Field (Frontend validation only) -->
          <div class="form-field">
            <label for="confirmPassword" class="field-label">
              {{ $t("auth.register.confirmPassword") }}
            </label>
            <div class="input-wrapper">
              <i class="input-icon pi pi-lock"></i>
              <div class="password-input-wrapper">
                <input
                  id="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="registerForm.confirmPassword"
                  :placeholder="$t('auth.register.confirmPasswordPlaceholder')"
                  :class="{ 'is-invalid': errors.confirmPassword }"
                  @input="clearError('confirmPassword')"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showConfirmPassword = !showConfirmPassword"
                  :aria-label="
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  "
                >
                  <i
                    :class="
                      showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'
                    "
                  ></i>
                </button>
              </div>
            </div>
            <InlineMessage
              v-if="errors.confirmPassword"
              severity="error"
              class="w-full mt-2"
            >
              {{ errors.confirmPassword }}
            </InlineMessage>
          </div>

          <!-- Terms & Conditions (Frontend validation only) -->
          <div class="form-field">
            <div class="flex align-items-center">
              <Checkbox
                v-model="registerForm.agreeToTerms"
                :binary="true"
                inputId="agreeToTerms"
                :class="{ 'p-invalid': errors.agreeToTerms }"
              />
              <label for="agreeToTerms" class="ml-2 checkbox-label">
                {{ $t("auth.register.agreeToTerms") }}
                <a href="#" class="auth-link" @click.prevent>
                  {{ $t("auth.register.termsLink") }}
                </a>
              </label>
            </div>
            <InlineMessage
              v-if="errors.agreeToTerms"
              severity="error"
              class="w-full mt-2"
            >
              {{ errors.agreeToTerms }}
            </InlineMessage>
          </div>

          <!-- Register Button -->
          <Button
            :label="$t('auth.register.registerButton')"
            icon="pi pi-user-plus"
            class="auth-button"
            :loading="isLoading"
            type="submit"
          />

          <!-- Links -->
          <div class="auth-links">
            <p class="auth-link-text">
              {{ $t("auth.register.haveAccount") }}
              <router-link to="/login" class="auth-link">
                {{ $t("auth.register.loginLink") }}
              </router-link>
            </p>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="auth-footer">
        <p>{{ $t("common.copyright") }}</p>
      </div>
    </div>

    <!-- Alert Components -->
    <AlertSubmit
      v-model:visible="showSuccessAlert"
      :header="$t('common.success')"
      :message="successMessage"
      :okText="$t('auth.register.loginLink')"
      @ok="handleSuccessConfirm"
    />

    <AlertError
      v-model:visible="showErrorAlert"
      :header="$t('common.error')"
      :message="errorMessage"
      :okText="$t('common.close')"
    />
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useRegisterApiStore } from "@/stores/api/register-api";
import LanguageSwitcher from "@/components/common/language-switcher.vue";
import { AlertSubmit, AlertError } from "@/components/alert";

export default {
  name: "RegisterView",

  components: {
    LanguageSwitcher,
    AlertSubmit,
    AlertError,
  },

  data() {
    return {
      // Register API Store
      registerApiStore: useRegisterApiStore(),

      // Register Form State (matching API structure)
      registerForm: {
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        tel: "",
        password: "",
        confirmPassword: "", // Frontend validation only
        agreeToTerms: false, // Frontend validation only
        // imageUrl: "", // Optional - can be added later
      },

      // UI State
      isLoading: false,
      showPassword: false,
      showConfirmPassword: false,
      errors: {},

      // Alert State
      showSuccessAlert: false,
      showErrorAlert: false,
      successMessage: "",
      errorMessage: "",
    };
  },

  methods: {
    // Clear Error
    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field];
      }
    },

    // Email Validation
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    // Password Strength Validation (matching Backend requirements)
    isStrongPassword(password) {
      // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
      const minLength = password.length >= 8;
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[\W_]/.test(password); // Special characters

      return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    },

    // Validation
    validateRegister() {
      const newErrors = {};

      // First Name
      if (
        !this.registerForm.firstName ||
        this.registerForm.firstName.trim() === ""
      ) {
        newErrors.firstName = this.$t("auth.validation.required", {
          field: this.$t("auth.register.firstName") || "ชื่อ",
        });
      } else if (this.registerForm.firstName.trim().length < 2) {
        newErrors.firstName = this.$t("auth.validation.minLength", {
          field: this.$t("auth.register.firstName") || "ชื่อ",
          min: 2,
        });
      }

      // Last Name
      if (
        !this.registerForm.lastName ||
        this.registerForm.lastName.trim() === ""
      ) {
        newErrors.lastName = this.$t("auth.validation.required", {
          field: this.$t("auth.register.lastName") || "นามสกุล",
        });
      } else if (this.registerForm.lastName.trim().length < 2) {
        newErrors.lastName = this.$t("auth.validation.minLength", {
          field: this.$t("auth.register.lastName") || "นามสกุล",
          min: 2,
        });
      }

      // Email
      if (!this.registerForm.email || this.registerForm.email.trim() === "") {
        newErrors.email = this.$t("auth.validation.required", {
          field: this.$t("auth.register.email"),
        });
      } else if (!this.isValidEmail(this.registerForm.email)) {
        newErrors.email = this.$t("auth.validation.invalidEmail");
      }

      // Username
      if (
        !this.registerForm.username ||
        this.registerForm.username.trim() === ""
      ) {
        newErrors.username = this.$t("auth.validation.required", {
          field: this.$t("auth.register.username"),
        });
      } else if (this.registerForm.username.length < 4) {
        newErrors.username = this.$t("auth.validation.minLength", {
          field: this.$t("auth.register.username"),
          min: 4,
        });
      }

      // Phone (Tel) - Optional but validate if provided
      if (this.registerForm.tel && this.registerForm.tel.trim() !== "") {
        if (this.registerForm.tel.replace(/\D/g, "").length !== 10) {
          newErrors.tel = this.$t("auth.validation.invalidPhone");
        }
      }

      // Password
      if (
        !this.registerForm.password ||
        this.registerForm.password.trim() === ""
      ) {
        newErrors.password = this.$t("auth.validation.required", {
          field: this.$t("auth.register.password"),
        });
      } else if (!this.isStrongPassword(this.registerForm.password)) {
        newErrors.password = this.$t("auth.validation.weakPassword");
      }

      // Confirm Password (Frontend validation only)
      if (
        !this.registerForm.confirmPassword ||
        this.registerForm.confirmPassword.trim() === ""
      ) {
        newErrors.confirmPassword = this.$t("auth.validation.required", {
          field: this.$t("auth.register.confirmPassword"),
        });
      } else if (
        this.registerForm.password !== this.registerForm.confirmPassword
      ) {
        newErrors.confirmPassword = this.$t("auth.validation.passwordMismatch");
      }

      // Terms & Conditions (Frontend validation only)
      if (!this.registerForm.agreeToTerms) {
        newErrors.agreeToTerms = this.$t("auth.validation.agreeToTerms");
      }

      Object.assign(this.errors, newErrors);
      return Object.keys(newErrors).length === 0;
    },

    // Handle Register
    async handleRegister() {
      if (!this.validateRegister()) return;

      this.isLoading = true;

      try {
        // Call Register API
        const result = await this.registerApiStore.register({
          username: this.registerForm.username,
          password: this.registerForm.password,
          firstName: this.registerForm.firstName,
          lastName: this.registerForm.lastName,
          email: this.registerForm.email,
          tel: this.registerForm.tel || null,
          // imageUrl: this.registerForm.imageUrl || null,
        });

        if (result.success) {
          this.isLoading = false;
          this.successMessage = result.message || this.$t("auth.register.success");
          this.showSuccessAlert = true;
        } else {
          // Handle API errors
          this.isLoading = false;

          // If there are field-specific errors from API
          if (result.errors) {
            Object.assign(this.errors, result.errors);
          }

          this.errorMessage = result.message || this.$t("auth.register.error");
          this.showErrorAlert = true;
        }
      } catch (error) {
        this.isLoading = false;
        this.errorMessage = error.message || this.$t("auth.register.error");
        this.showErrorAlert = true;
      }
    },

    // Handle Success Alert Confirm
    handleSuccessConfirm() {
      const router = useRouter();
      router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped>
// No custom styles needed - all styles are in _auth.scss
</style>
