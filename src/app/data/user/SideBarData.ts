import { $PAGES } from "@/app/configs/pages.config";

export interface SideBarButton {
  title: string;
  icon: string;
  path: string;
}

export interface SideBarCategory {
  title: string;
  buttons: SideBarButton[];
}

export const userSideBarData: SideBarCategory[] = [
  {
    title: "Account",
    buttons: [
      {
        title: "Profile",
        icon: "user",
        path: $PAGES.user.profile,
      },
      {
        title: "Settings",
        icon: "settings",
        path: $PAGES.user.settings,
      },
    ],
  },
];
