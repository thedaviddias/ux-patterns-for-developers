---
name: user-profile
description: "Learn how to implement user profile interfaces. Use when you need to user profile and account management."
user-invocable: true
triggers:
  - user
  - profile
metadata:
  id: user-profile
  category: authentication
  pattern: User Profile
  source: uxpatterns.dev
  url: https://uxpatterns.dev/patterns/authentication/user-profile
  sourcePath: apps/web/content/patterns/authentication/user-profile.mdx
---

# User Profile

User profile and account management

> Full examples, anatomy diagrams, and testing notes live in `references/pattern.md`.

## What it solves

**User Profile** is the interface that displays a user's identity, activity, and public or personal information. Profiles serve as both an identity card (how others see the user) and a self-management tool (how the user views and edits their own data).
A well-designed profile balances information density with visual clarity, supports both viewing and editing modes, and respects privacy by giving users control over what information is visible to others.

## When to use and when to avoid

**Use when:**

Use **User Profile** to **display and manage user identity, activity, and personal information**.
**Common scenarios include:**
- Displaying a user's public profile on community or social platforms
- Showing the authenticated user's own profile with edit capabilities
- Team member profiles in collaboration tools
- Author profiles on content platforms (blogs, documentation)
- Contributor profiles on open-source or marketplace platforms

**Avoid when:**

- Account security settings (use [Account Settings](/patterns/authentication/account-settings))
- Application-level configuration unrelated to the user (use app settings)
- Contact cards in a directory where interaction isn't needed (use a simple card component)
- User management admin panels (use a data table or admin interface)

## Implementation workflow

1. Read `references/pattern.md` — review the anatomy section and pick the smallest variation that fits the use case.
2. Copy the starter markup from the quick-start example above (or reference examples). Adapt element names and props to the project's component library.
3. Wire up accessibility: apply ARIA roles, keyboard handlers, and focus management from the guardrails below.
4. Add performance safeguards (lazy loading, virtualization) when the pattern handles large data or frequent updates.
5. Validate: tab through the component, test with a screen reader, resize to mobile, and simulate error/empty states.

## Accessibility guardrails

**Do's ✅**
- Use `alt` text on avatar images that includes the user's name
- Use proper heading hierarchy (h1 for name, h2 for sections)
- Make all action buttons keyboard accessible with visible focus indicators
- Use `<time>` elements with `datetime` attributes for dates
- Ensure the edit mode provides clear form labels
**Don'ts ❌**
- Don't use the avatar as the sole identifier — always include the text name
- Don't make profile stats interactive (clickable) without clear affordance
- Don't auto-play media on profile pages

## Performance guardrails

### Target Metrics
- **Profile page load:** < 500ms with avatar and content
- **Avatar image:** < 100KB optimized (serve multiple sizes)
- **Edit mode toggle:** < 50ms response
- **Activity feed:** Lazy-load items beyond the first 10
- **Avatar upload:** < 2s for upload + processing + preview
### Optimization Strategies
**Responsive Avatar Sizes**
```html
<img
  src="/avatars/jane-96.jpg"
  srcset="/avatars/jane-192.jpg 2x"
  alt="Jane Doe"
  width="96"
  height="96"
  loading="eager"
/>
```

## Common mistakes

### No Default Avatar
**The Problem:**
Users without a profile picture see a broken image or empty space, making the profile look broken.

**How to Fix It:**
Show a fallback: initials-based avatar (first and last initials with a background color) or a generic silhouette icon.

### No Empty State for New Profiles
**The Problem:**
A new user's profile page shows blank sections with no guidance on what to add.

**How to Fix It:**
Show prompts for empty fields: "Add a bio to introduce yourself", "Upload a profile picture". These disappear once the user fills in the data.

### Edit Mode That Reloads the Page
**The Problem:**
Clicking "Edit profile" navigates to a separate page, losing the user's context and requiring a page load.

**How to Fix It:**
Use inline editing (click to edit fields in place) or a modal overlay. Keep the edit experience on the same page as the view.

## Related patterns

- https://uxpatterns.dev/patterns/authentication/account-settings
- https://uxpatterns.dev/patterns/authentication/login
- https://uxpatterns.dev/patterns/authentication/signup

---

For full implementation detail, examples, and testing notes, see `references/pattern.md`.

Pattern page: https://uxpatterns.dev/patterns/authentication/user-profile
