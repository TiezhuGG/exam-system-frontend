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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
