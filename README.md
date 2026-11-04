# 🏢 HB Realty — Automated Testing Framework

[![Playwright Tests](https://github.com/HarshitBakrania/HB-Realty-playwright-framework/actions/workflows/playwright.yml/badge.svg)](https://github.com/HarshitBakrania/HB-Realty-playwright-framework/actions/workflows/playwright.yml)
[![Live Test Report](https://img.shields.io/badge/Report-GitHub_Pages-2ea44f?style=flat&logo=github&logoColor=white)](https://harshitbakrania.github.io/HB-Realty-playwright-framework/)
![Playwright](https://img.shields.io/badge/Playwright-v1.64+-45ba4b?style=flat&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat&logo=typescript&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088ff?style=flat&logo=githubactions&logoColor=white)

A full-stack automation testing framework written in **TypeScript** using **Playwright**, providing 67 end-to-end (E2E), REST API, and real-time WebSocket tests across 16 test suites.

Built specifically to test the full-stack **[HB-Realty](https://github.com/HarshitBakrania/HB-Realty)** web application (React 18, Node.js/Express, MongoDB, Prisma, Socket.io), deployed live at **[real-estate-app-harshitbakranias-projects.vercel.app](https://real-estate-app-harshitbakranias-projects.vercel.app/)**.

📊 **Interactive Test Report**: [harshitbakrania.github.io/HB-Realty-playwright-framework](https://harshitbakrania.github.io/HB-Realty-playwright-framework/)

---

## 🏗 Architecture & Design Patterns

- **Page Object Model (POM)**: UI selectors and actions are strictly encapsulated inside dedicated page classes (`pages/`), decoupling test logic from DOM changes.
- **Custom Base Fixtures (`fixtures/base.fixtures.ts`)**: Extends Playwright's `test` runner to automatically inject pre-instantiated Page Objects and an `authenticatedPage` fixture into tests, eliminating manual setup boilerplate.
- **Session State Caching (`storageState`)**: High-performance authentication helper (`ensureAuthUser`) logs in once and saves the browser session state to disk, avoiding repetitive UI logins across tests.
- **Multi-Context WebSocket Testing**: Spawns two isolated browser contexts concurrently to test bidirectional real-time messaging between distinct users over Socket.io.
- **Dual-Layer Coverage (API + UI)**: Uses Playwright's native `request` context for 100% REST API route coverage alongside browser-based E2E user flows.
- **Automated Dev WebServers**: In local environments, Playwright automatically spins up the React client, Express API, and WebSocket servers (`reuseExistingServer: true`); on CI, this is automatically disabled in favor of live endpoints.
- **Environment Parity (Local & CI/Prod)**: Automatically toggles between local web servers and live Vercel production endpoints using dynamic URL sanitization (`replace(/\/$/, "")`).

---

## 📁 Project Structure

```
HB-Realty-playwright-framework/
├── .github/workflows/
│   └── playwright.yml            # CI/CD pipeline (runs tests on push/PR/manual)
├── fixtures/
│   └── base.fixtures.ts          # Custom test fixture extensions & auth caching
├── pages/                        # Page Object Model (POM) classes
│   ├── components/NavBar.ts      # Global navigation component
│   ├── CreateNewPost.ts          # Post creation page
│   ├── HomePage.ts               # Search bar & hero elements
│   ├── ListPage.ts               # Search results & Leaflet map
│   ├── MessagesPage.ts           # Chat interface & conversations
│   ├── PropertyPage.ts           # Property details & save/contact CTAs
│   ├── SignInPage.ts / SignUpPage.ts
│   └── UserPage.ts / UpdateUserProfile.ts
├── tests/
│   ├── api/                      # 31 REST API tests (auth, posts, lifecycle, users, chat)
│   ├── auth/                     # Sign-in & sign-up UI flows
│   ├── components/               # Navbar & navigation guards
│   ├── e2e/                      # Master end-to-end user journeys
│   ├── home/ & listings/         # Search filtering & card interactions
│   ├── messaging/                # Chat UI & real-time WebSocket messaging
│   ├── property/                 # Property specifications & save/unsave toggling
│   └── user/                     # Profile updates & saved property lists
├── utils/
│   └── .env                      # Local environment variable configuration
├── playwright.config.ts          # Global configuration (reporters, retries, workers, timeouts)
└── package.json                  # Scripts & dependencies
```

---

## 📊 Test Coverage Breakdown

| Layer | Specs | Count | What It Tests |
|---|---|:---:|---|
| **REST API** | `tests/api/*.spec.ts` | 31 | Status codes, payloads, auth cookies, post CRUD lifecycle, filters, and chat routes. |
| **UI Component & Features** | `tests/{auth,components,home,listings,property,user}/*.spec.ts` | 33 | Form validation, role-based accessibility locators, search filters, Leaflet maps, and optimistic UI toggles. |
| **Real-Time WebSocket** | `tests/messaging/realTimeMessaging.spec.ts` | 1 | Two simultaneous browser contexts validating real-time Socket.io message exchange. |
| **End-to-End (E2E)** | `tests/e2e/fullFlow.spec.ts` | 2 | Complete user journey: Search $\rightarrow$ View Details $\rightarrow$ Save $\rightarrow$ Message Owner $\rightarrow$ Check Profile $\rightarrow$ Logout. |
| **Total** | **16 test files** | **67** | **All tests passing** |

---

## ⚙️ Environment Configuration

The framework supports dual-environment execution via environment variables:

| Variable | Description | Local Default | CI / Production Environment |
|---|---|---|---|
| `BASE_URL` | Frontend client URL | `http://localhost:5173` | `https://real-estate-app-harshitbakranias-projects.vercel.app` |
| `API_URL` | Express backend REST API | `http://localhost:3000` | Configured via GitHub Secrets / Repository Variables |

- **Local Development**: Read automatically from `utils/.env` via `dotenv`.
- **CI / GitHub Actions**: Injected through repository variables (`vars.BASE_URL`, `vars.API_URL`).

---

## 🔄 CI/CD Pipeline

The framework runs via **GitHub Actions** (`.github/workflows/playwright.yml`) on Ubuntu runners:
- Runs automatically on `push`, `pull_request`, or manual dispatch (`workflow_dispatch`).
- Targets production using repository variables (`BASE_URL`, `API_URL`).
- Sets `CI: "true"` to run sequentially (`workers: 1`) with `retries: 2` to eliminate cloud latency flakiness.
- Publishes Playwright HTML reports and failure trace artifacts for 30 days.

---

## 🚀 Quickstart

### 1. Installation
```bash
git clone https://github.com/HarshitBakrania/HB-Realty-playwright-framework.git
cd HB-Realty-playwright-framework
npm ci
npx playwright install chromium
```

### 2. Run Tests
```bash
# Run all 67 tests headlessly
npm test

# Run tests in headed browser mode
npm run test:headed

# Run with interactive UI mode (time-travel debugging)
npm run test:ui

# Run only API tests
npx playwright test tests/api

# Run only E2E user flows
npx playwright test tests/e2e

# View the latest HTML test report
npm run test:report
```
