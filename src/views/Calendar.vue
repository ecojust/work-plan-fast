<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button class="nav-button" @click="previousMonth">&lt;</button>
      <span class="month-title">{{ currentYear }}年{{ currentMonth }}月</span>
      <button class="nav-button" @click="nextMonth">&gt;</button>
    </div>
    <div class="calendar-table-container">
      <el-button @click="startScheduling">开始排班</el-button>
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
                  v-model="planData[scope.row.name][`${day.day}`]"
                  class="plan-select"
                  placeholder="选择计划"
                  size="small"
                >
                  <el-option
                    v-for="type in workTypes"
                    :key="type.value"
                    :label="type.label"
                    :value="type.value"
                  />
                </el-select>
              </div>
              <div class="cell-plan">
                实际：

                <el-tag
                  :type="
                    realPlan[scope.row.name][`${day.day}`] == 1
                      ? 'success'
                      : realPlan[scope.row.name][`${day.day}`] == 4
                      ? 'warning'
                      : 'info'
                  "
                  >{{
                    renderworkType(realPlan[scope.row.name][`${day.day}`])
                  }}</el-tag
                >
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="work-type">
      <div v-for="type in workTypes" :key="type.value">
        <el-tag> {{ type.value }}. {{ type.label }} </el-tag>
      </div>
    </div>

    <div class="common-rule">
      <h3>常用规则</h3>
      <div>上一个班次为4，那么当前排班不能是2</div>
      <div>每个人每个月休8天</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import random from "randomize";

// 设置为中文
dayjs.locale("zh-cn");

// 当前年份和月份
const currentYear = ref(dayjs().year());
const currentMonth = ref(dayjs().month() + 1);

const workTypes = ref([
  { label: "休假", value: 1 },
  { label: "7:00-15:00", value: 2 },
  { label: "10:00-18:00", value: 3 },
  { label: "14:00-22:00", value: 4 },
]);

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
const realPlan = ref({});

const tableData = ref([
  { name: "张三", date: "2024-06-01", rules: [] },
  { name: "李四", date: "2024-06-02", rules: [] },
  { name: "王五", date: "2024-06-03", rules: [] },
]);
const people = computed(() => tableData.value.map((item) => item.name));

const resetRules = () => {
  people.value.forEach((person) => {
    planData.value[person] = {};
  });
};

const resetPlans = () => {
  people.value.forEach((person) => {
    realPlan.value[person] = {};
  });
};

const startScheduling = () => {
  resetPlans();
  people.value.forEach((person) => {
    days.value.forEach((day) => {
      autoSchedule(day.day, person);
    });
  });

  console.log("排班完成", realPlan.value);
};

const renderworkType = (value) => {
  const type = workTypes.value.find((type) => type.value === value);
  return type ? type.label : "未知";
};

const autoSchedule = (day, person) => {
  const vacationDaykey = 1;
  // 如果有个人计划，设置为"个人计划"
  if (planData.value[person][day]) {
    realPlan.value[person][`${day}`] = planData.value[person][day];
    console.log("有个人计划，按计划排班", person, planData.value[person][day]);
    return;
  } else {
    const radomValue = random(1, 2, 3, 4);
    realPlan.value[person][`${day}`] = radomValue;

    switch (day) {
      // case 1:
      //   break;

      default:
        var lastday = day - 1;
        // 常用规则：上一个班次为4，那么当前排班不能是2
        if (realPlan.value[person][`${lastday}`] == 4 && radomValue == 2) {
          // console.log("上个班为4，当前班为2，重新排班");
          autoSchedule(day, person);
          return;
        }
        // 计算当前已经休假的天数
        let vacationDays = 0;
        for (let d = 1; d < day; d++) {
          if (realPlan.value[person][`${d}`] === vacationDaykey) {
            vacationDays++;
          }
        }
        const remainingVacations = 8 - vacationDays;
        // 如果剩余休假天数小于等于0，且当前排班为休假，则重新排班
        if (remainingVacations <= 0 && radomValue === vacationDaykey) {
          // console.log("剩余休假天数不足，重新排班");
          autoSchedule(day, person);
          return;
        }
        // 如果剩余休假天数大于剩余天数，则必须安排休
        const daysCount = days.value.length;

        if (day > daysCount - 8) {
          // 最后8天，如果剩余天数等于剩余休假天数，则必须安排休
          const remainingDays = daysCount - day + 1;

          if (remainingDays === remainingVacations) {
            realPlan.value[person][`${day}`] = vacationDaykey;
            console.log(`${day} 剩余天数等于剩余休假天数，必须安排休息`);
            return;
          }
        }
        console.log(`${day} 没有个人计划，自动排班${radomValue}`);

        return;
    }
  }
};

// 初始化每个人的计划数据
resetRules();
resetPlans();

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
