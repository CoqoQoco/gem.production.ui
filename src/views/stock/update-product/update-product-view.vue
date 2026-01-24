<template>
  <div class="update-product-page">
    <!--
      ===================================
      Page Header - เหมือน goods-receipt
      ===================================
    -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <i class="pi pi-pencil header-icon"></i>
          <div class="header-text">
            <h1 class="header-title">แก้ไขข้อมูลสินค้า</h1>
            <p class="header-subtitle">แก้ไขข้อมูลสินค้าทีละรายการ</p>
          </div>
        </div>
      </div>
    </div>

    <!--
      ===================================
      Page Content - เหมือน goods-receipt
      ===================================
    -->
    <div class="page-content">
      <!--
        ===================================
        Section 1: ค้นหาสินค้า (Search Section)
        ===================================
        - ค้นหาด้วย Stock Number
        - เมื่อพบสินค้าจะแสดงฟอร์มแก้ไข
      -->
      <div class="section-card search-section">
        <div class="section-title">
          <i class="pi pi-search"></i>
          <span>ค้นหาสินค้า</span>
        </div>

        <div class="search-content">
          <div class="form-group">
            <label>รหัสสินค้า (Stock Number)</label>
            <div class="stock-number-input-group">
              <InputText
                v-model="stockNumberInput"
                placeholder="ใส่รหัสสินค้าเพื่อค้นหา เช่น ST001"
                :class="{ 'p-invalid': searchError }"
                @input="clearSearchError"
                @keyup.enter="handleSearch"
              />
              <small v-if="searchError" class="p-error">{{
                searchError
              }}</small>
            </div>
          </div>

          <div class="search-actions">
            <button
              class="btn-search"
              @click="handleSearch"
              :disabled="isSearching || !stockNumberInput"
            >
              <i
                :class="isSearching ? 'pi pi-spin pi-spinner' : 'pi pi-search'"
              ></i>
              <span>{{ isSearching ? "กำลังค้นหา..." : "ค้นหา" }}</span>
            </button>
            <button
              class="btn-clear"
              @click="handleClearSearch"
              :disabled="isSearching"
            >
              <i class="pi pi-times"></i>
              <span>ล้างข้อมูล</span>
            </button>
          </div>
        </div>
      </div>

      <!--
        ===================================
        Section 2: ข้อมูลสินค้า (Product Detail) - เหมือน goods-receipt
        ===================================
        แสดงเมื่อค้นหาสำเร็จ (stockData ไม่เป็น null)

        ส่วนที่ READ-ONLY (ไม่สามารถแก้ไขได้):
        - Stock Number (รหัสสินค้า)
        - Product Number (รหัสสินค้า/แม่พิมพ์) - แสดงแบบ readonly
        - PoNumber (เลขที่ใบสั่งซื้อ) - แสดงแบบ readonly
      -->
      <div v-if="stockData" class="product-detail-card">
        <div class="section-title">
          <i class="pi pi-tag"></i>
          <span>ข้อมูลสินค้า</span>
        </div>

        <div class="product-form">
          <!--
            Row 1: Stock Number (READ-ONLY) + Product Number (READ-ONLY)
            - Stock Number: ไม่สามารถแก้ไขได้ (ใช้ระบุสินค้า)
            - Product Number: อ่านได้อย่างเดียว (คล้าย originNumber ใน goods-receipt)
          -->
          <div class="form-group-row">
            <div class="form-group">
              <label>
                รหัสสินค้า (Stock Number)
                <span class="read-only-badge">Read-Only</span>
              </label>
              <input
                type="text"
                :value="stockData.stockNumber"
                class="custom-input"
                readonly
                disabled
              />
              <small class="info-text">
                <i class="pi pi-info-circle"></i>
                ไม่สามารถแก้ไขรหัสสินค้าได้
              </small>
            </div>

            <div class="form-group">
              <label>
                {{ $t("goodsReceipt.form.mold") || "รหัสแม่พิมพ์" }}
                <span class="read-only-badge">Read-Only</span>
              </label>
              <InputText
                type="text"
                v-model="formData.mold"
                class="custom-input"
                readonly
                disabled
              />
            </div>
          </div>

          <!--
            Row 2: Product Name (English + Thai)
            เหมือน goods-receipt ทุกประการ
          -->
          <div class="form-group-row">
            <div class="form-group">
              <label>
                ชื่อสินค้า (English)
                <span class="required">*</span>
              </label>
              <InputText
                v-model="formData.productNameEn"
                placeholder="กรอกชื่อสินค้าภาษาอังกฤษ"
                :class="{ 'p-invalid': errors.productNameEn }"
                @input="clearError('productNameEn')"
              />
              <small v-if="errors.productNameEn" class="p-error">
                {{ errors.productNameEn }}
              </small>
            </div>

            <div class="form-group">
              <label>
                ชื่อสินค้า (ไทย)
                <span class="required">*</span>
              </label>
              <InputText
                v-model="formData.productNameTh"
                placeholder="กรอกชื่อสินค้าภาษาไทย"
                :class="{ 'p-invalid': errors.productNameTh }"
                @input="clearError('productNameTh')"
              />
              <small v-if="errors.productNameTh" class="p-error">
                {{ errors.productNameTh }}
              </small>
            </div>
          </div>

          <!--
            Row 3: Product Type (เหมือน goods-receipt)
            - ใช้ FormDropdown แบบเดียวกัน
            - Default value: ตั้งค่าจาก stockData.productTypeCode
          -->
          <div class="form-group-row">
            <div class="form-group">
              <label>
                ประเภทสินค้า
                <span class="required">*</span>
              </label>
              <FormDropdown
                v-model="formData.productTypeCode"
                :options="productTypes"
                option-label="nameTh"
                option-value="code"
                placeholder="เลือกประเภทสินค้า"
                :invalid="!!errors.productTypeCode"
                :show-clear="false"
                @change="handleProductTypeChange"
              />
              <small v-if="errors.productTypeCode" class="p-error">
                {{ errors.productTypeCode }}
              </small>
            </div>
          </div>

          <!--
            Row 4: Quantity + Unit (เหมือน goods-receipt)
            แบ่งเป็น 4 columns: Qty + Unit
          -->
          <div class="form-group-row-4">
            <div class="form-group">
              <label>
                จำนวน
                <span class="required">*</span>
              </label>
              <input
                type="number"
                v-model.number="formData.qty"
                placeholder="กรอกจำนวน"
                :class="{ 'is-invalid': errors.qty }"
                class="custom-input"
                step="0.01"
                min="0"
                @input="clearError('qty')"
              />
              <small v-if="errors.qty" class="p-error">
                {{ errors.qty }}
              </small>
            </div>

            <div class="form-group">
              <label>
                หน่วยนับ
                <span class="required">*</span>
              </label>
              <InputText
                v-model="formData.qtyUnit"
                placeholder="กรอกหน่วยนับ เช่น ชิ้น, กรัม"
                :class="{ 'p-invalid': errors.qtyUnit }"
                @input="clearError('qtyUnit')"
              />
              <small v-if="errors.qtyUnit" class="p-error">
                {{ errors.qtyUnit }}
              </small>
            </div>
          </div>

          <!--
            Row 5: Location + Remark
          -->
          <!-- <div class="form-group-row">
            <div class="form-group">
              <label>ที่อยู่/ตำแหน่ง</label>
              <InputText
                v-model="formData.location"
                placeholder="กรอกที่อยู่หรือตำแหน่งจัดเก็บ"
              />
            </div>

            <div class="form-group">
              <label>หมายเหตุ</label>
              <InputText
                v-model="formData.remark"
                placeholder="กรอกหมายเหตุ"
              />
            </div>
          </div> -->

          <!--
            Row 6: Size + PoNumber (READ-ONLY)
          -->
          <!-- <div class="form-group-row">
            <div class="form-group">
              <label>ขนาด</label>
              <InputText
                v-model="formData.size"
                placeholder="กรอกขนาดสินค้า"
              />
            </div>

            <div class="form-group">
              <label>
                เลขที่ใบสั่งซื้อ (PO Number)
                <span class="read-only-badge">Read-Only</span>
              </label>
              <input
                type="text"
                :value="stockData.poNumber || '-'"
                class="custom-input"
                readonly
                disabled
              />
            </div>
          </div> -->
        </div>
      </div>

      <!--
        ===================================
        Section 3: ข้อมูลสาขา (Branch Selection) - เหมือน goods-receipt
        ===================================
      -->
      <div v-if="stockData" class="selection-card">
        <div class="section-title">
          <i class="pi pi-building"></i>
          <span>ข้อมูลสาขา</span>
        </div>

        <div class="selection-form">
          <div class="form-group">
            <label>
              สาขา
              <span class="required">*</span>
            </label>
            <FormDropdown
              v-model="formData.branchId"
              :options="branches"
              option-label="nameTh"
              option-value="branchId"
              placeholder="เลือกสาขา"
              :invalid="!!errors.branchId"
              :show-clear="false"
              @change="handleBranchChange"
            />
            <small v-if="errors.branchId" class="p-error">
              {{ errors.branchId }}
            </small>
          </div>
        </div>
      </div>

      <!--
        ===================================
        Section 4: ส่วนประกอบสินค้า (Product Components) - เหมือน goods-receipt
        ===================================
        - Components Table: ตารางส่วนประกอบเหมือน goods-receipt
        - Cost Summary: สรุปต้นทุนเหมือน goods-receipt
        - Material Dialog: Dialog เพิ่ม/แก้ไขส่วนประกอบ
      -->
      <div v-if="stockData" class="product-components-card">
        <div class="section-title">
          <i class="pi pi-th-large"></i>
          <span>ส่วนประกอบสินค้า</span>
        </div>

        <!-- Product Image Section (เหมือน goods-receipt) -->
        <div class="product-image-section">
          <div class="image-upload-header">
            <label class="image-label">
              <i class="pi pi-image"></i>
              <span>รูปภาพสินค้า</span>
              <span class="image-info">(รูปภาพจาก Azure Blob Storage)</span>
            </label>
          </div>

          <div class="image-display-area">
            <!-- Image Preview - Read Only -->
            <div v-if="productImageUrl" class="image-preview-container">
              <img
                :src="productImageUrl"
                alt="Product Image"
                class="product-image-preview"
              />
              <div class="image-file-info">
                <small>{{ stockData.stockNumber }}.jpg</small>
              </div>
            </div>

            <!-- No Image Placeholder -->
            <div v-else class="no-image-box">
              <i class="pi pi-image"></i>
              <p>ไม่มีรูปภาพสินค้า</p>
            </div>
          </div>
        </div>

        <!-- Add Component Button (เหมือน goods-receipt) -->
        <div class="add-component-header">
          <button
            class="btn-add-component"
            @click="showAddMaterialDialog = true"
          >
            <i class="pi pi-plus"></i>
            <span>เพิ่มส่วนประกอบ</span>
          </button>
        </div>

        <!-- Components Table (เหมือน goods-receipt) -->
        <div class="components-table-wrapper">
          <table
            class="components-table"
            v-if="formData.materials && formData.materials.length > 0"
          >
            <colgroup>
              <col style="width: 60px" />
              <!-- ลำดับ -->
              <col style="width: 140px" />
              <!-- ประเภท -->
              <col style="width: 150px" />
              <!-- รายการ -->
              <col style="width: auto" />
              <!-- รายละเอียด -->
              <col style="width: 100px" />
              <!-- น้ำหนัก -->
              <col style="width: 100px" />
              <!-- จำนวน -->
              <col style="width: 120px" />
              <!-- ต้นทุน -->
              <col style="width: 100px" />
              <!-- Actions -->
            </colgroup>
            <thead>
              <tr>
                <th class="no-column">ลำดับ</th>
                <th>ประเภท</th>
                <th>รายการ</th>
                <th>รายละเอียด</th>
                <th>น้ำหนัก</th>
                <th>จำนวน</th>
                <th>ต้นทุน (บาท)</th>
                <th class="action-column"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(material, index) in formData.materials"
                :key="`material-${index}`"
                class="component-row"
              >
                <!-- No. -->
                <td class="no-column">{{ index + 1 }}</td>

                <!-- Type Badge -->
                <td>
                  <span :class="['type-badge', `type-${material.type}`]">
                    <i :class="getMaterialTypeIcon(material.type)"></i>
                    {{ getMaterialTypeName(material.type) }}
                  </span>
                </td>

                <!-- Item Name (ใช้ typeNameTh แทน itemNameTh) -->
                <td>
                  <strong>{{ material.typeNameTh || "-" }}</strong>
                </td>

                <!-- Details Column -->
                <td>
                  <div class="details-cell">
                    <!-- Gold Details -->
                    <template v-if="material.type === 'gold'">
                      <div class="detail-row">
                        <span class="detail-label">รูปร่าง:</span>
                        <span>{{ material.typeNameTh2 || "-" }}</span>
                      </div>
                      <div
                        class="detail-row"
                        v-if="
                          material.wastePercent !== null &&
                          material.wastePercent !== undefined
                        "
                      >
                        <span class="detail-label">%waste:</span>
                        <span>{{ material.wastePercent }}%</span>
                      </div>
                      <div class="detail-row" v-if="material.labelWeight">
                        <span class="detail-label">น้ำหนักป้าย:</span>
                        <span
                          >{{ material.labelWeight }}
                          {{ material.weightUnit || "" }}</span
                        >
                      </div>
                    </template>

                    <!-- Gem Details -->
                    <template v-if="material.type === 'gem'">
                      <div class="detail-row">
                        <span class="detail-label">รูปร่าง:</span>
                        <span>{{ material.typeNameTh2 || "-" }}</span>
                      </div>
                      <div class="detail-row" v-if="material.size">
                        <span class="detail-label">ขนาด:</span>
                        <span>{{ material.size }}</span>
                      </div>
                      <div class="detail-row" v-if="material.region">
                        <span class="detail-label">แหล่งที่มา:</span>
                        <span>{{ material.region }}</span>
                      </div>
                    </template>

                    <!-- Labor Details -->
                    <template v-if="material.type === 'labor'">
                      <div class="detail-row" v-if="material.description">
                        <span class="detail-label">รายละเอียด:</span>
                        <span>{{ material.description }}</span>
                      </div>
                    </template>
                  </div>
                </td>

                <!-- Weight -->
                <td>
                  <template v-if="material.type !== 'labor'">
                    {{
                      material.weight
                        ? `${material.weight} ${material.weightUnit}`
                        : "-"
                    }}
                  </template>
                  <template v-else>-</template>
                </td>

                <!-- Quantity -->
                <td>
                  <template v-if="material.type !== 'labor'">
                    {{
                      material.qty ? `${material.qty} ${material.qtyUnit}` : "-"
                    }}
                  </template>
                  <template v-else>-</template>
                </td>

                <!-- Cost -->
                <td class="cost-cell">
                  <strong>{{ formatCurrency(material.cost) }}</strong>
                </td>

                <!-- Actions -->
                <td class="action-column">
                  <button
                    class="btn-edit-component"
                    @click="editMaterial(index)"
                    title="แก้ไข"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button
                    class="btn-delete-component"
                    @click="removeMaterial(index)"
                    title="ลบ"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="6" class="total-label">
                  <strong>ราคาต้นทุนจริง</strong>
                </td>
                <td class="total-cost">
                  <strong>{{ formatCurrency(totalCost) }}</strong>
                </td>
                <td></td>
              </tr>
              <tr class="cost-summary-row">
                <td colspan="6" class="summary-label">
                  <strong>ราคาต้นทุนที่ใช้</strong>
                </td>
                <td class="summary-input-cell">
                  <input
                    type="number"
                    v-model.number="formData.productCostUesd"
                    class="cost-input"
                    step="0.01"
                    min="0"
                  />
                </td>
                <td></td>
              </tr>
              <tr class="cost-summary-row">
                <td colspan="6" class="summary-label">
                  <strong>ส่วนลด (%)</strong>
                </td>
                <td class="summary-input-cell">
                  <input
                    type="number"
                    v-model.number="formData.productDiscount"
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
                  <strong>ราคาสุดท้าย</strong>
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
            <p>ยังไม่มีส่วนประกอบ คลิกปุ่มเพิ่มส่วนประกอบด้านบน</p>
          </div>
        </div>
      </div>

      <!--
        ===================================
        Action Buttons - เหมือน goods-receipt
        ===================================
      -->
      <div v-if="stockData" class="action-buttons">
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          class="p-button-secondary btn-clear"
          @click="handleCancel"
          :disabled="isSubmitting"
        />
        <Button
          label="บันทึก"
          icon="pi pi-check"
          class="p-button-success btn-submit"
          @click="showConfirmModal = true"
          :disabled="!hasChanges || isSubmitting"
        />
      </div>

      <!-- Empty State -->
      <div v-else-if="!isSearching" class="empty-state-main">
        <i class="pi pi-inbox"></i>
        <p>กรุณาค้นหาสินค้าด้วยรหัสสินค้า</p>
      </div>
    </div>

    <!--
      ===================================
      Material Dialog - เหมือน goods-receipt
      ===================================
    -->
    <Dialog
      v-model:visible="showAddMaterialDialog"
      :header="
        editingMaterialIndex !== null ? 'แก้ไขส่วนประกอบ' : 'เพิ่มส่วนประกอบ'
      "
      :modal="true"
      :style="{ width: '800px' }"
      class="component-dialog"
    >
      <div class="dialog-content">
        <!-- Component Type Selection -->
        <div class="form-group">
          <label>
            ประเภทส่วนประกอบ
            <span class="required">*</span>
          </label>
          <div class="type-selector">
            <button
              v-for="type in materialTypes"
              :key="type.value"
              :class="[
                'type-option',
                { active: currentMaterial.type === type.value },
              ]"
              @click="selectMaterialType(type.value)"
              type="button"
            >
              <i :class="type.icon"></i>
              <span>{{ type.label }}</span>
            </button>
          </div>
        </div>

        <!-- Gold Material Form -->
        <template v-if="currentMaterial.type === 'gold'">
          <div class="form-grid">
            <div class="form-group form-group-full">
              <label>ชื่อทอง <span class="required">*</span></label>
              <InputText
                v-model="currentMaterial.typeNameTh"
                placeholder="กรอกชื่อทอง"
                :class="{ 'p-invalid': !!materialErrors.typeNameTh }"
              />
              <small v-if="materialErrors.typeNameTh" class="p-error">{{
                materialErrors.typeNameTh
              }}</small>
            </div>

            <div class="form-group">
              <label>น้ำหนัก <span class="required">*</span></label>
              <input
                type="number"
                v-model.number="currentMaterial.weight"
                placeholder="กรอกน้ำหนัก"
                :class="{ 'is-invalid': !!materialErrors.weight }"
                class="custom-input"
                step="0.01"
                min="0"
                @input="calculateMaterialCost"
              />
              <small v-if="materialErrors.weight" class="p-error">{{
                materialErrors.weight
              }}</small>
            </div>

            <div class="form-group">
              <label>หน่วยน้ำหนัก <span class="required">*</span></label>
              <InputText
                v-model="currentMaterial.weightUnit"
                placeholder="เช่น g, kg"
                :class="{ 'p-invalid': !!materialErrors.weightUnit }"
              />
              <small v-if="materialErrors.weightUnit" class="p-error">{{
                materialErrors.weightUnit
              }}</small>
            </div>

            <div class="form-group">
              <label>%waste <span class="required">*</span></label>
              <input
                type="number"
                v-model.number="currentMaterial.wastePercent"
                placeholder="กรอก %waste"
                :class="{ 'is-invalid': !!materialErrors.wastePercent }"
                class="custom-input"
                step="0.01"
                min="0"
                max="100"
                @input="calculateMaterialCost"
              />
              <small v-if="materialErrors.wastePercent" class="p-error">{{
                materialErrors.wastePercent
              }}</small>
            </div>

            <div class="form-group">
              <label>ราคา (บาท/กรัม) <span class="required">*</span></label>
              <input
                type="number"
                v-model.number="currentMaterial.price"
                placeholder="กรอกราคา"
                :class="{ 'is-invalid': !!materialErrors.price }"
                class="custom-input"
                step="0.01"
                min="0"
                @input="calculateMaterialCost"
              />
              <small v-if="materialErrors.price" class="p-error">{{
                materialErrors.price
              }}</small>
            </div>

            <div class="form-group form-group-full">
              <label>
                ต้นทุน (บาท)
                <span class="info-badge">คำนวณอัตโนมัติ</span>
              </label>
              <input
                type="number"
                v-model.number="currentMaterial.cost"
                placeholder="คำนวณอัตโนมัติจากสูตร"
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

        <!-- Gem Material Form -->
        <template v-if="currentMaterial.type === 'gem'">
          <div class="form-grid">
            <div class="form-group form-group-full">
              <label>ชื่อเพชร/พลอย <span class="required">*</span></label>
              <InputText
                v-model="currentMaterial.typeNameTh"
                placeholder="กรอกชื่อเพชร/พลอย"
                :class="{ 'p-invalid': !!materialErrors.typeNameTh }"
              />
              <small v-if="materialErrors.typeNameTh" class="p-error">{{
                materialErrors.typeNameTh
              }}</small>
            </div>

            <div class="form-group">
              <label>น้ำหนัก <span class="required">*</span></label>
              <input
                type="number"
                v-model.number="currentMaterial.weight"
                placeholder="กรอกน้ำหนัก"
                :class="{ 'is-invalid': !!materialErrors.weight }"
                class="custom-input"
                step="0.01"
                min="0"
                @input="calculateMaterialCost"
              />
              <small v-if="materialErrors.weight" class="p-error">{{
                materialErrors.weight
              }}</small>
            </div>

            <div class="form-group">
              <label>หน่วยน้ำหนัก <span class="required">*</span></label>
              <InputText
                v-model="currentMaterial.weightUnit"
                placeholder="เช่น g, ct"
                :class="{ 'p-invalid': !!materialErrors.weightUnit }"
              />
              <small v-if="materialErrors.weightUnit" class="p-error">{{
                materialErrors.weightUnit
              }}</small>
            </div>

            <div class="form-group">
              <label>ราคา (บาท/กรัม) <span class="required">*</span></label>
              <input
                type="number"
                v-model.number="currentMaterial.price"
                placeholder="กรอกราคา"
                :class="{ 'is-invalid': !!materialErrors.price }"
                class="custom-input"
                step="0.01"
                min="0"
                @input="calculateMaterialCost"
              />
              <small v-if="materialErrors.price" class="p-error">{{
                materialErrors.price
              }}</small>
            </div>

            <div class="form-group form-group-full">
              <label>
                ต้นทุน (บาท)
                <span class="info-badge">คำนวณอัตโนมัติ</span>
              </label>
              <input
                type="number"
                v-model.number="currentMaterial.cost"
                placeholder="คำนวณอัตโนมัติจากสูตร"
                class="custom-input"
                step="0.01"
                min="0"
                readonly
                disabled
              />
              <small class="cost-formula">
                <i class="pi pi-info-circle"></i>
                สูตร: น้ำหนัก × ราคาพลอย
              </small>
            </div>
          </div>
        </template>

        <!-- Labor Material Form -->
        <template v-if="currentMaterial.type === 'labor'">
          <div class="form-grid">
            <div class="form-group form-group-full">
              <label>หัวข้อ <span class="required">*</span></label>
              <InputText
                v-model="currentMaterial.typeNameTh"
                placeholder="กรอกหัวข้อ เช่น ค่าแรงช่าง, ค่าขนส่ง"
                :class="{ 'p-invalid': !!materialErrors.typeNameTh }"
              />
              <small v-if="materialErrors.typeNameTh" class="p-error">{{
                materialErrors.typeNameTh
              }}</small>
            </div>

            <div class="form-group form-group-full">
              <label>รายละเอียด</label>
              <Textarea
                v-model="currentMaterial.description"
                rows="3"
                placeholder="กรอกรายละเอียด (ถ้ามี)"
              />
            </div>

            <div class="form-group form-group-full">
              <label>ต้นทุน (บาท) <span class="required">*</span></label>
              <input
                type="number"
                v-model.number="currentMaterial.cost"
                placeholder="กรอกต้นทุน"
                :class="{ 'is-invalid': !!materialErrors.cost }"
                class="custom-input"
                step="0.01"
                min="0"
              />
              <small v-if="materialErrors.cost" class="p-error">{{
                materialErrors.cost
              }}</small>
            </div>
          </div>
        </template>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <button
            class="btn-cancel"
            @click="cancelMaterialDialog"
            type="button"
          >
            <i class="pi pi-times"></i>
            <span>ยกเลิก</span>
          </button>
          <button class="btn-submit" @click="saveMaterial" type="button">
            <i class="pi pi-check"></i>
            <span>{{
              editingMaterialIndex !== null ? "บันทึก" : "เพิ่ม"
            }}</span>
          </button>
        </div>
      </template>
    </Dialog>

    <!--
      ===================================
      Confirm Modal - เหมือน goods-receipt
      ===================================
    -->
    <Dialog
      v-model:visible="showConfirmModal"
      header="ยืนยันการบันทึกการเปลี่ยนแปลง"
      :style="{ width: '600px' }"
      class="confirm-dialog"
    >
      <div class="confirm-content">
        <div class="confirm-icon">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <div class="confirm-message">
          <p>
            คุณต้องการบันทึกการเปลี่ยนแปลงข้อมูลสินค้า
            <strong>{{ stockData?.stockNumber }}</strong> ใช่หรือไม่?
          </p>
          <div class="confirm-summary">
            <div class="summary-item">
              <span>จำนวนฟิลด์ที่เปลี่ยนแปลง:</span>
              <strong>{{ changedFields.length }} ฟิลด์</strong>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <button
          class="btn-cancel"
          @click="showConfirmModal = false"
          :disabled="isSubmitting"
        >
          <i class="pi pi-times"></i>
          <span>ยกเลิก</span>
        </button>
        <button
          class="btn-submit"
          @click="handleSubmit"
          :disabled="isSubmitting"
        >
          <i
            :class="isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
          ></i>
          <span>{{ isSubmitting ? "กำลังบันทึก..." : "ยืนยันการบันทึก" }}</span>
        </button>
      </template>
    </Dialog>

    <Toast />
  </div>
