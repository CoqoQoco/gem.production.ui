<template>
  <div class="auth-page">
    <LanguageSwitcher />

    <div class="auth-container">
      <div class="auth-card">
        <!-- Brand Section -->
        <div class="auth-brand">
          <img src="@/assets/images/logo.png" alt="Logo" class="brand-logo" />
          <h1 class="brand-name">{{ t("auth.login.brandName") }}</h1>
        </div>

        <!-- Form Title -->
        <h2 class="form-title">{{ t("auth.login.title") }}</h2>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="auth-form">
          <!-- Username/Email Field -->
          <div class="form-field">
            <label for="username" class="field-label">
              {{ t("auth.login.username") }}
            </label>
            <div class="input-wrapper">
              <i class="input-icon pi pi-user"></i>
              <input
                id="username"
                type="text"
                v-model="loginForm.username"
                :placeholder="t('auth.login.usernamePlaceholder')"
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
              {{ t("auth.login.password") }}
            </label>
            <div class="input-wrapper">
              <i class="input-icon pi pi-lock"></i>
              <div class="password-input-wrapper">
                <input
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="loginForm.password"
                  :placeholder="t('auth.login.passwordPlaceholder')"
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
            <InlineMessage
              v-if="errors.password"
              severity="error"
              class="w-full mt-2"
            >
              {{ errors.password }}
            </InlineMessage>
          </div>

          <!-- Remember Me -->
          <div class="form-field">
            <div class="flex align-items-center">
              <Checkbox
                v-model="loginForm.rememberMe"
                :binary="true"
                inputId="rememberMe"
              />
              <label for="rememberMe" class="ml-2 checkbox-label">
                {{ t("auth.login.rememberMe") }}
              </label>
            </div>
          </div>

          <!-- Login Button -->
          <Button
            :label="t('auth.login.loginButton')"
            icon="pi pi-sign-in"
            class="auth-button"
            :loading="isLoading"
            type="submit"
          />

          <!-- Links -->
          <div class="auth-links">
            <p class="auth-link-text">
              {{ t("auth.login.noAccount") }}
              <router-link to="/register" class="auth-link">
                {{ t("auth.login.registerLink") }}
              </router-link>
            </p>
            <a href="#" class="forgot-link" @click.prevent>
              {{ t("auth.login.forgotPassword") }}
            </a>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="auth-footer">
        <p>{{ t("common.copyright") }}</p>
      </div>
    </div>

    <!-- Alert Components -->
    <AlertSubmit
      v-model:visible="showSuccessAlert"
      :header="t('common.success')"
      :message="successMessage"
      :okText="t('common.ok')"
      @ok="handleSuccessConfirm"
    />

    <AlertError
      v-model:visible="showErrorAlert"
      :header="t('common.error')"
      :message="errorMessage"
      :okText="t('common.close')"
    />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import LanguageSwitcher from "@/components/common/language-switcher.vue";
import { AlertSubmit, AlertError } from "@/components/alert";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const authStore = useAuthStore();

// Function to check for access denied error
const checkAccessDenied = () => {
  if (route.query.error === "access_denied") {
    errorMessage.value =
      route.query.message ||
      t("auth.login.accessDenied") ||
      "You do not have permission to access this resource";
    showErrorAlert.value = true;

    // Clear query parameters after showing error
    router.replace({ path: "/login" });
  }
};

// Check on mount
onMounted(() => {
  checkAccessDenied();
  isLoading.value = false;
});

// Watch for route changes
watch(
  () => route.query,
  (newQuery) => {
    //isLoading.value = false;
    if (newQuery.error === "access_denied") {
      errorMessage.value =
        newQuery.message ||
        t("auth.login.accessDenied") ||
        "You do not have permission to access this resource";
      showErrorAlert.value = true;

      // Clear query parameters after showing error
      setTimeout(() => {
        router.replace({ path: "/login" });
      }, 100);
    }
  },
  { immediate: true }
);

