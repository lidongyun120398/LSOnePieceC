import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () => import("@/views/login/login.vue"), //路由懒加载
  },
  {
    path: "/home",
    component: () => import("@/views/main/home/home.vue"),
  },
];

export default routes;
