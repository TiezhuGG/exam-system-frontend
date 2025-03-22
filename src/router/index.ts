import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "ExamList",
    component: () => import("../views/ExamList/index.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login/index.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register/index.vue"),
  },
  {
    path: "/updatePassword",
    name: "UpdatePassword",
    component: () => import("../views/UpdatePassword/index.vue"),
  },
  {
    path: "/edit/:id",
    name: "Edit",
    component: () => import("../views/Edit/index.vue"),
  },
  {
    path: "/exam/:id",
    name: "Exam",
    component: () => import("../views/Exam/index.vue"),
  },
  {
    path: "/result/:id",
    name: "Result",
    component: () => import("../views/Exam/Result.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
