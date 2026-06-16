import DictionaryDetailPage from "@/pages/user/vocabulary/detail/DictionaryDetailPage.vue";
import VocabularyPage from "@/pages/user/vocabulary/VocabularyPage.vue";
import ProfilePage from "@/pages/user/profile/ProfilePage.vue";
import SettingsPage from "@/pages/user/settings/SettingsPage.vue";

export const userRoutes = [
  { path: "profile", component: ProfilePage, meta: { breadcrumb: "Profile" } },
  { path: "settings", component: SettingsPage, meta: { breadcrumb: "Settings" } },
  {
    path: "vocabulary",
    component: VocabularyPage,
    meta: { breadcrumb: "Vocabulary" },
  },
  {
    path: "vocabulary/:dictionaryId",
    component: DictionaryDetailPage,
    meta: { breadcrumb: "Dictionary" },
  },
];
