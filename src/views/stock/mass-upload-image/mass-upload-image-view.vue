<template>
  <div class="mass-upload-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <i class="pi pi-image"></i>
        <h1>{{ $t('massUploadImage.title') || 'อัพโหลดรูปสินค้า' }}</h1>
      </div>
      <div class="header-actions">
        <Button
          :label="$t('massUploadImage.uploadAll') || 'อัพโหลดทั้งหมด'"
          icon="pi pi-upload"
          severity="primary"
          :disabled="fileList.length === 0 || isUploading || !hasValidFiles"
          :loading="isUploading"
          @click="uploadAll"
        />
        <Button
          :label="$t('massUploadImage.clearAll') || 'ล้างทั้งหมด'"
          icon="pi pi-trash"
          severity="secondary"
          :outlined="true"
          :disabled="fileList.length === 0 || isUploading"
          @click="clearAll"
        />
      </div>
    </div>

    <!-- Drop Zone -->
    <div
      class="drop-zone"
      :class="{ 'drop-zone--active': isDragging, 'drop-zone--has-files': fileList.length > 0 }"
      @dragenter.prevent="onDragEnter"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    >
      <div class="drop-zone__content">
        <i class="pi pi-cloud-upload drop-zone__icon"></i>
        <p class="drop-zone__text">
          {{ $t('massUploadImage.dropHere') || 'วางรูปที่นี่ หรือ คลิกเพื่อเลือกรูป' }}
        </p>
        <p class="drop-zone__subtext">
          {{ $t('massUploadImage.supportedFormats') || 'รอบรับ JPG, PNG, WEBP' }}
        </p>
        <div class="drop-zone__buttons">
          <Button
            :label="$t('massUploadImage.selectFiles') || 'เลือกรูป'"
            icon="pi pi-file-plus"
            severity="primary"
            :outlined="true"
            @click="triggerFileSelect"
          />
          <Button
            :label="$t('massUploadImage.selectFolder') || 'เลือกโฟลเดอร์'"
            icon="pi pi-folder-open"
            severity="secondary"
            :outlined="true"
            @click="triggerFolderSelect"
          />
        </div>
      </div>
      <!-- Hidden file inputs -->
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*"
        class="drop-zone__input"
        @change="onFileSelect"
      />
      <input
        ref="folderInput"
        type="file"
        multiple
        webkitdirectory
        accept="image/*"
        class="drop-zone__input"
        @change="onFileSelect"
      />
    </div>

    <!-- Upload Summary -->
    <div v-if="fileList.length > 0" class="upload-summary">
      <span class="summary-item">
        <i class="pi pi-files"></i>
        {{ fileList.length }} {{ $t('massUploadImage.files') || 'รูป' }}
      </span>
      <span class="summary-item">
        <i class="pi pi-check-circle summary-icon--success"></i>
        {{ successCount }} {{ $t('massUploadImage.success') || 'สำเร็จ' }}
      </span>
      <span v-if="errorCount > 0" class="summary-item summary-item--error">
        <i class="pi pi-exclamation-circle"></i>
        {{ errorCount }} {{ $t('massUploadImage.failed') || 'เสียหาย' }}
      </span>
      <span class="summary-item">
        <i class="pi pi-database"></i>
        {{ formattedTotalSize }}
      </span>
    </div>

    <!-- File List Table -->
    <div v-if="fileList.length > 0" class="file-list">
      <table class="file-table">
        <thead>
          <tr>
            <th class="col-no">{{ $t('massUploadImage.no') || 'ลำดับ' }}</th>
            <th class="col-preview">{{ $t('massUploadImage.preview') || 'ตัวอย่าง' }}</th>
            <th class="col-stocknumber">{{ $t('massUploadImage.stockNumber') || 'Stock Number' }}</th>
            <th class="col-filename">{{ $t('massUploadImage.originalName') || 'ชื่อไฟล์เดิม' }}</th>
            <th class="col-size">{{ $t('massUploadImage.size') || 'ขนาด' }}</th>
            <th class="col-status">{{ $t('massUploadImage.status') || 'สถานะ' }}</th>
            <th class="col-actions">{{ $t('massUploadImage.actions') || 'การดำเนินการ' }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in fileList"
            :key="item.id"
            :class="rowClass(item)"
          >
            <!-- No -->
            <td class="col-no">{{ index + 1 }}</td>

            <!-- Preview -->
            <td class="col-preview">
              <img
                v-if="item.previewUrl"
                :src="item.previewUrl"
                :alt="item.stockNumber"
                class="preview-thumb"
              />
            </td>

            <!-- Stock Number (editable) -->
            <td class="col-stocknumber">
              <input
                v-if="item.status === 'pending' || item.status === 'error'"
                type="text"
                v-model="item.stockNumber"
                class="stock-input"
                :class="{ 'stock-input--invalid': !item.stockNumber.trim() }"
                placeholder="STOCK NUMBER"
                @input="onStockNumberInput(item)"
                @blur="onStockNumberBlur(item)"
              />
              <span v-else class="stock-text">{{ item.stockNumber }}</span>
            </td>

            <!-- Original Name -->
            <td class="col-filename">{{ item.originalName }}</td>

            <!-- Size -->
            <td class="col-size">{{ item.formattedSize }}</td>

            <!-- Status -->
            <td class="col-status">
              <span :class="statusClass(item.status)" class="status-badge">
                <i :class="statusIcon(item.status)"></i>
                {{ statusText(item) }}
              </span>
            </td>

            <!-- Actions -->
            <td class="col-actions">
              <button
                v-if="item.status === 'pending' || item.status === 'error'"
                class="action-btn action-btn--delete"
                :title="$t('massUploadImage.delete') || 'ลบ'"
                @click="removeFile(item.id)"
              >
                <i class="pi pi-times"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <i class="pi pi-image empty-state__icon"></i>
      <p>{{ $t('massUploadImage.emptyState') || 'ไม่มีรูปที่รอเพิ่ม วางรูปหรือเลือกรูปด้านบน' }}</p>
    </div>
  </div>
</template>

<script>
import Button from '@/components/prime-vue/button.vue'
import { useUploadApiStore } from '@/stores/api/upload-api'

let nextId = 1

export default {
  name: 'MassUploadImageView',

  components: {
    Button
  },

  data() {
    return {
      uploadApiStore: useUploadApiStore(),
      fileList: [],
      isDragging: false,
      isUploading: false
    }
  },

  computed: {
    hasValidFiles() {
      return this.fileList.some(
        (item) => item.status === 'pending' && item.stockNumber.trim() !== ''
      )
    },

    successCount() {
      return this.fileList.filter((item) => item.status === 'success').length
    },

    errorCount() {
      return this.fileList.filter((item) => item.status === 'error').length
    },

    totalSize() {
      return this.fileList.reduce((sum, item) => sum + item.size, 0)
    },

    formattedTotalSize() {
      return this.formatFileSize(this.totalSize)
    }
  },

  methods: {
    // --- File Selection ---
    triggerFileSelect() {
      this.$refs.fileInput.click()
    },

    triggerFolderSelect() {
      this.$refs.folderInput.click()
    },

    onFileSelect(event) {
      const files = Array.from(event.target.files || [])
      this.addFiles(files)
      // Reset input so same file can be re-added
      event.target.value = ''
    },

    // --- Drag & Drop ---
    onDragEnter() {
      this.isDragging = true
    },

    onDragOver() {
      this.isDragging = true
    },

    onDragLeave(event) {
      // Only leave if we're actually leaving the drop zone
      if (!event.currentTarget.contains(event.relatedTarget)) {
        this.isDragging = false
      }
    },

    onDrop(event) {
      this.isDragging = false
      const files = Array.from(event.dataTransfer.files || [])
      const imageFiles = files.filter((f) => f.type.startsWith('image/'))
      this.addFiles(imageFiles)
    },

    // --- File Management ---
    addFiles(files) {
      const imageFiles = files.filter((f) => f.type.startsWith('image/'))
      imageFiles.forEach((file) => {
        const stockNumber = this.extractStockNumber(file.name)
        const item = {
          id: nextId++,
          file: file,
          originalName: file.name,
          stockNumber: stockNumber,
          size: file.size,
          formattedSize: this.formatFileSize(file.size),
          status: 'pending', // pending | uploading | success | error
          errorMessage: '',
          previewUrl: null
        }

        // Push first so Vue wraps it as reactive
        this.fileList.push(item)
        const reactiveItem = this.fileList[this.fileList.length - 1]

        // Generate preview via reactive reference
        const reader = new FileReader()
        reader.onload = (e) => {
          reactiveItem.previewUrl = e.target.result
        }
        reader.readAsDataURL(file)
      })
    },

    extractStockNumber(fileName) {
      // Remove extension and use as initial stock number (UPPERCASE)
      const name = fileName.replace(/\.[^/.]+$/, '')
      return name.toUpperCase()
    },

    removeFile(id) {
      const index = this.fileList.findIndex((item) => item.id === id)
      if (index !== -1) {
        const item = this.fileList[index]
        // Revoke preview URL to free memory
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl)
        }
        this.fileList.splice(index, 1)
      }
    },

    clearAll() {
      // Revoke all preview URLs
      this.fileList.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl)
        }
      })
      this.fileList = []
    },

    // --- Stock Number Handling ---
    onStockNumberInput(item) {
      // Enforce UPPERCASE in real-time
      item.stockNumber = item.stockNumber.toUpperCase()
    },

    onStockNumberBlur(item) {
      // Trim on blur
      item.stockNumber = item.stockNumber.trim().toUpperCase()
    },

    // --- Upload ---
    async uploadAll() {
      if (this.isUploading) return

      // Filter only pending items with valid stock numbers
      const pendingItems = this.fileList.filter(
        (item) => item.status === 'pending' && item.stockNumber.trim() !== ''
      )

      if (pendingItems.length === 0) return

      this.isUploading = true

      // Sequential upload
      for (const item of pendingItems) {
        item.status = 'uploading'
        item.errorMessage = ''

        try {
          // Rename file to {STOCK_NUMBER}.extension
          const extension = this.getFileExtension(item.originalName)
          const renamedFileName = `${item.stockNumber}.${extension}`
          const renamedFile = new File([item.file], renamedFileName, {
            type: item.file.type
          })

          const result = await this.uploadApiStore.uploadProductImage({
            file: renamedFile,
            containerName: 'image-gem'
          })

          if (result.success) {
            item.status = 'success'
          } else {
            item.status = 'error'
            item.errorMessage = result.message || 'อัพโหลดล้มเหลว'
          }
        } catch (error) {
          item.status = 'error'
          item.errorMessage = error.message || 'เกิดข้อผิดพลาด'
        }
      }

      this.isUploading = false
    },

    getFileExtension(fileName) {
      const parts = fileName.split('.')
      return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'jpg'
    },

    // --- Formatting & Display ---
    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    },

    statusText(item) {
      switch (item.status) {
        case 'pending':
          return this.$t('massUploadImage.statusPending') || 'รออัพโหลด'
        case 'uploading':
          return this.$t('massUploadImage.statusUploading') || 'กำลังอัพโหลด...'
        case 'success':
          return this.$t('massUploadImage.statusSuccess') || 'สำเร็จ'
        case 'error':
          return item.errorMessage || this.$t('massUploadImage.statusError') || 'เสียหาย'
        default:
          return ''
      }
    },

    statusClass(status) {
      switch (status) {
        case 'pending':
          return 'status-badge--pending'
        case 'uploading':
          return 'status-badge--uploading'
        case 'success':
          return 'status-badge--success'
        case 'error':
          return 'status-badge--error'
        default:
          return ''
      }
    },

    statusIcon(status) {
      switch (status) {
        case 'pending':
          return 'pi pi-clock'
        case 'uploading':
          return 'pi pi-spinner pi-spin'
        case 'success':
          return 'pi pi-check'
        case 'error':
          return 'pi pi-exclamation-circle'
        default:
          return ''
      }
    },

    rowClass(item) {
      return {
        'row--success': item.status === 'success',
        'row--error': item.status === 'error',
        'row--uploading': item.status === 'uploading'
      }
    }
  },

  // Cleanup preview URLs on destroy
  beforeUnmount() {
    this.fileList.forEach((item) => {
      if (item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
// --- Page Layout ---
.mass-upload-page {
  padding: 1rem;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

// --- Page Header ---
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .header-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i {
      font-size: 1.125rem;
      color: #e7de99;
    }

    h1 {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
  }
}

// --- Drop Zone ---
.drop-zone {
  background: white;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &--active {
    border-color: #e7de99;
    background: rgba(231, 222, 153, 0.06);
    transform: scale(1.01);
  }

  &--has-files {
    padding: 1.25rem 1rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  &__icon {
    font-size: 2rem;
    color: #d1d5db;
    transition: color 0.2s;
  }

  &--active &__icon {
    color: #e7de99;
  }

  &__text {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    margin: 0;
  }

  &__subtext {
    font-size: 0.6875rem;
    color: #9ca3af;
    margin: 0;
  }

  &__buttons {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  &__input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    pointer-events: none;
  }
}

// --- Upload Summary ---
.upload-summary {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;

  .summary-item {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 500;

    i {
      font-size: 0.75rem;
    }

    .summary-icon--success {
      color: #22c55e;
    }

    &--error {
      color: #ef4444;

      i {
        color: #ef4444;
      }
    }
  }
}

// --- File List Table ---
.file-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.file-table {
  width: 100%;
  border-collapse: collapse;

  thead {
    background: #f9fafb;
    border-bottom: 2px solid #e7de99;

    th {
      font-size: 0.6875rem;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.025em;
      padding: 0.5rem 0.625rem;
      text-align: left;
      white-space: nowrap;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #f3f4f6;
      transition: background 0.15s;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #fafafa;
      }

      // Row status classes
      &.row--success {
        background: rgba(34, 197, 94, 0.04);
      }

      &.row--error {
        background: rgba(239, 68, 68, 0.04);
      }

      &.row--uploading {
        background: rgba(231, 222, 153, 0.08);
      }
    }

    td {
      padding: 0.5rem 0.625rem;
      font-size: 0.75rem;
      color: #374151;
      vertical-align: middle;
    }
  }

  // Column widths
  .col-no {
    width: 48px;
    text-align: center;
    color: #9ca3af;
    font-weight: 600;
  }

  .col-preview {
    width: 56px;
  }

  .col-stocknumber {
    width: 180px;
  }

  .col-filename {
    flex: 1;
    color: #6b7280;
    word-break: break-all;
  }

  .col-size {
    width: 72px;
    color: #9ca3af;
    text-align: right;
  }

  .col-status {
    width: 140px;
  }

  .col-actions {
    width: 48px;
    text-align: center;
  }
}

// --- Preview Thumbnail ---
.preview-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

// --- Stock Number Input ---
.stock-input {
  width: 100%;
  height: 28px;
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #e7de99;
    box-shadow: 0 0 0 2px rgba(231, 222, 153, 0.2);
  }

  &--invalid {
    border-color: #ef4444;

    &:focus {
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15);
    }
  }

  &::placeholder {
    color: #d1d5db;
    font-weight: 400;
    text-transform: uppercase;
  }
}

.stock-text {
  font-weight: 600;
  letter-spacing: 0.025em;
  color: #374151;
}

// --- Status Badge ---
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  white-space: nowrap;

  i {
    font-size: 0.6875rem;
  }

  &--pending {
    background: #f3f4f6;
    color: #6b7280;
  }

  &--uploading {
    background: rgba(231, 222, 153, 0.15);
    color: #c0ab28;
  }

  &--success {
    background: rgba(34, 197, 94, 0.1);
    color: #16a34a;
  }

  &--error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// --- Action Buttons ---
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
  background: transparent;
  margin: 0 auto;

  i {
    font-size: 0.6875rem;
  }

  &--delete {
    color: #9ca3af;

    &:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
  }
}

// --- Empty State ---
.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &__icon {
    font-size: 2.5rem;
    color: #e5e7eb;
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.8125rem;
    color: #9ca3af;
    margin: 0;
  }
}

// --- Responsive ---
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.625rem;
  }

  .file-table {
    font-size: 0.6875rem;

    .col-filename {
      display: none; // Hide on mobile to save space
    }

    .col-size {
      display: none;
    }

    thead th,
    tbody td {
      padding: 0.375rem 0.25rem;
    }

    .col-stocknumber {
      width: auto;
    }

    .stock-input {
      width: 100%;
      min-width: 80px;
    }
  }

  .upload-summary {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>
