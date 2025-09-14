<template>
  <div class="version-container">
    <h2 style="text-align: center">当前版本</h2>

    <div style="text-align: left">
      <p>版本号：{{ version }}</p>
      <p>构建时间：{{ time }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {} from "vue";

const props = defineProps<{
  version: string;
  time: string;
}>();
</script>

<style lang="less" scoped>
.version-container {
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
