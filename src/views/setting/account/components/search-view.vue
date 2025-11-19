<template>
  <div class="list-search-header">
    <div class="list-search-container">
      <!-- Page Title -->
      <div class="list-page-title-section">
        <h2 class="list-page-title">
          <i class="pi pi-users"></i>
          {{ $t("account.title") || "จัดการบัญชีผู้ใช้" }}
        </h2>
        <!-- <p class="list-page-subtitle">
          {{ $t('account.subtitle') || 'จัดการและดูรายละเอียดบัญชีผู้ใช้ในระบบ' }}
        </p> -->
      </div>

      <!-- Search and Filter Bar -->
      <div class="list-search-bar">
        <!-- Search Input -->
        <div class="list-search-input-wrapper">
          <i class="pi pi-search search-icon"></i>
          <InputText
            v-model="localSearchText"
            :placeholder="
              $t('account.searchPlaceholder') ||
              'ค้นหาชื่อ, อีเมล, หรือชื่อผู้ใช้...'
            "
            @keyup.enter="handleSearch"
            class="list-search-input"
          />
          <!-- <Button
            v-if="localSearchText"
            icon="pi pi-times"
            class="p-button-text clear-button"
            @click="handleClear"
          /> -->
        </div>

        <!-- Search Button -->
        <!-- :label="$t('common.search') || 'ค้นหา'" -->
        <Button
          icon="pi pi-search"
          @click="handleSearch"
          class="list-search-button"
        />

        <Button icon="pi pi-times" class="list-search-button" @click="handleClear" />

        <!-- Refresh Button -->
        <!-- <Button
          :label="$t('common.refresh') || 'รีเฟรช'"
          icon="pi pi-refresh"
          @click="handleRefresh"
          class="list-refresh-button"
          outlined
        /> -->
      </div>

      <!-- Active Filters Display -->
      <!-- <div v-if="hasActiveFilters" class="list-active-filters">
        <span class="filter-label">{{ $t('account.activeFilters') || 'ตัวกรอง:' }}</span>
        <Chip
          v-if="localSearchText"
          :label="searchChipLabel"
          removable
          @remove="handleClear"
          class="filter-chip"
        />
      </div> -->
    </div>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Chip from "primevue/chip";

export default {
  name: "SearchView",

  components: {
    InputText,
    Button,
    Chip,
  },

  props: {
    searchText: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      localSearchText: this.searchText,
    };
  },

  computed: {
    hasActiveFilters() {
      return !!this.localSearchText;
    },
    searchChipLabel() {
      return `${this.$t("account.searchText")}: ${this.localSearchText}`;
    },
  },

  watch: {
    searchText(newVal) {
      this.localSearchText = newVal;
    },
  },

  methods: {
    handleSearch() {
      this.$emit("search", {
        searchText: this.localSearchText,
      });
    },

    handleClear() {
      this.localSearchText = "";
      this.$emit("search", {
        searchText: "",
      });
    },

    handleRefresh() {
      this.$emit("refresh");
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/components/list-page-templete/search-view.scss';
</style>
