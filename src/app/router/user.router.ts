import ProfilePage from "@/pages/user/profile/ProfilePage.vue";
import SettingsPage from "@/pages/user/settings/SettingsPage.vue";

export const userRoutes = [
  { path: "profile", component: ProfilePage, meta: { breadcrumb: "Profile" } },
  { path: "settings", component: SettingsPage, meta: { breadcrumb: "Settings" } },
];
