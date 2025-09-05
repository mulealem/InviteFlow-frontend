<template>
  <v-container class="py-6" fluid>
    <v-row dense>
      <v-col cols="12">
        <TemplateGallery />
        <v-card elevation="1" class="mb-4">
          <v-card-title class="text-lg font-semibold"
            >Step 1: Analyze Template</v-card-title
          >
          <v-card-text>
            <form @submit.prevent="analyze">
              <v-file-input
                ref="templateFile"
                accept=".docx"
                label="Template (.docx)"
                prepend-icon="mdi-file-word"
                required
              />
              <v-btn
                type="submit"
                color="primary"
                class="mt-2"
                :loading="aLoading"
                prepend-icon="mdi-text-search"
                >Analyze</v-btn
              >
            </form>
            <v-alert
              v-if="aError"
              type="error"
              class="mt-3"
              density="compact"
              >{{ aError }}</v-alert
            >
            <div v-if="aResult" class="mt-3">
              <div class="mb-2">
                <strong>Variables:</strong> {{ aResult.variables?.join(", ") }}
              </div>
              <v-btn
                class="mb-3"
                variant="tonal"
                prepend-icon="mdi-download"
                @click="downloadAnalyzedCsv"
              >
                Download CSV
              </v-btn>
              <v-table density="comfortable">
                <thead>
                  <tr>
                    <th
                      v-for="h in aResult.variables"
                      :key="h"
                      class="text-left"
                    >
                      {{ h }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      :colspan="aResult.variables?.length || 1"
                      class="text-gray-500"
                    >
                      Headers preview only — fill rows in the downloaded CSV
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </v-card-text>
        </v-card>

        <v-card elevation="1">
          <v-card-title class="text-lg font-semibold"
            >Step 2: Generate Documents</v-card-title
          >
          <v-card-text>
            <form @submit.prevent="generate">
              <v-file-input
                ref="gTemplate"
                accept=".docx"
                label="Template (.docx)"
                prepend-icon="mdi-file-word"
                required
              />
              <v-file-input
                ref="gCsv"
                accept=".csv"
                label="CSV"
                prepend-icon="mdi-file-delimited"
                @change="onCsvSelected"
                required
              />
              <div v-if="csvHeaders.length" class="mt-2">
                <div class="text-gray-500 mb-1">
                  CSV preview (first {{ csvPreview.length }} rows):
                </div>
                <v-table density="comfortable">
                  <thead>
                    <tr>
                      <th v-for="h in csvHeaders" :key="h" class="text-left">
                        {{ h }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, idx) in csvPreview" :key="idx">
                      <td v-for="(h, ci) in csvHeaders" :key="ci">
                        {{ row[h] ?? "" }}
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
              <v-btn
                type="submit"
                color="primary"
                class="mt-2"
                :loading="gLoading"
                prepend-icon="mdi-cog"
                >Generate</v-btn
              >
            </form>
            <v-alert
              v-if="gError"
              type="error"
              class="mt-3"
              density="compact"
              >{{ gError }}</v-alert
            >
            <div v-if="gResult" class="mt-3">
              <v-card variant="tonal">
                <v-card-title class="text-base font-medium"
                  >Downloads</v-card-title
                >
                <v-card-text>
                  <div class="mb-2">
                    <v-chip color="primary" variant="flat" class="mr-2"
                      >Total: {{ gResult.totalDocuments }}</v-chip
                    >
                    <v-chip variant="tonal"
                      >Merged ID: {{ gResult.mergedDocumentId }}</v-chip
                    >
                  </div>
                  <v-btn
                    color="primary"
                    class="mr-2"
                    @click="downloadMerged"
                    prepend-icon="mdi-file-pdf-box"
                  >
                    Download Merged PDF
                  </v-btn>
                  <v-btn
                    v-if="gResult.batchId"
                    variant="tonal"
                    @click="downloadZip"
                    :loading="zipLoading"
                    :disabled="zipLoading"
                    prepend-icon="mdi-zip-box"
                  >
                    Download ZIP
                  </v-btn>
                </v-card-text>
              </v-card>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" class="mt-4">
        <v-expansion-panels variant="accordion">
          <v-expansion-panel>
            <v-expansion-panel-title expand-icon="mdi-chevron-down">
              <v-icon icon="mdi-qrcode" class="mr-2" /> QR Viewer
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-text-field
                v-model="scanned"
                label="QR Token"
                density="comfortable"
                clearable
              />
              <v-btn
                color="primary"
                class="mr-2"
                @click="openView"
                prepend-icon="mdi-open-in-new"
                >Open View</v-btn
              >
              <v-btn
                variant="tonal"
                @click="downloadPDF"
                prepend-icon="mdi-download"
                >Download PDF</v-btn
              >
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TemplateGallery from "../components/TemplateGallery.vue";
import { apiFetch, apiUrl } from "../utils/api";
export default {
  name: "AppFlow",
  components: { TemplateGallery },
  data() {
    return {
      aLoading: false,
      aResult: null,
      aError: "",
      gLoading: false,
      gResult: null,
      gError: "",
      scanned: "",
      zipLoading: false,
      csvHeaders: [],
      csvPreview: [],
    };
  },
  methods: {
    downloadAnalyzedCsv() {
      const csv = this.aResult?.csvContent || "";
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "template_variables.csv";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onCsvSelected() {
      try {
        const f = this.$refs.gCsv?.files?.[0];
        if (!f) {
          this.csvHeaders = [];
          this.csvPreview = [];
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result || "";
          const { headers, rows } = this.parseCsv(String(text), 5);
          this.csvHeaders = headers;
          this.csvPreview = rows;
        };
        reader.onerror = () => {
          this.csvHeaders = [];
          this.csvPreview = [];
        };
        reader.readAsText(f);
      } catch (e) {
        this.csvHeaders = [];
        this.csvPreview = [];
      }
    },
    parseCsv(text, maxRows = 5) {
      // Simple CSV parser with quoted field support
      const lines = String(text)
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split("\n")
        .filter((l) => l.length > 0);
      if (lines.length === 0) return { headers: [], rows: [] };
      const parseLine = (line) => {
        const out = [];
        let cur = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const ch = line[i];
          if (inQuotes) {
            if (ch === '"') {
              if (line[i + 1] === '"') {
                // escaped quote
                cur += '"';
                i++;
              } else {
                inQuotes = false;
              }
            } else {
              cur += ch;
            }
          } else {
            if (ch === '"') {
              inQuotes = true;
            } else if (ch === ",") {
              out.push(cur);
              cur = "";
            } else {
              cur += ch;
            }
          }
        }
        out.push(cur);
        return out;
      };
      const headerFields = parseLine(lines[0]).map((h) => h.trim());
      const rows = [];
      for (let i = 1; i < lines.length && rows.length < maxRows; i++) {
        const vals = parseLine(lines[i]);
        const obj = {};
        for (let c = 0; c < headerFields.length; c++) {
          obj[headerFields[c]] = vals[c] ?? "";
        }
        rows.push(obj);
      }
      return { headers: headerFields, rows };
    },
    openView() {
      if (!this.scanned) return alert("No token");
      window.open(apiUrl(`/view/${this.scanned}`), "_blank");
    },
    async downloadPDF() {
      if (!this.scanned) return alert("No token");
      const r = await apiFetch(`/view/${this.scanned}/file`);
      if (!r.ok) {
        const t = await r.text();
        return alert(`Failed: ${r.status} ${t}`);
      }
      const b = await r.blob();
      const u = URL.createObjectURL(b);
      const a = document.createElement("a");
      a.href = u;
      a.download = `invitation_${this.scanned}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(u);
      document.body.removeChild(a);
    },
    async analyze() {
      this.aLoading = true;
      this.aError = "";
      this.aResult = null;
      const f = this.$refs.templateFile.files?.[0];
      if (!f) {
        this.aError = "Choose a file";
        this.aLoading = false;
        return;
      }
      const fd = new FormData();
      fd.append("template", f);
      try {
        const res = await apiFetch("/analyze-template", {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Analyze failed");
        this.aResult = data;
      } catch (e) {
        this.aError = e.message;
      } finally {
        this.aLoading = false;
      }
    },
    async generate() {
      this.gLoading = true;
      this.gError = "";
      this.gResult = null;
      const t = this.$refs.gTemplate.files?.[0];
      const c = this.$refs.gCsv.files?.[0];
      if (!t || !c) {
        this.gError = "Choose template & CSV";
        this.gLoading = false;
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
        this.gResult = data;
      } catch (e) {
        this.gError = e.message;
      } finally {
        this.gLoading = false;
      }
    },
    downloadMerged() {
      const id = this.gResult?.mergedDocumentId;
      if (!id) return;
      const a = document.createElement("a");
      a.href = apiUrl(`/download/${id}?filename=merged-documents`);
      a.download = "merged-documents.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    async downloadZip() {
      this.zipLoading = true;
      const id = this.gResult?.batchId;
      if (!id) return;
      try {
        const resp = await apiFetch(`/batches/${id}/zip`);
        if (!resp.ok) {
          const t = await resp.text();
          return alert(`Zip failed: ${resp.status} ${t}`);
        }
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `batch_${id}.zip`;
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
