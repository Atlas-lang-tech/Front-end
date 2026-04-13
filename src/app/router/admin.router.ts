import DashboardAdminPage from "@/pages/admin/dashboard/DashboardAdminPage.vue";
import CategoryAdminPage from "@/pages/admin/categories/CategoryAdminPage.vue";
import CategoryAddAdminPage from "@/pages/admin/categories/add/CategoryAddAdminPage.vue";
import LanguagesAdminPage from "@/pages/admin/languages/LanguagesAdminPage.vue";
import LanguageCreateAdminPage from "@/pages/admin/languages/create/LanguageCreateAdminPage.vue";
import LanguageLevelsAdminPage from "@/pages/admin/languages/levels/LanguageLevelsAdminPage.vue";
import LanguageLevelCreateAdminPage from "@/pages/admin/languages/levels/create/LanguageLevelCreateAdminPage.vue";

export const adminRoutes = [
  { path: "dashboard", component: DashboardAdminPage },
  { path: "categories", component: CategoryAdminPage },
  { path: "categories/create", component: CategoryAddAdminPage },
  { path: "languages", component: LanguagesAdminPage },
  { path: "languages/create", component: LanguageCreateAdminPage },
  { path: "languages/levels", component: LanguageLevelsAdminPage },
  { path: "languages/levels/create", component: LanguageLevelCreateAdminPage },
];
