import { $PAGES } from "@/app/configs/pages.config";

export interface SideBarCategory {
  title: string;
  buttons: SideBarButton[];
}
export interface SideBarButton {
  title: string;
  icon: string;
  path: string;
}

export const sideBarData: SideBarCategory[] = [
  {
    title: "Main",
    buttons: [
      {
        title: "Dashboard",
        icon: "gauge",
        path: $PAGES.admin.dashboard,
      },
    ],
  },
  {
    title: "Categories",
    buttons: [
      {
        title: "Add Category",
        icon: "plus",
        path: $PAGES.admin.categories.create,
      },
      {
        title: "All Categories",
        icon: "list",
        path: $PAGES.admin.categories.list,
      },
    ],
  },
  {
    title: "Languages",
    buttons: [
      {
        title: "Add Language",
        icon: "plus",
        path: $PAGES.admin.language.create,
      },
      {
        title: "Add language Level",
        icon: "plus",
        path: $PAGES.admin.language.languageLevel.create,
      },
      {
        title: "All Languages",
        icon: "list",
        path: $PAGES.admin.language.list,
      },
      {
        title: "All language Levels",
        icon: "list",
        path: $PAGES.admin.language.languageLevel.list,
      },
    ],
  },
  {
    title: "Courses",
    buttons: [
      {
        title: "Add Course",
        icon: "plus",
        path: $PAGES.admin.course.create,
      },
      {
        title: "All Courses",
        icon: "list",
        path: $PAGES.admin.course.list,
      },
    ],
  },
];
