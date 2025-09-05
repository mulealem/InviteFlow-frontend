<template>
  <div class="mb-6">
    <div class="mb-3">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">
        Templates
      </h2>
      <p class="text-sm text-slate-700 dark:text-slate-300">
        Download ready-to-use DOCX templates. Click a card image to download.
      </p>
    </div>

    <div class="overflow-hidden">
      <div class="flex flex-nowrap overflow-x-auto gap-3 pr-1">
        <v-card
          v-for="t in shownTemplates"
          :key="t.id"
          class="flex-none"
          elevation="1"
          width="280"
        >
          <a
            :href="t.docUrl"
            :download="t.fileName"
            class="block"
            @click.prevent="download(t)"
          >
            <img
              :src="t.imageUrl"
              :alt="t.title"
              class="block w-full h-40 object-cover bg-neutral-900"
            />
          </a>
          <v-card-title class="text-sm font-medium">{{ t.title }}</v-card-title>
          <v-card-text class="pt-0 pb-2 text-gray-500">
            {{ t.desc }}
          </v-card-text>
          <v-card-actions>
            <v-btn
              size="small"
              color="primary"
              :href="t.docUrl"
              :download="t.fileName"
              @click.prevent="download(t)"
              prepend-icon="mdi-download"
            >
              Download DOCX
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>

    <div class="mt-2">
      <v-btn
        size="small"
        variant="tonal"
        @click="openDialog"
        prepend-icon="mdi-eye"
      >
        View more
      </v-btn>
    </div>

    <v-alert v-if="error" type="error" density="compact" class="mt-2">{{
      error
    }}</v-alert>

    <v-dialog v-model="dialogOpen" max-width="900">
      <v-card>
        <v-card-title class="flex items-center justify-between">
          <span>All Templates</span>
          <v-btn icon="mdi-close" variant="text" @click="dialogOpen = false" />
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="search"
            label="Search templates"
            prepend-icon="mdi-magnify"
            density="comfortable"
            clearable
            class="mb-4"
          />
          <v-row>
            <v-col
              v-for="t in filteredTemplates"
              :key="t.id"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card elevation="1" class="h-full">
                <a
                  :href="t.docUrl"
                  :download="t.fileName"
                  class="block"
                  @click.prevent="download(t)"
                >
                  <img
                    :src="t.imageUrl"
                    :alt="t.title"
                    class="block w-full h-40 object-cover bg-neutral-900"
                  />
                </a>
                <v-card-title class="text-sm font-medium">{{
                  t.title
                }}</v-card-title>
                <v-card-text class="pt-0 pb-2 text-gray-500">
                  {{ t.desc }}
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    size="small"
                    color="primary"
                    :href="t.docUrl"
                    :download="t.fileName"
                    @click.prevent="download(t)"
                    prepend-icon="mdi-download"
                  >
                    Download DOCX
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col
              v-if="!filteredTemplates.length"
              cols="12"
              class="text-gray-500"
            >
              No templates match "{{ search }}".
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "TemplateGallery",
  data() {
    return {
      dialogOpen: false,
      search: "",
      error: "",
      templates: [
        {
          id: "commemoration_invite",
          title: "Commemoration Invite",
          desc: "Clean single-page invite with common placeholders.",
          imageUrl: "/templates/commemoration_invite.jpg",
          docUrl: "/templates/commemoration_invite.docx",
          fileName: "commemoration_invite.docx",
        },

        {
          id: "halloween_party_invite",
          title: "Halloween Party Invite",
          desc: "Spooky-themed invite for Halloween parties.",
          imageUrl: "/templates/halloween_party_invite.jpg",
          docUrl: "/templates/halloween_party_invite.docx",
          fileName: "halloween_party_invite.docx",
        },
        {
          id: "party_invitation_tropical",
          title: "Party Invitation - Tropical",
          desc: "Vibrant tropical-themed invitation layout.",
          imageUrl: "/templates/party_invitation_tropical.jpg",
          docUrl: "/templates/party_invitation_tropical.docx",
          fileName: "party_invitation_tropical.docx",
        },
        {
          id: "wedding_invite",
          title: "Wedding Invite",
          desc: "Elegant floral design for wedding invitations.",
          imageUrl: "/templates/wedding_invite.jpg",
          docUrl: "/templates/wedding_invite.docx",
          fileName: "wedding_invite.docx",
        },
      ],
    };
  },
  computed: {
    shownTemplates() {
      return this.templates.slice(0, 3);
    },
    filteredTemplates() {
      const q = this.search.trim().toLowerCase();
      if (!q) return this.templates;
      return this.templates.filter((t) =>
        [t.title, t.desc, t.id].some((s) => (s || "").toLowerCase().includes(q))
      );
    },
  },
  methods: {
    openDialog() {
      this.dialogOpen = true;
    },
    async download(t) {
      this.error = "";
      try {
        const resp = await fetch(t.docUrl, { method: "HEAD" });
        if (!resp.ok) throw new Error("Template file not found.");
        const a = document.createElement("a");
        a.href = t.docUrl;
        a.download = t.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        this.error = `${t.title}: ${e.message}`;
      }
    },
  },
};
</script>

<!-- Tailwind-only styles via utility classes; no scoped CSS needed. -->
