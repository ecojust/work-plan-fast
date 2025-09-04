import { createApp } from "vue";
import App from "./App.vue";

import ElementPlus from "element-plus";
import "element-plus/theme-chalk/index.css";
import "./styles/ghibli-theme.css";

import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import ganttastic from "@infectoone/vue-ganttastic";

const app = createApp(App);

//@ts-ignore
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  //@ts-ignore
  app.component(key, component);
}
app.use(ElementPlus);
app.use(ganttastic);
app.mount("#app");
