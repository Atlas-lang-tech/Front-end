# Pandas Frontend

Language learning platform built with Vue 3 + TypeScript.

## Tech Stack

- **Framework**: Vue 3 (Composition API + `<script setup>`)
- **Language**: TypeScript
- **Build**: Vite 8
- **Styling**: TailwindCSS v4 (via `@tailwindcss/vite` plugin, no config file)
- **UI Components**: Reka UI v2 / shadcn/ui
- **State**: Pinia (with `pinia-plugin-persistedstate`)
- **Routing**: Vue Router 4
- **HTTP**: `@astralis-os/notfetch` (custom fetch wrapper, instance at `src/api/index.ts`)
- **Forms**: VeeValidate + Valibot
- **Queries**: `@pinia/colada`
- **Tables**: TanStack Vue Table
- **Icons**: Lucide Vue Next
- **Toasts**: vue-sonner
- **Utils**: `clsx` + `tailwind-merge` via `src/utils/cn.ts`

## Project Structure

```
src/
├── api/              # API calls, organized by domain/action
│   ├── index.ts      # $API instance (notfetch), auth interceptors (Bearer + refresh)
│   ├── auth/
│   ├── languages/
│   └── courses/
├── app/
│   ├── configs/
│   │   └── pages.config.ts  # $PAGES — centralized route paths
│   └── router/
│       ├── router.ts         # Root router
│       ├── admin.router.ts
│       ├── auth.router.ts
│       └── user.router.ts
├── layout/           # AuthLayout, AdminLayout, UserLayout
├── pages/            # Route-level components, mirroring router structure
├── stores/           # Pinia stores (user.store.ts — persisted)
├── types/            # TypeScript interfaces/types (.d.ts)
├── shared/           # Shared components (icon.vue, etc.)
└── utils/            # cn.ts and other helpers
```

## Development

```bash
pnpm dev      # Start dev server (Vite)
pnpm build    # vue-tsc + vite build
pnpm preview  # Preview production build
```

## Environment Variables

| Variable       | Description                                              |
| -------------- | -------------------------------------------------------- |
| `VITE_API_URL` | Backend REST API base URL (e.g. `http://localhost:8000`) |

Create `.env.local` for local development:

```
VITE_API_URL=http://localhost:8000
```

## Auth Flow

- **Access token**: stored in `localStorage` as `accessToken`
- **Refresh token**: stored in `httpOnly` cookie, sent via `credentials: 'include'`
- **Refresh endpoint**: `POST /auth/refresh`
- On 401 → automatic token refresh with subscriber queue (prevents parallel refresh storms)
- On refresh failure → clear tokens + redirect to `/auth/login`

## Routes

| Prefix   | Layout      | Description                                             |
| -------- | ----------- | ------------------------------------------------------- |
| `/auth`  | AuthLayout  | Login, Registration                                     |
| `/admin` | AdminLayout | Admin panel (dashboard, categories, languages, courses) |
| `/user`  | UserLayout  | User profile, learning                                  |

---

## Code Patterns

### API Layer

Every action = its own folder with exactly two files:

```
src/api/<domain>/<action>/
  index.ts        ← raw async function + Params interface
  use[Action].ts  ← composable wrapping useQuery or useMutation
```

GET actions live under `src/api/<domain>/get/<method>/`.

**Query composable:**
```ts
export const useXxxGetAll = () => {
  return useQuery({ key: ['xxx'], query: () => getXxx() })
}
```

**Mutation composable:**
```ts
export const useXxxCreate = () => {
  return useMutation({
    mutation: (params: XxxParams) => createXxx(params),
  })
}
```

**Raw function (`index.ts`):**
```ts
export interface XxxParams { ... }

export const createXxx = async (params: XxxParams) => {
  return $API.post('/path', { ...params }, {})
}
```

---

### Vue Component Script Structure

Sections always separated by `// ---------------------` dividers:

```ts
// ---------------------
// props / emits
// ---------------------

// ---------------------
// schema
// ---------------------

// ---------------------
// api
// ---------------------

// ---------------------
// form
// ---------------------

// ---------------------
// fields
// ---------------------

// ---------------------
// submit
// ---------------------
```

---

### Forms

```ts
const schema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1, 'Name is required')),
})

const { handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: { name: '' },
})

const { value: name, errorMessage: nameError } = useField<string>('name')

const onSubmit = handleSubmit(async values => {
  try {
    await mutation.mutateAsync({ name: values.name })
    toast.success('...')
    resetForm()
  } catch (e) {
    toast.error('...')
  }
})
```

