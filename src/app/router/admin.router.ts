import DashboardPage from "@/pages/admin/dashboard/DashboardPage.vue";
import CategoryPage from "@/pages/admin/categories/CategoryPage.vue";
import CategoryAddPage from "@/pages/admin/categories/add/CategoryAddPage.vue";

export const adminRoutes = [
  { path: "dashboard", component: DashboardPage },
  { path: "categories", component: CategoryPage },
  { path: "categories/add", component: CategoryAddPage },
];
