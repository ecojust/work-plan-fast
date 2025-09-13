<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <div class="left-operations">
        <el-button color="#009090" circle round @click="handleExport">
          <i class="iconfont icon-export1"></i>
        </el-button>
      </div>

      <div class="center">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="handleDateChange"
        />
      </div>

      <div class="right-operations">
        <el-button color="#00ff00" circle round @click="startScheduling">
          <i class="iconfont icon-weibiaoti518"></i>
        </el-button>

        <el-button color="red" circle round @click="clearResults">
          <i class="iconfont icon-clear"></i>
        </el-button>

        <el-button color="blue" circle round @click="showSettings">
          <i class="iconfont icon-setting"></i>
        </el-button>
      </div>
    </div>
    <div class="calendar-table-container">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :cell-class-name="cellClassName"
        :header-cell-class-name="cellClassName"
        id="commTable"
      >
        <el-table-column
          prop="name"
          label="姓名"
          width="150"
          fixed
          align="center"
        >
          <template #header>
            <div class="date-header">姓名</div>
          </template>
          <template #default="scope">
            <div class="cell-content">
              <b class="user-name">{{ scope.row.name }}</b>

              <div>
                <div class="work-details" v-for="t in workTypes" :key="t.value">
                  <span class="work-details-label">{{ t.label }}</span>
                  <span class="work-details-value">{{
                    getCount(scope.row.name, t.value)
                  }}</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="date"
          :label="day.weekdayIndex + ''"
          :weekIndex="day.weekdayIndex"
          width="160"
          v-for="day in days"
          :key="day.day"
        >
          <template #header>
            <div :class="['date-header']">
              <span class="day-number">{{ day.day }}</span>
              <span class="weekday">{{ day.weekday }}</span>
            </div>
          </template>
          <template #default="scope">
            <div :class="['cell-content']">
              <div class="cell-rule">
                <span class="rule-name">计划:</span>
                <el-select
                  @change="ruleChange"
                  v-model="planData[scope.row.name][`${day.fullDate}`]"
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
              <div class="cell-rule">
                <span class="rule-name">实际：</span>
                <b
                  :style="{
                    background: renderworkTypeColor(
                      realPlan[scope.row.name][`${day.fullDate}`]
                    ),
                  }"
                  >{{
                    renderworkType(realPlan[scope.row.name][`${day.fullDate}`])
                  }}</b
                >
              </div>

              <div class="cell-rule">
                <span class="rule-name">机制 ：</span>
                <span class="rule-type">{{
                  realPlan[scope.row.name][`${day.fullDate}Type`]
                }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          v-if="days.length == 0"
          prop="name"
          label="温馨提示"
          fixed
          align="center"
        >
          <template #default="scope">
            <div class="cell-content">
              <b class="user-name">请先选择日期范围</b>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 设置对话框 -->
    <el-dialog
      title="排班设置"
      width="60%"
      :destroy-on-close="false"
      :close-on-click-modal="false"
      center
      align-center
    >
      <Config v-if="showConfig" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeConfig">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="导出预览" v-model="exportPreviewVisible">
      <el-table :data="tableData" border style="width: 100%" id="previewTable">
        <el-table-column
          prop="name"
          label="姓名"
          width="150"
          fixed
          align="center"
        >
          <template #header>
            <div class="date-header">姓名</div>
          </template>
          <template #default="scope">
            <div class="cell-content">
              <b class="user-name">{{ scope.row.name }}</b>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="date"
          :label="day.weekdayIndex + ''"
          :weekIndex="day.weekdayIndex"
          width="160"
          v-for="day in days"
          :key="day.day"
        >
          <template #header>
            <div :class="['date-header']">
              <span class="day-number">{{ day.day }}</span>
              <span class="weekday">{{ day.weekday }}</span>
            </div>
          </template>
          <template #default="scope">
            <div :class="['cell-content']">
              <div class="cell-rule">
                <b>{{
                  renderworkType(realPlan[scope.row.name][`${day.fullDate}`])
                }}</b>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportPreviewVisible = false">关闭</el-button>
          <el-button @click="exportExcel">导出</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ElLoading, ElMessage } from "element-plus";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import random from "randomize";
import User from "../service/users";
import Schedule from "../service/schedules";
import Rule from "../service/rules";
import Config from "./Config.vue";
import ContributionGraph from "../components/ContributionGraph.vue";
import exportToExcel from "../service/exportToExcel";
import Util from "../service/utils";

const settingsVisible = ref(false);
const exportPreviewVisible = ref(false);
const showConfig = ref(false);

const showSettings = () => {
  showConfig.value = true;
  settingsVisible.value = true;
};
const dateRange = ref("");

// 设置为中文
dayjs.locale("zh-cn");
// 当前年份和月份
const currentYear = ref(dayjs().year());
const currentMonth = ref(dayjs().month() + 1);

const workTypes = ref(Schedule.getSchedules());
const tableData = ref([]);

// 存储计划数据
const planData = ref({});
const realPlan = ref({});

const people = computed(() => tableData.value.map((item) => item.name));

