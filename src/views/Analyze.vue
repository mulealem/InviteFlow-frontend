<template>
  <v-container class="py-6">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card elevation="1">
          <v-card-title class="text-h6">Analyze Template</v-card-title>
          <v-card-text>
            <form @submit.prevent="submit">
              <v-file-input
                ref="file"
                accept=".docx"
                label="Template (.docx)"
                prepend-icon="mdi-file-word"
                required
              />
              <v-btn
                type="submit"
                color="primary"
                class="mt-2"
                :loading="loading"
                prepend-icon="mdi-text-search"
                >Analyze</v-btn
              >
            </form>
            <v-alert v-if="error" type="error" class="mt-3" density="compact">{{
              error
            }}</v-alert>
            <div v-if="result" class="mt-3">
              <div class="mb-2">
                <strong>Variables:</strong> {{ result.variables?.join(", ") }}
              </div>
              <v-sheet
                color="grey-lighten-4"
                rounded
                class="pa-3"
                style="white-space: pre-wrap; overflow: auto"
              >
                {{ result.csvContent }}
              </v-sheet>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "AnalyzeView",
  data() {
    return { loading: false, result: null, error: "" };
  },
  methods: {
    async submit() {
      this.loading = true;
      this.result = null;
      this.error = "";
      const fd = new FormData();
      const f = this.$refs.file.files?.[0];
      if (!f) {
        this.error = "Select a template";
        this.loading = false;
        return;
      }
      fd.append("template", f);
      try {
        const res = await fetch("/analyze-template", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Analyze failed");
        this.result = data;
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped></style>
