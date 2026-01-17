<template>
  <div class="auth-page">
    <LanguageSwitcher />

    <div class="auth-container">
      <div class="auth-card">
        <!-- Brand Section -->
        <div class="auth-brand">
          <img src="@/assets/images/logo.png" alt="Logo" class="brand-logo" />
          <h1 class="brand-name">{{ $t("auth.resetPassword.brandName") || "Gem Management System" }}</h1>
        </div>

        <!-- Form Title -->
        <h2 class="form-title">{{ $t("auth.resetPassword.title") || "Reset Password" }}</h2>
        <p class="form-subtitle">{{ $t("auth.resetPassword.subtitle") || "Enter your current password and new password" }}</p>

        <!-- Reset Password Form -->
        <form @submit.prevent="handleResetPassword" class="auth-form">
          <!-- Username or ID Field (for identification) -->
          <div class="form-field">
            <label for="username" class="field-label">
              {{ $t("auth.resetPassword.username") || "Username" }}
            </label>
            <div class="input-wrapper">
              <i class="input-icon pi pi-user"></i>
              <input
                id="username"
                type="text"
                v-model="resetForm.username"
                :placeholder="$t('auth.resetPassword.usernamePlaceholder') || 'Enter username'"
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

          <!-- Old Password Field -->
          <div class="form-field">
            <label for="oldPassword" class="field-label">
              {{ $t("auth.resetPassword.oldPassword") || "Current Password" }}
            </label>
            <div class="input-wrapper">
              <i class="input-icon pi pi-lock"></i>
              <div class="password-input-wrapper">
                <input
                  id="oldPassword"
                  :type="showOldPassword ? 'text' : 'password'"
                  v-model="resetForm.oldPassword"
                  :placeholder="$t('auth.resetPassword.oldPasswordPlaceholder') || 'Enter current password'"
                  :class="{ 'is-invalid': errors.oldPassword }"
                  @input="clearError('oldPassword')"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showOldPassword = !showOldPassword"
                  :aria-label="showOldPassword ? 'Hide password' : 'Show password'"
                >
                  <i :class="showOldPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
            </div>
            <InlineMessage
              v-if="errors.oldPassword"
              severity="error"
              class="w-full mt-2"
            >
              {{ errors.oldPassword }}
            </InlineMessage>
          </div>

          <!-- New Password Field -->
          <div class="form-field">
            <label for="newPassword" class="field-label">
              {{ $t("auth.resetPassword.newPassword") || "New Password" }}
            </label>
            <div class="input-wrapper">
              <i class="input-icon pi pi-lock"></i>
              <div class="password-input-wrapper">
                <input
                  id="newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  v-model="resetForm.newPassword"
                  :placeholder="$t('auth.resetPassword.newPasswordPlaceholder') || 'Enter new password'"
                  :class="{ 'is-invalid': errors.newPassword }"
                  @input="clearError('newPassword')"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showNewPassword = !showNewPassword"
                  :aria-label="showNewPassword ? 'Hide password' : 'Show password'"
                >
                  <i :class="showNewPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                </button>
              </div>
            </div>
            <!-- Password Requirements Hint -->
            <div class="password-hint-box" v-if="resetForm.newPassword">
              <p class="password-hint">
                {{ $t("auth.register.passwordHint") || "Password must meet the following requirements:" }}
              </p>
              <ul class="password-requirements">
                <li :class="{ met: resetForm.newPassword.length >= 8 }">
                  {{ $t("auth.register.passwordRequirements.minLength") || "At least 8 characters" }}
                </li>
                <li :class="{ met: /[A-Z]/.test(resetForm.newPassword) }">
                  {{ $t("auth.register.passwordRequirements.uppercase") || "At least one uppercase letter" }}
                </li>
                <li :class="{ met: /[a-z]/.test(resetForm.newPassword) }">
                  {{ $t("auth.register.passwordRequirements.lowercase") || "At least one lowercase letter" }}
                </li>
                <li :class="{ met: /\d/.test(resetForm.newPassword) }">
                  {{ $t("auth.register.passwordRequirements.number") || "At least one number" }}
                </li>
                <li :class="{ met: /[\W_]/.test(resetForm.newPassword) }">
                  Special characters (!@#$%^&* etc.)
                </li>
              </ul>
            </div>
            <InlineMessage
              v-if="errors.newPassword"
              severity="error"
              class="w-full mt-2"
            >
              {{ errors.newPassword }}
            </InlineMessage>
          </div>

          <!-- Confirm Password Field -->
          <div class="form-field">
            <label for="confirmPassword" class="field-label">
              {{ $t("auth.resetPassword.confirmPassword") || "Confirm New Password" }}
            </label>
            <div class="input-wrapper">
              <i class="input-icon pi pi-lock"></i>
              <div class="password-input-wrapper">
                <input
                  id="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="resetForm.confirmPassword"
                  :placeholder="$t('auth.resetPassword.confirmPasswordPlaceholder') || 'Re-enter new password'"
                  :class="{ 'is-invalid': errors.confirmPassword }"
                  @input="clearError('confirmPassword')"
                />
                <button
                  type="button"
                  class="password-toggle"
                  @click="showConfirmPassword = !showConfirmPassword"
                  :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'"
                >
                  <i :class="showConfirmPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
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

          <!-- Submit Button -->
          <Button
            :label="$t('auth.resetPassword.submitButton') || 'Reset Password'"
            icon="pi pi-check"
            class="auth-button"
            :loading="isLoading"
            type="submit"
          />

          <!-- Links -->
          <div class="auth-links">
            <router-link to="/login" class="auth-link">
              <i class="pi pi-arrow-left"></i>
              {{ $t("auth.resetPassword.backToLogin") || "Back to Login" }}
            </router-link>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="auth-footer">
        <p>{{ $t("common.copyright") || "© 2025 Gem Management System. All rights reserved." }}</p>
      </div>
    </div>

    <!-- Alert Components -->
    <AlertSubmit
      v-model:visible="showSuccessAlert"
      :header="$t('common.success') || 'Success'"
      :message="successMessage"
      :okText="$t('common.ok') || 'OK'"
      @ok="handleSuccessConfirm"
    />

    <AlertError
      v-model:visible="showErrorAlert"
      :header="$t('common.error') || 'Error'"
      :message="errorMessage"
      :okText="$t('common.close') || 'Close'"
    />
  </div>
</template>

<script>
import { useUserApiStore } from "@/stores/api/user-api";
import LanguageSwitcher from "@/components/common/language-switcher.vue";
import { AlertSubmit, AlertError } from "@/components/alert";

export default {
  name: "ResetPasswordView",

  components: {
    LanguageSwitcher,
    AlertSubmit,
    AlertError,
  },

  data() {
    return {
      // User API Store
      userApiStore: useUserApiStore(),

      // Reset Password Form State
      resetForm: {
        username: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },

      // UI State
      isLoading: false,
      showOldPassword: false,
      showNewPassword: false,
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

    // Password Strength Validation (matching Backend requirements)
    isStrongPassword(password) {
      const minLength = password.length >= 8;
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[\W_]/.test(password);

      return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
    },

    // Validation
    validateResetPassword() {
      const newErrors = {};

      // Username
      if (!this.resetForm.username || this.resetForm.username.trim() === "") {
        newErrors.username = this.$t("auth.validation.required", {
          field: this.$t("auth.resetPassword.username") || "Username",
        });
      }

      // Old Password
      if (!this.resetForm.oldPassword || this.resetForm.oldPassword.trim() === "") {
        newErrors.oldPassword = this.$t("auth.validation.required", {
          field: this.$t("auth.resetPassword.oldPassword") || "Current Password",
        });
      }

      // New Password
      if (!this.resetForm.newPassword || this.resetForm.newPassword.trim() === "") {
        newErrors.newPassword = this.$t("auth.validation.required", {
          field: this.$t("auth.resetPassword.newPassword") || "New Password",
        });
      } else if (!this.isStrongPassword(this.resetForm.newPassword)) {
        newErrors.newPassword = this.$t("auth.validation.weakPassword") || "Password must meet all requirements";
      } else if (this.resetForm.newPassword === this.resetForm.oldPassword) {
        newErrors.newPassword = this.$t("auth.validation.samePassword") || "New password must be different from current password";
      }

      // Confirm Password
      if (!this.resetForm.confirmPassword || this.resetForm.confirmPassword.trim() === "") {
        newErrors.confirmPassword = this.$t("auth.validation.required", {
          field: this.$t("auth.resetPassword.confirmPassword") || "Confirm Password",
        });
      } else if (this.resetForm.newPassword !== this.resetForm.confirmPassword) {
        newErrors.confirmPassword = this.$t("auth.validation.passwordMismatch") || "Passwords do not match";
      }

      Object.assign(this.errors, newErrors);
      return Object.keys(newErrors).length === 0;
    },

    // Handle Reset Password
    async handleResetPassword() {
      if (!this.validateResetPassword()) return;

      this.isLoading = true;

      try {
        const result = await this.userApiStore.resetPassword({
          username: this.resetForm.username,
          oldPassword: this.resetForm.oldPassword,
          newPassword: this.resetForm.newPassword,
          confirmPassword: this.resetForm.confirmPassword,
        });

        if (result.success) {
          this.isLoading = false;
          this.successMessage = result.message || this.$t("auth.resetPassword.success") || "Password reset successfully";
          this.showSuccessAlert = true;
        } else {
          this.isLoading = false;

          // Handle API errors
          if (result.errors) {
            Object.assign(this.errors, result.errors);
          }

          this.errorMessage = result.message || this.$t("auth.resetPassword.error") || "Failed to reset password";
          this.showErrorAlert = true;
        }
      } catch (error) {
        this.isLoading = false;
        this.errorMessage = error.message || this.$t("auth.resetPassword.error") || "Failed to reset password";
        this.showErrorAlert = true;
      }
    },

    // Handle Success Alert Confirm
    handleSuccessConfirm() {
      // Clear form
      this.resetForm = {
        username: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
      this.errors = {};

      // Redirect to login or stay on page
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped>
// No custom styles needed - all styles are in _auth.scss
</style>
