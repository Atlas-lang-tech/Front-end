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
        path: "/admin/dashboard",
      },
    ],
  },
  {
    title: "Categories",
    buttons: [
      {
        title: "Add Category",
        icon: "plus",
        path: "/admin/categories/add",
      },
      {
        title: "All Categories",
        icon: "list",
        path: "/admin/categories",
      },
    ],
  },
];
