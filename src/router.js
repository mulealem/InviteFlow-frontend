import { createRouter, createWebHistory } from "vue-router";
import Landing from "./views/Landing.vue";

const routes = [
  { path: "/", component: Landing },
  { path: "/app", redirect: "/" },
];

const router = createRouter({ history: createWebHistory(), routes });
export default router;
