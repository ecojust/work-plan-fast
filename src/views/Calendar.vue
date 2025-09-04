<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button class="nav-button" @click="previousMonth">&lt;</button>
      <span class="month-title">{{ currentYear }}年{{ currentMonth }}月</span>
      <button class="nav-button" @click="nextMonth">&gt;</button>
    </div>
    <div class="calendar-table-container">
      <el-table :data="tableData" height="400" style="width: 100%">
        <el-table-column prop="name" label="Name" width="80" fixed />

        <el-table-column
          prop="date"
          :label="day.day"
          width="180"
          v-for="day in days"
          :key="day.day"
        >
          <template #header>
            <div class="date-header">
              <span class="day-number">{{ day.day }}</span>
              <span class="weekday">{{ day.weekday }}</span>
            </div>
          </template>
          <template #default="scope">
            <div class="cell-content">
              <div class="cell-rule">
                <span class="rule-name">个人计划</span>
                <el-select
                  @change="ruleChange"
                  v-model="
                    planData[scope.row.name][
                      `${currentYear}-${currentMonth}-${day.day}`
                    ]
                  "
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
              <div class="cell-plan">plan</div>
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
  { name: "张三", date: "2024-06-01", rules: [] },
  { name: "李四", date: "2024-06-02", rules: [] },
  { name: "王五", date: "2024-06-03", rules: [] },
]);

const resetRules = () => {
  people.value.forEach((person) => {
    planData.value[person] = {};
  });
};

// 初始化每个人的计划数据
resetRules();

const previousMonth = () => {
  const date = dayjs(`${currentYear.value}-${currentMonth.value}-01`).subtract(
    1,
    "month"
  );
  currentYear.value = date.year();
  currentMonth.value = date.month() + 1;
  resetRules();
};

const nextMonth = () => {
  const date = dayjs(`${currentYear.value}-${currentMonth.value}-01`).add(
    1,
    "month"
  );
  currentYear.value = date.year();
  currentMonth.value = date.month() + 1;
  resetRules();
};

const ruleChange = (value) => {
  console.log("Selected plan:", planData.value);
};
</script>

<style lang="less">
// 变量定义
@primary-color: #409eff;
@border-color: #ddd;
@text-color: #333;
@text-light-color: #666;
@background-color: #fff;

.calendar-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 80vh;
  border: 1px solid @border-color;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  .calendar-header {
    padding: 20px;
    background: @background-color;
    border-bottom: 1px solid @border-color;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;

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
  }

  .calendar-table-container {
    flex: 1;
    padding: 0 20px;
    overflow: hidden;

    .date-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;

      .day-number {
        font-size: 14px;
        font-weight: bold;
        color: @text-color;
      }

      .weekday {
        font-size: 12px;
        color: @text-light-color;
      }
    }

    .cell-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      .cell-rule {
        display: flex;
        align-items: center;
        gap: 8px;
        .rule-name {
          font-size: 12px;
          color: @text-color;
          width: 80px;
        }
      }
    }

    .plan-select {
      width: 100%;
    }
  }
}
</style>
