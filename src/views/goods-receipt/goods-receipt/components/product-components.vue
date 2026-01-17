<template>
  <div class="product-components-card">
    <!-- Section Title -->
    <div class="section-title">
      <i class="pi pi-th-large"></i>
      <span>{{ $t('goodsReceipt.components.title') || 'ส่วนประกอบสินค้า' }}</span>
    </div>

    <!-- Product Image Section -->
    <div class="product-image-section">
      <div class="image-upload-header">
        <label class="image-label">
          <i class="pi pi-image"></i>
          <span>{{ $t('goodsReceipt.components.productImage') || 'รูปภาพสินค้า' }}</span>
          <span class="image-info">(แนะนำ: ขนาด 800x800px, ไฟล์ไม่เกิน 500KB)</span>
        </label>
      </div>

      <div class="image-upload-area">
        <!-- Loading Indicator -->
        <div v-if="isUploadingImage" class="image-loading">
          <i class="pi pi-spin pi-spinner"></i>
          <p>กำลังอัพโหลดรูปภาพ...</p>
        </div>

        <!-- Image Preview -->
        <div v-else-if="productImage" class="image-preview-container">
          <img :src="productImage" alt="Product Image" class="product-image-preview" />
          <div class="image-overlay">
            <button class="btn-remove-image" @click="removeImage" type="button">
              <i class="pi pi-trash"></i>
              <span>ลบรูปภาพ</span>
            </button>
          </div>
          <div class="image-file-info">
            <small>{{ imageFileName }} ({{ formatFileSize(imageFileSize) }})</small>
          </div>
        </div>

        <!-- Upload Area -->
        <div v-else class="image-upload-box" @click="triggerFileInput">
          <i class="pi pi-cloud-upload"></i>
          <p>คลิกเพื่ออัพโหลดรูปภาพ</p>
          <small>รองรับ: JPG, PNG (แนะนำ 800x800px)</small>
        </div>

        <input
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          @change="handleImageUpload"
          style="display: none;"
          :disabled="isUploadingImage"
        />
      </div>
    </div>

    <!-- Add Component Button -->
    <div class="add-component-header">
      <button class="btn-add-component" @click="showAddComponentDialog = true">
        <i class="pi pi-plus"></i>
        <span>{{ $t('goodsReceipt.components.addComponent') || 'เพิ่มส่วนประกอบ' }}</span>
      </button>
    </div>

    <!-- Components Table -->
    <div class="components-table-wrapper">
      <table class="components-table" v-if="componentsData.components && componentsData.components.length > 0">
        <colgroup>
          <col style="width: 60px;">     <!-- ลำดับ -->
          <col style="width: 140px;">    <!-- ประเภท -->
          <col style="width: 150px;">    <!-- รายการ -->
          <col style="width: auto;">     <!-- รายละเอียด (ขยายเต็มที่) -->
          <col style="width: 100px;">    <!-- น้ำหนัก -->
          <col style="width: 100px;">    <!-- จำนวน -->
          <col style="width: 120px;">    <!-- ต้นทุน -->
          <col style="width: 100px;">    <!-- Actions -->
        </colgroup>
        <thead>
          <tr>
            <th class="no-column">{{ $t('common.no') || 'ลำดับ' }}</th>
            <th>{{ $t('goodsReceipt.components.type') || 'ประเภท' }}</th>
            <th>{{ $t('goodsReceipt.components.item') || 'รายการ' }}</th>
            <th>{{ $t('goodsReceipt.components.details') || 'รายละเอียด' }}</th>
            <th>{{ $t('goodsReceipt.components.weight') || 'น้ำหนัก' }}</th>
            <th>{{ $t('goodsReceipt.components.qty') || 'จำนวน' }}</th>
            <th>{{ $t('goodsReceipt.components.cost') || 'ต้นทุน (บาท)' }}</th>
            <th class="action-column"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(component, index) in componentsData.components"
            :key="`component-${index}`"
            class="component-row"
          >
            <!-- No. -->
            <td class="no-column">{{ index + 1 }}</td>

            <!-- Type Badge -->
            <td>
              <span :class="['type-badge', `type-${component.type}`]">
                <i :class="getTypeIcon(component.type)"></i>
                {{ getTypeName(component.type) }}
              </span>
            </td>

            <!-- Item Name -->
            <td>
              <strong>{{ component.itemNameTh || '-' }}</strong>
            </td>

            <!-- Details Column -->
            <td>
              <div class="details-cell">
                <!-- Gold Details -->
                <template v-if="component.type === 'gold'">
                  <div class="detail-row">
                    <span class="detail-label">รูปร่าง:</span>
                    <span>{{ component.shapeNameTh || '-' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">%waste:</span>
                    <span>{{ component.wastePercent ? `${component.wastePercent}%` : '-' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">น้ำหนักป้าย:</span>
                    <span>{{ component.labelWeight ? `${component.labelWeight} ${component.weightUnit || ''}` : '-' }}</span>
                  </div>
                </template>

                <!-- Gem Details -->
                <template v-if="component.type === 'gem'">
                  <div class="detail-row">
                    <span class="detail-label">รูปร่าง:</span>
                    <span>{{ component.shapeNameTh || '-' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">ขนาด:</span>
                    <span>{{ component.size || '-' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">แหล่งที่มา:</span>
                    <span>{{ component.origin || '-' }}</span>
                  </div>
                </template>

                <!-- Labor Details -->
                <template v-if="component.type === 'labor'">
                  <div class="detail-row">
                    <span class="detail-label">รายละเอียด:</span>
                    <span>{{ component.description || '-' }}</span>
                  </div>
                </template>
              </div>
            </td>

            <!-- Weight -->
            <td>
              <template v-if="component.type !== 'labor'">
                {{ component.weight ? `${component.weight} ${component.weightUnit}` : '-' }}
              </template>
              <template v-else>-</template>
            </td>

            <!-- Quantity -->
            <td>
              <template v-if="component.type !== 'labor'">
                {{ component.qty ? `${component.qty} ${component.qtyUnit}` : '-' }}
              </template>
              <template v-else>-</template>
            </td>

            <!-- Cost -->
            <td class="cost-cell">
              <strong>{{ formatCurrency(component.cost) }}</strong>
            </td>

            <!-- Actions -->
            <td class="action-column">
              <button
                class="btn-edit-component"
                @click="editComponent(index)"
                :title="$t('common.edit')"
              >
                <i class="pi pi-pencil"></i>
              </button>
              <button
                class="btn-delete-component"
                @click="removeComponent(index)"
                :title="$t('common.delete')"
              >
                <i class="pi pi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td colspan="6" class="total-label">
              <strong>{{ $t('goodsReceipt.components.actualCost') || 'ราคาต้นทุนจริง' }}</strong>
            </td>
            <td class="total-cost">
              <strong>{{ formatCurrency(totalCost) }}</strong>
            </td>
            <td></td>
          </tr>
          <tr class="cost-summary-row">
            <td colspan="6" class="summary-label">
              <strong>{{ $t('goodsReceipt.components.usedCost') || 'ราคาต้นทุนที่ใช้' }}</strong>
            </td>
            <td class="summary-input-cell">
              <input
                type="number"
                v-model.number="costSummary.usedCost"
                class="cost-input"
                step="0.01"
                min="0"
              />
            </td>
            <td></td>
          </tr>
          <tr class="cost-summary-row">
            <td colspan="6" class="summary-label">
              <strong>{{ $t('goodsReceipt.components.discountPercent') || 'ส่วนลด (%)' }}</strong>
            </td>
            <td class="summary-input-cell">
              <input
                type="number"
                v-model.number="costSummary.discountPercent"
                class="cost-input"
                step="0.01"
                min="0"
                max="100"
              />
            </td>
            <td></td>
          </tr>
          <tr class="final-cost-row">
            <td colspan="6" class="summary-label">
              <strong>{{ $t('goodsReceipt.components.finalCost') || 'ราคาสุดท้าย' }}</strong>
            </td>
            <td class="final-cost">
              <strong>{{ formatCurrency(finalCost) }}</strong>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <i class="pi pi-inbox"></i>
        <p>{{ $t('goodsReceipt.components.noComponents') || 'ยังไม่มีส่วนประกอบ คลิกปุ่มเพิ่มส่วนประกอบด้านบน' }}</p>
      </div>
    </div>

    <!-- Add/Edit Component Dialog -->
    <Dialog
      v-model:visible="showAddComponentDialog"
      :header="editingIndex !== null ? 'แก้ไขส่วนประกอบ' : 'เพิ่มส่วนประกอบ'"
      :modal="true"
      :style="{ width: '800px' }"
      class="component-dialog"
    >
      <div class="dialog-content">
        <!-- Component Type Selection -->
        <div class="form-group">
          <label>
            {{ $t('goodsReceipt.components.componentType') || 'ประเภทส่วนประกอบ' }}
            <span class="required">*</span>
          </label>
          <div class="type-selector">
            <button
              v-for="type in componentTypes"
              :key="type.value"
              :class="['type-option', { active: currentComponent.type === type.value }]"
              @click="selectComponentType(type.value)"
            >
              <i :class="type.icon"></i>
              <span>{{ type.label }}</span>
            </button>
          </div>
        </div>

        <!-- Gold Component Form -->
        <template v-if="currentComponent.type === 'gold'">
          <div class="form-grid">
            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.gold') || 'ทอง' }}
                <span class="required">*</span>
              </label>
              <FormDropdown
                v-model="currentComponent.itemCode"
                :options="golds"
                option-label="nameTh"
                option-value="code"
                :placeholder="$t('goodsReceipt.components.goldPlaceholder') || 'เลือกทอง'"
                :invalid="!!dialogErrors.itemCode"
                @change="handleGoldChange"
              />
              <small v-if="dialogErrors.itemCode" class="p-error">{{ dialogErrors.itemCode }}</small>
            </div>

            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.goldShape') || 'รูปร่างทอง' }}
                <span class="required">*</span>
              </label>
              <FormDropdown
                v-model="currentComponent.shapeCode"
                :options="goldSizes"
                option-label="nameTh"
                option-value="code"
                :placeholder="$t('goodsReceipt.components.goldShapePlaceholder') || 'เลือกรูปร่าง'"
                :invalid="!!dialogErrors.shapeCode"
                @change="handleGoldShapeChange"
              />
              <small v-if="dialogErrors.shapeCode" class="p-error">{{ dialogErrors.shapeCode }}</small>
            </div>

            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.weight') || 'น้ำหนัก' }}
                <span class="required">*</span>
              </label>
              <input
                type="number"
                v-model.number="currentComponent.weight"
                :placeholder="$t('goodsReceipt.components.weightPlaceholder') || 'กรอกน้ำหนัก'"
                :class="{ 'is-invalid': !!dialogErrors.weight }"
                class="custom-input"
                step="0.01"
                min="0"
                @input="calculateGoldCost"
              />
              <small v-if="dialogErrors.weight" class="p-error">{{ dialogErrors.weight }}</small>
            </div>

            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.weightUnit') || 'หน่วยน้ำหนัก' }}
                <span class="required">*</span>
              </label>
              <InputText
                v-model="currentComponent.weightUnit"
                :placeholder="$t('goodsReceipt.components.weightUnitPlaceholder') || 'กรอกหน่วยน้ำหนัก'"
                :class="{ 'p-invalid': !!dialogErrors.weightUnit }"
              />
              <small v-if="dialogErrors.weightUnit" class="p-error">{{ dialogErrors.weightUnit }}</small>
            </div>

            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.wastePercent') || '%waste' }}
                <span class="required">*</span>
              </label>
              <input
                type="number"
                v-model.number="currentComponent.wastePercent"
                :placeholder="$t('goodsReceipt.components.wastePercentPlaceholder') || 'กรอก %waste'"
                :class="{ 'is-invalid': !!dialogErrors.wastePercent }"
                class="custom-input"
                step="0.01"
                min="0"
                max="100"
                @input="calculateGoldCost"
              />
              <small v-if="dialogErrors.wastePercent" class="p-error">{{ dialogErrors.wastePercent }}</small>
            </div>

            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.labelWeight') || 'น้ำหนักป้าย' }}
                <span class="required">*</span>
              </label>
              <input
                type="number"
                v-model.number="currentComponent.labelWeight"
                :placeholder="$t('goodsReceipt.components.labelWeightPlaceholder') || 'กรอกน้ำหนักป้าย'"
                :class="{ 'is-invalid': !!dialogErrors.labelWeight }"
                class="custom-input"
                step="0.01"
                min="0"
              />
              <small v-if="dialogErrors.labelWeight" class="p-error">{{ dialogErrors.labelWeight }}</small>
            </div>

            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.qty') || 'จำนวน' }}
                <span class="required">*</span>
              </label>
              <input
                type="number"
                v-model.number="currentComponent.qty"
                :placeholder="$t('goodsReceipt.components.qtyPlaceholder') || 'กรอกจำนวน'"
                :class="{ 'is-invalid': !!dialogErrors.qty }"
                class="custom-input"
                step="0.01"
                min="0"
              />
              <small v-if="dialogErrors.qty" class="p-error">{{ dialogErrors.qty }}</small>
            </div>

            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.qtyUnit') || 'หน่วยนับ' }}
                <span class="required">*</span>
              </label>
              <InputText
                v-model="currentComponent.qtyUnit"
                :placeholder="$t('goodsReceipt.components.qtyUnitPlaceholder') || 'กรอกหน่วยนับ'"
                :class="{ 'p-invalid': !!dialogErrors.qtyUnit }"
              />
              <small v-if="dialogErrors.qtyUnit" class="p-error">{{ dialogErrors.qtyUnit }}</small>
            </div>

            <div class="form-group form-group-full">
              <label>
                {{ $t('goodsReceipt.components.price') || 'ราคา (บาท/กรัม)' }}
                <span class="required">*</span>
              </label>
              <input
                type="number"
                v-model.number="currentComponent.price"
                :placeholder="$t('goodsReceipt.components.pricePlaceholder') || 'กรอกราคา'"
                :class="{ 'is-invalid': !!dialogErrors.price }"
                class="custom-input"
                step="0.01"
                min="0"
                @input="calculateGoldCost"
              />
              <small v-if="dialogErrors.price" class="p-error">{{ dialogErrors.price }}</small>
            </div>

            <div class="form-group form-group-full">
              <label>
                {{ $t('goodsReceipt.components.cost') || 'ต้นทุน (บาท)' }}
                <span class="info-badge">คำนวณอัตโนมัติ</span>
              </label>
              <input
                type="number"
                v-model.number="currentComponent.cost"
                :placeholder="$t('goodsReceipt.components.costPlaceholder') || 'คำนวณอัตโนมัติจากสูตร'"
                :class="{ 'is-invalid': !!dialogErrors.cost }"
                class="custom-input"
                step="0.01"
                min="0"
                readonly
                disabled
              />
              <small class="cost-formula">
                <i class="pi pi-info-circle"></i>
                สูตร: (น้ำหนัก + (น้ำหนัก × %waste)) × ราคาทอง
              </small>
            </div>
          </div>
        </template>

        <!-- Gem Component Form -->
        <template v-if="currentComponent.type === 'gem'">
          <div class="form-grid">
            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.gem') || 'เพชร/พลอย' }}
                <span class="required">*</span>
              </label>
              <FormDropdown
                v-model="currentComponent.itemCode"
                :options="gems"
                option-label="nameTh"
                option-value="code"
                :placeholder="$t('goodsReceipt.components.gemPlaceholder') || 'เลือกเพชร/พลอย'"
                :invalid="!!dialogErrors.itemCode"
                @change="handleGemChange"
              />
              <small v-if="dialogErrors.itemCode" class="p-error">{{ dialogErrors.itemCode }}</small>
            </div>

            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.gemShape') || 'รูปร่างพลอย' }}
                <span class="required">*</span>
              </label>
              <FormDropdown
                v-model="currentComponent.shapeCode"
                :options="gemShapes"
                option-label="nameTh"
                option-value="code"
                :placeholder="$t('goodsReceipt.components.gemShapePlaceholder') || 'เลือกรูปร่าง'"
                :invalid="!!dialogErrors.shapeCode"
                @change="handleGemShapeChange"
              />
              <small v-if="dialogErrors.shapeCode" class="p-error">{{ dialogErrors.shapeCode }}</small>
            </div>

            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.size') || 'ขนาด' }}
                <span class="required">*</span>
              </label>
              <InputText
                v-model="currentComponent.size"
                :placeholder="$t('goodsReceipt.components.sizePlaceholder') || 'กรอกขนาดพลอย'"
                :class="{ 'p-invalid': !!dialogErrors.size }"
              />
              <small v-if="dialogErrors.size" class="p-error">{{ dialogErrors.size }}</small>
            </div>

            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.origin') || 'แหล่งที่มา (แหล่งกำเนิดพลอย)' }}
                <span class="required">*</span>
              </label>
              <InputText
                v-model="currentComponent.origin"
                :placeholder="$t('goodsReceipt.components.originPlaceholder') || 'กรอกแหล่งที่มาของพลอย'"
                :class="{ 'p-invalid': !!dialogErrors.origin }"
              />
              <small v-if="dialogErrors.origin" class="p-error">{{ dialogErrors.origin }}</small>
            </div>

            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.weight') || 'น้ำหนัก' }}
                <span class="required">*</span>
              </label>
              <input
                type="number"
                v-model.number="currentComponent.weight"
                :placeholder="$t('goodsReceipt.components.weightPlaceholder') || 'กรอกน้ำหนัก'"
                :class="{ 'is-invalid': !!dialogErrors.weight }"
                class="custom-input"
                step="0.01"
                min="0"
                @input="calculateGemCost"
              />
              <small v-if="dialogErrors.weight" class="p-error">{{ dialogErrors.weight }}</small>
            </div>

            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.weightUnit') || 'หน่วยน้ำหนัก' }}
                <span class="required">*</span>
              </label>
              <InputText
                v-model="currentComponent.weightUnit"
                :placeholder="$t('goodsReceipt.components.weightUnitPlaceholder') || 'กรอกหน่วยน้ำหนัก'"
                :class="{ 'p-invalid': !!dialogErrors.weightUnit }"
              />
              <small v-if="dialogErrors.weightUnit" class="p-error">{{ dialogErrors.weightUnit }}</small>
            </div>

            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.qty') || 'จำนวน' }}
                <span class="required">*</span>
              </label>
              <input
                type="number"
                v-model.number="currentComponent.qty"
                :placeholder="$t('goodsReceipt.components.qtyPlaceholder') || 'กรอกจำนวน'"
                :class="{ 'is-invalid': !!dialogErrors.qty }"
                class="custom-input"
                step="0.01"
                min="0"
              />
              <small v-if="dialogErrors.qty" class="p-error">{{ dialogErrors.qty }}</small>
            </div>

            <div class="form-group">
              <label>
                {{ $t('goodsReceipt.components.qtyUnit') || 'หน่วยนับ' }}
                <span class="required">*</span>
              </label>
              <InputText
                v-model="currentComponent.qtyUnit"
                :placeholder="$t('goodsReceipt.components.qtyUnitPlaceholder') || 'กรอกหน่วยนับ'"
                :class="{ 'p-invalid': !!dialogErrors.qtyUnit }"
              />
              <small v-if="dialogErrors.qtyUnit" class="p-error">{{ dialogErrors.qtyUnit }}</small>
            </div>

            <div class="form-group form-group-full">
              <label>
                {{ $t('goodsReceipt.components.price') || 'ราคา (บาท/กรัม)' }}
                <span class="required">*</span>
              </label>
              <input
                type="number"
                v-model.number="currentComponent.price"
                :placeholder="$t('goodsReceipt.components.pricePlaceholder') || 'กรอกราคา'"
                :class="{ 'is-invalid': !!dialogErrors.price }"
                class="custom-input"
                step="0.01"
                min="0"
                @input="calculateGemCost"
              />
              <small v-if="dialogErrors.price" class="p-error">{{ dialogErrors.price }}</small>
            </div>

            <div class="form-group form-group-full">
              <label>
                {{ $t('goodsReceipt.components.cost') || 'ต้นทุน (บาท)' }}
                <span class="info-badge">คำนวณอัตโนมัติ</span>
              </label>
              <input
                type="number"
                v-model.number="currentComponent.cost"
                :placeholder="$t('goodsReceipt.components.costPlaceholder') || 'คำนวณอัตโนมัติจากสูตร'"
                :class="{ 'is-invalid': !!dialogErrors.cost }"
                class="custom-input"
                step="0.01"
                min="0"
                readonly
                disabled
              />
              <small class="cost-formula">
                <i class="pi pi-info-circle"></i>
                สูตร: น้ำหนัก × ราคาเพชร/พลอย
              </small>
            </div>
          </div>
        </template>

        <!-- Labor/Other Cost Form -->
        <template v-if="currentComponent.type === 'labor'">
          <div class="form-grid">
            <div class="form-group form-group-full">
              <label>
                {{ $t('goodsReceipt.components.laborTitle') || 'หัวข้อ' }}
                <span class="required">*</span>
              </label>
              <InputText
                v-model="currentComponent.itemNameTh"
                :placeholder="$t('goodsReceipt.components.laborTitlePlaceholder') || 'กรอกหัวข้อ เช่น ค่าแรงช่าง, ค่าขนส่ง'"
                :class="{ 'p-invalid': !!dialogErrors.itemNameTh }"
              />
              <small v-if="dialogErrors.itemNameTh" class="p-error">{{ dialogErrors.itemNameTh }}</small>
            </div>

            <div class="form-group form-group-full">
              <label>
                {{ $t('goodsReceipt.components.laborDescription') || 'รายละเอียด' }}
              </label>
              <Textarea
                v-model="currentComponent.description"
                :placeholder="$t('goodsReceipt.components.laborDescriptionPlaceholder') || 'กรอกรายละเอียด (ถ้ามี)'"
                rows="3"
              />
            </div>

            <div class="form-group form-group-full">
              <label>
                {{ $t('goodsReceipt.components.cost') || 'ต้นทุน (บาท)' }}
                <span class="required">*</span>
              </label>
              <input
                type="number"
                v-model.number="currentComponent.cost"
                :placeholder="$t('goodsReceipt.components.costPlaceholder') || 'กรอกต้นทุน'"
                :class="{ 'is-invalid': !!dialogErrors.cost }"
                class="custom-input"
                step="0.01"
                min="0"
              />
              <small v-if="dialogErrors.cost" class="p-error">{{ dialogErrors.cost }}</small>
            </div>
          </div>
        </template>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <button class="btn-cancel" @click="cancelComponentDialog">
            <i class="pi pi-times"></i>
            <span>{{ $t('common.cancel') || 'ยกเลิก' }}</span>
          </button>
          <button class="btn-submit" @click="saveComponent">
            <i class="pi pi-check"></i>
            <span>{{ editingIndex !== null ? $t('common.save') : $t('common.add') || 'บันทึก' }}</span>
          </button>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import FormDropdown from '@/components/common/form-dropdown.vue'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dialog from 'primevue/dialog'
import { useGoldApiStore } from '@/stores/api/gold-api'
import { useGemApiStore } from '@/stores/api/gem-api'
import { useGemShapeApiStore } from '@/stores/api/gem-shape-api'
import { useGoldSizeApiStore } from '@/stores/api/gold-size-api'
import { useUploadApiStore } from '@/stores/api/upload-api'

export default {
  name: 'ProductComponents',

  components: {
    FormDropdown,
    InputText,
    Textarea,
    Dialog
  },

  props: {
    modelValue: {
      type: Object,
      default: () => ({
        components: []
      })
    }
  },

  emits: ['update:modelValue', 'validate'],

  data() {
    return {
      goldApiStore: useGoldApiStore(),
      gemApiStore: useGemApiStore(),
      gemShapeApiStore: useGemShapeApiStore(),
      goldSizeApiStore: useGoldSizeApiStore(),
      uploadApiStore: useUploadApiStore(),
      componentsData: {
        components: []
      },
      componentTypes: [
        { value: 'gold', label: 'ทอง', icon: 'pi pi-circle-fill' },
        { value: 'gem', label: 'เพชร/พลอย', icon: 'pi pi-circle-fill' },
        { value: 'labor', label: 'ค่าแรง/ต้นทุนอื่นๆ', icon: 'pi pi-wrench' }
      ],
      showAddComponentDialog: false,
      editingIndex: null,
      currentComponent: this.getEmptyComponent('gold'),
      costSummary: {
        usedCost: 0,
        discountPercent: 0
      },
      golds: [],
      gems: [],
      gemShapes: [],
      goldSizes: [],
      dialogErrors: {},
      errors: {},
      isUpdatingFromParent: false,
      // Image Upload
      productImage: null,
      productImageUrl: null,
      productImageBlobName: null,
      imageFileName: '',
      imageFileSize: 0,
      isUploadingImage: false,
      pendingImageFile: null // Store file for upload later
    }
  },

  computed: {
    totalCost() {
      if (!this.componentsData.components || !Array.isArray(this.componentsData.components)) {
        return 0
      }
      return this.componentsData.components.reduce((sum, component) => {
        return sum + (parseFloat(component.cost) || 0)
      }, 0)
    },

    finalCost() {
      const usedCost = parseFloat(this.costSummary.usedCost) || 0
      const discountPercent = parseFloat(this.costSummary.discountPercent) || 0
      const discountAmount = usedCost * (discountPercent / 100)
      return usedCost - discountAmount
    }
  },

  async mounted() {
    await this.loadGolds()
    await this.loadGems()
    await this.loadGemShapes()
    await this.loadGoldSizes()
  },

  watch: {
    modelValue: {
      handler(newValue) {
        if (newValue && !this.isUpdatingFromParent) {
          this.isUpdatingFromParent = true

          // Update components
          const updatedValue = {
            components: Array.isArray(newValue.components) ? newValue.components : []
          }
          this.componentsData = JSON.parse(JSON.stringify(updatedValue))

          // Update productImageUrl
          if (newValue.productImageUrl) {
            this.productImageUrl = newValue.productImageUrl
            this.productImage = newValue.productImageUrl
          }

          // Update productImageBlobName
          if (newValue.productImageBlobName) {
            this.productImageBlobName = newValue.productImageBlobName
          }

          // Update costSummary
          if (newValue.costSummary) {
            this.costSummary = {
              usedCost: newValue.costSummary.usedCost || 0,
              discountPercent: newValue.costSummary.discountPercent || 0
            }
          }

          this.$nextTick(() => {
            this.isUpdatingFromParent = false
          })
        }
      },
      deep: true,
      immediate: true
    },

    componentsData: {
      handler(newValue) {
        if (!this.isUpdatingFromParent) {
          this.emitAllData()
        }
      },
      deep: true
    },

    productImageUrl: {
      handler() {
        if (!this.isUpdatingFromParent) {
          this.emitAllData()
        }
      }
    },

    costSummary: {
      handler() {
        if (!this.isUpdatingFromParent) {
          this.emitAllData()
        }
      },
      deep: true
    },

    totalCost: {
      handler(newValue) {
        // Update usedCost when totalCost changes
        this.costSummary.usedCost = newValue
      },
      immediate: true
    }
  },

  methods: {
    emitAllData() {
      // Emit complete data including image URL and cost summary
      const completeData = {
        components: this.componentsData.components || [],
        productImageUrl: this.productImageUrl || '',
        productImageBlobName: this.productImageBlobName || '',
        costSummary: {
          actualCost: this.totalCost,
          usedCost: this.costSummary.usedCost || 0,
          discountPercent: this.costSummary.discountPercent || 0,
          finalCost: this.finalCost
        }
      }
      this.$emit('update:modelValue', completeData)
    },

    getEmptyComponent(type = 'gold') {
      const baseComponent = {
        type: type,
        cost: null,
        price: null
      }

      if (type === 'gold') {
        return {
          ...baseComponent,
          itemCode: '',
          itemNameTh: '',
          itemNameEn: '',
          shapeCode: '',
          shapeNameTh: '',
          shapeNameEn: '',
          weight: null,
          weightUnit: 'g',
          wastePercent: null,
          labelWeight: null,
          qty: null,
          qtyUnit: 'pc'
        }
      } else if (type === 'gem') {
        return {
          ...baseComponent,
          itemCode: '',
          itemNameTh: '',
          itemNameEn: '',
          shapeCode: '',
          shapeNameTh: '',
          shapeNameEn: '',
          size: '',
          origin: '',
          weight: null,
          weightUnit: 'g',
          qty: null,
          qtyUnit: 'pc'
        }
      } else if (type === 'labor') {
        return {
          ...baseComponent,
          itemNameTh: '',
          description: ''
        }
      }
    },

    selectComponentType(type) {
      this.currentComponent = this.getEmptyComponent(type)
      this.dialogErrors = {}
    },

    async loadGolds() {
      try {
        const result = await this.goldApiStore.listGolds({
          pageIndex: 0,
          pageSize: 1000,
          criteria: { searchText: null }
        })
        if (result.success) {
          this.golds = result.data
        }
      } catch (error) {
        console.error('Error loading golds:', error)
      }
    },

    async loadGems() {
      try {
        const result = await this.gemApiStore.listGems({
          pageIndex: 0,
          pageSize: 1000,
          criteria: { searchText: null }
        })
        if (result.success) {
          this.gems = result.data
        }
      } catch (error) {
        console.error('Error loading gems:', error)
      }
    },

    async loadGemShapes() {
      try {
        const result = await this.gemShapeApiStore.listGemShapes({
          pageIndex: 0,
          pageSize: 1000,
          criteria: { searchText: null }
        })
        if (result.success) {
          this.gemShapes = result.data
        }
      } catch (error) {
        console.error('Error loading gem shapes:', error)
      }
    },

    async loadGoldSizes() {
      try {
        const result = await this.goldSizeApiStore.listGoldSizes({
          pageIndex: 0,
          pageSize: 1000,
          criteria: { searchText: null }
        })
        if (result.success) {
          this.goldSizes = result.data
        }
      } catch (error) {
        console.error('Error loading gold sizes:', error)
      }
    },

    handleGoldChange(event) {
      const selectedGold = this.golds.find(g => g.code === event.value)
      if (selectedGold) {
        this.currentComponent.itemCode = selectedGold.code
        this.currentComponent.itemNameTh = selectedGold.nameTh
        this.currentComponent.itemNameEn = selectedGold.nameEn
      }
      delete this.dialogErrors.itemCode
    },

    handleGoldShapeChange(event) {
      const selectedShape = this.goldSizes.find(s => s.code === event.value)
      if (selectedShape) {
        this.currentComponent.shapeCode = selectedShape.code
        this.currentComponent.shapeNameTh = selectedShape.nameTh
        this.currentComponent.shapeNameEn = selectedShape.nameEn
      }
      delete this.dialogErrors.shapeCode
    },

    handleGemChange(event) {
      const selectedGem = this.gems.find(g => g.code === event.value)
      if (selectedGem) {
        this.currentComponent.itemCode = selectedGem.code
        this.currentComponent.itemNameTh = selectedGem.nameTh
        this.currentComponent.itemNameEn = selectedGem.nameEn
      }
      delete this.dialogErrors.itemCode
    },

    handleGemShapeChange(event) {
      const selectedShape = this.gemShapes.find(s => s.code === event.value)
      if (selectedShape) {
        this.currentComponent.shapeCode = selectedShape.code
        this.currentComponent.shapeNameTh = selectedShape.nameTh
        this.currentComponent.shapeNameEn = selectedShape.nameEn
      }
      delete this.dialogErrors.shapeCode
    },

    editComponent(index) {
      this.editingIndex = index
      this.currentComponent = JSON.parse(JSON.stringify(this.componentsData.components[index]))
      this.showAddComponentDialog = true
      this.dialogErrors = {}
    },

    removeComponent(index) {
      if (!this.componentsData.components || !Array.isArray(this.componentsData.components)) {
        return
      }
      const newComponents = this.componentsData.components.filter((_, i) => i !== index)
      this.componentsData = {
        components: newComponents
      }
    },

    validateCurrentComponent() {
      this.dialogErrors = {}
      const comp = this.currentComponent

      if (comp.type === 'gold') {
        if (!comp.itemCode || !comp.itemCode.trim()) {
          this.dialogErrors.itemCode = 'กรุณาเลือกทอง'
        }
        if (!comp.shapeCode || !comp.shapeCode.trim()) {
          this.dialogErrors.shapeCode = 'กรุณาเลือกรูปร่าง'
        }
        if (!comp.weight || comp.weight <= 0) {
          this.dialogErrors.weight = 'กรุณากรอกน้ำหนัก'
        }
        if (!comp.weightUnit || !comp.weightUnit.trim()) {
          this.dialogErrors.weightUnit = 'กรุณากรอกหน่วยน้ำหนัก'
        }
        if (comp.wastePercent === null || comp.wastePercent === undefined || comp.wastePercent < 0) {
          this.dialogErrors.wastePercent = 'กรุณากรอก %waste'
        }
        if (!comp.labelWeight || comp.labelWeight <= 0) {
          this.dialogErrors.labelWeight = 'กรุณากรอกน้ำหนักป้าย'
        }
        if (!comp.qty || comp.qty <= 0) {
          this.dialogErrors.qty = 'กรุณากรอกจำนวน'
        }
        if (!comp.qtyUnit || !comp.qtyUnit.trim()) {
          this.dialogErrors.qtyUnit = 'กรุณากรอกหน่วยนับ'
        }
        if (!comp.price || comp.price <= 0) {
          this.dialogErrors.price = 'กรุณากรอกราคา'
        }
      } else if (comp.type === 'gem') {
        if (!comp.itemCode || !comp.itemCode.trim()) {
          this.dialogErrors.itemCode = 'กรุณาเลือกเพชร/พลอย'
        }
        if (!comp.shapeCode || !comp.shapeCode.trim()) {
          this.dialogErrors.shapeCode = 'กรุณาเลือกรูปร่าง'
        }
        if (!comp.size || !comp.size.trim()) {
          this.dialogErrors.size = 'กรุณากรอกขนาด'
        }
        if (!comp.origin || !comp.origin.trim()) {
          this.dialogErrors.origin = 'กรุณากรอกแหล่งที่มา'
        }
        if (!comp.weight || comp.weight <= 0) {
          this.dialogErrors.weight = 'กรุณากรอกน้ำหนัก'
        }
        if (!comp.weightUnit || !comp.weightUnit.trim()) {
          this.dialogErrors.weightUnit = 'กรุณากรอกหน่วยน้ำหนัก'
        }
        if (!comp.qty || comp.qty <= 0) {
          this.dialogErrors.qty = 'กรุณากรอกจำนวน'
        }
        if (!comp.qtyUnit || !comp.qtyUnit.trim()) {
          this.dialogErrors.qtyUnit = 'กรุณากรอกหน่วยนับ'
        }
        if (!comp.price || comp.price <= 0) {
          this.dialogErrors.price = 'กรุณากรอกราคา'
        }
      } else if (comp.type === 'labor') {
        if (!comp.itemNameTh || !comp.itemNameTh.trim()) {
          this.dialogErrors.itemNameTh = 'กรุณากรอกหัวข้อ'
        }
      }

      // Cost is required for all types
      if (!comp.cost || comp.cost <= 0) {
        this.dialogErrors.cost = 'กรุณากรอกต้นทุน'
      }

      return Object.keys(this.dialogErrors).length === 0
    },

    saveComponent() {
      if (!this.validateCurrentComponent()) {
        return
      }

      const currentComponents = Array.isArray(this.componentsData.components) ? this.componentsData.components : []
      const newComponents = [...currentComponents]

      if (this.editingIndex !== null) {
        // Update existing component
        newComponents[this.editingIndex] = JSON.parse(JSON.stringify(this.currentComponent))
      } else {
        // Add new component
        newComponents.push(JSON.parse(JSON.stringify(this.currentComponent)))
      }

      this.componentsData = {
        components: newComponents
      }

      this.cancelComponentDialog()
    },

    cancelComponentDialog() {
      this.showAddComponentDialog = false
      this.editingIndex = null
      this.currentComponent = this.getEmptyComponent('gold')
      this.dialogErrors = {}
    },

    getTypeName(type) {
      const typeObj = this.componentTypes.find(t => t.value === type)
      return typeObj ? typeObj.label : type
    },

    getTypeIcon(type) {
      const typeObj = this.componentTypes.find(t => t.value === type)
      return typeObj ? typeObj.icon : 'pi pi-circle'
    },

    formatCurrency(value) {
      if (!value && value !== 0) return '฿0.00'
      return `฿${parseFloat(value).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    },

    calculateGoldCost() {
      // สูตร: (น้ำหนัก + (น้ำหนัก × %waste)) × ราคา
      const weight = parseFloat(this.currentComponent.weight) || 0
      const wastePercent = parseFloat(this.currentComponent.wastePercent) || 0
      const price = parseFloat(this.currentComponent.price) || 0

      if (weight > 0 && price > 0) {
        const totalWeight = weight + (weight * (wastePercent / 100))
        this.currentComponent.cost = Math.round(totalWeight * price * 100) / 100
      } else {
        this.currentComponent.cost = 0
      }
    },

    calculateGemCost() {
      // สูตร: น้ำหนัก × ราคา
      const weight = parseFloat(this.currentComponent.weight) || 0
      const price = parseFloat(this.currentComponent.price) || 0

      if (weight > 0 && price > 0) {
        this.currentComponent.cost = Math.round(weight * price * 100) / 100
      } else {
        this.currentComponent.cost = 0
      }
    },

    triggerFileInput() {
      this.$refs.fileInput.click()
    },

    async handleImageUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!validTypes.includes(file.type)) {
        alert('กรุณาเลือกไฟล์รูปภาพ JPG หรือ PNG เท่านั้น')
        return
      }

      // Validate file size (max 10MB before compression)
      if (file.size > 10 * 1024 * 1024) {
        alert('ไฟล์มีขนาดใหญ่เกินไป (ไม่เกิน 10MB)')
        return
      }

      try {
        this.isUploadingImage = true

        // Compress and resize image first
        const compressedImageData = await this.compressImage(file)

        // Convert base64 to Blob for later upload
        const blob = await this.base64ToBlob(compressedImageData.dataUrl)

        // Create a new file from blob with original filename
        const compressedFile = new File([blob], file.name, { type: 'image/jpeg' })

        // Store file for upload later (when submitting form)
        this.pendingImageFile = compressedFile

        // Show preview immediately
        this.productImage = compressedImageData.dataUrl
        this.imageFileName = file.name
        this.imageFileSize = compressedImageData.size

        console.log('Image compressed and ready for upload:', {
          fileName: file.name,
          originalSize: file.size,
          compressedSize: compressedImageData.size
        })
      } catch (error) {
        console.error('Error processing image:', error)
        alert(`เกิดข้อผิดพลาดในการประมวลผลรูปภาพ: ${error.message}`)
        // Clear preview on error
        this.productImage = null
        this.pendingImageFile = null
        this.imageFileName = ''
        this.imageFileSize = 0
      } finally {
        this.isUploadingImage = false
        // Clear input for re-upload same file
        event.target.value = ''
      }
    },

    async base64ToBlob(base64Data) {
      const response = await fetch(base64Data)
      return response.blob()
    },

    async compressImage(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
          const img = new Image()
          img.src = e.target.result
          img.onload = () => {
            // Create canvas
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            // Target dimensions (max width/height)
            const MAX_WIDTH = 800
            const MAX_HEIGHT = 800

            let width = img.width
            let height = img.height

            // Calculate new dimensions maintaining aspect ratio
            if (width > height) {
              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width)
                width = MAX_WIDTH
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height)
                height = MAX_HEIGHT
              }
            }

            // Set canvas size
            canvas.width = width
            canvas.height = height

            // Draw image on canvas
            ctx.drawImage(img, 0, 0, width, height)

            // Compress image with quality settings
            // Start with 0.7 quality for JPEG
            let quality = 0.7
            let dataUrl = canvas.toDataURL('image/jpeg', quality)
            let size = this.getBase64Size(dataUrl)

            // Target size: 500KB
            const TARGET_SIZE = 500 * 1024

            // If still too large, reduce quality further
            while (size > TARGET_SIZE && quality > 0.1) {
              quality -= 0.1
              dataUrl = canvas.toDataURL('image/jpeg', quality)
              size = this.getBase64Size(dataUrl)
            }

            resolve({
              dataUrl: dataUrl,
              size: size
            })
          }
          img.onerror = reject
        }
        reader.onerror = reject
      })
    },

    getBase64Size(base64String) {
      // Remove data URL prefix
      const base64 = base64String.split(',')[1]
      // Calculate size in bytes
      const padding = (base64.match(/=/g) || []).length
      return (base64.length * 0.75) - padding
    },

    async uploadPendingImage(stockNumber = null) {
      // Upload pending image file to Azure Blob Storage
      if (!this.pendingImageFile) {
        return null // No image to upload
      }

      try {
        // Rename file with stockNumber if provided
        let fileToUpload = this.pendingImageFile
        if (stockNumber) {
          const fileExtension = this.pendingImageFile.name.split('.').pop()
          const newFileName = `${stockNumber}.${fileExtension}`
          fileToUpload = new File([this.pendingImageFile], newFileName, {
            type: this.pendingImageFile.type
          })
          console.log('Uploading image with stock number:', newFileName)
        } else {
          console.log('Uploading pending image...', this.pendingImageFile.name)
        }

        const uploadResult = await this.uploadApiStore.uploadProductImage({
          file: fileToUpload,
          containerName: 'image-gem'
        })

        if (uploadResult.success) {
          this.productImageUrl = uploadResult.data.blobUrl
          this.productImageBlobName = uploadResult.data.blobName
          console.log('Image uploaded successfully:', this.productImageUrl)
          return {
            blobUrl: uploadResult.data.blobUrl,
            blobName: uploadResult.data.blobName
          }
        } else {
          throw new Error(uploadResult.message || 'Failed to upload image')
        }
      } catch (error) {
        console.error('Error uploading pending image:', error)
        throw error
      }
    },

    async removeImage() {
      // Delete from Azure Blob Storage if exists
      // if (this.productImageBlobName) {
      //   try {
      //     const deleteResult = await this.uploadApiStore.deleteProductImage({
      //       blobName: this.productImageBlobName,
      //       containerName: 'image-gem'
      //     })

      //     if (deleteResult.success) {
      //       console.log('Image deleted successfully from Azure Blob Storage')
      //     } else {
      //       console.warn('Failed to delete image from Azure Blob Storage:', deleteResult.message)
      //     }
      //   } catch (error) {
      //     console.error('Error deleting image:', error)
      //     // Continue even if delete fails
      //   }
      // }

      // Clear local data
      this.productImage = null
      this.productImageUrl = null
      this.productImageBlobName = null
      this.pendingImageFile = null
      this.imageFileName = ''
      this.imageFileSize = 0
    },

    validate() {
      this.errors = {}

      if (!this.componentsData.components || this.componentsData.components.length === 0) {
        this.errors.components = 'กรุณาเพิ่มส่วนประกอบอย่างน้อย 1 รายการ'
      }

      const isValid = Object.keys(this.errors).length === 0
      this.$emit('validate', isValid)
      return isValid
    },

    reset() {
      this.componentsData = {
        components: []
      }
      this.costSummary = {
        usedCost: 0,
        discountPercent: 0
      }
      this.errors = {}
      this.dialogErrors = {}
      this.showAddComponentDialog = false
      this.editingIndex = null
      this.currentComponent = this.getEmptyComponent('gold')
      this.removeImage()
    }
  }
}
</script>

<style lang="scss" scoped>
.product-components-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e7de99;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 1.25rem;
    color: #e7de99;
  }
}

// Product Image Section
.product-image-section {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid #e5e7eb;
}

.image-upload-header {
  margin-bottom: 1rem;

  .image-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #374151;

    i {
      color: #e7de99;
      font-size: 1.125rem;
    }

    .image-info {
      font-size: 0.8125rem;
      font-weight: 400;
      color: #6b7280;
      margin-left: 0.5rem;
    }
  }
}

.image-upload-area {
  position: relative;
}

.image-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  border: 2px solid #e7de99;
  border-radius: 8px;
  background: rgba(231, 222, 153, 0.05);

  i {
    font-size: 3rem;
    color: #e7de99;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    font-weight: 600;
    color: #e7de99;
    margin: 0;
  }
}

.image-upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #e7de99;
    background: rgba(231, 222, 153, 0.02);
  }

  i {
    font-size: 3rem;
    color: #d1d5db;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    margin: 0 0 0.5rem 0;
  }

  small {
    font-size: 0.875rem;
    color: #6b7280;
  }
}

.image-preview-container {
  position: relative;
  display: inline-block;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .product-image-preview {
    max-width: 400px;
    max-height: 400px;
    width: auto;
    height: auto;
    display: block;
    border-radius: 8px;
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover .image-overlay {
    opacity: 1;
  }

  .btn-remove-image {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #dc2626;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
    }

    i {
      font-size: 0.875rem;
    }
  }

  .image-file-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    padding: 0.5rem;
    text-align: center;

    small {
      color: white;
      font-size: 0.75rem;
    }
  }
}

.add-component-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.btn-add-component {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(135deg, #c0ab28 0%, #91801e 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(231, 222, 153, 0.3);
  }

  i {
    font-size: 0.875rem;
  }
}

.components-table-wrapper {
  overflow-x: auto;
}

.components-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;

  thead {
    background: #f9fafb;

    th {
      padding: 0.875rem;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e7de99;
      white-space: nowrap;

      &.action-column {
        width: 100px;
        text-align: center;
      }

      &.no-column {
        width: 60px;
        text-align: center;
      }

      &:nth-child(7) {
        // Cost column - align right
        text-align: right;
      }
    }
  }

  tbody {
    tr.component-row {
      border-bottom: 1px solid #e5e7eb;
      transition: background 0.2s;

      &:hover {
        background: #f9fafb;
      }

      td {
        padding: 1rem 0.875rem;
        color: #1f2937;
        vertical-align: top;

        &.cost-cell {
          color: #059669;
          font-weight: 600;
          text-align: right;
        }

        &.action-column {
          text-align: center;
        }

        &.no-column {
          text-align: center;
          font-weight: 600;
          color: #6b7280;
        }
      }
    }
  }

  tfoot {
    tr.total-row {
      background: #f9fafb;
      border-top: 2px solid #e7de99;

      td {
        padding: 1rem 0.875rem;
        font-weight: 600;

        &.total-label {
          text-align: right;
          color: #374151;
        }

        &.total-cost {
          color: #059669;
          font-size: 1.125rem;
          text-align: right;
        }
      }
    }

    tr.cost-summary-row {
      background: #ffffff;
      border-top: 1px solid #e5e7eb;

      td {
        padding: 0.875rem;
        font-weight: 600;

        &.summary-label {
          text-align: right;
          color: #374151;
        }

        &.summary-input-cell {
          padding: 0.5rem 0.875rem;

          .cost-input {
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 2px solid #d1d5db;
            border-radius: 6px;
            font-size: 0.9375rem;
            font-weight: 600;
            text-align: right;
            transition: all 0.2s;

            &:focus {
              outline: none;
              border-color: #e7de99;
              box-shadow: 0 0 0 3px rgba(231, 222, 153, 0.1);
            }

            &::-webkit-inner-spin-button,
            &::-webkit-outer-spin-button {
              -webkit-appearance: none;
              margin: 0;
            }
          }
        }
      }
    }

    tr.final-cost-row {
      background: #fff5f7;
      border-top: 2px solid #e7de99;

      td {
        padding: 1rem 0.875rem;
        font-weight: 700;

        &.summary-label {
          text-align: right;
          color: #e7de99;
          font-size: 1.0625rem;
        }

        &.final-cost {
          color: #e7de99;
          font-size: 1.25rem;
          text-align: right;
        }
      }
    }
  }
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;

  i {
    font-size: 0.625rem;
  }

  &.type-gold {
    background: rgba(231, 222, 153, 0.1);
    color: #e7de99;
    border: 1px solid rgba(231, 222, 153, 0.3);

    i {
      color: #e7de99;
    }
  }

  &.type-gem {
    background: rgba(147, 51, 234, 0.1);
    color: #9333ea;
    border: 1px solid rgba(147, 51, 234, 0.3);

    i {
      color: #9333ea;
    }
  }

  &.type-labor {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);

    i {
      color: #3b82f6;
    }
  }
}

.details-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-row {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;

  .detail-label {
    font-weight: 600;
    color: #6b7280;
  }
}

.btn-edit-component,
.btn-delete-component {
  padding: 0.375rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  margin: 0 0.25rem;

  i {
    font-size: 0.875rem;
  }
}

.btn-edit-component {
  color: #3b82f6;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
  }
}

.btn-delete-component {
  color: #ef4444;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: #9ca3af;
  text-align: center;

  i {
    font-size: 3rem;
    color: #d1d5db;
    margin-bottom: 1rem;
  }

  p {
    font-size: 0.9375rem;
    color: #6b7280;
    margin: 0;
  }
}

// Dialog Styles
:deep(.component-dialog) {
  .p-dialog-header {
    background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
    color: white;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    padding: 1.25rem 1.5rem;
  }

  .p-dialog-content {
    padding: 1.5rem;
  }

  .p-dialog-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
  }
}

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.type-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.type-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
  color: #6b7280;

  i {
    font-size: 1.5rem;
  }

  &:hover {
    border-color: #e7de99;
    background: rgba(231, 222, 153, 0.05);
  }

  &.active {
    border-color: #e7de99;
    background: rgba(231, 222, 153, 0.1);
    color: #e7de99;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &.form-group-full {
    grid-column: 1 / -1;
  }

  label {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .required {
      color: #ef4444;
      margin-left: 0.25rem;
    }

    .info-badge {
      font-size: 0.75rem;
      font-weight: 500;
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      margin-left: auto;
    }
  }

  small.cost-formula {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: #6b7280;
    font-size: 0.8125rem;
    margin-top: -0.25rem;

    i {
      color: #3b82f6;
      font-size: 0.875rem;
    }
  }

  :deep(.p-select),
  :deep(.p-inputtext),
  :deep(.p-textarea),
  .custom-input {
    width: 100%;
    min-height: 40px;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    transition: all 0.2s;
    padding: 0.625rem 0.875rem;
    font-size: 0.9375rem;

    &:focus,
    &:focus-within {
      outline: none;
      border-color: #e7de99;
      box-shadow: 0 0 0 3px rgba(231, 222, 153, 0.1);
    }

    &.p-invalid,
    &.is-invalid {
      border-color: #ef4444;

      &:focus,
      &:focus-within {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
    }
  }

  :deep(.p-textarea) {
    min-height: auto;
    resize: vertical;
  }

  small.p-error {
    color: #ef4444;
    font-size: 0.875rem;
  }
}

.dialog-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;

  .btn-cancel,
  .btn-submit {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9375rem;

    i {
      font-size: 0.875rem;
    }
  }

  .btn-cancel {
    background: white;
    color: #6b7280;
    border: 2px solid #d1d5db;

    &:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
    }
  }

  .btn-submit {
    background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
    color: white;
    border: none;

    &:hover {
      background: linear-gradient(135deg, #c0ab28 0%, #91801e 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(231, 222, 153, 0.3);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }
}
</style>
