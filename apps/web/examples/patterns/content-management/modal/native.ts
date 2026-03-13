import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const nativeModalExample: PatternExampleDefinition = {
	html: `<div class="modal-demo">
  <button type="button" class="preview-button preview-button--primary" id="native-modal-open">
    Open Modal
  </button>

  <dialog id="nativeModal">
    <article class="preview-card native-modal">
      <h2 class="preview-title">Archive project?</h2>
      <p class="preview-muted">
        The project will be removed from active views, but teammates can still
        restore it later.
      </p>

      <div class="preview-actions">
        <button type="button" class="preview-button preview-button--ghost" id="native-modal-cancel">
          Cancel
        </button>
        <button type="button" class="preview-button preview-button--primary" id="native-modal-confirm">
          Archive
        </button>
      </div>
    </article>
  </dialog>
</div>`,
	css: `.modal-demo {
  min-height: 180px;
}

.native-modal {
  display: grid;
  gap: 16px;
  padding: 20px;
}
`,
	js: `const nativeModal = document.getElementById("nativeModal");
document.getElementById("native-modal-open").addEventListener("click", () => {
  nativeModal.showModal();
});
document.getElementById("native-modal-cancel").addEventListener("click", () => {
  nativeModal.close();
});
document.getElementById("native-modal-confirm").addEventListener("click", () => {
  nativeModal.close("confirmed");
});
`,
};