const eleIdPrefix = ref("prefix"); // 循环Dmo绑定的ID前缀

const handleExport = () => {
  if (days.value.length === 0) {
    ElMessage({
      message: "请先选择日期并排班",
      type: "warning",
    });
    return;
  }
  exportPreviewVisible.value = true;
};
const exportExcel = async () => {
  await exportToExcel("previewTable", "排班计划");
  exportPreviewVisible.value = false;
};

const cellClassName = ({ row, column, rowIndex, columnIndex }) => {
  return "d" + column.label;
};

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

const initAll = async () => {
  const loadingInstance = ElLoading.service();
  workTypes.value = await Schedule.getSchedules();
  tableData.value = await User.getUsers();
  resetRules();
  resetPlans();
  loadingInstance.close();
};

const clearResults = () => {
  resetPlans();
  resetRules();
};

const getCount = (person, type) => {
  let count = 0;
  days.value.forEach((day) => {
    if (
      realPlan.value[person] &&
      realPlan.value[person][`${day.fullDate}`] === type
    ) {
      count++;
    }
  });
  return count;
};

const renderworkType = (value) => {
  const type = workTypes.value.find((type) => type.value === value);
  return type ? type.label : "请排班";
};

const renderworkTypeColor = (value) => {
  const type = workTypes.value.find((type) => type.value === value);
  return type ? type.color : "";
};

const days = ref([]);

const handleDateChange = async (value) => {
  const loadingInstance = ElLoading.service();

  await Util.sleep(1000);

  initAll();
  const start = dayjs(value[0]);
  const end = dayjs(value[1]);

  // 计算开始和结束日期之间的所有天数
  const totalDays = end.diff(start, "day") + 1; // 包括结束日期
  const newDays = Array.from({ length: totalDays }, (_, i) => {
    const date = start.add(i, "day");
    return {
      day: date.date(),
      weekday: date.format("ddd"),
      fullDate: date.format("YYYY-MM-DD"),
      weekdayIndex: date.day(), // 获取星期几的索引，0表示星期天，1表示星期一，依此类推
    };
  });

  days.value = newDays;
  loadingInstance.close();
};

let restDays = 0; //一个月休息天数
let schedules = []; //班次计划
let maxConsecutiveDays = 0; //不连续上班天数,上5休1
const startScheduling = async () => {
  if (days.value.length === 0) {
    ElMessage({
      message: "请先选择日期范围",
      type: "warning",
    });
    return;
  }
  resetPlans();
  restDays = await Rule.getRest();
  maxConsecutiveDays = await Rule.getMaxConsecutiveDays();
  schedules = await Schedule.getSchedules();
  people.value.forEach((person) => {
    days.value.forEach((day, index) => {
      autoSchedule(day.fullDate, person, index);
    });
  });
  console.log("排班完成", realPlan.value);
};

