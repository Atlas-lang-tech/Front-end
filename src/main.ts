import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./app/router/router";
import { createPinia } from "pinia";
import { PiniaColada } from "@pinia/colada";

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

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(PiniaColada, {});
app.mount("#app");
