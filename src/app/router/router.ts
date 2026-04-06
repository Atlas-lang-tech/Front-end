import { createRouter, createWebHistory } from "vue-router";
import { userRoutes } from "./user.router";
import UserLayout from "@/layout/UserLayout.vue";
import AdminLayout from "@/layout/AdminLayout.vue";
import { adminRoutes } from "./admin.router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/user", component: UserLayout, children: userRoutes },
    { path: "/admin", component: AdminLayout, children: adminRoutes },
  ],
});
