<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button class="nav-button" @click="previousMonth">&lt;</button>
      <span class="month-title">{{ currentMonth }}月</span>
      <button class="nav-button" @click="nextMonth">&gt;</button>
    </div>
    <table class="calendar-table">
      <thead>
        <tr>
          <th class="name-column"></th>
          <th v-for="day in days" :key="day" class="date-column">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="person in people" :key="person" class="person-row">
          <td class="name-cell">{{ person }}</td>
          <td v-for="day in days" :key="`${person}-${day}`" class="plan-cell">
            <el-select class="plan-select" placeholder="选择计划" size="small">
              <el-option label="休假" value="休假" />
              <el-option label="出差" value="出差" />
              <el-option label="加班" value="加班" />
              <el-option label="正常" value="正常" />
            </el-select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { ElSelect, ElOption } from "element-plus";
import "element-plus/dist/index.css";

const currentMonth = ref(9);
const people = ref(["张三", "李四", "王五"]);
const days = computed(() => Array.from({ length: 12 }, (_, i) => i + 1));

// 存储计划数据
const planData = ref({});

// 初始化每个人的计划数据
people.value.forEach((person) => {
  if (!planData.value[person]) {
    planData.value[person] = {};
  }
});

const previousMonth = () => {
  if (currentMonth.value > 1) {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value < 12) {
    currentMonth.value++;
  }
};
</script>

<style scoped>
.calendar-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.calendar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.nav-button {
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
  padding: 5px 10px;
}

.month-title {
  font-size: 18px;
  font-weight: bold;
}

.calendar-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
}

th,
td {
  border: 1px solid #ccc;
  text-align: center;
  height: 40px;
}

.name-column {
  min-width: 80px;
  background-color: #f5f5f5;
}

.date-column {
  min-width: 60px;
  padding: 8px;
  background-color: #f5f5f5;
}

.name-cell {
  background-color: #f5f5f5;
  font-weight: bold;
  padding: 8px;
}

.plan-cell {
  padding: 4px;
}

.plan-select {
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  box-shadow: none !important;
  padding: 0 8px;
}

:deep(.el-select .el-input__inner) {
  height: 32px;
  color: #606266;
  text-align: center;
}

:deep(.el-select-dropdown__item) {
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
}

:deep(.el-select-dropdown__item.selected) {
  color: #409eff;
  font-weight: bold;
}
</style>
