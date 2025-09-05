<template>
  <v-app>
    <v-app-bar density="comfortable" elevation="1">
      <v-app-bar-title>InviteFlow</v-app-bar-title>
      <v-spacer />
      <!-- <v-btn variant="text" to="/" prepend-icon="mdi-home">Home</v-btn>
      <v-divider vertical class="mx-2" /> -->
      <v-btn
        icon="mdi-theme-light-dark"
        @click="toggleTheme"
        :title="`Switch to ${isDark ? 'light' : 'dark'} theme`"
      />
    </v-app-bar>
    <v-main
      class="min-h-screen bg-app-gradient bg-no-repeat bg-[length:140%_140%,120%_120%,100%_100%] animate-float-gradient"
    >
      <v-container class="py-6">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const isDark = computed(() => theme.global.current.value.dark);
function toggleTheme() {
  theme.global.name.value = isDark.value ? "light" : "dark";
}
</script>

<style></style>
