import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import "./assets/main.css";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";

const vuetify = createVuetify({
  icons: { defaultSet: "mdi", aliases, sets: { mdi } },
  theme: {
    defaultTheme: "dark",
    themes: {
      light: { colors: { primary: "#6366f1", secondary: "#22d3ee" } },
      dark: { colors: { primary: "#818cf8", secondary: "#22d3ee" } },
    },
  },
});

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.mount("#app");
