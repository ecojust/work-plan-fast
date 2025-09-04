<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <button @click="previousMonth" class="nav-button">&lt;</button>
      <h2 class="month-title">{{ currentMonth }}月</h2>
      <button @click="nextMonth" class="nav-button">&gt;</button>
    </div>

    <div class="calendar-grid">
      <!-- 日期行 -->
      <div class="date-row">
        <div class="name-cell"></div>
        <div v-for="day in daysInMonth" :key="day" class="date-cell">
          {{ day }}
        </div>
      </div>

      <!-- 人员行 -->
      <div v-for="person in people" :key="person" class="person-row">
        <div class="name-cell">{{ person }}</div>
        <div
          v-for="day in daysInMonth"
          :key="`${person}-${day}`"
          class="schedule-cell"
        >
          <!-- 这里可以添加日程内容 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const currentMonth = ref(9); // 9月
const people = ref(["张三", "李四", "王五"]);

// 计算当月天数（简化版，这里固定为30天）
const daysInMonth = computed(() => {
  return Array.from({ length: 30 }, (_, i) => i + 1);
});

const previousMonth = () => {
  if (currentMonth.value > 1) {
    currentMonth.value--;
  } else {
    currentMonth.value = 12;
  }
};

const nextMonth = () => {
  if (currentMonth.value < 12) {
    currentMonth.value++;
  } else {
    currentMonth.value = 1;
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
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  gap: 20px;
}

.nav-button {
  background: none;
  border: 1px solid #ccc;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 16px;
}

.nav-button:hover {
  background-color: #f0f0f0;
}

.month-title {
  margin: 0;
  font-size: 24px;
  font-weight: normal;
}

.calendar-grid {
  border: 2px solid #333;
  display: inline-block;
}

.date-row,
.person-row {
  display: flex;
}

.name-cell {
  width: 80px;
  height: 40px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  font-weight: 500;
  color: red;
}

.date-cell {
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  font-weight: 500;
  color: blue;
}

.schedule-cell {
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  background-color: white;
}

.schedule-cell:hover {
  background-color: #f0f0f0;
}
</style>