Error display in template:
```html
<p class="text-red-500 text-sm">{{ nameError }}</p>
```

---

### Template — Three Loading States

Always in this order:

```html
<!-- loading -->
<div v-if="asyncStatus === 'loading'">
  <Skeleton v-for="i in 6" :key="i" class="h-12 w-full rounded-lg" />
</div>

<!-- error -->
<div v-else-if="state.status === 'error'" class="bg-card border border-destructive ...">
  <p class="text-destructive font-semibold text-lg">Error loading data</p>
</div>

<!-- success -->
<div v-else-if="state.status === 'success'">
  ...
</div>
```

---

### Template — Client-side Pagination

Used in every table page:

```ts
const PER_PAGE = 8
const page = ref(1)

const items = computed(() => state.value.data?.data ?? [])
const totalPages = computed(() => Math.ceil(items.value.length / PER_PAGE))
const paginated = computed(() => {
  const start = (page.value - 1) * PER_PAGE
  return items.value.slice(start, start + PER_PAGE)
})
const rangeLabel = computed(() => {
  const start = (page.value - 1) * PER_PAGE + 1
  const end = Math.min(page.value * PER_PAGE, items.value.length)
  return `${start}–${end} of ${items.value.length}`
})
```

---

### Modals

- Live next to their page in a `(modals)/` folder
- Receive `@success="refetch"` from the parent page
- Open state via `defineModel`: `const isOpen = defineModel<boolean>('open')`

---

### Component Placement

- Used only on one page → lives next to that page
- Used across multiple pages → goes in `src/components/`

```
pages/admin/languages/
  LanguagesAdminPage.vue
  widgets/               ← page-specific components
    LanguageCard.vue
  (modals)/
    delete/
    edit/

src/components/admin/    ← global admin components
  SideBar/
  BreadCrumbs/
  StatsCard/
```

---

### Naming Conventions

| What | Pattern | Example |
|---|---|---|
| Pages | `[Entity][Section]Page.vue` | `CategoryAdminPage.vue` |
| Create pages | `[Entity]Create[Section]Page.vue` | `LanguageCreateAdminPage.vue` |
| Modals | `Admin[Entity][Action]Modal.vue` | `AdminCategoryDeleteModal.vue` |
| Composables | `use[Entity][Action]` | `useCategoryCreate`, `useLanguageGetAll` |
| Raw functions | camelCase verb+noun | `createCategory`, `getLanguages` |
| Params interfaces | `[Action][Entity]Params` | `CreateCategoryParams` |

---

### General Rules

- `$PAGES` always for route paths — never hardcode strings
- `@/` alias resolves to `src/`
- `toast.success / toast.error` (vue-sonner) for all user feedback
- `isSubmitting` for submit button disabled state
- Indentation: tabs in `.vue`, 2 spaces in `.ts`
- Quotes: single in `.vue`, double in `.ts`
- No comments in code except the `// ---------------------` section dividers

---

## Design System

### Colors (CSS variables in `src/style.css`)

**Brand**
- `--primary` / `bg-primary` — `#c0392b` (red, main accent)
- `--secondary` / `bg-secondary` — `#3b82f6` (blue)
- `--accent` / `bg-accent` — `#e67e22` (orange, warm accent)
- `--destructive` — `#c0392b` (same as primary, used for danger actions)

**Backgrounds**
- `bg-background` — page background (`#f2f2f2` light / `#1a1a1a` dark)
- `bg-card` — card/surface (`#ffffff` / `#242424`)
- `bg-card-secondary` — subtle secondary surface (`#f7f7f7` / `#2e2e2e`)
- `bg-input` — input background (`#ffffff` / `#2e2e2e`)

**Text**
- `text-foreground` — primary text (`#1a1a1a` / `#f0f0f0`)
- `text-muted-foreground` — secondary text (`#5a5a5a` / `#aaaaaa`)
- `text-muted` — muted/placeholder text (`#9b9b9b` / `#666666`)

**Status**
- `bg-status-success` / `text-status-success` — `#27ae60`
- `bg-status-pending` / `text-status-pending` — `#f39c12`
- `bg-status-error` / `text-status-error` — `#c0392b`
- `bg-status-neutral` / `text-status-neutral` — `#9b9b9b`

**Border**
- `border-border` — default border (`#e0e0e0` / `#3a3a3a`)

