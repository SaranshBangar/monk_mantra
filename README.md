# Monk Mantra - Task Manager

A modern, full-stack task management application built with Next.js 15, React 19, TypeScript, and Neon Database. This project demonstrates clean architecture, server actions, and a responsive UI with CRUD operations.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- Neon Database account (for production)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd monk_mantra
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
DATABASE_URL=your_neon_database_connection_string
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 API Documentation

### Server Actions

This application uses Next.js 15 Server Actions for backend functionality. All actions are defined in `app/actions.ts`.

#### Get All Tasks

- **Function**: `getAllTasks()`
- **Method**: Server Action
- **Response**: Array of Task objects
- **Sample Output**:

```json
[
  {
    "id": "1",
    "title": "Complete project documentation",
    "status": "pending",
    "createdAt": "2025-06-17 06:50:11.723474+00"
  },
  {
    "id": "2",
    "title": "Review code changes",
    "status": "complete",
    "createdAt": "2025-06-18 06:50:11.723474+00"
  }
]
```

#### Add New Task

- **Function**: `addTask(title: string, status?: TaskStatus)`
- **Method**: Server Action
- **Parameters**:
  - `title` (string, required): Task title
  - `status` (TaskStatus, optional): "pending" | "complete" (defaults to "pending")
- **Sample Input**:

```typescript
await addTask("New task title", "pending", NOW());
```

#### Get Single Task

- **Function**: `getATask(id: string)`
- **Method**: Server Action
- **Parameters**:
  - `id` (string, required): Task ID
- **Sample Output**:

```json
{
  "id": "1",
  "title": "Complete project documentation",
  "status": "pending",
  "createdAt": "2025-06-17 06:50:11.723474+00"
}
```

#### Update Task

- **Function**: `updateTask(id: string, title: string, status?: TaskStatus)`
- **Method**: Server Action
- **Parameters**:
  - `id` (string, required): Task ID
  - `title` (string, required): New task title
  - `status` (TaskStatus, optional): New task status
- **Sample Input**:

```typescript
await updateTask("1", "Updated task title", "complete");
```

#### Update Task Status

- **Function**: `updateTaskStatus(id: string, status: TaskStatus)`
- **Method**: Server Action
- **Parameters**:
  - `id` (string, required): Task ID
  - `status` (TaskStatus, required): "pending" | "complete"
- **Sample Input**:

```typescript
await updateTaskStatus("1", "complete");
```

#### Delete Task

- **Function**: `deleteTask(id: string)`
- **Method**: Server Action
- **Parameters**:
  - `id` (string, required): Task ID
- **Sample Input**:

```typescript
await deleteTask("1");
```

### Data Types

```typescript
export type TaskStatus = "pending" | "complete";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
}
```

## 🏗️ Project Structure

```
monk_mantra/
├── app/
│   ├── actions.ts          # Server actions for CRUD operations
│   ├── favicon.ico
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout component
│   └── page.tsx           # Home page component
├── components/
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   └── select.tsx
│   ├── Footer.tsx         # Footer component
│   ├── Header.tsx         # Header component
│   ├── TaskItem.tsx       # Individual task item component
│   └── TaskManager.tsx    # Main task management component
├── lib/
│   └── utils.ts           # Utility functions
├── public/
│   └── logo.png
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

### Architecture Rationale

The project follows Next.js 15 App Router conventions with a clear separation of concerns:

- **`app/`**: Contains the main application logic, layouts, and server actions
- **`components/`**: Reusable React components organized by functionality
- **`components/ui/`**: Base UI components using shadcn/ui design system
- **`lib/`**: Utility functions and shared logic
- **`public/`**: Static assets

## 🤔 Section B: Technical Decisions & Architecture

### Why did you choose this project structure?

1. **Next.js App Router**: Leveraged the latest Next.js 15 App Router for better organization, nested layouts, and improved performance with React Server Components.

2. **Component-Based Architecture**: Separated concerns into logical components:

   - `TaskManager`: Main container handling state and business logic
   - `TaskItem`: Reusable component for individual task display
   - `Header` & `Footer`: Layout components for consistent branding

3. **Server Actions**: Used Next.js Server Actions instead of traditional API routes for:

   - Type safety between client and server
   - Reduced boilerplate code
   - Automatic serialization/deserialization
   - Better integration with React forms

4. **UI Component Library**: Integrated shadcn/ui for:
   - Consistent design system
   - Accessible components out of the box
   - Customizable with Tailwind CSS
   - Professional appearance with minimal effort

### How did you separate frontend and backend concerns?

1. **Server Actions in `actions.ts`**:

   - All database operations isolated in a single file
   - Type-safe server functions with `"use server"` directive
   - Direct database access using Neon's serverless driver

2. **Client Components**:

   - UI logic and state management in React components
   - Event handling and user interactions
   - Optimistic updates and loading states

3. **Data Flow**:
   - Server Actions handle all CRUD operations
   - Client components call server actions directly
   - No need for intermediate API layer
   - Automatic error handling and serialization

### How would you handle errors and edge cases?

**Current Implementation**:

- Try-catch blocks around all server action calls
- Console error logging for debugging
- User feedback through loading states

**Production Improvements**:

```typescript
export class TaskError extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}

