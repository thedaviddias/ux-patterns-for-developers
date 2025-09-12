<a href="https://uxpatterns.dev/">
  <img src="https://raw.githubusercontent.com/thedaviddias/ux-patterns-for-developers/refs/heads/main/banner.png" alt="">
  </br>
  </br>
</a>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/thedaviddias/ux-patterns-for-developers/blob/main/.github/CONTRIBUTING.md)

---

# UX Patterns for Developers

A comprehensive ecosystem for learning, building, and showcasing UX patterns with developer-focused documentation and ready-to-use components.

## 🏗️ The Ecosystem

UX Patterns consists of three interconnected projects:

### 📚 [Web](https://uxpatterns.dev)
**Learn & Reference** - Comprehensive documentation for UX patterns with best practices, accessibility guidelines, and implementation details.

### 🧩 [Kit](https://kit.uxpatterns.dev)
**Build & Install** - Ready-to-use component library compatible with shadcn/ui. Copy, paste, and customize components for your projects.

### 🖼️ [Gallery](https://gallery.uxpatterns.dev)
**Explore & Inspire** - Real-world examples and implementations of UX patterns from popular applications.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/thedaviddias/ux-patterns-for-developers.git

# Install dependencies
pnpm install

# Run all projects in development mode
pnpm dev
```

This will start:
- Web → http://localhost:3060
- Kit → http://localhost:3061
- Gallery → http://localhost:3062

### Running Individual Projects

```bash
# Run only the documentation site
pnpm dev:web

# Run only the component kit
pnpm dev:kit

# Run only the gallery
pnpm dev:gallery
```

## 📦 Project Structure

This is a monorepo managed with Turbo and pnpm workspaces:

```
ux-patterns-for-developers/
├── apps/
│   ├── web/        # Documentation site
│   ├── kit/        # Component library
│   └── gallery/    # Visual examples
├── packages/
│   ├── ui/         # Shared UI components
│   ├── constants/  # Shared constants
│   ├── tracking/   # Analytics utilities
│   └── ...         # Other shared packages
```

## 🛠️ Development

```bash
# Build all projects
pnpm build

# Run tests
pnpm test

# Lint and format
pnpm lint
pnpm format
```

## ✨ Contributing

We welcome contributions! Please read our [Contributing Guide](https://github.com/thedaviddias/ux-patterns-for-developers/blob/main/.github/CONTRIBUTING.md) before submitting a pull request.

- 🐛 [Report bugs](https://github.com/thedaviddias/ux-patterns-for-developers/issues)
- 💡 [Suggest new patterns](https://github.com/thedaviddias/ux-patterns-for-developers/issues/new)
- 📝 [Improve documentation](https://github.com/thedaviddias/ux-patterns-for-developers/blob/main/.github/CONTRIBUTING.md)
- 🔧 [Submit pull requests](https://github.com/thedaviddias/ux-patterns-for-developers/pulls)

## 📄 Dual License

This project is available under a dual license:

### 1. MIT License (Non-Commercial)

- ✅ Free for personal use and non-commercial projects
- ✅ Attribution required
- ✅ Modifications and distributions allowed
- ❌ Commercial use not permitted
- [View MIT License Details](./LICENSE.md)

### 2. Commercial License

- 💼 Required for commercial use
- 🏢 Suitable for businesses and commercial projects
- 🔒 Includes additional rights and support
- [View Commercial License Details](.github/COMMERCIAL-LICENSE.md)

---

<div align="center">

If you find this project useful, please consider giving it a ⭐️

</div>
