<template>
  <div class="search-header">
    <div class="search-container">
      <!-- Page Title -->
      <div class="page-title-section">
        <h2 class="page-title">
          <i class="pi pi-users"></i>
          {{ $t("account.title") || "จัดการบัญชีผู้ใช้" }}
        </h2>
        <!-- <p class="page-subtitle">
          {{ $t('account.subtitle') || 'จัดการและดูรายละเอียดบัญชีผู้ใช้ในระบบ' }}
        </p> -->
      </div>

      <!-- Search and Filter Bar -->
      <div class="search-bar">
        <!-- Search Input -->
        <div class="search-input-wrapper">
          <i class="pi pi-search search-icon"></i>
          <InputText
            v-model="localSearchText"
            :placeholder="
              $t('account.searchPlaceholder') ||
              'ค้นหาชื่อ, อีเมล, หรือชื่อผู้ใช้...'
            "
            @keyup.enter="handleSearch"
            class="search-input"
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
          class="search-button"
        />

        <Button icon="pi pi-times" class="search-button" @click="handleClear" />

        <!-- Refresh Button -->
        <!-- <Button
          :label="$t('common.refresh') || 'รีเฟรช'"
          icon="pi pi-refresh"
          @click="handleRefresh"
          class="refresh-button"
          outlined
        /> -->
      </div>

      <!-- Active Filters Display -->
      <!-- <div v-if="hasActiveFilters" class="active-filters">
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
.search-header {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  margin-bottom: 0.5rem;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.page-title-section {
  .page-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 0.5rem 0;

    i {
      color: #f58511;
      font-size: 1.75rem;
    }
  }

  .page-subtitle {
    margin: 0;
    font-size: 0.875rem;
    color: #6b7280;
    padding-left: 2.5rem;
  }
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  .search-input-wrapper {
    position: relative;
    flex: 1;
    min-width: 300px;

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #9ca3af;
      font-size: 1rem;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding-left: 3rem;
      padding-right: 3rem;
      height: 45px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.875rem;
      transition: all 0.2s;

      &:hover {
        border-color: #d1d5db;
      }

      &:focus {
        border-color: #f58511;
        box-shadow: 0 0 0 3px rgba(245, 133, 17, 0.1);
      }

      &::placeholder {
        color: #9ca3af;
      }
    }

    .clear-button {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
      width: 2rem;
      height: 2rem;
      padding: 0;
      color: #9ca3af;

      &:hover {
        color: #6b7280;
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }

  .search-button {
    height: 40px;
    background: #f58511;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    padding: 0 1.5rem;

    &:hover {
      background: #e67710;
    }
  }

  .refresh-button {
    height: 45px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-weight: 500;
    padding: 0 1.5rem;
    color: #6b7280;

    &:hover {
      border-color: #f58511;
      color: #f58511;
    }
  }
}

.active-filters {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;

  .filter-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
  }

  .filter-chip {
    background: #f58511;
    color: #ffffff;
  }
}

@media (max-width: 768px) {
  .search-header {
    padding: 1rem;
  }

  .search-bar {
    .search-input-wrapper {
      min-width: 100%;
    }
  }
}
</style>
