export const $PAGES = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    verifyEmail: "/auth/verify-email",
  },

  admin: {
    dashboard: "/admin/dashboard",
    categories: {
      list: "/admin/categories",
      create: "/admin/categories/create",
    },
    language: {
      list: "/admin/languages",
      create: "/admin/languages/create",
      languageLevel: {
        list: "/admin/languages/levels",
        create: "/admin/languages/levels/create",
      },
    },
  },
};
