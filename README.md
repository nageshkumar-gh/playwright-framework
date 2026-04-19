# playwright-framework
> UI test automation platform built with Playwright & TypeScript,
> targeting OrangeHRM — a real-world HR management application.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Organization](#test-organization)
- [Page Object Model](#page-object-model)
- [Fixtures](#fixtures)
- [Utilities](#utilities)
- [CI/CD Pipeline](#cicd-pipeline)
- [Docker & Kubernetes](#docker--kubernetes)
- [Reports & Artifacts](#reports--artifacts)

---

## Overview

This framework automates end-to-end UI testing for [OrangeHRM](https://www.orangehrm.com/), an open-source HR management system. It is built with:

- **[Playwright](https://playwright.dev/)** — cross-browser end-to-end testing
- **TypeScript** — type-safe test authoring
- **Page Object Model** — maintainable, reusable page abstractions
- **Custom Fixtures** — shared setup/teardown across tests
- **Docker + Kubernetes** — containerised, portable test execution
- **GitHub Actions** — automated CI/CD with artifact publishing

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Test Specs                            │
│              tests/Login/    tests/PIM/                      │
└──────────────────────┬───────────────────────────────────────┘
                       │ use
┌──────────────────────▼───────────────────────────────────────┐
│                   Custom Fixtures                            │
│                  fixtures/loginFixture.ts                    │
└──────────────────────┬───────────────────────────────────────┘
                       │ use
┌──────────────────────▼───────────────────────────────────────┐
│                  Page Object Model                           │
│    BasePage  →  LoginPage  /  HeaderAndMenuPage  /  PimPage  │
└──────────────────────┬───────────────────────────────────────┘
                       │ powered by
┌──────────────────────▼───────────────────────────────────────┐
│              Playwright Test Runner                          │
│         Chromium  │  Firefox  │  WebKit                      │
└──────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
playwright-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml        # GitHub Actions CI/CD pipeline
├── fixtures/
│   └── loginFixture.ts           # Reusable authenticated-session fixture
├── pages/                        # Page Object Model classes
│   ├── BasePage.ts               # Base class holding the Playwright Page instance
│   ├── LoginPage.ts              # Login page interactions
│   ├── HeaderAndMenuPage.ts      # Top navigation and logout
│   └── PimPage.ts                # Employee (PIM) management interactions
├── tests/                        # Test specifications
│   ├── Login/
│   │   └── login.spec.ts         # Login / logout / session test cases
│   └── PIM/
│       └── pim.spec.ts           # Employee creation test cases
├── test-data/
│   └── login-data.json           # Static credentials used in negative tests
├── utils/
│   ├── nameGenerator.ts          # Random name generation helpers
│   └── empIdGenerator.ts         # Unique employee-ID generation
├── Dockerfile                    # Container image for test execution
├── pw-k8s-job.yaml               # Kubernetes Job manifest
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript compiler options
├── package.json                  # Project metadata and dependencies
└── .env                          # Local environment variables (git-ignored)
```

---

## Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | 18 LTS |
| npm | 9+ |
| Docker | 24+ (for containerised runs) |
| Kind | 0.20+ (for Kubernetes runs) |

---

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd playwright-framework

# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install
```

---

## Configuration

All runtime settings are driven by environment variables. Copy the example below into a `.env` file at the project root (this file is git-ignored):

```dotenv
BASE_URL=http://localhost:8200   # OrangeHRM instance URL
USERNAME=dev_admin               # Valid admin username
PASSWORD=Selenium@123456         # Valid admin password
```

`playwright.config.ts` reads these variables via `dotenv` and applies them to every test run.

### Key Playwright settings

| Setting | Value |
|---------|-------|
| Test directory | `./tests` |
| Global timeout | 120 seconds |
| Retries (local) | 3 |
| Retries (CI) | 2 |
| Parallelism | Fully parallel |
| Headless | `true` |
| Screenshots | On failure only |
| Traces | On every retry |
| Browsers | Chromium, Firefox, WebKit |
| Report | HTML → `playwright-report/` |

---

## Running Tests

```bash
# Run all tests across all browsers
npx playwright test

# Run a specific spec file
npx playwright test tests/Login/login.spec.ts

# Run in headed mode (watch the browser)
npx playwright test --headed

# Run only on a single browser
npx playwright test --project=chromium

# Run with a custom base URL
BASE_URL=https://staging.example.com npx playwright test

# Open the interactive HTML report after a run
npx playwright show-report
```

---

## Test Organization

### Login Tests — `tests/Login/login.spec.ts`

| # | Test Case | Description |
|---|-----------|-------------|
| 1 | Admin can login with valid credentials | Verifies successful login and dashboard heading |
| 2 | User sees error with invalid credentials | Asserts error message for wrong username/password |
| 3 | User cannot login with empty credentials | Validates required-field error messages |
| 4 | Admin can logout successfully | Completes a full login → logout cycle |
| 5 | Session expired redirects to login | Confirms expired-session redirect behaviour |

### PIM Tests — `tests/PIM/pim.spec.ts`

| # | Test Case | Description |
|---|-----------|-------------|
| 1 | Admin can add a new employee | Navigates to PIM, fills employee details with dynamically generated data, and verifies the success notification |

---

## Page Object Model

All page objects live in [`pages/`](pages/) and extend `BasePage`.

### [BasePage.ts](pages/BasePage.ts)
Holds the Playwright `Page` instance and is the single inheritance point for all page objects.

### [LoginPage.ts](pages/LoginPage.ts)
| Method | Description |
|--------|-------------|
| `setUsername(username)` | Types into the username field |
| `setPassword(password)` | Types into the password field |
| `clickLogin()` | Submits the login form |
| `getLoginTitle()` | Returns the page heading locator |
| `getErrorMsg()` | Returns the error alert locator |

### [HeaderAndMenuPage.ts](pages/HeaderAndMenuPage.ts)
| Method | Description |
|--------|-------------|
| `getHeaderTitle()` | Returns the dashboard header locator |
| `clickLogout()` | Triggers the logout flow |
| `selectMenuTitle(menuName)` | Clicks a top-level navigation menu item |

### [PimPage.ts](pages/PimPage.ts)
| Method | Description |
|--------|-------------|
| `clickAddEmp()` | Clicks the "Add Employee" button |
| `setFullName(first, middle, last)` | Fills the three name fields |
| `setEmpId(empId)` | Fills the employee ID field |
| `clickSaveEmpName()` | Saves the new employee record |
| `checkSucessNotification()` | Asserts the success toast is visible |

---

## Fixtures

### [fixtures/loginFixture.ts](fixtures/loginFixture.ts)

Extends Playwright's built-in fixture system to provide an **already-authenticated session** to any test that imports from it.

```typescript
import { test } from '../../fixtures/loginFixture';

test('some authenticated test', async ({ loginPage }) => {
  // page is already logged in
});
```

**What it does:**
1. Navigates to `BASE_URL`
2. Reads `USERNAME` and `PASSWORD` from environment variables
3. Calls the `LoginPage` methods to perform login
4. Yields the `LoginPage` instance to the test
5. No teardown required — Playwright resets browser context per test

---

## Utilities

### [utils/nameGenerator.ts](utils/nameGenerator.ts)

| Function | Returns | Description |
|----------|---------|-------------|
| `randomString(length)` | `string` | Lowercase random alphabetical string |
| `randomName(length)` | `string` | Capitalised random name |
| `generateFullName()` | `{ firstName, middleName, lastName }` | Full name object for employee forms |

### [utils/empIdGenerator.ts](utils/empIdGenerator.ts)

| Function | Returns | Description |
|----------|---------|-------------|
| `randomEmpIdData()` | `string` | Timestamp-based unique employee ID (`{mm}{ss}{ms}`) |

---

## CI/CD Pipeline

The GitHub Actions workflow at [.github/workflows/playwright.yml](.github/workflows/playwright.yml) runs on every push to `main` and on manual dispatch.

### Pipeline steps

```
1. Checkout repository
2. Build Docker image  →  pw-test:latest
3. Install Kind (Kubernetes-in-Docker)
4. Create local Kubernetes cluster
5. Wait for cluster nodes to become Ready
6. Load Docker image into Kind cluster
7. Create Kubernetes Secret from GitHub secrets
       (BASE_URL, USERNAME, PASSWORD)
8. Apply Kubernetes Job  →  pw-k8s-job.yaml
9. Monitor pod status
10. Wait for Job completion (success or failure)
11. Collect debug output on failure
12. Stream pod logs
13. Copy playwright-report/ from pod
14. Upload report as GitHub Actions artifact (30-day retention)
15. Tear down Kind cluster
```

### Required GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `BASE_URL` | OrangeHRM instance URL |
| `USERNAME` | Test admin username |
| `PASSWORD` | Test admin password |

---

## Docker & Kubernetes

### Docker

The [Dockerfile](Dockerfile) uses the official Playwright base image which ships with all required browser binaries and OS dependencies.

```bash
# Build the image locally
docker build -t pw-test:latest .

# Run tests inside the container (pass env vars at runtime)
docker run --rm \
  -e BASE_URL=http://host.docker.internal:8200 \
  -e USERNAME=dev_admin \
  -e PASSWORD=Selenium@123456 \
  pw-test:latest
```

**Base image:** `mcr.microsoft.com/playwright:v1.59.1-noble`

### Kubernetes

[pw-k8s-job.yaml](pw-k8s-job.yaml) defines a one-shot Kubernetes Job:

| Setting | Value |
|---------|-------|
| Kind | `Job` |
| Backoff limit | `0` (no K8s-level retries) |
| Restart policy | `Never` |
| Image pull policy | `Never` (uses pre-loaded local image) |
| Credentials | Injected from `playwright-secret` |

---

## Reports & Artifacts

After a test run:

- **Local:** Open `playwright-report/index.html` or run `npx playwright show-report`
- **CI:** Download the `playwright-report` artifact from the GitHub Actions run summary (retained for 30 days)

Traces (`.zip` files with DOM snapshots, network logs, and screenshots) are collected on every retry and are viewable at [trace.playwright.dev](https://trace.playwright.dev/).
