<template>
  <v-container class="py-6">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card elevation="1">
          <v-card-title class="text-h6">Generate Documents</v-card-title>
          <v-card-text>
            <form @submit.prevent="submit">
              <v-file-input
                ref="template"
                accept=".docx"
                label="Template (.docx)"
                prepend-icon="mdi-file-word"
                required
              />
              <v-file-input
                ref="csv"
                accept=".csv"
                label="CSV"
                prepend-icon="mdi-file-delimited"
                required
              />
              <v-btn
                type="submit"
                color="primary"
                class="mt-2"
                :loading="loading"
                prepend-icon="mdi-cog"
                >Generate</v-btn
              >
            </form>
            <v-alert v-if="error" type="error" class="mt-3" density="compact">{{
              error
            }}</v-alert>
            <div v-if="result" class="mt-3">
              <div class="mb-1">
                <strong>Total:</strong> {{ result.totalDocuments }}
              </div>
              <div class="mb-3">
                <strong>Merged Document ID:</strong>
                <code>{{ result.mergedDocumentId }}</code>
              </div>
              <v-btn
                color="primary"
                class="mr-2"
                @click="downloadMerged"
                prepend-icon="mdi-file-pdf-box"
                >Merged PDF</v-btn
              >
              <v-btn
                v-if="result.batchId"
                variant="tonal"
                @click="downloadZip"
                :loading="zipLoading"
                :disabled="zipLoading"
                prepend-icon="mdi-zip-box"
                >ZIP</v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { apiFetch, apiUrl } from "../utils/api";
export default {
  name: "GenerateView",
  data() {
    return { loading: false, result: null, error: "", zipLoading: false };
  },
  methods: {
    async submit() {
      this.loading = true;
      this.result = null;
      this.error = "";
      const t = this.$refs.template.files?.[0];
      const c = this.$refs.csv.files?.[0];
      if (!t || !c) {
        this.error = "Choose template & CSV";
        this.loading = false;
        return;
      }
      const fd = new FormData();
      fd.append("template", t);
      fd.append("csvFile", c);
      try {
        const res = await apiFetch("/generate-documents", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Generate failed");
        this.result = data;
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    downloadMerged() {
      const id = this.result?.mergedDocumentId;
      if (!id) return;
      const a = document.createElement("a");
      a.href = apiUrl(`/download/${id}?filename=merged-documents`);
      a.download = `merged-documents.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    async downloadZip() {
      this.zipLoading = true;
      const batchId = this.result?.batchId;
      if (!batchId) return;
      try {
        const resp = await apiFetch(`/batches/${batchId}/zip`);
        if (!resp.ok) {
          const t = await resp.text();
          return alert(`Zip failed: ${resp.status} ${t}`);
        }
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `batch_${batchId}.zip`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } finally {
        this.zipLoading = false;
      }
    },
  },
};
</script>

<style scoped></style>