</template>

<script>
import { useStockApiStore } from "@/stores/api/stock-api";
import { useProductTypeApiStore } from "@/stores/api/product-type-api";
import { useBranchApiStore } from "@/stores/api/branch-api";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Toast from "primevue/toast";
import FormDropdown from "@/components/common/form-dropdown.vue";

export default {
  name: "UpdateProductView",

  components: {
    Dialog,
    InputText,
    Textarea,
    Button,
    Toast,
    FormDropdown,
  },

  data() {
    return {
      stockApiStore: useStockApiStore(),
      productTypeApiStore: useProductTypeApiStore(),
      branchApiStore: useBranchApiStore(),
      toast: useToast(),
      stockNumberInput: "",
      stockData: null,
      formData: this.getEmptyFormData(),
      originalFormData: null,
      isSearching: false,
      isSubmitting: false,
      searchError: "",
      errors: {},
      showConfirmModal: false,
      showAddMaterialDialog: false,
      editingMaterialIndex: null,
      currentMaterial: this.getEmptyMaterial("gold"),
      materialErrors: {},
      materialTypes: [
        { value: "gold", label: "ทอง", icon: "pi pi-circle-fill" },
        { value: "gem", label: "เพชร/พลอย", icon: "pi pi-circle-fill" },
        { value: "labor", label: "ค่าแรง/ต้นทุนอื่นๆ", icon: "pi pi-wrench" },
      ],
      productTypes: [],
      branches: [],
      azureBlobBaseUrl:
        import.meta.env.VITE_AZURE_BLOB_URL ||
        "https://gemproduction.blob.core.windows.net/image-gem/",
      placeholderImage:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=",
    };
  },

  async mounted() {
    await this.loadProductTypes();
    await this.loadBranches();
  },

  computed: {
    productImageUrl() {
      if (!this.stockData || !this.stockData.stockNumber) return null;
      return `${this.azureBlobBaseUrl}${this.stockData.stockNumber}.jpg`;
    },

    totalCost() {
      if (!this.formData.materials || !Array.isArray(this.formData.materials)) {
        return 0;
      }
      return this.formData.materials.reduce((sum, material) => {
        return sum + (parseFloat(material.cost) || 0);
      }, 0);
    },

    finalCost() {
      const usedCost = parseFloat(this.formData.productCostUesd) || 0;
      const discountPercent = parseFloat(this.formData.productDiscount) || 0;
      const discountAmount = usedCost * (discountPercent / 100);
      return usedCost - discountAmount;
    },

    hasChanges() {
      if (!this.originalFormData) return false;

      const fieldsChanged = Object.keys(this.formData).some((key) => {
        if (key === "materials") return false;

        const newValue = this.formData[key];
        const oldValue = this.originalFormData[key];

        const normalizedNew =
          newValue === null || newValue === undefined || newValue === ""
            ? null
            : newValue;
        const normalizedOld =
          oldValue === null || oldValue === undefined || oldValue === ""
            ? null
            : oldValue;

        return normalizedNew !== normalizedOld;
      });

      const materialsChanged =
        JSON.stringify(this.formData.materials) !==
        JSON.stringify(this.originalFormData.materials);

      return fieldsChanged || materialsChanged;
    },

    changedFields() {
      if (!this.originalFormData) return [];

      const changes = [];
      const fieldLabels = {
        productNameTh: "ชื่อสินค้า (ไทย)",
        productNameEn: "ชื่อสินค้า (อังกฤษ)",
        location: "ที่อยู่/ตำแหน่ง",
        productTypeCode: "รหัสประเภทสินค้า",
        remark: "หมายเหตุ",
        branchId: "สาขา",
        productCostUesd: "ต้นทุนที่ใช้",
        productDiscount: "ส่วนลด (%)",
      };

      Object.keys(this.formData).forEach((key) => {
        const newValue = this.formData[key];
        const oldValue = this.originalFormData[key];

        const normalizedNew =
          newValue === null || newValue === undefined || newValue === ""
            ? null
            : newValue;
        const normalizedOld =
          oldValue === null || oldValue === undefined || oldValue === ""
            ? null
            : oldValue;

        if (normalizedNew !== normalizedOld) {
          changes.push({
            field: key,
            label: fieldLabels[key] || key,
            oldValue: normalizedOld,
            newValue: normalizedNew,
          });
        }
      });

      return changes;
    },
  },

  methods: {
    getEmptyFormData() {
      return {
        productNameTh: null,
        productNameEn: null,
        location: null,
        productTypeCode: null,
        productTypeNameTh: null,
        productTypeNameEn: null,
        remark: null,
        branchId: null,
        branchNameTh: null,
        branchNameEn: null,
        productNumber: null,
        size: null,
        qty: null,
        qtyUnit: null,
        productCostActual: null,
        productCostUesd: null,
        productDiscount: null,
        materials: [],
      };
    },

    getEmptyMaterial(type = "gold") {
      const baseMaterial = {
        type: type,
        cost: null,
        price: null,
      };

      if (type === "gold") {
        return {
          ...baseMaterial,
          typeNameTh: "",
          weight: null,
          weightUnit: "g",
          wastePercent: null,
        };
      } else if (type === "gem") {
        return {
          ...baseMaterial,
          typeNameTh: "",
          weight: null,
          weightUnit: "g",
        };
      } else if (type === "labor") {
        return {
          ...baseMaterial,
          typeNameTh: "",
          description: "",
        };
      }
    },

    async loadProductTypes() {
      try {
        const result = await this.productTypeApiStore.listProductTypes({
          pageIndex: 0,
          pageSize: 1000,
          criteria: { searchText: null },
        });
        if (result.success) {
          this.productTypes = result.data;
        }
      } catch (error) {
        console.error("Error loading product types:", error);
      }
    },

    async loadBranches() {
      try {
        const result = await this.branchApiStore.listBranches({
          pageIndex: 0,
          pageSize: 1000,
          criteria: { searchText: null },
        });
        if (result.success) {
          this.branches = result.data;
        }
      } catch (error) {
        console.error("Error loading branches:", error);
      }
    },

    handleProductTypeChange(event) {
      const selectedProductType = this.productTypes.find(
        (pt) => pt.code === event.value,
      );
      if (selectedProductType) {
        this.formData.productTypeCode = selectedProductType.code;
        this.formData.productTypeNameTh = selectedProductType.nameTh;
        this.formData.productTypeNameEn = selectedProductType.nameEn;
      }
      this.clearError("productTypeCode");
    },

    handleBranchChange(event) {
      const selectedBranch = this.branches.find(
        (b) => b.branchId === event.value,
      );
      if (selectedBranch) {
        this.formData.branchId = selectedBranch.branchId;
        this.formData.branchNameTh = selectedBranch.nameTh;
        this.formData.branchNameEn = selectedBranch.nameEn;
      }
      this.clearError("branchId");
    },

    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field];
      }
    },

    clearSearchError() {
      this.searchError = "";
    },

    async handleSearch() {
      this.searchError = "";
      const stockNumber = this.stockNumberInput.trim();

      if (!stockNumber) {
        this.searchError = "กรุณาใส่รหัสสินค้า";
        return;
      }

      this.isSearching = true;
      this.stockData = null;
      this.formData = this.getEmptyFormData();
      this.originalFormData = null;

      try {
        const response = await this.stockApiStore.getStockInventory({
          stockNumber,
        });

        console.log("Search response:", response);

        if (response.success && response.data) {
          this.stockData = response.data;

          this.formData = {
            productNameTh: response.data.productNameTh || null,
            productNameEn: response.data.productNameEn || null,
            mold: response.data.mold || null,

            location: response.data.location || null,

            productTypeCode: response.data.productTypeCode || null,
            productTypeNameTh: response.data.productTypeNameTh || null,
            productTypeNameEn: response.data.productTypeNameEn || null,

            remark: response.data.remark || null,
            branchId: response.data.branchId || null,
            branchNameTh: response.data.branchNameTh || null,
            branchNameEn: response.data.branchNameEn || null,
            productNumber: response.data.productNumber || null,
            size: response.data.size || null,
            qty: response.data.qty || null,
            qtyUnit: response.data.qtyUnit || null,
            productCostActual: response.data.costSummary?.actualCost || null,
            productCostUesd: response.data.costSummary?.usedCost || null,
            productDiscount: response.data.costSummary?.discountPercent || null,
            materials: response.data.materials
              ? JSON.parse(JSON.stringify(response.data.materials))
              : [],
          };

          console.log("Initialized formData:", this.formData);

          this.originalFormData = JSON.parse(JSON.stringify(this.formData));

          this.toast.add({
            severity: "success",
            summary: "ค้นหาสำเร็จ",
            detail: `พบสินค้า: ${stockNumber}`,
            life: 3000,
          });
        } else {
          this.searchError = `ไม่พบสินค้ารหัส: ${stockNumber}`;
          this.toast.add({
            severity: "warn",
            summary: "ไม่พบข้อมูล",
            detail: `ไม่พบสินค้ารหัส: ${stockNumber}`,
            life: 3000,
          });
        }
      } catch (error) {
        console.error("Error searching stock:", error);
        this.searchError = "เกิดข้อผิดพลาดในการค้นหา";
        this.toast.add({
          severity: "error",
          summary: "เกิดข้อผิดพลาด",
          detail: "ไม่สามารถค้นหาสินค้าได้",
          life: 5000,
        });
      } finally {
        this.isSearching = false;
      }
    },

    handleClearSearch() {
      this.stockNumberInput = "";
      this.stockData = null;
      this.formData = this.getEmptyFormData();
      this.originalFormData = null;
      this.searchError = "";
      this.errors = {};
      this.showConfirmModal = false;
    },

    handleCancel() {
      if (this.hasChanges) {
        if (
          confirm(
            "มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก คุณต้องการยกเลิกใช่หรือไม่?",
          )
        ) {
          this.handleClearSearch();
        }
      } else {
        this.handleClearSearch();
      }
    },

    async handleSubmit() {
      if (!this.stockData || !this.hasChanges) {
        return;
      }

      this.isSubmitting = true;

      try {
        const editStock = {
          stockNumber: this.stockData.stockNumber,
        };

        Object.keys(this.formData).forEach((key) => {
          if (key === "materials") {
            const materialsChanged =
              JSON.stringify(this.formData.materials) !==
              JSON.stringify(this.originalFormData.materials);
            if (materialsChanged) {
              editStock.materials = this.formData.materials.map((m) => ({
                id: m.id || null,
                type: m.type,
                typeCode: m.typeCode || null,
                typeNameTh: m.typeNameTh || null,
                typeNameEn: m.typeNameEn || null,
                typeCode2: m.typeCode2 || null,
                typeNameTh2: m.typeNameTh2 || null,
                typeNameEn2: m.typeNameEn2 || null,
                size: m.size || null,
                price: m.price || null,
                weight: m.weight || null,
                weightUnit: m.weightUnit || null,
                qty: m.qty || null,
                qtyUnit: m.qtyUnit || null,
                region: m.region || null,
                description: m.description || null,
                cost: m.cost || null,
                wastePercent: m.wastePercent || null,
                labelWeight: m.labelWeight || null,
              }));
            }
            return;
          }

          const newValue = this.formData[key];
          const oldValue = this.originalFormData[key];

          const normalizedNew =
            newValue === null || newValue === undefined || newValue === ""
              ? null
              : newValue;
          const normalizedOld =
            oldValue === null || oldValue === undefined || oldValue === ""
              ? null
              : oldValue;

          if (normalizedNew !== normalizedOld) {
            editStock[key] = normalizedNew;
          }
        });

        console.log("Submitting edit stock:", editStock);

        const response = await this.stockApiStore.editStockInventory({
          stocks: [editStock],
        });

        if (response.success) {
          this.toast.add({
            severity: "success",
            summary: "บันทึกสำเร็จ",
            detail: `อัปเดตข้อมูลสินค้า ${this.stockData.stockNumber} สำเร็จ`,
            life: 5000,
          });

          this.handleClearSearch();
          this.showConfirmModal = false;
        } else {
          throw new Error(response.message || "Failed to update stock");
        }
      } catch (error) {
        console.error("Error submitting update:", error);
        this.toast.add({
          severity: "error",
          summary: "เกิดข้อผิดพลาด",
          detail: "ไม่สามารถบันทึกการเปลี่ยนแปลงได้",
          life: 5000,
        });
      } finally {
        this.isSubmitting = false;
      }
    },

    getMaterialTypeName(type) {
      const types = {
        gold: "ทอง",
        gem: "พลอย",
        labor: "ค่าแรง",
      };
      return types[type] || type;
    },

    getMaterialTypeIcon(type) {
      const icons = {
        gold: "pi pi-circle-fill",
        gem: "pi pi-circle-fill",
        labor: "pi pi-wrench",
      };
      return icons[type] || "pi pi-circle";
    },

    formatCurrency(value) {
      if (!value && value !== 0) return "฿0.00";
      return `฿${parseFloat(value).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    selectMaterialType(type) {
      this.currentMaterial = this.getEmptyMaterial(type);
      this.materialErrors = {};
    },

    editMaterial(index) {
      this.editingMaterialIndex = index;
      this.currentMaterial = JSON.parse(
        JSON.stringify(this.formData.materials[index]),
      );
      this.showAddMaterialDialog = true;
      this.materialErrors = {};
    },

    removeMaterial(index) {
      if (confirm("คุณต้องการลบส่วนประกอบนี้ใช่หรือไม่?")) {
        this.formData.materials.splice(index, 1);
      }
    },

    validateCurrentMaterial() {
      this.materialErrors = {};
      const mat = this.currentMaterial;

      if (mat.type === "gold") {
        if (!mat.typeNameTh || !mat.typeNameTh.trim()) {
          this.materialErrors.typeNameTh = "กรุณากรอกชื่อทอง";
        }
        if (!mat.weight || mat.weight <= 0) {
          this.materialErrors.weight = "กรุณากรอกน้ำหนัก";
        }
        if (!mat.weightUnit || !mat.weightUnit.trim()) {
          this.materialErrors.weightUnit = "กรุณากรอกหน่วยน้ำหนัก";
        }
        if (
          mat.wastePercent === null ||
          mat.wastePercent === undefined ||
          mat.wastePercent < 0
        ) {
          this.materialErrors.wastePercent = "กรุณากรอก %waste";
        }
        if (!mat.price || mat.price <= 0) {
          this.materialErrors.price = "กรุณากรอกราคา";
        }
      } else if (mat.type === "gem") {
        if (!mat.typeNameTh || !mat.typeNameTh.trim()) {
          this.materialErrors.typeNameTh = "กรุณากรอกชื่อเพชร/พลอย";
        }
        if (!mat.weight || mat.weight <= 0) {
          this.materialErrors.weight = "กรุณากรอกน้ำหนัก";
        }
        if (!mat.weightUnit || !mat.weightUnit.trim()) {
          this.materialErrors.weightUnit = "กรุณากรอกหน่วยน้ำหนัก";
        }
        if (!mat.price || mat.price <= 0) {
          this.materialErrors.price = "กรุณากรอกราคา";
        }
      } else if (mat.type === "labor") {
        if (!mat.typeNameTh || !mat.typeNameTh.trim()) {
          this.materialErrors.typeNameTh = "กรุณากรอกหัวข้อ";
        }
        if (!mat.cost || mat.cost <= 0) {
          this.materialErrors.cost = "กรุณากรอกต้นทุน";
        }
      }

      return Object.keys(this.materialErrors).length === 0;
    },

    saveMaterial() {
      if (!this.validateCurrentMaterial()) {
        return;
      }

      if (this.editingMaterialIndex !== null) {
        this.formData.materials[this.editingMaterialIndex] = JSON.parse(
          JSON.stringify(this.currentMaterial),
        );
      } else {
        this.formData.materials.push(
          JSON.parse(JSON.stringify(this.currentMaterial)),
        );
      }

      this.cancelMaterialDialog();
    },

    cancelMaterialDialog() {
      this.showAddMaterialDialog = false;
      this.editingMaterialIndex = null;
      this.currentMaterial = this.getEmptyMaterial("gold");
      this.materialErrors = {};
    },

    calculateMaterialCost() {
      const mat = this.currentMaterial;

      if (mat.type === "gold") {
        const weight = parseFloat(mat.weight) || 0;
        const wastePercent = parseFloat(mat.wastePercent) || 0;
        const price = parseFloat(mat.price) || 0;

        if (weight > 0 && price > 0) {
          const totalWeight = weight + weight * (wastePercent / 100);
          mat.cost = Math.round(totalWeight * price * 100) / 100;
        } else {
          mat.cost = 0;
        }
      } else if (mat.type === "gem") {
        const weight = parseFloat(mat.weight) || 0;
        const price = parseFloat(mat.price) || 0;

        if (weight > 0 && price > 0) {
          mat.cost = Math.round(weight * price * 100) / 100;
        } else {
          mat.cost = 0;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* ===================================
   Import goods-receipt styles
   =================================== */
@import "@/assets/styles/components/list-page-templete/index-view.scss";

.update-product-page {
  min-height: 100vh;
  background: #f3f4f6;
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
}

/* ===================================
   Page Header - เหมือน goods-receipt
   =================================== */
.page-header {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 2.5rem;
  color: #e7de99;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    rgba(231, 222, 153, 0.1) 0%,
    rgba(255, 20, 147, 0.1) 100%
  );
  border-radius: 12px;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.header-subtitle {
  font-size: 0.9375rem;
  color: #6b7280;
  margin: 0;
}

/* ===================================
   Page Content
   =================================== */
.page-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* ===================================
   Section Card - เหมือน goods-receipt
   =================================== */
.section-card,
.product-detail-card,
.selection-card,
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

/* ===================================
   Search Section
   =================================== */
.search-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.stock-number-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;

  button {
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

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .btn-search {
    background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
    color: white;
    border: none;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #c0ab28 0%, #91801e 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 6px rgba(231, 222, 153, 0.3);
    }
  }

  .btn-clear {
    background: white;
    color: #6b7280;
    border: 2px solid #d1d5db;

    &:hover:not(:disabled) {
      background: #f3f4f6;
      border-color: #9ca3af;
    }
  }
}

/* ===================================
   Product Form - เหมือน goods-receipt
   =================================== */
.product-form,
.selection-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-group-row-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #374151;

    .required {
      color: #ef4444;
      margin-left: 0.25rem;
    }

    .read-only-badge {
      font-size: 0.75rem;
      font-weight: 500;
      color: #6b7280;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      margin-left: 0.5rem;
    }
  }

  :deep(.p-inputtext),
  .custom-input {
    width: 100%;
    height: 40px;
    padding: 0.625rem 0.875rem;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.9375rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #e7de99;
      box-shadow: 0 0 0 3px rgba(231, 222, 153, 0.1);
    }

    &.p-invalid,
    &.is-invalid {
      border-color: #ef4444;

      &:focus {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
    }

    &:disabled {
      background: #f3f4f6;
      cursor: not-allowed;
      color: #6b7280;
    }
  }

  small.p-error {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: -0.25rem;
  }

  small.info-text {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: #6b7280;
    font-size: 0.8125rem;

    i {
      color: #3b82f6;
      font-size: 0.875rem;
    }
  }
}

/* ===================================
   Product Image Section
   =================================== */
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

.image-display-area {
  position: relative;
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

.no-image-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: white;

  i {
    font-size: 3rem;
    color: #d1d5db;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    font-weight: 600;
    color: #6b7280;
    margin: 0;
  }
}

/* ===================================
   Components Table - เหมือน goods-receipt
   =================================== */
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

.empty-state-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: #9ca3af;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  i {
    font-size: 4rem;
    color: #d1d5db;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    color: #6b7280;
    margin: 0;
  }
}

/* ===================================
   Action Buttons - เหมือน goods-receipt
   =================================== */
.action-buttons {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse;

    :deep(.p-button) {
      width: 100%;
      justify-content: center;
    }
  }
}

.btn-clear {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s;
  background: white;
  color: #6b7280;
  border: 2px solid #d1d5db;

  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
    color: #374151;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-submit {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

:deep(.p-button-success) {
  background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(135deg, #c0ab28 0%, #91801e 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(231, 222, 153, 0.3);
  }

  &:disabled {
    background: #d1d5db;
    opacity: 0.6;
    cursor: not-allowed;
  }
}

/* ===================================
   Dialog Styles - เหมือน goods-receipt
   =================================== */
:deep(.component-dialog),
:deep(.confirm-dialog) {
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

  .form-group {
    &.form-group-full {
      grid-column: 1 / -1;
    }

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;

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

    :deep(.p-textarea) {
      min-height: auto;
      resize: vertical;
      border: 2px solid #d1d5db;
      border-radius: 8px;
      padding: 0.625rem 0.875rem;
      font-size: 0.9375rem;
      transition: all 0.2s;

      &:focus {
        outline: none;
        border-color: #e7de99;
        box-shadow: 0 0 0 3px rgba(231, 222, 153, 0.1);
      }
    }
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

.confirm-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 0;
}

.confirm-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(245, 158, 11, 0.1);

  i {
    font-size: 2.5rem;
    color: #f59e0b;
  }
}

.confirm-message {
  text-align: center;

  p {
    font-size: 1rem;
    color: #374151;
    margin: 0 0 1.5rem 0;

    strong {
      color: #e7de99;
    }
  }
}

.confirm-summary {
  background: #faf9f0;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e7de99;
  min-width: 350px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  font-size: 0.9375rem;

  strong {
    font-weight: 700;
    color: #e7de99;
  }
}
</style>
