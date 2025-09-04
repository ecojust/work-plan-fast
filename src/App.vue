<template>
  <el-table class="table-gantt" :data="fixedTable" :style="fixedStyle">
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column align="center">
      <template #header>
        <div class="header-time">
          <el-icon @click="handleChangeDay(-24)" class="lll"
            ><ArrowLeftBold
          /></el-icon>
          <span
            >{{ date }} <b class="holiday-label">{{ holidayLabel }}</b></span
          >
          <el-icon @click="handleChangeDay(24)" class="rrr"
            ><ArrowRightBold
          /></el-icon>
        </div>
      </template>
      <template #default="scope">
        <Gantt
          :key="Math.random()"
          :bardata="scope.row.bardata"
          :showHeader="scope.row.showHeader"
          :showBar="scope.row.showBar"
          :currentDay="scope.row.date"
          @on-dragend="handleDragEnd"
        />
      </template>
    </el-table-column>
  </el-table>

  <el-table
    :key="dataKey"
    :data="tableData"
    :style="tableStyle"
    :show-header="false"
  >
    <el-table-column prop="name" label="姓名" width="180" />
    <el-table-column align="center">
      <template #header>
        <div class="header-time">
          <el-icon @click="handleChangeDay(-24)" class="lll"
            ><ArrowLeftBold
          /></el-icon>
          <span
            >{{ date }} <b class="holiday-label">{{ holidayLabel }}</b></span
          >
          <el-icon @click="handleChangeDay(24)" class="rrr"
            ><ArrowRightBold
          /></el-icon>
        </div>
      </template>
      <template #default="scope">
        <Gantt
          :bardata="scope.row.bardata"
          :showHeader="scope.row.showHeader"
          :showBar="scope.row.showBar"
          :currentDay="scope.row.date"
          @on-dragend="handleDragEnd"
        />
      </template>
    </el-table-column>
  </el-table>

  <el-button
    :icon="Setting"
    type="danger"
    class="show-operation"
    round
    circle
    @click="settingVisible = true"
  >
  </el-button>

  <el-dialog
    v-model="settingVisible"
    title="Tips"
    width="500"
    :show-close="false"
  >
    <span>
      <ul>
        <!-- <li>时间解析+2，自动计算到endtime</li> -->
        <!-- <li>1.时间解析+2，自动计算到endtime</li> -->
      </ul>
    </span>

    <div>
      <el-upload
        :auto-upload="false"
        @before-upload="handleUpload"
        @change="handleUpload"
        class="upload-demo"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
      >
        <el-button round type="primary">上传Excel</el-button>
      </el-upload>
      <!-- <el-button type="primary" round @click="handleReload">页面刷新</el-button> -->

      <el-button type="primary" round @click="handleOpenAllowance"
        >津贴计算</el-button
      >

      <el-button type="primary" round @click="handleSetHoliday"
        >三倍工资日设置</el-button
      >
    </div>
    <template #footer>
      <div class="dialog-footer">
        <span class="version"> {{ appVersion }}</span>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    class="allowance-visible"
    v-model="allowanceVisible"
    title="Allowance"
    width="800"
    :show-close="false"
  >
    <template #header="{}">
      <div class="my-header">
        <div>Allowance</div>
        <span class="count">¥ {{ count }}</span>
      </div>
    </template>

    <div class="operation">
      <div width="300px">
        <el-date-picker
          v-model="dateRange"
          @change="handleChangeDate"
          :picker-options="pickerOptions"
          type="daterange"
          range-separator="To"
          start-placeholder="Start date"
          end-placeholder="End date"
        />
      </div>

      <el-radio-group v-model="mode" size="default">
        <el-radio-button label="calendar" value="calendar" />
        <el-radio-button label="person" value="person" />
      </el-radio-group>
    </div>

    <br />
    <br />

    <el-scrollbar height="300px">
      <el-calendar v-if="mode == 'calendar'" :range="calendarRange">
        <template #date-cell="{ data }">
          <div :class="{ checked: allowances[data.day] }">
            <div v-if="allowances[data.day]">
              <el-tooltip
                :show-after="300"
                v-if="allowances[data.day]?.count > 0"
                placement="top"
                raw-content
                :content="
                  allowances[data.day]?.details
                    .map((i) => {
                      return `${i.name}
              : ¥ ${i.value} </br>`;
                    })
                    .join('')
                "
              >
                <p>
                  {{ data.day.split("-").slice(1).join("-") }}<br />

                  <span class="count-small">
                    ¥ {{ allowances[data.day]?.count }}
                  </span>
                </p>
              </el-tooltip>
              <p v-else>
                {{ data.day.split("-").slice(1).join("-") }}
                <br />
                <span class="count-small">
                  ¥ {{ allowances[data.day]?.count }}
                </span>
              </p>
            </div>

            <p v-else>
              {{ data.day.split("-").slice(1).join("-") }}
            </p>
          </div>
        </template>
      </el-calendar>

      <el-table v-else class="user-table" height="300px" :data="usersTable">
        <el-table-column prop="name" label="Name" width="120">
          <template #default="scope">
            <div :style="{ color: '#2B9EB3', fontWeight: 900 }">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sum" label="Sum" width="90" />

        <el-table-column align="center">
          <template #header>
            <div class="header-time">Details</div>
          </template>
          <template #default="scope">
            <div class="day-block" v-for="i in scope.row.details" :key="i.date">
              {{ i.date }}
              <div>{{ i.value }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
  </el-dialog>

  <el-dialog
    title="紫色代表三倍工资日"
    :show-close="false"
    v-model="isHolidaySetting"
    width="800"
  >
    <el-scrollbar height="300px">
      <div class="holiday-year" v-for="y in allHolidays" :key="y.year">
        <div>{{ y.year }}</div>

        <div
          @click="toggleReal(h)"
          :class="['holiday-item', h.isReal ? 'isReal' : '']"
          v-for="h in y.holidays"
          :key="h"
        >
          <span class="date">{{ h.date }}</span
          ><br />
          {{ h.name }}
        </div>
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { Setting } from "@element-plus/icons-vue";
import { getVersion } from "@tauri-apps/api/app";
import Gantt from "./components/gantt/index.vue";
import Data from "./data";
import Utils from "./utils";
import Fetch from "./fetch";
import Lowdb from "./lowdb";
import Sheet from "./sheet";
import * as XLSX from "xlsx";

const { y, md } = Utils.getNow();

const mode = ref("calendar");

const year = ref(y);
const day = ref(md);
const dateRange = ref("");

// const calendarRange = ref([
//   new Date(),
//   new Date(new Date().getTime() + 1000 * 60 * 60),
// ]);

// const calendarRange = ref([new Date("2025-03-03"), new Date("2025-03-09")]);
const calendarRange = ref([new Date(2025, 3, 3), new Date(2025, 3, 9)]);

const pickerOptions = ref({
  disabledDate: (time) => {
    const maxDays = 10; // 两个月大概有60天
    if (dateRange.value.length === 0) {
      return false; // 如果没有选择日期，不禁用任何日期
    }

    const startTime = dateRange.value[0];

    // 如果开始日期存在，计算结束日期的范围
    const endTime = startTime
      ? new Date(startTime).getTime() + maxDays * 24 * 60 * 60 * 1000
      : null;

    if (time.getTime() < startTime || time.getTime() > endTime) {
      return true; // 禁用超过两个月范围的日期
    }
    return false;
  },
});

const settingVisible = ref(false);
const allowanceVisible = ref(false);

const appVersion = ref("");

const dataKey = ref(Math.random());

const fixedStyle = computed(() => {
  return {
    width: "100%",
    height: "106px",
  };
});

const tableStyle = computed(() => {
  return {
    width: "100%",
    height: window.innerHeight - 130 + "px",
  };
});

const dayFile = computed(() => {
  return `${year.value}-${day.value}.json`;
});

const date = computed(() => {
  return `${year.value}-${day.value}`;
});

const holidayLabel = computed(() => {
  const find = holidays.value.find((h) => h.date == date.value);
  if (find) {
    return find.name;
  }
  return ``;
});

const fixedTable = ref([]);
const tableData = ref([]);
const allowances = ref({});
const usersTable = ref([]);
const count = ref(0);

const isHolidaySetting = ref(false);
const allHolidays = ref([]);

const toggleReal = async (h) => {
  h.isReal = !h.isReal;
  await Lowdb.writeFile("holidays.json", JSON.stringify(allHolidays.value));
};

const handleOpenAllowance = () => {
  settingVisible.value = false;
  allowanceVisible.value = true;
};

const handleSetHoliday = async () => {
  settingVisible.value = false;
  isHolidaySetting.value = true;
  allHolidays.value = await Lowdb.getData("holidays.json");
};

const getDayAllowance = async (day) => {
  const alldata = await Lowdb.getData(`${day}.json`);

  const holidays = await Utils.getHolidays();

  console.log("getDayAllowance - holidays", holidays);
  let sum = [];
  alldata.forEach((item) => {
    const n = Utils.calculateAllowance(
      item.startTimeN,
      item.endTimeN,
      holidays
    );
    if (n > 0) {
      sum.push({
        name: item.name,
        value: n,
      });
    }
  });
  return sum;
};

const handleChangeDate = async () => {
  calendarRange.value = dateRange.value;
  allowances.value = {};

  const days = Utils.getDatesBetween(
    calendarRange.value[0].getTime(),
    calendarRange.value[1].getTime()
  );

  let rangeCount = 0;

  const users = new Map();

  for (var i = 0; i < days.length; i++) {
    var day = days[i];

    const details = await getDayAllowance(day);
    const dayCount = details.reduce((accumulator, item) => {
      if (!users.has(item.name)) {
        users.set(item.name, []);
      }

      if (item.value > 0) {
        users.get(item.name).push({
          date: day,
          value: item.value,
        });
      }

      return accumulator + item.value;
    }, 0);
    allowances.value[day] = {
      count: dayCount,
      details: details,
    };
    rangeCount += dayCount;
  }

  count.value = rangeCount;

  users.forEach((item, key) => {
    item.sort((a, b) => {
      return a.value - b.value;
    });
  });

  var uerTable = [...users];

  uerTable = uerTable.map((item) => {
    return {
      name: item[0],
      details: item[1],
      sum: item[1].reduce((accumulator, item) => {
        return accumulator + item.value;
      }, 0),
    };
  });

  // uerTable.sort((a, b) => {
  //   return b.name - a.name;
  // });

  uerTable.sort((a, b) => a.name.localeCompare(b.name, "en"));

  usersTable.value = uerTable;

  console.log("dateRange", allowances.value, uerTable);
};

const handleReload = () => {
  window.location.reload();
};

const handleDragEnd = async (bar) => {
  await Lowdb.updateRow(dayFile.value, {
    name: bar.ganttBarConfig.id,
    startTimeN: bar.myBeginDate,
    endTimeN: bar.myEndDate,
  });
  getCurrentData();
};

// 读取本地excel文件
const readWorkbookFromLocalFile = (file, callback) => {
  var reader = new FileReader();
  reader.onload = function (e) {
    var data = e.target.result;
    var workbook = XLSX.read(data, { type: "binary" });
    if (callback) callback(workbook);
  };
  reader.readAsBinaryString(file);
};

const handleUpload = (file) => {
  readWorkbookFromLocalFile(file.raw, (book) => {
    Sheet.parseBook(book, year.value);
    setTimeout(getCurrentData, 1000);
  });
  return false;
};

const handleChangeDay = (offset) => {
  const newday = Utils.getDate(date.value, offset).split("-");
  day.value = `${newday[1]}-${newday[2]}`;
  getCurrentData();
};

const getCurrentData = async () => {
  const data = await Lowdb.getData(dayFile.value);
  console.log("origindata", dayFile);
  const convertData = await Data.convertToGantt(data, date.value);
  fixedTable.value = [
    {
      date: date.value,
      bardata: [],
      showHeader: true,
    },
  ];
  tableData.value = convertData;
  dataKey.value = Math.random();
};

const holidays = ref([]);

// Add debounce function
const debounce = (fn, delay) => {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

// Add resize handler
const handleResize = debounce(() => {
  window.location.reload();
}, 300);

onMounted(async () => {
  getCurrentData();
  appVersion.value = await getVersion();
  window.addEventListener("resize", handleResize);
});

// Clean up event listener
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style lang="less">
.table-gantt {
  .el-table__header {
    // height: 105px;
  }
  .el-table__row {
    pointer-events: none;
  }
}

.header-time {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  i {
    cursor: pointer;
  }
  .holiday-label {
    color: rgb(194, 7, 7);
    margin-left: 10px;
  }
  * {
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10+ and Edge */
    user-select: none; /* 标准语法 */
  }
}
.show-operation {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 999;
}
.allowance-visible {
  text-align: center;
  position: relative;
  .my-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    color: var(--ghibli-primary) !important;
    font-weight: 900;
    .count {
      font-size: 26px;
      font-weight: 900;
      color: var(--ghibli-primary) !important;
      // position: absolute;
      // right: 20px;
      // top: 58px;
    }
  }

  .operation {
    display: flex;
    justify-content: space-between;
  }

  .count-small {
    font-size: 14px;
    font-weight: 900;
    color: var(--ghibli-primary) !important;
  }
  .checked {
    // background: rgb(79, 168, 220);
  }

  .day-block {
    display: inline-block;
    width: 100px;
    color: var(--ghibli-primary) !important;
    border: 2px solid var(--ghibli-primary);
    margin: 4px;
    padding: 4px;
    border-radius: 4px;
  }
}

.upload-demo {
  display: inline-block;
  margin-right: 10px;
}

.version {
  font-family: var(--ghibli-font-family-title) !important;
}

.holiday-year {
  margin-bottom: 20px;

  .holiday-item {
    display: inline-block;
    width: 80px;
    // height: 40px;
    // border: 1px solid blue;
    margin: 5px;
    padding: 5px;
    border-radius: 4px;
    text-align: center;
    vertical-align: middle;
    font-size: 10px;
    cursor: pointer;
    .date {
      font-size: 12px;
      font-weight: 900;
    }
  }
  .holiday-item.isReal {
    background: var(--ghibli-info);
    color: white;
  }
}
</style>
