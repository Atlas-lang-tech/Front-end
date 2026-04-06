import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./app/router/router";

const initTheme = () => {
  if (
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

initTheme();

const app = createApp(App);
app.use(router);
app.mount("#app");
