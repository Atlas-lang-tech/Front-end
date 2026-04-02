import { createRouter, createWebHistory } from "vue-router";
import { userRoutes } from "./user.router";
import UserLayout from "@/layout/UserLayout.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/user", component: UserLayout, children: userRoutes }],
});
