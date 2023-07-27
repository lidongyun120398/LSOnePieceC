// 1. 导入
import { defineStore } from "pinia";
// 2. 使用
const useDemoStore = defineStore("demoStore", {
  state: () => {
    return {
      counter: 0,
    };
  },
  actions: {},
  getters: {},
  // 持久化存储插件其他配置
  persist: {
    enabled: true,
    strategies: [
      // 修改存储中使用的键
      // 修改为 sessionStora
      // 部分持久化状态的点
      { key: "userInfo", storage: sessionStorage, paths: ["routes", "userInfo"] }, // routes 和 userInfo字段用sessionStorage存储
      { key: "token", storage: localStorage, paths: ["token"] }, // token字段用 localstorage存储
    ],
  },
});
// 3. 导出
export default useDemoStore;
