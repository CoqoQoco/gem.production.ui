<template>
  <div class="product-components-card">
    <!-- Section Title -->
    <div class="section-title">
      <i class="pi pi-th-large"></i>
      <span>{{
        $t("goodsReceipt.components.title") || "ส่วนประกอบสินค้า"
      }}</span>
    </div>

    <!-- Product Image Section - Compact -->
    <div class="product-image-section">
      <div class="image-upload-header">
        <label class="image-label">
          <i class="pi pi-image"></i>
          <span>{{
            $t("goodsReceipt.components.productImage") || "รูปภาพสินค้า"
          }}</span>
        </label>
      </div>

      <div class="image-upload-area">
        <div v-if="isUploadingImage" class="image-loading">
          <i class="pi pi-spin pi-spinner"></i>
          <p>กำลังอัพโหลดรูปภาพ...</p>
        </div>

        <div v-else-if="productImage" class="image-preview-container">
          <img
            :src="productImage"
            alt="Product Image"
            class="product-image-preview"
          />
          <div class="image-overlay">
            <button class="btn-remove-image" @click="removeImage" type="button">
              <i class="pi pi-trash"></i>
              <span>ลบรูปภาพ</span>
            </button>
          </div>
          <div class="image-file-info">
            <small
              >{{ imageFileName }} ({{ formatFileSize(imageFileSize) }})</small
            >
          </div>
        </div>

        <div v-else class="image-upload-box" @click="triggerFileInput">
          <i class="pi pi-cloud-upload"></i>
          <p>คลิกเพื่ออัพโหลดรูปภาพ</p>
        </div>

        <input
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          @change="handleImageUpload"
          style="display: none"
          :disabled="isUploadingImage"
        />
      </div>
    </div>

    <!-- Gold Section -->
    <div ref="goldSection" class="component-section scroll-section">
      <div class="component-section-header">
        <div class="section-title-inline">
          <i class="pi pi-hammer gold-icon"></i>
          <span>ทอง</span>
        </div>
        <button
          class="btn-toggle-expand"
          @click="toggleGoldExpand"
          type="button"
        >
          <i
            :class="isGoldExpanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
          ></i>
          <span>{{ isGoldExpanded ? "ซ่อน" : "แสดง" }}</span>
        </button>
      </div>

      <!-- Gold Input Form -->
      <transition name="expand-collapse">
        <div v-show="isGoldExpanded" class="expandable-content">
          <div class="input-form-card">
            <div class="form-grid-compact">
              <div class="form-group-compact">
                <label>ทอง <span class="required">*</span></label>
                <AutoComplete
                  v-model="goldForm.selectedGold"
                  :suggestions="filteredGolds"
                  field="nameTh"
                  :option-label="(item) => `${item.nameEn} - ${item.nameTh}`"
                  :dropdown="true"
                  placeholder="ค้นหาทอง..."
                  @complete="searchGolds"
                  @item-select="handleGoldFormChange"
                />
              </div>

              <div class="form-group-compact">
                <label>รูปร่าง <span class="required">*</span></label>
                <AutoComplete
                  v-model="goldForm.selectedShape"
                  :suggestions="filteredGoldSizes"
                  field="nameTh"
                  :option-label="(item) => `${item.nameEn} - ${item.nameTh}`"
                  :dropdown="true"
                  placeholder="ค้นหารูปร่าง..."
                  @complete="searchGoldSizes"
                  @item-select="handleGoldFormShapeChange"
                />
              </div>

              <div class="form-group-compact">
                <label>น้ำหนัก <span class="required">*</span></label>
                <input
                  type="number"
                  v-model.number="goldForm.weight"
                  placeholder="0.00"
                  class="input-compact"
                  step="0.01"
                  min="0"
                />
              </div>

              <div class="form-group-compact">
                <label>หน่วย</label>
                <InputText
                  v-model="goldForm.weightUnit"
                  placeholder="g"
                  class="input-compact"
                />
              </div>

              <div class="form-group-compact">
                <label>น้ำหนักป้าย</label>
                <input
                  type="number"
                  v-model.number="goldForm.labelWeight"
                  placeholder="0.00"
                  class="input-compact"
                  step="0.01"
                  min="0"
                />
              </div>

              <div class="form-group-compact">
                <label>จำนวน</label>
                <input
                  type="number"
                  v-model.number="goldForm.qty"
                  placeholder="1"
                  class="input-compact"
                  step="0.01"
                  min="0"
                />
              </div>

              <div class="form-group-compact">
                <label>หน่วยนับ</label>
                <InputText
                  v-model="goldForm.qtyUnit"
                  placeholder="pc"
                  class="input-compact"
                />
              </div>

              <div class="form-group-compact">
                <label>ราคา (บาท/กรัม)</label>
                <input
                  type="number"
                  v-model.number="goldForm.price"
                  placeholder="0.00"
                  class="input-compact"
                  step="0.01"
                  min="0"
                />
              </div>

              <div class="form-group-compact">
                <label>%waste</label>
                <input
                  type="number"
                  v-model.number="goldForm.wastePercent"
                  placeholder="0"
                  class="input-compact"
                  step="0.01"
                  min="0"
                  max="100"
                />
              </div>

              <div class="form-group-compact btn-group-end">
                <button
                  class="btn-add-to-table"
                  @click="addGoldToTable"
                  type="button"
                >
                  <i class="pi pi-plus"></i>
                  <span>เพิ่มเข้าตาราง</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Gold Table -->
          <div v-if="goldItems.length > 0" class="data-table-container">
            <DataTable
              :items="goldItemsWithId"
              :columns="goldColumns"
              data-key="id"
              :paginator="false"
              :show-gridlines="true"
              scroll-height="300px"
              empty-message="ยังไม่มีทอง กรุณากรอกข้อมูลและกดปุ่มเพิ่มเข้าตาราง"
            >
              <!-- Waste Percent Template -->
              <template #wastePercentTemplate="{ data }">
                {{ formatNumber(data.wastePercent) }}%
              </template>

              <!-- Actions Template -->
              <template #actionsTemplate="{ data }">
                <button
                  class="btn-delete"
                  @click="removeGoldItem(data.index)"
                  type="button"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </template>
            </DataTable>
          </div>
          <div v-else class="empty-state-inline">
            <i class="pi pi-inbox"></i>
            <p>ยังไม่มีทอง กรุณากรอกข้อมูลและกดปุ่มเพิ่มเข้าตาราง</p>
          </div>
        </div>
      </transition>
    </div>

    <!-- Gem/Diamond Section -->
    <div ref="gemSection" class="component-section scroll-section">
      <div class="component-section-header">
        <div class="section-title-inline">
          <i class="pi pi-hammer gold-icon"></i>
          <span>เพชร/พลอย</span>
        </div>
        <button
          class="btn-toggle-expand"
          @click="toggleGemExpand"
          type="button"
        >
          <i
            :class="isGemExpanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
          ></i>
          <span>{{ isGemExpanded ? "ซ่อน" : "แสดง" }}</span>
        </button>
      </div>

      <!-- Gem Input Form -->
      <transition name="expand-collapse">
        <div v-show="isGemExpanded" class="expandable-content">
          <div class="input-form-card">
            <div class="form-grid-compact">
              <div class="form-group-compact">
                <label>เพชร/พลอย <span class="required">*</span></label>
                <AutoComplete
                  v-model="gemForm.selectedGem"
                  :suggestions="filteredGems"
                  field="nameTh"
                  :option-label="(item) => `${item.nameEn} - ${item.nameTh}`"
                  :dropdown="true"
                  placeholder="ค้นหาเพชร/พลอย..."
                  @complete="searchGems"
                  @item-select="handleGemFormChange"
                />
              </div>

              <div class="form-group-compact">
                <label>รูปร่าง <span class="required">*</span></label>
                <AutoComplete
                  v-model="gemForm.selectedGemShape"
                  :suggestions="filteredGemShapes"
                  field="nameTh"
                  :option-label="(item) => `${item.nameEn} - ${item.nameTh}`"
                  :dropdown="true"
                  placeholder="ค้นหารูปร่าง..."
                  @complete="searchGemShapes"
                  @item-select="handleGemFormShapeChange"
                />
              </div>

              <div class="form-group-compact">
                <label>สูตรคำนวณ <span class="required">*</span></label>
                <AutoComplete
                  v-model="gemForm.selectedFormula"
                  :suggestions="filteredGemFormulas"
                  field="label"
                  :dropdown="true"
                  placeholder="เลือกสูตร..."
                  @complete="searchGemFormulas"
                  @item-select="handleGemFormulaChange"
                />
              </div>

              <div class="form-group-compact">
                <label>ขนาด</label>
                <InputText
                  v-model="gemForm.size"
                  placeholder="กรอกขนาด"
                  class="input-compact"
                />
              </div>

              <div class="form-group-compact">
                <label>แหล่งที่ซื้อมา <span class="required">*</span></label>
                <InputText
                  v-model="gemForm.source"
                  placeholder="กรอกแหล่งที่ซื้อมา"
                  class="input-compact"
                />
              </div>

              <div class="form-group-compact">
                <label>Color/Clarity <span class="required">*</span></label>
                <InputText
                  v-model="gemForm.colorClarity"
                  placeholder="กรอก Color/Clarity"
                  class="input-compact"
                />
              </div>

              <div class="form-group-compact">
                <label>แหล่งที่มา (Origin)</label>
                <InputText
                  v-model="gemForm.origin"
                  placeholder="กรอกแหล่งที่มา"
                  class="input-compact"
                />
              </div>

              <div class="form-group-compact">
                <label>น้ำหนัก</label>
                <input
                  type="number"
                  v-model.number="gemForm.weight"
                  placeholder="0.00"
                  class="input-compact"
                  step="0.01"
                  min="0"
                />
              </div>

              <div class="form-group-compact">
                <label>หน่วย</label>
                <InputText
                  v-model="gemForm.weightUnit"
                  placeholder="g"
                  class="input-compact"
                />
              </div>

              <div class="form-group-compact">
                <label>จำนวน</label>
                <input
                  type="number"
                  v-model.number="gemForm.qty"
                  placeholder="1"
                  class="input-compact"
                  step="0.01"
                  min="0"
                />
              </div>

              <div class="form-group-compact">
                <label>หน่วยนับ</label>
                <InputText
                  v-model="gemForm.qtyUnit"
                  placeholder="pc"
                  class="input-compact"
                />
              </div>

              <div class="form-group-compact">
                <label>ราคา (บาท)</label>
                <input
                  type="number"
                  v-model.number="gemForm.price"
                  placeholder="0.00"
                  class="input-compact"
                  step="0.01"
                  min="0"
                />
              </div>

              <div class="form-group-compact btn-group-end">
                <button
                  class="btn-add-to-table"
                  @click="addGemToTable"
                  type="button"
                >
                  <i class="pi pi-plus"></i>
                  <span>เพิ่มเข้าตาราง</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Gem Table -->
          <div v-if="gemItems.length > 0" class="data-table-container">
            <DataTable
              :items="gemItemsWithId"
              :columns="gemColumns"
              data-key="id"
              :paginator="false"
              :show-gridlines="true"
              scroll-height="300px"
              empty-message="ยังไม่มีเพชร/พลอย กรุณากรอกข้อมูลและกดปุ่มเพิ่มเข้าตาราง"
            >
              <!-- Calculation Formula Template -->
              <template #calculationFormulaTemplate="{ data }">
                <span
                  v-if="data.calculationFormula === 'price_x_weight'"
                  class="formula-badge"
                  >ราคา × น้ำหนัก</span
                >
                <span
                  v-else-if="data.calculationFormula === 'price_x_qty'"
                  class="formula-badge"
                  >ราคา × จำนวน</span
                >
              </template>

              <!-- Actions Template -->
              <template #actionsTemplate="{ data }">
                <button
                  class="btn-delete"
                  @click="removeGemItem(data.index)"
                  type="button"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </template>
            </DataTable>
          </div>
          <div v-else class="empty-state-inline">
            <i class="pi pi-inbox"></i>
            <p>ยังไม่มีเพชร/พลอย กรุณากรอกข้อมูลและกดปุ่มเพิ่มเข้าตาราง</p>
          </div>
        </div>
      </transition>
    </div>

    <!-- Labor Section -->
    <div ref="laborSection" class="component-section scroll-section">
      <div class="component-section-header">
        <div class="section-title-inline">
          <i class="pi pi-wrench labor-icon"></i>
          <span>ค่าแรง/ต้นทุนอื่นๆ</span>
        </div>
        <button
          class="btn-toggle-expand"
          @click="toggleLaborExpand"
          type="button"
        >
          <i
            :class="isLaborExpanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
          ></i>
          <span>{{ isLaborExpanded ? "ซ่อน" : "แสดง" }}</span>
        </button>
      </div>

      <!-- Labor Input Form -->
      <transition name="expand-collapse">
        <div v-show="isLaborExpanded" class="expandable-content">
          <div class="input-form-card">
            <div class="form-grid-compact labor-grid">
              <div class="form-group-compact">
                <label>หัวข้อ <span class="required">*</span></label>
                <InputText
                  v-model="laborForm.itemNameTh"
                  placeholder="เช่น ค่าแรงช่าง, ค่าขนส่ง"
                  class="input-compact"
                />
              </div>

              <div class="form-group-compact">
                <label>ต้นทุน (บาท) <span class="required">*</span></label>
                <input
                  type="number"
                  v-model.number="laborForm.cost"
                  placeholder="0.00"
                  class="input-compact"
                  step="0.01"
                  min="0"
                />
              </div>

              <div class="form-group-compact full-width">
                <label>รายละเอียด</label>
                <Textarea
                  v-model="laborForm.description"
                  placeholder="กรอกรายละเอียด (ถ้ามี)"
                  rows="2"
                  class="textarea-compact"
                />
              </div>

              <div class="form-group-compact btn-group full-width">
                <button
                  class="btn-add-to-table"
                  @click="addLaborToTable"
                  type="button"
                >
                  <i class="pi pi-plus"></i>
                  <span>เพิ่มเข้าตาราง</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Labor Table -->
          <div v-if="laborItems.length > 0" class="data-table-container">
            <DataTable
              :items="laborItemsWithId"
              :columns="laborColumns"
              data-key="id"
              :paginator="false"
              :show-gridlines="true"
              scroll-height="300px"
              empty-message="ยังไม่มีค่าแรง กรุณากรอกข้อมูลและกดปุ่มเพิ่มเข้าตาราง"
            >
              <!-- Description Template -->
              <template #descriptionTemplate="{ data }">
                {{ data.description || "-" }}
              </template>

              <!-- Actions Template -->
              <template #actionsTemplate="{ data }">
                <button
                  class="btn-delete"
                  @click="removeLaborItem(data.index)"
                  type="button"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </template>
            </DataTable>
          </div>
          <div v-else class="empty-state-inline">
            <i class="pi pi-inbox"></i>
            <p>ยังไม่มีค่าแรง กรุณากรอกข้อมูลและกดปุ่มเพิ่มเข้าตาราง</p>
          </div>
        </div>
      </transition>
    </div>

    <!-- Summary Section -->
    <div ref="summarySection" class="summary-section scroll-section">
      <div class="summary-title">
        <i class="pi pi-calculator"></i>
        <span>สรุปส่วนประกอบทั้งหมด</span>
      </div>

      <div v-if="allComponents.length > 0" class="summary-table-container">
        <DataTable
          :items="allComponents"
          :columns="summaryColumns"
          data-key="id"
          :paginator="false"
          :show-gridlines="true"
          scroll-height="400px"
          empty-message="ยังไม่มีส่วนประกอบ"
        >
          <!-- Type Badge Template -->
          <template #typeTemplate="{ data }">
            <span v-if="data.type === 'gold'" class="type-badge gold-badge"
              >ทอง</span
            >
            <span v-else-if="data.type === 'gem'" class="type-badge gem-badge"
              >เพชร/พลอย</span
            >
            <span
              v-else-if="data.type === 'labor'"
              class="type-badge labor-badge"
              >ค่าแรง</span
            >
          </template>

          <!-- Calculation Formula Template -->
          <template #calculationFormulaTemplate="{ data }">
            <span
              v-if="
                data.type === 'gem' &&
                data.calculationFormula === 'price_x_weight'
              "
              class="formula-badge"
              >ราคา × น้ำหนัก</span
            >
            <span
              v-else-if="
                data.type === 'gem' && data.calculationFormula === 'price_x_qty'
              "
              class="formula-badge"
              >ราคา × จำนวน</span
            >
            <span v-else>-</span>
          </template>

          <!-- Waste Percent Template -->
          <template #wastePercentTemplate="{ data }">
            <span
              v-if="
                data.type === 'gold' &&
                data.wastePercent !== null &&
                data.wastePercent !== undefined
              "
            >
              {{ formatNumber(data.wastePercent) }}%
            </span>
            <span v-else>-</span>
          </template>

          <!-- Footer Template -->
          <template #footer>
            <div class="summary-footer">
              <span class="footer-label">รวมต้นทุนทั้งหมด:</span>
              <span class="footer-total">{{ formatCurrency(totalCost) }}</span>
            </div>
          </template>
        </DataTable>
      </div>
      <div v-else class="empty-state-inline">
        <i class="pi pi-inbox"></i>
        <p>ยังไม่มีส่วนประกอบ</p>
      </div>
    </div>

    <!-- Final Cost Summary -->
    <div class="final-summary-section">
      <div class="summary-row">
        <label class="summary-label">ราคาต้นทุนจริง:</label>
        <div class="summary-value actual-cost">
          {{ formatCurrency(totalCost) }}
        </div>
      </div>

      <div class="summary-row editable">
        <label class="summary-label">ราคาต้นทุนที่ใช้:</label>
        <input
          type="number"
          v-model.number="costSummary.usedCost"
          class="summary-input"
          step="0.01"
          min="0"
        />
      </div>

      <div class="summary-row editable">
        <label class="summary-label">ส่วนลด (%):</label>
        <input
          type="number"
          v-model.number="costSummary.discountPercent"
          class="summary-input"
          step="0.01"
          min="0"
          max="100"
        />
      </div>

      <div class="summary-row final">
        <label class="summary-label">ราคาสุดท้าย:</label>
        <div class="summary-value final-cost">
          {{ formatCurrency(finalCost) }}
        </div>
      </div>

      <div class="summary-row editable">
        <label class="summary-label">ราคาป้ายหน้า:</label>
        <input
          type="number"
          v-model.number="costSummary.priceFront"
          class="summary-input"
          step="0.01"
          min="0"
        />
      </div>

      <div class="summary-row editable">
        <label class="summary-label">ราคาป้ายหลัง:</label>
        <input
          type="number"
          v-model.number="costSummary.priceBack"
          class="summary-input"
          step="0.01"
          min="0"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AutoComplete from "@/components/prime-vue/auto-complete.vue";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import DataTable from "@/components/prime-vue/data-table.vue";
