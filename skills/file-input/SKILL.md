---
name: file-input
description: "Use when you need to upload and handle files."
metadata:
  id: file-input
  category: forms
  pattern: File Input
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/forms/file-input
  sourcePath: apps/web/content/patterns/forms/file-input.mdx
---

# File Input

Upload and handle files

## What it solves

A **File Input** is a form component that allows users to select one or more files from their device's file system and upload them to a server. It ranges from the native `<input type="file">` control to enhanced drop zones with drag-and-drop, file previews, upload progress indicators, and validation feedback.
File inputs appear in document management, profile photo upload, e-commerce product imagery, form attachment flows, and media-rich applications.

## When to use

- **Profile and avatar upload** – Users select a photo for their account.
- **Document submission** – Forms that require attached PDFs, contracts, or ID documents.
- **Media uploads** – Images or videos for social media, e-commerce listings, or galleries.
- **Bulk import** – CSV or JSON files for data import workflows.
- **Email attachments** – Web mail applications.

## When to avoid

- **Camera capture on mobile** – Use `<input type="file" capture="environment">` or `capture="user"` to open the camera directly.
- **Cloud file selection** – Google Drive or Dropbox pickers require their own SDKs.
- **Very large files** – Consider chunked upload APIs rather than a standard form file input.
- **Real-time streaming content** – Not appropriate for live audio/video streams.

## Implementation workflow

1. Confirm the pattern matches the problem and constraints before copying the example.
2. Start from the anatomy and examples in `references/pattern.md`, then choose the smallest viable variation.
3. Apply accessibility, performance, and interaction guardrails before layering visual polish.
4. Use the testing guidance to verify behavior across keyboard, screen reader, responsive, and failure scenarios.

## Accessibility guardrails

### Keyboard Interaction Pattern
| **Key**              | **Action**                                                        |
| -------------------- | ----------------------------------------------------------------- |
| `Tab`                | Moves focus to the file input or drop zone                        |
| `Enter` / `Space`    | Opens the native file browser dialog                              |
| `Tab` (in file list) | Moves focus to the next file item's remove button                 |
| `Enter` / `Space`    | Activates the focused remove button                               |
| `Delete`             | Removes focused file from the selection list (where implemented)  |
| `Escape`             | Cancels an in-progress drag-and-drop operation                    |

## Performance guardrails

- **File selection dialog open**: < 100ms from click to dialog appearance
- **File preview generation**: < 200ms for image thumbnails (up to 5 MB)
- **Client-side validation**: < 50ms per file
- **Progress bar update**: < 16ms per frame (smooth animation)
- **Memory usage**: < 50KB per file input component; image preview memory managed with `URL.revokeObjectURL()`

## Common mistakes

### Client-Side Validation Only

**The Problem:**
Validating file type by extension only on the client allows users (or malicious actors) to rename files and bypass restrictions.

**How to Fix It?** Validate both client-side (for UX) and server-side (for security).

```javascript
// Client-side check (UX only)
function isValidFileType(file, accept) {
  return accept.split(',').some(type => {
    type = type.trim();
    if (type.startsWith('.')) return file.name.endsWith(type);
    if (type.endsWith('/*')) return file.type.startsWith(type.slice(0, -1));
    return file.type === type;
  });
}
```

```python
# Server-side check (security-critical) — Python example

allowed_types = ['image/jpeg', 'image/png', 'application/pdf']
mime_type = magic.from_buffer(file_bytes, mime=True)
if mime_type not in allowed_types:
    raise ValueError("Invalid file type")
```

### No Upload Feedback for Large Files

**The Problem:**
Users submit a form, see nothing happen for 30 seconds, and assume it is broken. They click submit again, causing duplicate uploads.

**How to Fix It?** Always show upload progress for uploads that will take more than 1 second.

```javascript
const xhr = new XMLHttpRequest();
xhr.upload.addEventListener('progress', (e) => {
  if (e.lengthComputable) {
    const percent = Math.round((e.loaded / e.total) * 100);
    progressBar.setAttribute('aria-valuenow', percent);
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `${percent}%`;
  }
});
```

### Not Handling Drop Zone Keyboard Access

**The Problem:**
A drop zone implemented as a `<div>` is not keyboard-accessible, excluding users who cannot use a mouse.

**How to Fix It?** Make the drop zone keyboard operable.

```html
<!-- Good: keyboard-accessible drop zone -->
<div
  class="file-input__dropzone"
  role="button"
  tabindex="0"
  aria-label="Upload files. Press Enter or Space to open file browser."
>
  <!-- ... -->
</div>
```

```javascript
dropzone.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fileInput.click();
  }
});
```

## Related patterns

- https://uxpatterns.dev/patterns/forms/text-field

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/forms/file-input
