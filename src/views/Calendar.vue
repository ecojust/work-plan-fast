<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button class="nav-button" @click="previousMonth">&lt;</button>
      <span class="month-title">{{ currentYear }}年{{ currentMonth }}月</span>
      <button class="nav-button" @click="nextMonth">&gt;</button>
    </div>
    <div class="calendar-table-container">
      <el-table :data="tableData" height="250" style="width: 100%">
        <el-table-column prop="name" label="Name" width="80" fixed />

        <el-table-column
          prop="date"
          :label="day.day"
          width="80"
          v-for="day in days"
          :key="day.day"
        >
          <template #header>
            <div class="date-header">
              <span class="day-number">{{ day.day }}</span>
              <span class="weekday">{{ day.weekday }}</span>
            </div>
          </template>
          <template #default>
            <div class="content">
              <el-select
                class="plan-select"
                placeholder="选择计划"
                size="small"
              >
                <el-option label="休假" value="休假" />
                <el-option label="出差" value="出差" />
                <el-option label="加班" value="加班" />
                <el-option label="正常" value="正常" />
              </el-select>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

// 设置为中文
dayjs.locale("zh-cn");

// 当前年份和月份
const currentYear = ref(dayjs().year());
const currentMonth = ref(dayjs().month() + 1);

const people = ref(["张三", "李四", "王五"]);

// 计算当月的天数和对应的星期
const days = computed(() => {
  const daysInMonth = dayjs(
    `${currentYear.value}-${currentMonth.value}`
  ).daysInMonth();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = dayjs(`${currentYear.value}-${currentMonth.value}-${day}`);
    return {
      day,
      weekday: date.format("ddd"), // 星期几的中文简写
    };
  });
});

// 存储计划数据
const planData = ref({});

const tableData = ref([
  { name: "张三", date: "2024-06-01" },
  { name: "李四", date: "2024-06-02" },
  { name: "王五", date: "2024-06-03" },
]);

// 初始化每个人的计划数据
people.value.forEach((person) => {
  if (!planData.value[person]) {
    planData.value[person] = {};
  }
});

const previousMonth = () => {
  const date = dayjs(`${currentYear.value}-${currentMonth.value}-01`).subtract(
    1,
    "month"
  );
  currentYear.value = date.year();
  currentMonth.value = date.month() + 1;
};

const nextMonth = () => {
  const date = dayjs(`${currentYear.value}-${currentMonth.value}-01`).add(
    1,
    "month"
  );
  currentYear.value = date.year();
  currentMonth.value = date.month() + 1;
};
</script>

<style scoped>
.calendar-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  height: 80vh;
  border: 1px solid #ddd;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

/* 固定的头部 */
.calendar-header {
  padding: 20px;
  background: white;
  border-bottom: 1px solid #ddd;
  flex-shrink: 0;
}

/* 可滚动的表格容器 */
.calendar-table-container {
  flex: 1;
  overflow: auto;
  padding: 0 20px;
  position: relative;
}

/* 表格样式 */
.calendar-table {
  width: 100%;
  min-width: max-content;
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
  min-width: 100%;
  border-collapse: separate; /* 改为 separate 以支持 sticky */
  border-spacing: 0;
  border: 1px solid #ccc;
}

.calendar-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  position: relative; /* 为 sticky 定位提供参考 */
}

th,
td {
  border: 1px solid #ccc;
  text-align: center;
  height: 40px;
  min-width: 100px;
  white-space: nowrap;
  background: #fff; /* 添加背景色，防止内容重叠 */
}

/* 固定表头 */
thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #f5f5f5;
}

/* 固定左侧列 */
.name-column,
.name-cell {
  position: sticky;
  left: 0;
  z-index: 1;
}

/* 左上角单元格需要最高层级 */
.name-column {
  z-index: 3;
}

.name-column {
  min-width: 80px;
  background-color: #f5f5f5;
}

.date-column {
  min-width: 60px;
  padding: 4px;
  background-color: #f5f5f5;
}

.date-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.day-number {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.weekday {
  font-size: 12px;
  color: #666;
}

.name-cell {
  background-color: #f5f5f5;
  font-weight: bold;
  padding: 8px;
}

.plan-cell {
  padding: 2px;
  background: #fff;
}

.plan-select {
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  background-color: #fff;
  box-shadow: 0 0 0 1px #dcdfe6 inset !important;
  border-radius: 4px;
  padding: 1px 8px;
}

:deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset !important;
}

:deep(.el-select .el-input__inner) {
  height: 28px;
  color: #333;
  font-size: 13px;
  text-align: center;
}

:deep(.el-input__suffix) {
  color: #909399;
}

:deep(.el-select-dropdown__item) {
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
  color: #333;
}

:deep(.el-select-dropdown__item.selected) {
  color: #409eff;
  font-weight: bold;
  background-color: #ecf5ff;
}

:deep(.el-select-dropdown__item:hover) {
  background-color: #f5f7fa;
}
</style>