import { useGoldApiStore } from "@/stores/api/gold-api";
import { useGemApiStore } from "@/stores/api/gem-api";
import { useGemShapeApiStore } from "@/stores/api/gem-shape-api";
import { useGoldSizeApiStore } from "@/stores/api/gold-size-api";
import { useUploadApiStore } from "@/stores/api/upload-api";

export default {
  name: "ProductComponentsNew",

  components: {
    AutoComplete,
    InputText,
    Textarea,
    DataTable,
  },

  props: {
    modelValue: {
      type: Object,
      default: () => ({
        components: [],
      }),
    },
  },

  emits: ["update:modelValue", "validate"],

  data() {
    return {
      goldApiStore: useGoldApiStore(),
      gemApiStore: useGemApiStore(),
      gemShapeApiStore: useGemShapeApiStore(),
      goldSizeApiStore: useGoldSizeApiStore(),
      uploadApiStore: useUploadApiStore(),

      // Form data for inputs (not yet added to table)
      goldForm: this.getEmptyGoldItem(),
      gemForm: this.getEmptyGemItem(),
      laborForm: this.getEmptyLaborItem(),

      // Arrays for table data
      goldItems: [],
      gemItems: [],
      laborItems: [],

      gemCalculationFormulas: [
        { value: "price_x_weight", label: "ราคา × น้ำหนัก" },
        { value: "price_x_qty", label: "ราคา × จำนวน" },
      ],

      costSummary: {
        usedCost: 0,
        discountPercent: 0,
        priceFront: 0,
        priceBack: 0,
      },

      // Flags to track if user has manually edited label prices
      isPriceFrontEdited: false,
      isPriceBackEdited: false,

      golds: [],
      gems: [],
      gemShapes: [],
      goldSizes: [],

      // Filtered suggestions for autocomplete
      filteredGolds: [],
      filteredGoldSizes: [],
      filteredGems: [],
      filteredGemShapes: [],
      filteredGemFormulas: [],

      errors: {},
      isUpdatingFromParent: false,

      // Image Upload
      productImage: null,
      productImageUrl: null,
      productImageBlobName: null,
      imageFileName: "",
      imageFileSize: 0,
      isUploadingImage: false,
      pendingImageFile: null,

      // Expand/Collapse state - separate for each section
      isGoldExpanded: true,
      isGemExpanded: true,
      isLaborExpanded: true,
    };
  },

  computed: {
    totalCost() {
      const goldCost = this.goldItems.reduce(
        (sum, item) => sum + (parseFloat(item.cost) || 0),
        0,
      );
      const gemCost = this.gemItems.reduce(
        (sum, item) => sum + (parseFloat(item.cost) || 0),
        0,
      );
      const laborCost = this.laborItems.reduce(
        (sum, item) => sum + (parseFloat(item.cost) || 0),
        0,
      );
      return goldCost + gemCost + laborCost;
    },

    finalCost() {
      const usedCost = parseFloat(this.costSummary.usedCost) || 0;
      const discountPercent = parseFloat(this.costSummary.discountPercent) || 0;
      const discountAmount = usedCost * (discountPercent / 100);
      return usedCost - discountAmount;
    },

    allComponents() {
      return [
        ...this.goldItems.map((item, index) => ({
          ...item,
          type: "gold",
          id: `gold-${index}`,
        })),
        ...this.gemItems.map((item, index) => ({
          ...item,
          type: "gem",
          id: `gem-${index}`,
        })),
        ...this.laborItems.map((item, index) => ({
          ...item,
          type: "labor",
          id: `labor-${index}`,
        })),
      ];
    },

    summaryColumns() {
      return [
        { field: "type", header: "ประเภท", width: "80px", align: "center", sortable: false },
        { field: "itemNameTh", header: "ชื่อรายการ", width: "150px", sortable: false },
        { field: "shapeNameTh", header: "รูปร่าง", width: "120px", sortable: false },
          { field: "description", header: "รายละเอียด", width: "150px", sortable: false },
        {
          field: "calculationFormula",
          header: "สูตร",
          width: "140px",
          align: "center",
          sortable: false,
        },
        { field: "size", header: "ขนาด", width: "80px", sortable: false },
        { field: "source", header: "แหล่งซื้อ", width: "120px", sortable: false },
        { field: "colorClarity", header: "Color/Clarity", width: "120px", sortable: false },
        { field: "origin", header: "Origin", width: "100px", sortable: false },
        {
          field: "qty",
          header: "จำนวน",
          width: "80px",
          align: "right",
          format: "decimal2",
          sortable: false,
        },
        {
          field: "qtyUnit",
          header: "หน่วยนับ",
          width: "80px",
          align: "center",
          sortable: false,
        },
        {
          field: "weight",
          header: "น้ำหนัก",
          width: "90px",
          align: "right",
          format: "decimal2",
          sortable: false,
        },
        {
          field: "weightUnit",
          header: "หน่วย",
          width: "60px",
          align: "center",
          sortable: false,
        },
        {
          field: "wastePercent",
          header: "%waste",
          width: "80px",
          align: "right",
          sortable: false,
        },
        {
          field: "labelWeight",
          header: "น้ำหนักป้าย",
          width: "100px",
          align: "right",
          format: "decimal2",
          sortable: false,
        },
        {
          field: "price",
          header: "ราคา",
          width: "100px",
          align: "right",
          format: "currency",
          sortable: false,
        },
        {
          field: "cost",
          header: "ต้นทุน (บาท)",
          width: "120px",
          align: "right",
          format: "currency",
          sortable: false,
        },
      ];
    },

    goldColumns() {
      return [
        { field: "itemNameTh", header: "ทอง", width: "150px", sortable: false },
        { field: "shapeNameTh", header: "รูปร่าง", width: "120px", sortable: false },
        {
          field: "qty",
          header: "จำนวน",
          width: "80px",
          align: "right",
          format: "decimal2",
          sortable: false,
        },
        {
          field: "qtyUnit",
          header: "หน่วยนับ",
          width: "80px",
          align: "center",
          sortable: false,
        },
        {
          field: "weight",
          header: "น้ำหนัก",
          width: "90px",
          align: "right",
          format: "decimal2",
          sortable: false,
        },
        {
          field: "weightUnit",
          header: "หน่วย",
          width: "70px",
          align: "center",
          sortable: false,
        },
        {
          field: "wastePercent",
          header: "%waste",
          width: "80px",
          align: "right",
          format: "decimal2",
          sortable: false,
        },
        {
          field: "labelWeight",
          header: "น้ำหนักป้าย",
          width: "100px",
          align: "right",
          format: "decimal2",
          sortable: false,
        },
        {
          field: "price",
          header: "ราคา",
          width: "100px",
          align: "right",
          format: "currency",
          sortable: false,
        },
        {
          field: "cost",
          header: "ต้นทุน",
          width: "120px",
          align: "right",
          format: "currency",
          sortable: false,
        },
        { field: "actions", header: "ลบ", width: "70px", align: "center", sortable: false },
      ];
    },

    goldItemsWithId() {
      return this.goldItems.map((item, index) => ({
        ...item,
        id: `gold-${index}`,
        index,
      }));
    },

    gemColumns() {
      return [
        { field: "itemNameTh", header: "เพชร/พลอย", width: "150px", sortable: false },
        { field: "shapeNameTh", header: "รูปร่าง", width: "120px", sortable: false },
        {
          field: "calculationFormula",
          header: "สูตร",
          width: "140px",
          align: "center",
          sortable: false,
        },
        { field: "size", header: "ขนาด", width: "90px", sortable: false },
        { field: "source", header: "แหล่งซื้อ", width: "120px", sortable: false },
        { field: "colorClarity", header: "Color/Clarity", width: "120px", sortable: false },
        { field: "origin", header: "Origin", width: "100px", sortable: false },
        {
          field: "weight",
          header: "น้ำหนัก",
          width: "90px",
          align: "right",
          format: "decimal2",
          sortable: false,
        },
        {
          field: "weightUnit",
          header: "หน่วย",
          width: "70px",
          align: "center",
          sortable: false,
        },
        {
          field: "qty",
          header: "จำนวน",
          width: "80px",
          align: "right",
          format: "decimal2",
          sortable: false,
        },
        {
          field: "qtyUnit",
          header: "หน่วยนับ",
          width: "80px",
          align: "center",
          sortable: false,
        },
        {
          field: "price",
          header: "ราคา",
          width: "100px",
          align: "right",
          format: "currency",
          sortable: false,
        },
        {
          field: "cost",
          header: "ต้นทุน",
          width: "120px",
          align: "right",
          format: "currency",
          sortable: false,
        },
        { field: "actions", header: "ลบ", width: "70px", align: "center", sortable: false },
      ];
    },

    gemItemsWithId() {
      return this.gemItems.map((item, index) => ({
        ...item,
        id: `gem-${index}`,
        index,
      }));
    },

    laborColumns() {
      return [
        { field: "itemNameTh", header: "หัวข้อ", width: "200px", sortable: false },
        { field: "description", header: "รายละเอียด", width: "300px", sortable: false },
        {
          field: "cost",
          header: "ต้นทุน (บาท)",
          width: "150px",
          align: "right",
          format: "currency",
          sortable: false,
        },
        { field: "actions", header: "ลบ", width: "70px", align: "center", sortable: false },
      ];
    },

    laborItemsWithId() {
      return this.laborItems.map((item, index) => ({
        ...item,
        id: `labor-${index}`,
        index,
      }));
    },
  },

  async mounted() {
    await this.loadGolds();
    await this.loadGems();
    await this.loadGemShapes();
    await this.loadGoldSizes();
  },

  watch: {
    modelValue: {
      handler(newValue) {
        if (newValue && !this.isUpdatingFromParent) {
          this.isUpdatingFromParent = true;

          if (Array.isArray(newValue.components)) {
            this.goldItems = newValue.components.filter(
              (c) => c.type === "gold",
            );
            this.gemItems = newValue.components.filter((c) => c.type === "gem");
            this.laborItems = newValue.components.filter(
              (c) => c.type === "labor",
            );
          }

          if (newValue.productImageUrl) {
            this.productImageUrl = newValue.productImageUrl;
            this.productImage = newValue.productImageUrl;
          }

          if (newValue.productImageBlobName) {
            this.productImageBlobName = newValue.productImageBlobName;
          }

          if (newValue.costSummary) {
            this.costSummary = {
              usedCost: newValue.costSummary.usedCost || 0,
              discountPercent: newValue.costSummary.discountPercent || 0,
              priceFront: newValue.costSummary.priceFront || 0,
              priceBack: newValue.costSummary.priceBack || 0,
            };
            if (newValue.costSummary.priceFront) this.isPriceFrontEdited = true;
            if (newValue.costSummary.priceBack) this.isPriceBackEdited = true;
          }

          this.$nextTick(() => {
            this.isUpdatingFromParent = false;
          });
        }
      },
      deep: true,
      immediate: true,
    },

    goldItems: {
      handler() {
        if (!this.isUpdatingFromParent) {
          this.emitAllData();
        }
      },
      deep: true,
    },

    gemItems: {
      handler() {
        if (!this.isUpdatingFromParent) {
          this.emitAllData();
        }
      },
      deep: true,
    },

    laborItems: {
      handler() {
        if (!this.isUpdatingFromParent) {
          this.emitAllData();
        }
      },
      deep: true,
    },

    productImageUrl: {
      handler() {
        if (!this.isUpdatingFromParent) {
          this.emitAllData();
        }
      },
    },

    costSummary: {
      handler() {
        if (!this.isUpdatingFromParent) {
          this.emitAllData();
        }
      },
      deep: true,
    },

    totalCost: {
      handler(newValue) {
        this.costSummary.usedCost = newValue;
        // Reset label prices to finalCost if user hasn't manually edited them
        if (!this.isPriceFrontEdited) {
          this.costSummary.priceFront = this.finalCost;
        }
        if (!this.isPriceBackEdited) {
          this.costSummary.priceBack = this.finalCost;
        }
      },
      immediate: true,
    },

    finalCost: {
      handler(newValue) {
        // Sync label prices to finalCost if user hasn't manually edited them
        if (!this.isPriceFrontEdited) {
          this.costSummary.priceFront = newValue;
        }
        if (!this.isPriceBackEdited) {
          this.costSummary.priceBack = newValue;
        }
      },
    },

    'costSummary.priceFront': {
      handler(newVal, oldVal) {
        if (!this.isUpdatingFromParent && newVal !== oldVal && oldVal !== undefined) {
          this.isPriceFrontEdited = true;
        }
      },
    },

    'costSummary.priceBack': {
      handler(newVal, oldVal) {
        if (!this.isUpdatingFromParent && newVal !== oldVal && oldVal !== undefined) {
          this.isPriceBackEdited = true;
        }
      },
    },
  },

  methods: {
    toggleGoldExpand() {
      this.isGoldExpanded = !this.isGoldExpanded;
    },

    toggleGemExpand() {
      this.isGemExpanded = !this.isGemExpanded;
    },

    toggleLaborExpand() {
      this.isLaborExpanded = !this.isLaborExpanded;
    },

    emitAllData() {
      const completeData = {
        components: this.allComponents,
        productImageUrl: this.productImageUrl || "",
        productImageBlobName: this.productImageBlobName || "",
        costSummary: {
          actualCost: this.totalCost,
          usedCost: this.costSummary.usedCost || 0,
          discountPercent: this.costSummary.discountPercent || 0,
          finalCost: this.finalCost,
          priceFront: this.costSummary.priceFront || 0,
          priceBack: this.costSummary.priceBack || 0,
        },
      };
      this.$emit("update:modelValue", completeData);
    },

    // Gold Methods
    getEmptyGoldItem() {
      return {
        type: "gold",
        selectedGold: null,
        selectedShape: null,
        itemCode: "",
        itemNameTh: "",
        itemNameEn: "",
        shapeCode: "",
        shapeNameTh: "",
        shapeNameEn: "",
        weight: null,
        weightUnit: "g",
        wastePercent: 0,
        labelWeight: null,
        qty: 1,
        qtyUnit: "pc",
        price: null,
        cost: 0,
      };
    },

    searchGolds(event) {
      const query = event.query.toLowerCase().trim();
      this.filteredGolds = query
        ? this.golds.filter(
            (gold) =>
              gold.nameTh.toLowerCase().includes(query) ||
              gold.nameEn.toLowerCase().includes(query) ||
              gold.code.toLowerCase().includes(query),
          )
        : [...this.golds];
    },

    searchGoldSizes(event) {
      const query = event.query.toLowerCase().trim();
      this.filteredGoldSizes = query
        ? this.goldSizes.filter(
            (size) =>
              size.nameTh.toLowerCase().includes(query) ||
              size.nameEn.toLowerCase().includes(query) ||
              size.code.toLowerCase().includes(query),
          )
        : [...this.goldSizes];
    },

    handleGoldFormChange(event) {
      const selectedGold = event.value;
      if (selectedGold) {
        this.goldForm.itemCode = selectedGold.code;
        this.goldForm.itemNameTh = selectedGold.nameTh;
        this.goldForm.itemNameEn = selectedGold.nameEn;
      }
    },

    handleGoldFormShapeChange(event) {
      const selectedShape = event.value;
      if (selectedShape) {
        this.goldForm.shapeCode = selectedShape.code;
        this.goldForm.shapeNameTh = selectedShape.nameTh;
        this.goldForm.shapeNameEn = selectedShape.nameEn;
      }
    },

    addGoldToTable() {
      if (
        !this.goldForm.itemCode ||
        !this.goldForm.shapeCode ||
        !this.goldForm.weight ||
        !this.goldForm.price
      ) {
        alert("กรุณากรอกข้อมูลที่จำเป็น: ทอง, รูปร่าง, น้ำหนัก, และราคา");
        return;
      }

      const weight = parseFloat(this.goldForm.weight) || 0;
      const wastePercent = parseFloat(this.goldForm.wastePercent) || 0;
      const price = parseFloat(this.goldForm.price) || 0;
      const totalWeight = weight + weight * (wastePercent / 100);
      const cost = Math.round(totalWeight * price * 100) / 100;

      const newItem = {
        type: "gold",
        itemCode: this.goldForm.itemCode,
        itemNameTh: this.goldForm.itemNameTh,
        itemNameEn: this.goldForm.itemNameEn,
        shapeCode: this.goldForm.shapeCode,
        shapeNameTh: this.goldForm.shapeNameTh,
        shapeNameEn: this.goldForm.shapeNameEn,
        weight: this.goldForm.weight,
        weightUnit: this.goldForm.weightUnit,
        wastePercent: this.goldForm.wastePercent,
        labelWeight: this.goldForm.labelWeight,
        qty: this.goldForm.qty,
        qtyUnit: this.goldForm.qtyUnit,
        price: this.goldForm.price,
        cost,
      };

      this.goldItems.push(newItem);
      this.goldForm = this.getEmptyGoldItem();
    },

    removeGoldItem(index) {
      this.goldItems.splice(index, 1);
    },

    // Gem Methods
    getEmptyGemItem() {
      return {
        type: "gem",
        selectedGem: null,
        selectedGemShape: null,
        selectedFormula: null,
        itemCode: "",
        itemNameTh: "",
        itemNameEn: "",
        shapeCode: "",
        shapeNameTh: "",
        shapeNameEn: "",
        calculationFormula: "price_x_weight",
        size: "",
        source: "",
        colorClarity: "",
        origin: "",
        weight: null,
        weightUnit: "g",
        qty: 1,
        qtyUnit: "pc",
        price: null,
        cost: 0,
      };
    },

    searchGems(event) {
      const query = event.query.toLowerCase().trim();
      this.filteredGems = query
        ? this.gems.filter(
            (gem) =>
              gem.nameTh.toLowerCase().includes(query) ||
              gem.nameEn.toLowerCase().includes(query) ||
              gem.code.toLowerCase().includes(query),
          )
        : [...this.gems];
    },

    searchGemShapes(event) {
      const query = event.query.toLowerCase().trim();
      this.filteredGemShapes = query
        ? this.gemShapes.filter(
            (shape) =>
              shape.nameTh.toLowerCase().includes(query) ||
              shape.nameEn.toLowerCase().includes(query) ||
              shape.code.toLowerCase().includes(query),
          )
        : [...this.gemShapes];
    },

    searchGemFormulas(event) {
      const query = event.query.toLowerCase().trim();
      this.filteredGemFormulas = query
        ? this.gemCalculationFormulas.filter((formula) =>
            formula.label.toLowerCase().includes(query),
          )
        : [...this.gemCalculationFormulas];
    },

    handleGemFormChange(event) {
      const selectedGem = event.value;
      if (selectedGem) {
        this.gemForm.itemCode = selectedGem.code;
        this.gemForm.itemNameTh = selectedGem.nameTh;
        this.gemForm.itemNameEn = selectedGem.nameEn;
      }
    },

    handleGemFormShapeChange(event) {
      const selectedShape = event.value;
      if (selectedShape) {
        this.gemForm.shapeCode = selectedShape.code;
        this.gemForm.shapeNameTh = selectedShape.nameTh;
        this.gemForm.shapeNameEn = selectedShape.nameEn;
      }
    },

    handleGemFormulaChange(event) {
      const selectedFormula = event.value;
      if (selectedFormula) {
        this.gemForm.calculationFormula = selectedFormula.value;
      }
    },

    addGemToTable() {
      if (
        !this.gemForm.itemCode ||
        !this.gemForm.shapeCode ||
        !this.gemForm.calculationFormula ||
        !this.gemForm.source ||
        !this.gemForm.colorClarity ||
        !this.gemForm.price
      ) {
        alert(
          "กรุณากรอกข้อมูลที่จำเป็น: เพชร/พลอย, รูปร่าง, สูตรคำนวณ, แหล่งที่ซื้อมา, Color/Clarity, และราคา",
        );
        return;
      }

      const weight = parseFloat(this.gemForm.weight) || 0;
      const qty = parseFloat(this.gemForm.qty) || 0;
      const price = parseFloat(this.gemForm.price) || 0;
      let cost = 0;

      if (this.gemForm.calculationFormula === "price_x_weight" && weight > 0) {
        cost = Math.round(price * weight * 100) / 100;
      } else if (this.gemForm.calculationFormula === "price_x_qty" && qty > 0) {
        cost = Math.round(price * qty * 100) / 100;
      }

      const newItem = {
        type: "gem",
        itemCode: this.gemForm.itemCode,
        itemNameTh: this.gemForm.itemNameTh,
        itemNameEn: this.gemForm.itemNameEn,
        shapeCode: this.gemForm.shapeCode,
        shapeNameTh: this.gemForm.shapeNameTh,
        shapeNameEn: this.gemForm.shapeNameEn,
        calculationFormula: this.gemForm.calculationFormula,
        size: this.gemForm.size,
        source: this.gemForm.source,
        colorClarity: this.gemForm.colorClarity,
        origin: this.gemForm.origin,
        weight: this.gemForm.weight,
        weightUnit: this.gemForm.weightUnit,
        qty: this.gemForm.qty,
        qtyUnit: this.gemForm.qtyUnit,
        price: this.gemForm.price,
        cost,
      };

      this.gemItems.push(newItem);
      this.gemForm = this.getEmptyGemItem();
    },

    removeGemItem(index) {
      this.gemItems.splice(index, 1);
    },

    // Labor Methods
    getEmptyLaborItem() {
      return {
        type: "labor",
        itemNameTh: "",
        description: "",
        cost: null,
      };
    },

    addLaborToTable() {
      if (!this.laborForm.itemNameTh || !this.laborForm.cost) {
        alert("กรุณากรอกข้อมูลที่จำเป็น: หัวข้อและต้นทุน");
        return;
      }

      this.laborItems.push({ ...this.laborForm });
      this.laborForm = this.getEmptyLaborItem();
    },

    removeLaborItem(index) {
      this.laborItems.splice(index, 1);
    },

    // API Methods
    async loadGolds() {
      try {
        const result = await this.goldApiStore.listGolds({
          pageIndex: 0,
          pageSize: 1000,
          criteria: { searchText: null },
        });
        if (result.success) {
          this.golds = result.data;
        }
      } catch (error) {
        console.error("Error loading golds:", error);
      }
    },

    async loadGems() {
      try {
        const result = await this.gemApiStore.listGems({
          pageIndex: 0,
          pageSize: 1000,
          criteria: { searchText: null },
        });
        if (result.success) {
          this.gems = result.data;
        }
      } catch (error) {
        console.error("Error loading gems:", error);
      }
    },

    async loadGemShapes() {
      try {
        const result = await this.gemShapeApiStore.listGemShapes({
          pageIndex: 0,
          pageSize: 1000,
          criteria: { searchText: null },
        });
        if (result.success) {
          this.gemShapes = result.data;
        }
      } catch (error) {
        console.error("Error loading gem shapes:", error);
      }
    },

    async loadGoldSizes() {
      try {
        const result = await this.goldSizeApiStore.listGoldSizes({
          pageIndex: 0,
          pageSize: 1000,
          criteria: { searchText: null },
        });
        if (result.success) {
          this.goldSizes = result.data;
        }
      } catch (error) {
        console.error("Error loading gold sizes:", error);
      }
    },

    // Utility Methods
    formatCurrency(value) {
      if (!value && value !== 0) return "฿0.00";
      return `฿${parseFloat(value).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },

    formatNumber(value) {
      if (!value && value !== 0) return "0.00";
      return parseFloat(value).toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },

    formatFileSize(bytes) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    },

    // Image Upload Methods
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        alert("กรุณาเลือกไฟล์รูปภาพ JPG หรือ PNG เท่านั้น");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert("ไฟล์มีขนาดใหญ่เกินไป (ไม่เกิน 10MB)");
        return;
      }

      try {
        this.isUploadingImage = true;
        const compressedImageData = await this.compressImage(file);
        const blob = await this.base64ToBlob(compressedImageData.dataUrl);
        const compressedFile = new File([blob], file.name, {
          type: "image/jpeg",
        });

        this.pendingImageFile = compressedFile;
        this.productImage = compressedImageData.dataUrl;
        this.imageFileName = file.name;
        this.imageFileSize = compressedImageData.size;
      } catch (error) {
        console.error("Error processing image:", error);
        alert(`เกิดข้อผิดพลาดในการประมวลผลรูปภาพ: ${error.message}`);
        this.productImage = null;
        this.pendingImageFile = null;
        this.imageFileName = "";
        this.imageFileSize = 0;
      } finally {
        this.isUploadingImage = false;
        event.target.value = "";
      }
    },

    async base64ToBlob(base64Data) {
      const response = await fetch(base64Data);
      return response.blob();
    },

    async compressImage(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;

            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height);
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            let quality = 0.7;
            let dataUrl = canvas.toDataURL("image/jpeg", quality);
            let size = this.getBase64Size(dataUrl);
            const TARGET_SIZE = 500 * 1024;

            while (size > TARGET_SIZE && quality > 0.1) {
              quality -= 0.1;
              dataUrl = canvas.toDataURL("image/jpeg", quality);
              size = this.getBase64Size(dataUrl);
            }

            resolve({ dataUrl, size });
          };
          img.onerror = reject;
        };
        reader.onerror = reject;
      });
    },

    getBase64Size(base64String) {
      const base64 = base64String.split(",")[1];
      const padding = (base64.match(/=/g) || []).length;
      return base64.length * 0.75 - padding;
    },

    async uploadPendingImage(stockNumber = null) {
      if (!this.pendingImageFile) {
        return null;
      }

      try {
        let fileToUpload = this.pendingImageFile;
        if (stockNumber) {
          const fileExtension = this.pendingImageFile.name.split(".").pop();
          const newFileName = `${stockNumber}.${fileExtension}`;
          fileToUpload = new File([this.pendingImageFile], newFileName, {
            type: this.pendingImageFile.type,
          });
        }

        const uploadResult = await this.uploadApiStore.uploadProductImage({
          file: fileToUpload,
          containerName: "image-gem",
        });

        if (uploadResult.success) {
          this.productImageUrl = uploadResult.data.blobUrl;
          this.productImageBlobName = uploadResult.data.blobName;
          return {
            blobUrl: uploadResult.data.blobUrl,
            blobName: uploadResult.data.blobName,
          };
        } else {
          throw new Error(uploadResult.message || "Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading pending image:", error);
        throw error;
      }
    },

    async removeImage() {
      this.productImage = null;
      this.productImageUrl = null;
      this.productImageBlobName = null;
      this.pendingImageFile = null;
      this.imageFileName = "";
      this.imageFileSize = 0;
    },

    validate() {
      this.errors = {};

      if (
        this.goldItems.length === 0 &&
        this.gemItems.length === 0 &&
        this.laborItems.length === 0
      ) {
        this.errors.components = "กรุณาเพิ่มส่วนประกอบอย่างน้อย 1 รายการ";
      }

      const isValid = Object.keys(this.errors).length === 0;
      this.$emit("validate", isValid);
      return isValid;
    },

    reset() {
      this.goldForm = this.getEmptyGoldItem();
      this.gemForm = this.getEmptyGemItem();
      this.laborForm = this.getEmptyLaborItem();
      this.goldItems = [];
      this.gemItems = [];
      this.laborItems = [];
      this.costSummary = {
        usedCost: 0,
        discountPercent: 0,
        priceFront: 0,
        priceBack: 0,
      };
      this.isPriceFrontEdited = false;
      this.isPriceBackEdited = false;
      this.errors = {};
      this.removeImage();
    },
  },
};
</script>

<style lang="scss" scoped>
.product-components-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e7de99;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 1rem;
    color: #e7de99;
  }
}

// Product Image Section - Compact
.product-image-section {
  background: #f9fafb;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border: 1px solid #e5e7eb;
}

.image-upload-header {
  margin-bottom: 0.625rem;

  .image-label {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #374151;

    i {
      color: #e7de99;
      font-size: 0.9375rem;
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
  padding: 1.5rem 1rem;
  border: 2px solid #e7de99;
  border-radius: 8px;
  background: rgba(231, 222, 153, 0.05);

  i {
    font-size: 2rem;
    color: #e7de99;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.8125rem;
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
  padding: 1.5rem 1rem;
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
    font-size: 2rem;
    color: #d1d5db;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #374151;
    margin: 0;
  }
}

.image-preview-container {
  position: relative;
  display: inline-block;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .product-image-preview {
    max-width: 200px;
    max-height: 200px;
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
    gap: 0.375rem;
    padding: 0.375rem 0.75rem;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #dc2626;
    }
  }

  .image-file-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.7);
    padding: 0.25rem;
    text-align: center;

    small {
      color: white;
      font-size: 0.6875rem;
    }
  }
}

// Scroll Section Styling (for navigation)
.scroll-section {
  transition: all 0.3s ease;
  position: relative;
  scroll-margin-top: 80px;
}

// Highlight Effect (for navigation)
@keyframes highlight-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(231, 222, 153, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(231, 222, 153, 0);
  }
}

.scroll-section.highlight-section {
  animation: highlight-pulse 1s ease-in-out 2;

  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 3px solid #e7de99;
    border-radius: 14px;
    pointer-events: none;
    animation: fade-in-out 2s ease-in-out;
    z-index: 1;
  }
}

@keyframes fade-in-out {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

// Component Sections
.component-section {
  background: #f9fafb;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border: 1px solid #e5e7eb;
}

.component-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.625rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e7de99;
}

.section-title-inline {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;

  i {
    font-size: 0.75rem;

    &.gold-icon {
      color: #e7de99;
    }

    &.gem-icon {
      color: #9333ea;
    }

    &.labor-icon {
      color: #3b82f6;
      font-size: 0.875rem;
    }
  }
}

// Input Form Card
.input-form-card {
  background: white;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.625rem;
  border: 1px solid #e5e7eb;
}

// Compact Form Grid
.form-grid-compact {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.625rem;

  &.labor-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.form-group-compact {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

  &.full-width {
    grid-column: 1 / -1;
  }

  &.btn-group {
    justify-content: flex-end;
    flex-direction: row;
    align-items: flex-end;
  }

  &.btn-group-end {
    justify-content: flex-end;
    flex-direction: row;
    align-items: flex-end;
    margin-left: auto;
    grid-column: -2 / -1;
  }

   &.btn-group-start {
    justify-content: flex-start;
    flex-direction: row;
    align-items: flex-;
  }


  label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 0.25rem;

    .required {
      color: #ef4444;
    }
  }

  :deep(.p-select),
  :deep(.p-inputtext),
  .input-compact {
    width: 100%;
    min-height: 30px;
    height: 30px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    transition: all 0.2s;

    &:focus,
    &:focus-within {
      outline: none;
      border-color: #e7de99;
      box-shadow: 0 0 0 2px rgba(231, 222, 153, 0.1);
    }
  }

  .textarea-compact {
    min-height: auto;
    resize: vertical;
    padding: 0.375rem 0.5rem;
    font-size: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;

    &:focus {
      outline: none;
      border-color: #e7de99;
      box-shadow: 0 0 0 2px rgba(231, 222, 153, 0.1);
    }
  }
}

.btn-add-to-table {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  background: linear-gradient(135deg, #e7de99 0%, #c0ab28 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  height: 30px;

  &:hover {
    background: linear-gradient(135deg, #c0ab28 0%, #91801e 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(231, 222, 153, 0.3);
  }

  i {
    font-size: 0.6875rem;
  }
}

// Data Tables
.data-table-container {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  margin-bottom: 0.625rem;

  :deep(.base-datatable) {
    .p-datatable {
      font-size: 0.75rem;
    }
  }
}

.btn-delete {
  padding: 0.25rem 0.375rem;
  background: transparent;
  color: #ef4444;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }

  i {
    font-size: 0.6875rem;
  }
}

.formula-badge {
  display: inline-block;
  padding: 0.125rem 0.375rem;
  background: #e0e7ff;
  color: #4338ca;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 600;
}

.empty-state-inline {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  color: #9ca3af;
  text-align: center;

  i {
    font-size: 1.5rem;
    color: #d1d5db;
    margin-bottom: 0.375rem;
  }

  p {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
  }
}

// Summary Section
.summary-section {
  background: #f9fafb;
  border-radius: 8px;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  margin-bottom: 0.75rem;
}

.summary-title {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.625rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e7de99;

  i {
    color: #e7de99;
    font-size: 0.9375rem;
  }
}

.summary-table-container {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;

  :deep(.base-datatable) {
    .p-datatable {
      font-size: 0.75rem;
    }

    .p-datatable-footer {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      padding: 0.75rem 1rem;
      border-top: 2px solid #f59e0b;
    }
  }
}

.summary-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .footer-label {
    font-size: 0.875rem;
    font-weight: 700;
    color: black;
  }

  .footer-total {
    font-size: 1rem;
    font-weight: 700;
    color: black;
  }
}

.type-badge {
  display: inline-block;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 600;

  &.gold-badge {
    background: #fef3c7;
    color: #92400e;
  }

  &.gem-badge {
    background: #ede9fe;
    color: #6b21a8;
  }

  &.labor-badge {
    background: #dbeafe;
    color: #1e40af;
  }
}

// Final Summary
.final-summary-section {
  background: white;
  border-radius: 8px;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: #f9fafb;
  border-radius: 6px;

  &.editable {
    background: #ffffff;
    border: 1px solid #e5e7eb;
  }

  &.final {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    padding: 0.75rem;

    .summary-label {
      color: black;
      font-size: 0.875rem;
    }

    .summary-value {
      color: black;
    }
  }

  .summary-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #374151;
  }

  .summary-value {
    font-size: 0.9375rem;
    font-weight: 700;

    &.actual-cost {
      color: #059669;
    }

    &.final-cost {
      font-size: 1.125rem;
      color: black;
    }
  }

  .summary-input {
    width: 120px;
    padding: 0.375rem 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    text-align: right;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #e7de99;
      box-shadow: 0 0 0 2px rgba(231, 222, 153, 0.1);
    }
  }
}

// Expand/Collapse Toggle Button
.btn-toggle-expand {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #374151;
    border-color: #9ca3af;
  }

  i {
    font-size: 0.625rem;
    transition: transform 0.3s;
  }
}

// Expandable Content Wrapper
.expandable-content {
  overflow: hidden;
}

// Expand/Collapse Transition
.expand-collapse-enter-active,
.expand-collapse-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 2000px;
  opacity: 1;
}

.expand-collapse-enter-from,
.expand-collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
