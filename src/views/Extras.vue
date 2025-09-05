<template>
  <v-container class="py-6">
    <v-row>
      <v-col cols="12" md="4">
        <v-card elevation="1" class="mb-4">
          <v-card-title class="text-h6">Merged Document</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="mergedId"
              label="mergedDocumentId"
              clearable
            />
            <v-btn
              color="primary"
              @click="downloadMerged"
              prepend-icon="mdi-file-pdf-box"
              >Download</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card elevation="1" class="mb-4">
          <v-card-title class="text-h6">Batch Zip</v-card-title>
          <v-card-text>
            <v-text-field v-model="batchId" label="batchId" clearable />
            <v-btn
              color="primary"
              @click="downloadZip"
              :loading="zipLoading"
              :disabled="zipLoading"
              prepend-icon="mdi-zip-box"
              >Download</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card elevation="1" class="mb-4">
          <v-card-title class="text-h6">QR Token</v-card-title>
          <v-card-text>
            <v-text-field v-model="token" label="qr token" clearable />
            <v-btn
              class="mr-2"
              color="primary"
              @click="openView"
              prepend-icon="mdi-open-in-new"
              >Open</v-btn
            >
            <v-btn
              variant="tonal"
              @click="downloadQR"
              prepend-icon="mdi-download"
              >PDF</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ExtrasView",
  data() {
    return { mergedId: "", batchId: "", token: "", zipLoading: false };
  },
  methods: {
    downloadMerged() {
      if (!this.mergedId) return alert("enter id");
      window.open(
        `/download/${this.mergedId}?filename=merged-documents`,
        "_blank"
      );
    },
    async downloadZip() {
      this.zipLoading = true;
      if (!this.batchId) return alert("enter batchId");
      try {
        const resp = await fetch(`/batches/${this.batchId}/zip`);
        if (!resp.ok) {
          const t = await resp.text();
          return alert(`Zip failed: ${resp.status} ${t}`);
        }
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `batch_${this.batchId}.zip`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } finally {
        this.zipLoading = false;
      }
    },
    openView() {
      if (!this.token) return alert("enter token");
      window.open(`/view/${this.token}`, "_blank");
    },
    async downloadQR() {
      if (!this.token) return alert("enter token");
      const resp = await fetch(`/view/${this.token}/file`);
      if (!resp.ok) {
        const t = await resp.text();
        return alert(`Download failed: ${resp.status} ${t}`);
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invitation_${this.token}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  },
};
</script>

<style scoped></style>
