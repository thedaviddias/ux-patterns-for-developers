# UP Kit

A component registry for UX patterns and UI components, compatible with shadcn/ui CLI.

## Features

- 🎨 Ready-to-use UI components
- 📦 Component registry system
- 🔧 Compatible with shadcn/ui CLI
- 🚀 Built with Next.js and Tailwind CSS
- 📱 Responsive and accessible components

## Getting Started

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The registry will be available at `http://localhost:3065`

### Using Components with shadcn CLI

You can install components from this registry using the shadcn CLI:

```bash
# Install the button component
npx shadcn@latest add http://localhost:3065/r/button.json
```

### API Endpoints

- `GET /registry` - Returns the complete registry configuration
- `GET /r/[component-name].json` - Returns a specific component with file contents

### Registry Structure

```
registry/
└── default/
    ├── ui/              # Base UI components
    │   ├── button.tsx
    │   ├── input.tsx
    │   └── label.tsx
    ├── components/      # Complex components
    │   └── input-basic.tsx
    ├── hooks/           # Custom React hooks
    ├── lib/             # Utility functions
    │   └── utils.ts
    └── blocks/          # Page sections and layouts
        ├── hero-section.tsx
        └── feature-grid.tsx
```

### Adding New Components

1. Create your component file in the appropriate directory:
   - `registry/default/ui/` for base UI components
   - `registry/default/components/` for complex components
   - `registry/default/blocks/` for page sections

2. Add the component to `registry.json`:

```json
{
  "name": "your-component",
  "type": "registry:component",
  "registryDependencies": ["button", "input"],
  "files": [
    {
      "path": "registry/default/components/your-component.tsx",
      "type": "registry:component"
    }
  ],
  "meta": {
    "tags": ["form", "input"]
  }
}
```

3. The component will automatically be available via the API

### Example Usage

Visit `/examples` to see components in action, or use them in your code:

```tsx
import { Button } from "@/registry/default/ui/button"
import InputBasic from "@/registry/default/components/input-basic"

export default function MyPage() {
  return (
    <div>
      <Button>Click me</Button>
      <InputBasic />
    </div>
  )
}
```

## Deployment

When deploying, make sure to update the `homepage` field in `registry.json` to point to your production URL.

## Contributing

1. Fork the repository
2. Create a new branch for your component
3. Add your component following the structure above
4. Test locally using the shadcn CLI
5. Submit a pull request

## License

MIT
