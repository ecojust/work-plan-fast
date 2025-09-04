<template>
  <div :class="{ showHeader: showHeader, showBar: showBar, adad: true }">
    <div class="float-allowance">{{ allowance }}</div>
    <g-gantt-chart
      :chart-start="chartStart"
      :chart-end="chartEnd"
      precision="hour"
      bar-start="myBeginDate"
      bar-end="myEndDate"
      @dragend-bar="onDragendBar($event.bar, $event.e, $event.movedBars)"
    >
      <g-gantt-row :bars="bardata" />
    </g-gantt-chart>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import Utils from "../../utils";

const emit = defineEmits(["on-dragend"]);

const props = defineProps({
  showHeader: true,
  showBar: true,
  currentDay: "2021-07-14",
  bardata: {
    default: () => {
      return [
        {
          myBeginDate: "2021-07-13 20:00",
          myEndDate: "2021-07-14 08:00",
          allowance: 100,
          ganttBarConfig: {
            id: "another-unique-id-2",
            hasHandles: true,
            label: "大夜班",
            style: {
              // arbitrary CSS styling for your bar
              background: "#e09b69",
              borderRadius: "0px",
              color: "black",
            },
          },
        },
      ];
    },
  },
});

const allowance = computed(() => {
  const bardata = props.bardata;
  if (bardata && bardata[0]) {
    return bardata[0].allowance;
  }
});

const chartStart = computed(() => {
  return Utils.getDate(props.currentDay, 0) + " 06:00";
});

const chartEnd = computed(() => {
  return Utils.getDate(props.currentDay, 24) + " 12:00";
});

const onDragendBar = (bar, e, movedBars) => {
  bar.myBeginDate = Utils.generateNewTime(new Date(bar.myBeginDate).getTime());
  bar.myEndDate = Utils.generateNewTime(new Date(bar.myEndDate).getTime());

  if (bar.myBeginDate === bar.myEndDate) {
    bar.myEndDate = Utils.generateNewTime(
      new Date(bar.myEndDate).getTime() + 60 * 60 * 1000
    );
  }

  bar.ganttBarConfig.label = `${bar.myBeginDate.split(" ")[1]} - ${
    bar.myEndDate.split(" ")[1]
  }`;
  bar.ganttBarConfig.style.color = "black";

  emit("on-dragend", bar);
};

const updateGanttBarConfig = () => {
  if (props.bardata && props.bardata[0]) {
    props.bardata[0].ganttBarConfig.label = `${
      props.bardata[0].myBeginDate.split(" ")[1]
    } - ${props.bardata[0].myEndDate.split(" ")[1]}`;
    props.bardata[0].ganttBarConfig.style.color = "black";
  }

  console.log("updateGanttBarConfig");
};

watch(
  props.bardata,
  () => {
    //
    updateGanttBarConfig();
  },
  {
    deep: true,
    immediate: true,
  }
);

onMounted(() => {});
</script>

<style lang="less">
.adad {
  position: relative;
  .float-allowance {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
  }
}
.g-gantt-chart {
  .g-timeaxis {
    height: 0px;
    display: none;
  }
  .g-gantt-rows-container {
    height: 0px;
    display: none;
    .g-gantt-row-bars-container {
      border: none;
    }
  }
}
.g-gantt-tooltip {
  // display: none;
}
.g-timeunits-container {
  .g-upper-timeunit {
    color: transparent !important;
    position: relative;
  }
  // .g-upper-timeunit:nth-child(1):after {
  //   content: "前一天";
  //   display: inline-block;
  //   margin: auto;
  //   position: absolute;
  //   font-size: 10px;
  //   color: black;
  // }
  .g-upper-timeunit:nth-child(1):after {
    content: "当天";
    display: inline-block;
    margin: auto;
    position: absolute;
    font-size: 10px;
    color: black;
  }
  .g-upper-timeunit:nth-child(2):after {
    content: "后一天";
    display: inline-block;
    margin: auto;
    position: absolute;
    font-size: 10px;
    color: black;
  }
}

.showHeader {
  .g-gantt-chart {
    .g-timeaxis {
      height: 30px;
      display: block;
    }
  }
}

.showBar {
  .g-gantt-chart {
    .g-gantt-rows-container {
      height: 40px;
      display: block;
    }
  }
}
</style>
