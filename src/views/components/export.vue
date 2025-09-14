<template>
  <div class="export-container">
    <el-table
      :data="tableData"
      v-if="showResult"
      border
      style="width: 100%"
      id="previewTable"
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
            <span class="day-number"
              >{{ day.fullDate }}({{ day.weekday }})</span
            >
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
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import Schedule from "../../service/schedules";

const props = defineProps({
  tableData: {
    type: Array,
    required: true,
  },
  days: {
    type: Array,
    required: true,
  },
  realPlan: {
    type: Object,
    required: true,
  },
});

const workTypes = ref([]);

const showResult = ref(false);

const renderworkType = (value: any) => {
  const type = workTypes.value.find((type) => type.value === value);
  console.log("type", type);

  return type ? type.label : "请排班";
};

const formatData = async () => {
  showResult.value = false;
  workTypes.value = await Schedule.getSchedules();
  await nextTick();
  showResult.value = true;
};

defineExpose({
  formatData,
});
</script>

<style lang="less" scoped>
.export-container {
  padding: 20px;

  .actions {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .rule-section {
    margin-bottom: 30px;

    h3 {
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: 500;
    }
  }

  :deep(.el-tabs__content) {
    padding: 20px 0;
  }
}
</style>
