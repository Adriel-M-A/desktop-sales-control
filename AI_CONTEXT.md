# AI Context & Project Guidelines: desktop-app-core

## 1. Project Overview

This is a modern **Electron Desktop Application** template.

- **Goal:** Serve as a solid foundation for building professional desktop apps with a custom UI (non-native).
- **Architecture:** Electron (Main + Preload + Renderer) using **Vite**.

## 2. Tech Stack (Strictly Enforced)

- **Runtime:** Electron v39+
- **Frontend:** React v19 + TypeScript.
- **Build Tool:** Electron-Vite (Hot Module Replacement enabled).
- **Styling:** Tailwind CSS **v4** + Shadcn/UI.
- **Routing:** `react-router-dom` (HashRouter strategy).
- **Icons:** `lucide-react` (Do NOT use other icon libraries).
- **Database:** `better-sqlite3` (Prepared for local SQL).

## 3. Project Structure

- `src/main/index.ts` -> **Backend**. Handles window creation, `ipcMain` events.
  - _Rule:_ Window frame is `false`. We use a custom TitleBar.
- `src/preload/index.ts` -> **Bridge**. Exposes API via `contextBridge`.
  - _Rule:_ Never use Node.js modules directly in Renderer. Use `window.api`.
- `src/renderer/src/` -> **Frontend**.
  - `components/layout/` -> Contains `Sidebar.tsx`, `TitleBar.tsx`, `AppLayout.tsx`.
  - `config/menu.tsx` -> Configuration for Sidebar items.
  - `assets/main.css` -> Tailwind v4 configuration + CSS Variables.

## 4. Design System & UI Rules

We use a **Custom Design System** mapped to Tailwind utility classes.
**Do NOT** use hardcoded hex colors (e.g., `#000`). Use semantic variables:

- **Backgrounds:** `bg-background`, `bg-sidebar`
- **Surfaces:** `bg-card`, `bg-popover`
- **Primary Actions:** `bg-primary` (Text: `text-primary-foreground`)
- **Borders:** `border-border`, `border-sidebar-border`

### Layout Architecture (Visual Logic)

The layout (`AppLayout.tsx`) follows a strict structure:

1.  **TitleBar:** Fixed at the top (32px height). Contains window controls.
2.  **Sidebar:** Fixed at the left. Defined by `menu.tsx`.
3.  **Main Content:** The only scrollable area. It uses `flex-1` and `overflow-hidden` on the parent, with an inner scrollable container.
    - _Rule:_ Never apply scroll to the `body` tag. Scroll is handled internally by the main container.

### Custom TitleBar Logic

- To make an element drag the window: Add class `drag-region` (CSS: `-webkit-app-region: drag`).
- To make a button clickable inside that region: Add class `no-drag` (CSS: `-webkit-app-region: no-drag`).

## 5. Coding Conventions

1. **Routing:** Always use `HashRouter`. URLs must not be absolute paths.
2. **Imports (Aliases):**
   - **Frontend:**
     - `@/` -> `src/renderer/src/` (Standard).
     - Example: `import { Sidebar } from '@/components/layout/Sidebar'`
   - **Backend (Main):**
     - `@main/` -> `src/main/`
     - Example: `import { db } from '@main/database'`
   - **Preload:**
     - `@preload/` -> `src/preload/`

## 6. Pre-installed Libraries & Patterns (Use these!)

- **Forms:** `react-hook-form` + `zod` + `@hookform/resolvers` are **already installed**.
  - _Pattern:_ Define schema with Zod, use `useForm` hook, and Shadcn `<Form>` components.
- **Notifications:** `sonner` is installed and configured in `AppLayout`.
  - _Usage:_ `import { toast } from 'sonner'` -> `toast.success('Guardado!')`.
- **Async Operations:**
  - Renderer -> Main communication is **always asynchronous**. Always use `async/await` when calling `window.api`.

## 7. Naming Conventions (Strict)

- **Feature Components (Yours):** Use `PascalCase`.
  - _Location:_ `src/renderer/src/components/` (outside `ui` folder).
  - _Example:_ `UserProfile.tsx`, `SalesChart.tsx`, `SettingsForm.tsx`.
- **UI Components (Shadcn):** Keep default `kebab-case`.
  - _Location:_ `src/renderer/src/components/ui/`.
  - _Example:_ `button.tsx`, `card.tsx`, `scroll-area.tsx`.
- **Functions & Variables:** ALWAYS use `camelCase`.
  - _Example:_ `handleSubmit`, `isLoading`.
- **Folders:**
  - Standard folders: `kebab-case` (e.g., `components/ui`, `assets/images`).
  - Component groups: `PascalCase` (e.g., `components/UserDashboard/`).

## 8. Common Tasks (Cheat Sheet)

- **Add Menu Item:** Edit `src/renderer/src/config/menu.tsx`.
- **New Page:** Create in `src/renderer/src/pages/`, add route in `App.tsx`.
- **Build for Production:** `npm run build:win` (Generates .exe in `dist/`).

## 9. AI Interaction Guidelines (CRITICAL)

When generating code or answering questions, follow these strict rules:

1.  **Full Code Output:** When modifying a file, **ALWAYS provide the full content of the file**. Do not use placeholders like `// ... rest of the code` or `// ... existing code`.
2.  **Language:**
    - You can interact in English or Spanish as requested.
    - **Code Comments MUST be in SPANISH**.
3.  **Commenting Style:**
    - **No fluff:** Do not add obvious comments (e.g., `// Importing React`).
    - **Meaningful only:** Add comments only when explaining complex logic or specific project configurations.
    - **Format:** Keep comments short and direct.
