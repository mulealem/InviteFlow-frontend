<template>
  <v-container class="py-0 px-0">
    <div class="hero">
      <div class="hero-overlay">
        <div class="hero-content">
          <div class="title">InviteFlow – Event Invitation Automation</div>
          <div class="subtitle">
            Automation for event invitations — from DOCX + CSV to beautiful PDFs
            with QR codes.
          </div>
          <div class="pills">
            <v-chip
              color="primary"
              variant="flat"
              prepend-icon="mdi-file-search"
              >Analyze</v-chip
            >
            <v-chip color="primary" variant="flat" prepend-icon="mdi-qrcode"
              >QR Add</v-chip
            >
            <v-chip color="primary" variant="flat" prepend-icon="mdi-zip-box"
              >Merge & Zip</v-chip
            >
          </div>
        </div>
      </div>
    </div>
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10">
          <v-card elevation="1">
            <v-card-item>
              <v-card-title class="text-h6">Get Started</v-card-title>
              <v-card-subtitle
                >Use the steps below to analyze your template and generate
                documents.</v-card-subtitle
              >
            </v-card-item>
            <v-divider />
            <v-card-text>
              <AppFlow />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import AppFlow from "./AppFlow.vue";
export default { name: "Landing", components: { AppFlow } };
</script>

<style scoped>
.hero {
  position: relative;
  height: 260px;
  background-image: linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)),
    url("https://coolbackgrounds.imgix.net/2SvDjcgyav5C1DOb79JKXl/d3b06db5bb6bdb4ab237f666b5b4980e/compute-ea4c57a4.png?w=3840&q=60&auto=format,compress");
  background-size: cover;
  background-position: center;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-content {
  text-align: center;
  color: white;
  padding: 12px 16px;
}
.title {
  font-size: 32px;
  font-weight: 700;
}
.subtitle {
  opacity: 0.95;
  margin-top: 6px;
}
.pills {
  margin-top: 12px;
  display: inline-flex;
  gap: 8px;
}
</style>