// Login Form State
const loginForm = reactive({
  username: "",
  password: "",
  rememberMe: false,
});

// UI State
const isLoading = ref(false);
const showPassword = ref(false);
const errors = reactive({});

// Alert State
const showSuccessAlert = ref(false);
const showErrorAlert = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Clear Error
const clearError = (field) => {
  if (errors[field]) {
    delete errors[field];
  }
};

// Validation
const validateLogin = () => {
  const newErrors = {};

  if (!loginForm.username || loginForm.username.trim() === "") {
    newErrors.username = t("auth.validation.required", {
      field: t("auth.login.username"),
    });
  }

  if (!loginForm.password || loginForm.password.trim() === "") {
    newErrors.password = t("auth.validation.required", {
      field: t("auth.login.password"),
    });
  } else if (loginForm.password.length < 6) {
    newErrors.password = t("auth.validation.minLength", {
      field: t("auth.login.password"),
      min: 6,
    });
  }

  Object.assign(errors, newErrors);
  return Object.keys(newErrors).length === 0;
};

// Handle Login
const handleLogin = async () => {
  if (!validateLogin()) return;

  isLoading.value = true;

  try {
    // Call login API through auth store
    await authStore.login({
      username: loginForm.username,
      password: loginForm.password,
      rememberMe: loginForm.rememberMe,
    });

    isLoading.value = false;

    // Get redirect path from query parameter
    const redirectPath =
      router.currentRoute.value.query.redirect || "/dashboard";

    console.log("Login successful, redirecting to:", redirectPath);
    console.log("Current route query:", router.currentRoute.value.query);

    // Show success message briefly before redirect
    //successMessage.value = t("auth.login.success");
    //showSuccessAlert.value = true;

    // Redirect after short delay to allow user to see success message
    setTimeout(() => {
      console.log("Executing redirect to:", redirectPath);
      isLoading.value = false;
      router.push(redirectPath);
    }, 1500);
  } catch (error) {
    isLoading.value = false;

    console.error("Login failed:", error);

    // Handle error from axios interceptor
    errorMessage.value = error.message || t("auth.login.error");
    showErrorAlert.value = true;
  }
};

// Handle Success Alert Confirm - Redirect to dashboard
const handleSuccessConfirm = () => {
  showSuccessAlert.value = false;
  const redirect = router.currentRoute.value.query.redirect || "/dashboard";

  // Use nextTick to ensure dialog is closed before navigation
  setTimeout(() => {
    isLoading = false;
    router.push(redirect);
  }, 100);
};
</script>

<style lang="scss" scoped>
// Custom styles for login page with pastel pink theme

.brand-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  //margin-bottom: 1rem;
}

// Override button color to match pink theme
:deep(.auth-button) {
  background: linear-gradient(135deg, #ffb6c1 0%, #ffc0cb 100%) !important;
  border-color: #ffb6c1 !important;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #ffa6b1 0%, #ffb0bb 100%) !important;
    border-color: #ffa6b1 !important;
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba(255, 182, 193, 0.3) !important;
  }
}

// Override link colors
:deep(.auth-link),
:deep(.forgot-link) {
  color: #ff69b4 !important;

  &:hover {
    color: #ff1493 !important;
  }
}

// Override checkbox focus color
:deep(.p-checkbox .p-checkbox-box.p-focus) {
  border-color: #ffb6c1 !important;
  box-shadow: 0 0 0 0.2rem rgba(255, 182, 193, 0.2) !important;
}

:deep(.p-checkbox .p-checkbox-box.p-highlight) {
  background: #ffb6c1 !important;
  border-color: #ffb6c1 !important;
}

// Override input focus color
:deep(.input-wrapper input:focus) {
  border-color: #ffb6c1 !important;
  box-shadow: 0 0 0 0.2rem rgba(255, 182, 193, 0.2) !important;
}

// Override password toggle button
:deep(.password-toggle) {
  color: #ffb6c1 !important;

  &:hover {
    color: #ff69b4 !important;
  }
}
</style>
