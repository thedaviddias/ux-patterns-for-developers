import type { PatternExampleDefinition } from "@/examples/patterns/example";

export const basicExample: PatternExampleDefinition = {
	html: `<nav class="preview-card breadcrumb-card" aria-label="Breadcrumb">
  <div class="preview-header">
    <div class="preview-grid">
      <span class="preview-eyebrow">Hierarchy</span>
      <h2 class="preview-title">Gaming laptop category</h2>
    </div>
    <span class="preview-badge">5 levels</span>
  </div>

  <ol class="breadcrumb-list">
    <li class="breadcrumb-item"><a href="/">Home</a></li>
    <li class="breadcrumb-item"><a href="/products">Products</a></li>
    <li class="breadcrumb-item"><a href="/products/electronics">Electronics</a></li>
    <li class="breadcrumb-item"><a href="/products/electronics/laptops">Laptops</a></li>
    <li class="breadcrumb-item" aria-current="page">
      <span>Gaming Laptops</span>
    </li>
  </ol>

  <p class="preview-help">
    Breadcrumbs give people orientation and a quick path back up the hierarchy.
  </p>
</nav>`,
	css: `.breadcrumb-card {
  display: grid;
  gap: 18px;
  padding: 20px;
}

.breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  list-style: none;
  padding: 0;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--preview-muted);
  font-weight: 600;
}

.breadcrumb-item:not(:last-child)::after {
  content: "/";
  color: #94a3b8;
}

.breadcrumb-item a,
.breadcrumb-item span {
  padding: 6px 10px;
  border-radius: 999px;
}

.breadcrumb-item a {
  background: rgba(255, 255, 255, 0.78);
}

.breadcrumb-item[aria-current="page"] span {
  background: var(--preview-primary-soft);
  color: var(--preview-primary-strong);
}
`,
	presentation: "hidden-code",
	variant: "canonical",
};
