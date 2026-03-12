import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<div class="file-input">
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
</div>`,
	presentation: "hidden-code",
	variant: "canonical",
};