**Radius** — `--radius: 12px`. Tailwind classes: `rounded-sm` (8px), `rounded-md` (10px), `rounded-lg` (12px), `rounded-xl` (16px)

---

### Button (`src/shared/ui/button/`)

Import: `import { Button } from '@/shared/ui/button'`

**Variants**
- `default` — red background, white text (primary action)
- `destructive` — red border + bg, white text (dangerous action)
- `secondary` — blue background, white text
- `ghost` — transparent, hover fills muted bg
- `link` — text only with underline on hover

**Sizes**
- `default` — h-11, px-5
- `sm` — h-9, px-4, text-xs
- `lg` — h-14, px-8, text-lg
- `icon` — 40×40
- `icon-sm` — 32×32
- `icon-lg` — 48×48

```html
<Button>Default</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button size="icon"><PlusIcon /></Button>
<Button :disabled="isSubmitting">{{ isSubmitting ? 'Saving...' : 'Save' }}</Button>
```

---

### Badge (`src/shared/ui/badge/`)

Import: `import { Badge } from '@/shared/ui/badge'`

**Variants**
- `default` / `secondary` — neutral, border + muted text
- `outline` — transparent bg, border
- `success` / `active` — green tint, green border+text
- `warning` / `pending` — yellow/orange tint
- `destructive` / `canceled` — red tint

```html
<Badge variant="outline">#{{ item.id }}</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="pending">Pending</Badge>
<Badge variant="destructive">Error</Badge>
```

---

### Card (`src/shared/ui/card/`)

Import: `import { Card } from '@/shared/ui/card'`

White bg, `rounded-xl`, `border-border`, subtle shadow. No padding by default — add `class="p-5"` manually.
Sub-components: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAction`.

```html
<Card class="p-5">...</Card>
```

---

### Input (`src/shared/ui/input/`)

Import: `import { Input } from '@/shared/ui/input'`

Always used with `Label`. Error shown below as `<p class="text-red-500 text-sm">`.
Full width, h-11, rounded-lg, focus ring in primary color.

```html
<Label>Name</Label>
<Input v-model="name" placeholder="Enter name..." />
<p class="text-red-500 text-sm">{{ nameError }}</p>
```

---

### Select (`src/shared/ui/select/`)

Import: `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'`

Trigger sizes: `default` (h-11) and `sm` (h-9).
Dropdown has `rounded-2xl`, bold shadow `shadow-[0_4px_0_var(--border)]`.
Highlighted item turns primary red.

```html
<Select v-model="value">
  <SelectTrigger>
    <SelectValue placeholder="Choose..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="foo">Foo</SelectItem>
  </SelectContent>
</Select>
```

---

### Dialog (`src/shared/ui/dialog/`)

Import: `import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog'`

Open state always via `defineModel<boolean>('open')` in child, or local `ref` on the same page.
Has built-in close button (top-right X). `DialogContent` is centered modal, max-w-lg.

```html
<Dialog v-model:open="isOpen">
  <DialogTrigger as-child><Button>Open</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <!-- form or content -->
    <DialogFooter>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Table (`src/shared/ui/table/`)

Import: `import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'`

Always wrapped in `<Card>`. Headers are uppercase, `text-xs`, `text-muted`, tracked.
Rows have hover `bg-card-secondary`. Always wrap in `<Card>` — never use standalone.

```html
<Card>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>ID</TableHead>
        <TableHead>Name</TableHead>
        <TableHead class="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="item in paginated" :key="item.id">
        <TableCell><Badge variant="outline">#{{ item.id }}</Badge></TableCell>
        <TableCell>{{ item.name }}</TableCell>
        <TableCell class="text-right">...</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</Card>
```

---

### Skeleton (`src/shared/ui/skeleton/`)

Import: `import { Skeleton } from '@/shared/ui/skeleton'`

Used in `v-if="asyncStatus === 'loading'"` blocks. Animated pulse, `bg-card-secondary`.

```html
<Skeleton v-for="i in 6" :key="i" class="h-12 w-full rounded-lg" />
```

---

### AdminStatsCard (`src/components/admin/StatsCard/AdminStatsCard.vue`)

Props: `title: string`, `value: string | number`, `icon: string` (Lucide icon name), `color: string`.

Available colors: `blue`, `green`, `red`, `yellow`, `purple`, `orange`, `pink`, `cyan`.
Icon name is a Lucide icon passed to the custom `<Icon>` wrapper (`src/shared/icon.vue`).

```html
<AdminStatsCard title="Total Users" :value="1284" icon="users" color="blue" />
```
