# Contributing to DevConnect

Thank you for considering contributing to **DevConnect**! 🎉  
This guide explains how to get started, follow best practices, and submit high‑quality contributions.

---

## Quick Links
- [Setup Guide](/docs/SETUP.md) – Development environment setup  
- [Architecture](/docs/ARCHITECTURE.md) – System overview  
- [Database Schema](/docs/DATABASE.md) – Database documentation  
- [Code of Conduct](/docs/CODE_OF_CONDUCT.md) – Community guidelines   

---

## Getting Started

### Prerequisites
- **Node.js** 18+ and npm  
- **Git**  
- **Supabase account** (free tier works)  
- **GitHub account**  

---

## Fork & Clone

1. Fork the repository on GitHub  
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR-USERNAME/devconnect.git
cd devconnect
```

---

## Development Setup

Follow the detailed [Setup Guide](/docs/SETUP.md).

Basic steps:

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

---

## Making Changes

### Branch Naming
Use clear, descriptive branch names:

```text
# Feature branches
feature/add-user-profiles
feature/multiple-image-uploads

# Bug fix branches
fix/login-error-mobile
fix/image-upload-validation

# Documentation branches
docs/update-contributing-guide
docs/add-api-examples
```

---

### Commit Messages
Follow the **conventional commit** format:

```text
<type>: <short description>

<optional detailed description>

Closes #<issue-number>
```

**Types:**
- `feat` – New feature  
- `fix` – Bug fix  
- `docs` – Documentation  
- `style` – Formatting or styling  
- `refactor` – Code refactor  
- `test` – Tests  
- `chore` – Maintenance  

**Examples:**

```text
feat: add dark mode toggle

- Add ThemeContext for theme management
- Implement toggle in Navbar
- Persist preference in localStorage

Closes #45
```

```text
fix: resolve image upload validation

- Add file size limit (5MB)
- Validate file types (jpg, png, gif)
- Show user-friendly errors

Closes #78
```

---

## Testing Before Submitting

Run checks locally before opening a PR:

```bash
# Lint code
npm run lint

# Format code
npm run format

# Run app locally
npm run dev
```

Optional but recommended:

```bash
npm run build
```

---

## Code Style Guidelines

### TypeScript
- Use strict typing  
- Define interfaces for props and state  
- Avoid `any`  
- Use meaningful names  

Example:

```ts
interface PostProps {
  id: number;
  title: string;
  content: string;
  onLike: (id: number) => void;
}
```

---

### Tailwind CSS
- Use Tailwind utilities only  
- Follow existing color scheme  
- Ensure responsive layouts  

Example:

```tsx
<div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-cyan-500/30 transition-colors">
  <h3 className="text-lg font-semibold text-white">{title}</h3>
  <p className="text-gray-300 mt-2">{content}</p>
</div>
```

---

### Component Structure
- One component per file  
- Props interface at top  
- Destructure props  
- Named exports preferred  

Template:

```ts
import { FC } from 'react';

interface ComponentProps {}

const Component: FC<ComponentProps> = () => {
  return (
    <div>
      {/* JSX here */}
    </div>
  );
};

export default Component;
```

---

## File Organization

- `src/components/` – Reusable UI components  
- `src/pages/` – Page-level components  
- `src/hooks/` – Custom hooks  
- `src/context/` – Context providers  
- `src/types/` – Type definitions  
- `src/utils/` – Utility functions  

---

## Pull Request Process

### Creating a PR
1. Push your branch:
```bash
git push origin feature/your-feature
```
2. Open a Pull Request on GitHub  
3. Fill the PR template  
4. Link issues using `Closes #123`

---

### PR Requirements
✅ Linting passes  
✅ Build succeeds  
✅ Follows style guidelines  
✅ Focused change (one feature/bug)  
✅ Documentation updated if needed  

---

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactor
- [ ] Performance improvement

## Testing
- [ ] Tested locally
- [ ] Lint passes
- [ ] Build succeeds

## Screenshots (if applicable)

## Related Issues
Closes #<issue-number>
```

---

## Code Review
- Wait for maintainer review  
- Address feedback promptly  
- Squash commits if requested  

Reviewers check:
- Code quality
- Edge cases
- Performance
- Security
- Documentation

---

## Asking Questions

### Before Asking
- Check docs  
- Search issues  
- Review codebase  

### Where to Ask
- **GitHub Issues** – Bugs & features  
- **PR Discussions** – Code questions  
- **GitHub Discussions** – General help  

Good questions include:
- Goal
- What you tried
- Code snippets
- Errors
- Environment details

---

## Recognition
All contributors are listed in **CONTRIBUTORS.md** 💙

---

## Need Help?
- Review [SETUP.md](/docs/SETUP.md)  
- Check [ARCHITECTURE.md](/docs/ARCHITECTURE.md)  
- Explore existing code patterns  
- Open a discussion  

Thank you for contributing to **DevConnect** 🚀
