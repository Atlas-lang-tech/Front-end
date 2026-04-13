import DashboardPage from "@/pages/admin/dashboard/DashboardPage.vue";
import CategoryPage from "@/pages/admin/categories/CategoryPage.vue";
import CategoryAddPage from "@/pages/admin/categories/add/CategoryAddPage.vue";
import LanguagesPage from "@/pages/admin/languages/LanguagesPage.vue";
import LanguageCreatePage from "@/pages/admin/languages/create/LanguageCreatePage.vue";
import LanguageLevelsPage from "@/pages/admin/languages/levels/LanguageLevelsPage.vue";
import LanguageLevelCreatePage from "@/pages/admin/languages/levels/create/LanguageLevelCreatePage.vue";

export const adminRoutes = [
  { path: "dashboard", component: DashboardPage },
  { path: "categories", component: CategoryPage },
  { path: "categories/create", component: CategoryAddPage },
  { path: "languages", component: LanguagesPage },
  { path: "languages/create", component: LanguageCreatePage },
  { path: "languages/levels", component: LanguageLevelsPage },
  { path: "languages/levels/create", component: LanguageLevelCreatePage },
];