const autoSchedule = (day, person, index) => {
  // 如果有个人计划，设置为"个人计划"
  if (planData.value[person][day]) {
    realPlan.value[person][`${day}`] = planData.value[person][day];
    realPlan.value[person][`${day}Type`] = "预计划";

    console.log("有个人计划，按计划排班", person, planData.value[person][day]);
    return;
  } else {
    const radomValue = random(workTypes.value.map((type) => type.value));
    realPlan.value[person][`${day}`] = radomValue;
    realPlan.value[person][`${day}Type`] = "随机";

    switch (day) {
      default:
        var lastday = days.value[index - 1] ? days.value[index - 1].day : 0;
        //1.互斥规则
        for (var r in schedules) {
          if (
            index > 0 &&
            realPlan.value[person][`${lastday}`] == r.last &&
            radomValue == r.now
          ) {
            autoSchedule(day, person, index);
            return;
          }
        }

        // 2.休假天数规则
        // let vacationDays = 0;
        // const vacationDaykey = "vacation";
        // const daysCount = days.value.length;

        // // 统计所有已经排班的休假天数（包括当前和之前的天数）
        // for (let d = 1; d <= daysCount; d++) {
        //   if (realPlan.value[person][`${d}`] === vacationDaykey) {
        //     vacationDays++;
        //   }
        // }
        // const remainingDays = daysCount - day + 1; // 包括当前天在内的剩余天数
        // const remainingVacations = restDays - vacationDays;
        // // 如果已经达到或超过休假天数限制，不能再安排休假
        // if (vacationDays >= restDays && radomValue === vacationDaykey) {
        //   autoSchedule(day, person);
        //   return;
        // }

        // // 如果剩余天数等于剩余休假天数，必须安排休假，再不休就没得休了
        // if (remainingVacations > 0 && remainingVacations === remainingDays) {
        //   realPlan.value[person][`${day}`] = vacationDaykey;
        //   console.log(
        //     `${day} 剩余天数(${remainingDays})等于剩余休假天数(${remainingVacations})，必须安排休息`
        //   );
        //   return;
        // }

        // // 如果剩余休假天数大于0但小于剩余天数，根据概率决定是否安排休假
        // if (remainingVacations > 0 && remainingVacations < remainingDays) {
        //   const probability = remainingVacations / remainingDays;
        //   if (Math.random() < probability && radomValue !== vacationDaykey) {
        //     realPlan.value[person][`${day}`] = vacationDaykey;
        //     console.log(`${day} 根据概率(${probability})自动安排休息`);
        //     return;
        //   }
        // }

        //3.不连续上班天数规则
        //比如上6休1，那么就是每7天中，必须有一天休息

        let sortIndex = (index + 1) % (maxConsecutiveDays + 1);
        const loopIndex = Math.floor(index / (maxConsecutiveDays + 1));

        sortIndex = sortIndex === 0 ? maxConsecutiveDays + 1 : sortIndex;

        const startIndex = loopIndex * (maxConsecutiveDays + 1) + 1;
        const endIndex = startIndex + sortIndex - 1;

        console.log(`${day}在${loopIndex}周期中的位置:${sortIndex}`);

        if (sortIndex > 1) {
          console.log(`需要关注的区间是:${startIndex}~${endIndex - 1}`);

          let start = startIndex;
          let hasVacation = false;
          while (start <= endIndex - 1) {
            const key = days.value[start - 1].fullDate;
            if (realPlan.value[person][key] === "vacation") {
              hasVacation = true;
              if (radomValue === "vacation") {
                console.log(
                  "区间内已经有假期,并且当前又排到假期，重新排:",
                  key
                );
                autoSchedule(day, person, index);
                return;
              }
            }
            start++;
          }

          if (sortIndex === maxConsecutiveDays + 1 && !hasVacation) {
            console.log(
              `${day} 在一个周期的最后一天，并且区间内没有休息日，强制安排休息`
            );
            realPlan.value[person][`${day}`] = "vacation";
            realPlan.value[person][`${day}Type`] = "强制";
          }
        }

        //(){} 检查前一天开始的连续工作天数

        // let consecutiveDays = 0;
        // for (let d = lastday; d > 0; d--) {
        //   if (realPlan.value[person][`${d}`] !== "vacation") {
        //     consecutiveDays++;
        //   } else {
        //     break;
        //   }
        // }
        // if (consecutiveDays >= maxConsecutiveDays) {
        //   realPlan.value[person][`${day}`] = "vacation";

        //   return;
        // }

        // console.log(`${day} 没有个人计划，自动排班${radomValue}`);

        return;
    }
  }
};

const previousMonth = () => {
  const date = dayjs(`${currentYear.value}-${currentMonth.value}-01`).subtract(
    1,
    "month"
  );
  currentYear.value = date.year();
  currentMonth.value = date.month() + 1;
  initAll();
};

const nextMonth = () => {
  const date = dayjs(`${currentYear.value}-${currentMonth.value}-01`).add(
    1,
    "month"
  );
  currentYear.value = date.year();
  currentMonth.value = date.month() + 1;
  initAll();
};

const ruleChange = (value) => {
  console.log("Selected plan:", planData.value);
};

const closeConfig = () => {
  settingsVisible.value = false;
  showConfig.value = false;
  initAll();
};

onMounted(() => {
  initAll();
});
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
  height: 100vh;
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

    position: relative;

    .center {
      width: 400px;
      text-align: center;
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
      color: black;
    }
    .left-operations {
      position: absolute;
      left: 20px;
      top: 20px;
      display: flex;
      gap: 10px;
      // .start-button {
      //   background: #44c662;
      //   color: white;
      // }
    }

    .right-operations {
      position: absolute;
      right: 20px;
      top: 20px;
      display: flex;
      gap: 10px;
      // .start-button {
      //   background: #44c662;
      //   color: white;
      // }
      // .setting-button {
      //   background: #4466ff;
      //   color: white;
      // }
    }
  }

  .calendar-table-container {
    flex: 1;
    padding: 0 20px;
    overflow: hidden;

    .el-table__cell {
      padding: 0 !important;
      .cell {
        padding: 0 !important;
      }
    }
    .date-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      // padding: 4px 8px;

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
    .el-table__cell.d0,
    .el-table__cell.d6 {
      background: #dbdbdb7e;
    }

    .el-table__cell {
      height: 60px !important;
    }

    .cell-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 4px 8px;
      height: 100%;

      .cell-rule {
        display: flex;
        align-items: center;
        gap: 8px;
        .rule-name {
          font-size: 12px;
          color: @text-color;
          width: 80px;
        }
        b {
          font-size: 12px;
          color: @text-color;
          width: 140px;
          border-radius: 4px;
          display: inline-block;
          text-align: center;
        }
        .rule-type {
          font-size: 12px;
          color: @text-color;
        }
      }
    }

    .plan-select {
      width: 100%;
    }
  }

  .configuration {
    padding: 20px;
    background: #f9f9f9;
    border-top: 1px solid @border-color;
    display: flex;
    justify-content: space-between;

    .work-type {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .el-tag {
        font-size: 12px;
      }
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      align-items: center;

      .el-button {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

.work-details {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 14px;
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
}
</style>