export async function addTaskWithErrorHandling(title: string, status?: TaskStatus) {
  try {
    if (!title.trim()) {
      throw new TaskError("Task title cannot be empty", "INVALID_INPUT");
    }

    if (title.length > 255) {
      throw new TaskError("Task title too long", "TITLE_TOO_LONG");
    }

    return await addTask(title, status);
  } catch (error) {
    if (error instanceof TaskError) {
      throw error;
    }
    throw new TaskError("Failed to create task", "DATABASE_ERROR");
  }
}
```

**Additional Error Handling**:

- Input validation and sanitization
- Rate limiting for API calls
- Database connection error recovery
- User-friendly error messages with toast notifications
- Retry mechanisms for failed operations
- Offline support with local storage fallback

### What security features would you add in production?

1. **Authentication & Authorization**:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function addTask(title: string, status?: TaskStatus) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }

  const sql = neon(process.env.DATABASE_URL!);
  const data = await sql`
    INSERT INTO "public"."data" ("title", "status", "createdAt", "userId")
    VALUES (${title}, ${status}, NOW(), ${session.user.id})
    RETURNING *;
  `;
  return data;
}
```

2. **Input Validation & Sanitization**:

```typescript
import { z } from "zod";
import DOMPurify from "dompurify";

const TaskSchema = z.object({
  title: z.string().min(1).max(255).trim(),
  status: z.enum(["pending", "complete"]),
});

export async function addTaskSecure(title: string, status?: TaskStatus) {
  const validated = TaskSchema.parse({ title, status });

  const sanitizedTitle = DOMPurify.sanitize(validated.title);

  return await addTask(sanitizedTitle, validated.status);
}
```

3. **Additional Security Measures**:

- **CSRF Protection**: Built-in with Next.js Server Actions
- **Rate Limiting**: Implement with `next-rate-limit` or similar
- **SQL Injection Prevention**: Using parameterized queries (already implemented)
- **Environment Variables**: Secure storage of database credentials
- **HTTPS Enforcement**: In production deployment
- **Content Security Policy**: Restrict resource loading
- **Request Validation**: Middleware for request sanitization

### What would you improve if you had 1 full day?

**Priority Improvements**:

1. **Enhanced User Experience** :

   - Add drag-and-drop task reordering
   - Implement task categories/tags
   - Add due dates and priority levels
   - Search and filter functionality
   - Bulk actions (select multiple tasks)
   - Keyboard shortcuts support

2. **Performance & Optimization** :

   - Implement optimistic updates
   - Add virtual scrolling for large task lists
   - Implement caching with React Query or SWR
   - Add pagination for better performance
   - Optimize bundle size with dynamic imports

3. **Testing & Quality Assurance** :

   - Unit tests with Jest and React Testing Library
   - Integration tests for server actions
   - E2E tests with Playwright
   - Accessibility testing and improvements

4. **Developer Experience** :
   - Add Storybook for component documentation
   - Implement pre-commit hooks with Husky
   - Add comprehensive TypeScript configurations
   - Set up automated deployment pipeline

**Code Example - Enhanced Task Management**:

```typescript
export interface EnhancedTask extends Task {
  category: string;
  priority: "low" | "medium" | "high";
  dueDate?: string;
  tags: string[];
  description?: string;
  assignedTo?: string;
}

export async function getTasksWithFilters(filters: {
  status?: TaskStatus;
  category?: string;
  priority?: string;
  search?: string;
  sortBy?: "createdAt" | "dueDate" | "priority";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}) {
  const sql = neon(process.env.DATABASE_URL!);
  sorting;
}
```

---

## 🌟 Bonus Section

### Favorite Project

**[CloudSRM](https://www.cloudsrm.xyz/)** - [GitHub Repository](https://github.com/SaranshBangar/CloudSRM)

**Problem It Solves**:
Students at SRM University face repeated hassles in uploading academic documents across multiple platforms, including for placement, internships, and university processes. CloudSRM solves this by offering a centralized platform for managing, updating, and sharing academic documents securely and efficiently.

**Tech Stack Used**:

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, ShadCN
- **Backend**: Node.js, Express, MongoDB
- **Storage**: Appwrite (for file uploads and storage)
- **Deployment**: Vercel (frontend)

**Key Features**:

- Secure document upload with file type and size validations
- Role-based dashboards for students and admins
- Instant PDF preview and download functionality
- Document versioning and update history
- Responsive UI optimized for mobile and desktop
- Admin controls to verify and approve submitted documents
- Email notification system for verification updates

**Key Learnings**:

1. **Appwrite Integration**: Learned to use Appwrite’s storage and authentication modules in real-world projects
2. **Access Control**: Implemented fine-grained role-based permissions across the app
3. **File Handling**: Gained in-depth knowledge of file validation, secure storage, and previewing documents in-browser
4. **Collaboration with Admins**: Understood stakeholder needs by working with SRM placement coordinators and built admin tools accordingly
5. **CI/CD Practices**: Set up automated deployments using GitHub actions for smoother development cycles

---

## 🚀 Deployment

### Local Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Vercel Deployment (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://monk-mantra.vercel.app/)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `DATABASE_URL` environment variable
4. Deploy!

### Environment Variables

```env
# Required
DATABASE_URL=postgresql://user:password@host:port/database
```

---

**Built by [Saransh Bangar](https://www.saransh-bangar.xyz/)**
