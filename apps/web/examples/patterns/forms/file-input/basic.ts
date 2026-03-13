import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="preview-card file-input">
  <div class="preview-header">
    <div class="preview-grid">
      <span class="preview-eyebrow">File input</span>
      <h2 class="preview-title">Upload document</h2>
    </div>
    <span id="document-status" class="preview-badge">No file</span>
  </div>

  <label for="document-upload">Upload document</label>
  <div class="file-input__wrapper">
    <input
      type="file"
      id="document-upload"
      name="document"
      accept=".pdf,.doc,.docx"
      class="file-input__native"
      aria-describedby="doc-help"
    />
    <button
      type="button"
      class="file-input__btn"
      onclick="document.getElementById('document-upload').click()"
    >
      Choose file
    </button>
    <span class="file-input__filename" aria-live="polite">No file chosen</span>
  </div>
  <p id="doc-help" class="file-input__help">Accepted: PDF, DOC, DOCX · Max 10 MB</p>
  <div id="document-preview" class="preview-note">Selected file details will appear here.</div>
</div>`,
	css: `.file-input {
  max-width: 520px;
  display: grid;
  gap: 16px;
  padding: 20px;
}

.file-input__wrapper {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: center;
}

.file-input__native {
  position: absolute;
  inset: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

.file-input__filename {
  min-height: 44px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-radius: 14px;
  border: 1px solid var(--preview-border);
  background: rgba(255, 255, 255, 0.76);
  color: var(--preview-muted);
}
`,
	js: `const documentInput = document.getElementById("document-upload");
const documentStatus = document.getElementById("document-status");
const documentFilename = document.querySelector(".file-input__filename");
const documentPreview = document.getElementById("document-preview");

documentInput.addEventListener("change", () => {
  const file = documentInput.files && documentInput.files[0];

  if (!file) {
    documentStatus.textContent = "No file";
    documentFilename.textContent = "No file chosen";
    documentPreview.textContent = "Selected file details will appear here.";
    return;
  }

  const fileSize = (file.size / 1024 / 1024).toFixed(1);
  documentStatus.textContent = "Ready";
  documentFilename.textContent = file.name;
  documentPreview.textContent =
    file.name + " • " + file.type.replace("application/", "").toUpperCase() + " • " + fileSize + " MB";
});
`,
	presentation: "hidden-code",
	variant: "canonical",
};
