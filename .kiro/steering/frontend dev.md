---
inclusion: fileMatch
fileMatchPattern: ['frontend/**/*.ts', 'frontend/**/*.tsx', 'frontend/**/*.js', 'frontend/**/*.jsx']
---

# Frontend Development Guidelines

## Tech Stack & Architecture

- **React 19** with TypeScript in strict mode
- **Vite** for build tooling and development
- **Tailwind CSS v4** for styling with utility-first approach
- **shadcn/ui** components with Radix UI primitives
- **React Router v7** for client-side routing
- **Amazon Cognito** for authentication

## Project Structure

```
frontend/src/
├── components/ui/     # shadcn/ui components
├── pages/            # Route components
├── lib/              # Utilities (api.ts, auth.ts, utils.ts)
└── assets/           # Static assets
```

## Code Conventions

### Import Patterns
- Use `@/` path alias for src imports: `import { Button } from '@/components/ui/button'`
- Group imports: React, third-party, local components, utilities
- Use named exports for components

### Component Patterns
- Function declarations for page components: `export function Home() {}`
- Use TypeScript interfaces for props and data models
- Leverage `cn()` utility from `@/lib/utils` for conditional classes
- Follow shadcn/ui patterns for component variants using `cva`

### Styling Guidelines
- Use Tailwind utility classes with responsive prefixes (`md:`, `lg:`)
- Implement hover states and transitions for interactive elements
- Use semantic color tokens: `primary`, `secondary`, `muted`, `destructive`
- Apply consistent spacing with Tailwind's scale

### State Management
- Use React hooks for local state
- API calls through centralized `api.ts` client
- Authentication state managed via `auth.ts`

## API Integration

- All API calls go through the `ApiClient` class in `lib/api.ts`
- Use proper TypeScript interfaces for API responses
- Handle loading states and error boundaries
- Include proper error messages in Korean when applicable

## Accessibility Requirements

- Use semantic HTML elements
- Include proper ARIA labels and roles
- Ensure keyboard navigation works
- Maintain color contrast ratios
- Test with screen readers

## Design Research Process

When building new UI components:

1. **Research first** - Use Playwright MCP to find 2-3 modern examples
2. **Screenshot inspiration** - Capture well-designed patterns
3. **Adapt, don't copy** - Implement from scratch following project patterns
4. **Match existing style** - Use established color scheme and spacing

## Performance Considerations

- Lazy load route components
- Optimize images with proper sizing
- Use React.memo for expensive components
- Minimize bundle size with tree shaking