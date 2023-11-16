import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import "./tailwind.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router/index";
import "./assets/css/reset.css";

// 注册elementicon
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(createPinia()).use(router).use(ElementPlus).mount("#app");
