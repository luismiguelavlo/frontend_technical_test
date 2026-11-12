# Users App — React frontend

React + TypeScript SPA for user management. It consumes the CodeIgniter 4 REST API from the backend project (`ci4-app`). Built for the Developer Technical Test (`docs/Developer_Technical_Test.md`).

- **Stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4, React Compiler, Oxlint
- **API base URL expected:** `http://localhost:8080` (no `/api` prefix), configurable via `VITE_API_URL`
- **No extra runtime dependencies:** only `react` and `react-dom`, with native `fetch`, hash routing and hand-written hooks

## Requirements

- Node.js `^20.19.0` or `>=22.12.0` (required by Vite 8) and npm
- The backend running and seeded (see the backend README): `php spark migrate && php spark db:seed UserSeeder && php spark serve`
- The frontend origin listed in the backend's `CORS_ALLOWED_ORIGINS` (default `http://localhost:5173`)

## Run the frontend

```bash
# 1. Dependencies
npm install

# 2. Configuration
cp .env.example .env.local
#   VITE_API_URL = API base URL, no trailing slash (default http://localhost:8080)

# 3. Dev server
npm run dev                   # http://localhost:5173
```

If the list shows **"API sin conexión"**, check that the backend is running at `VITE_API_URL` and that `http://localhost:5173` is listed in `CORS_ALLOWED_ORIGINS`.

### Scripts

| Command           | What it does                                       |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Vite dev server with HMR                           |
| `npm run build`   | Type-check (`tsc -b`) and production build (`dist/`) |
| `npm run preview` | Serve the production build locally                 |
| `npm run lint`    | Oxlint                                             |

`VITE_API_URL` is inlined at build time, so set it before running `npm run build`. Because routing uses the URL hash, `dist/` can be served by any static host without rewrite rules.

## Features

| Requirement (test)                    | Where                                                                 |
| ------------------------------------- | --------------------------------------------------------------------- |
| Consume the API via `fetch`           | `src/api/client.ts`, `src/api/users.ts`                               |
| List users in a table                 | `#/`: `UsersPage` → `UserTable` (generic `DataTable`)                 |
| Create / edit forms + client validation | `UserFormDialog` + `useForm` + `utils/userValidation.ts`            |
| Delete with confirmation              | `DeleteUserDialog` (generic `ConfirmDialog`)                          |
| Loading and error states              | Skeletons, error panel with retry, empty state, API status badge      |
| User detail (`GET /users/{id}`)       | `#/users/{id}`: `UserDetailPage`, with its own 404 state              |

Extras: accent-insensitive search by name or email, gender filter and pagination (all client-side), toast notifications, keyboard and screen-reader support (labelled dialogs, Escape to close, `aria-invalid`/`aria-describedby` on fields).

## API contract used

| Request              | Success                | Errors handled                          |
| -------------------- | ---------------------- | --------------------------------------- |
| `GET /users`         | `200 { data: User[] }` | network error                           |
| `GET /users/{id}`    | `200 { data: User }`   | `404` → "user not found" view           |
| `POST /users`        | `201 { data: User }`   | `422 { errors }` → mapped to the fields |
| `PUT /users/{id}`    | `200 { data: User }`   | `422` → fields, `404` → removed from UI, `412` → reload + toast |
| `DELETE /users/{id}` | `204`                  | `404` → removed from UI                 |

`PUT` always sends `If-Match: "<version>"` with the version the user was loaded with (see below).

Errors follow the backend contract `{ status, message, errors }` and become an `ApiError`. A network failure is reported as status `0`.

## Project structure

```
src/
  api/          fetch client (JSON, { data } unwrap, ApiError) and users endpoints
  components/
    layout/     header, nav, footer, page shell
    ui/         reusable, domain-agnostic components (Button, Card, Modal, DataTable, FormField, …)
  features/
    users/      pages and user-specific components (table, form, dialogs, detail cards)
  hooks/        useUsers / useUser (server state), useForm, usePagination, useToasts, useHashRoute
  types/        User model and labels
  utils/        validation, filtering, pagination, dates, routes
```

`components/ui` knows nothing about users, while `features/users` composes those components with the domain. Each page has a skeleton with the same layout as its loaded state.

## Decisions and assumptions

- **Server state in hooks, no cache library.** `useUsers` and `useUser` fetch with an `AbortController` per request and abort the previous one, so an older response can never overwrite a newer one. After a create, edit or delete, the local list is updated with the entity the API returns, without refetching. A React Query/SWR-style library would be the next step if the app grew.
- **State placement.** Form values, open dialogs and filters are local component state. Server data lives in the hooks. The only cross-page state is the toast queue, kept in `App` so that a message like "Usuario eliminado" survives the navigation back to the list.
- **Client-side search, filter and pagination.** `GET /users` returns the whole table (20 seeded rows), so filtering in the browser is simpler and instant. With a large table this should move to the server (query params plus keyset pagination).
- **Validation mirrors the backend rules** (`UserModel::$validationRules`): required fields, email format, max lengths, phone characters, age 1–120. The server stays the source of truth: its `422` field errors (e.g. duplicate email) are shown on the same fields.
- **Concurrent edits (optimistic locking).** Every user carries a `version`. The edit form saves with `If-Match: "<version>"`. If another person saved first, the API answers `412`: the app reloads that user from the API (in the list row or on the detail page), closes the form and shows a toast asking the user to review the current data and edit again. Nothing is overwritten silently, and no stale form data is resubmitted.
- **Hash routing** (`#/users/12`) instead of a router dependency: two routes don't justify one, and it needs no server rewrites.
- **Gender values** are `male | female | other`, as stored by the API, and are displayed in Spanish. An unknown value from the API is shown as "Otro".
- **Timestamps** (`created_at`, `updated_at`) come from the API in UTC and are shown in the browser's time zone.
- **No authentication.** The test does not require it, and the API is open. The header shows only what exists: the users module and the API connection status.
- **UI language:** Spanish. Code and docs: English.
