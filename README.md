# playwright-framework

> End-to-end UI test automation platform built with **Playwright & TypeScript**, targeting **OrangeHRM** — a real-world HR management application. Tests run locally, in Docker, and inside a **Kubernetes** cluster via GitHub Actions CI/CD.

<p align="center">
  <a href="https://playwright.dev/">
    <img src="https://img.shields.io/badge/Playwright-1.59.1-45ba4b?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright"/>
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  </a>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  </a>
  <a href="https://www.docker.com/">
    <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  </a>
  <a href="https://kubernetes.io/">
    <img src="https://img.shields.io/badge/Kubernetes-Kind-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes"/>
  </a>
  <a href="https://github.com/features/actions">
    <img src="https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Chromium-✓-4285F4?style=flat-square&logo=googlechrome&logoColor=white" alt="Chromium"/>
  <img src="https://img.shields.io/badge/Firefox-✓-FF7139?style=flat-square&logo=firefox&logoColor=white" alt="Firefox"/>
  <img src="https://img.shields.io/badge/WebKit-✓-000000?style=flat-square&logo=safari&logoColor=white" alt="WebKit"/>
  <img src="https://img.shields.io/badge/Tests-Parallel-brightgreen?style=flat-square" alt="Parallel"/>
  <img src="https://img.shields.io/badge/Pattern-Page_Object_Model-blueviolet?style=flat-square" alt="POM"/>
  <img src="https://img.shields.io/badge/Reports-HTML-orange?style=flat-square" alt="HTML Reports"/>
</p>

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

| Layer | Technology |
|-------|-----------|
| Test runner | [Playwright](https://playwright.dev/) v1.59.1 |
| Language | TypeScript (strict mode) |
| Design pattern | Page Object Model |
| Test isolation | Custom Playwright fixtures |
| Containerisation | Docker (`mcr.microsoft.com/playwright:v1.59.1-noble`) |
| Orchestration | Kubernetes (Kind in CI) |
| CI/CD | GitHub Actions |
| Reporting | Playwright HTML Reporter + GitHub Artifacts |

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

| Tool | Minimum Version | Purpose |
|------|----------------|---------|
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white&style=flat-square) | 18 LTS | Runtime |
| ![npm](https://img.shields.io/badge/-npm-CB3837?logo=npm&logoColor=white&style=flat-square) | 9+ | Package management |
| ![Docker](https://img.shields.io/badge/-Docker-2496ED?logo=docker&logoColor=white&style=flat-square) | 24+ | Containerised runs |
| ![Kind](https://img.shields.io/badge/-Kind-326CE5?logo=kubernetes&logoColor=white&style=flat-square) | 0.20+ | Local Kubernetes cluster |

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

### Key Playwright Settings

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

```
Trigger: push to main / workflow_dispatch
          │
          ▼
  ┌───────────────────┐
  │  Build Docker     │  pw-test:latest
  │  Image            │
  └────────┬──────────┘
           │
           ▼
  ┌───────────────────┐
  │  Create Kind      │  Local K8s cluster
  │  Cluster          │
  └────────┬──────────┘
           │
           ▼
  ┌───────────────────┐
  │  Load Image &     │  Inject secrets:
  │  Deploy Job       │  BASE_URL / USERNAME / PASSWORD
  └────────┬──────────┘
           │
           ▼
  ┌───────────────────┐
  │  Monitor Pod &    │  Timeout: 600s
  │  Wait for Done    │
  └────────┬──────────┘
           │
           ▼
  ┌───────────────────┐
  │  Copy Report &    │  playwright-report/
  │  Upload Artifact  │  Retained: 30 days
  └────────┬──────────┘
           │
           ▼
  ┌───────────────────┐
  │  Teardown Kind    │
  │  Cluster          │
  └───────────────────┘
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

[![Docker](https://img.shields.io/badge/Base_Image-playwright%3Av1.59.1--noble-2496ED?style=flat-square&logo=docker&logoColor=white)](https://mcr.microsoft.com/en-us/artifact/mar/playwright)

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

### Kubernetes

[pw-k8s-job.yaml](pw-k8s-job.yaml) defines a one-shot Kubernetes Job:

| Setting | Value |
|---------|-------|
| Kind | `Job` |
| Backoff limit | `0` (no K8s-level retries) |
| Restart policy | `Never` |
| Image pull policy | `Never` (uses pre-loaded local image) |
| Credentials | Injected from `playwright-secret` |
| Report output | Copied to shared volume → extracted by CI |

---

## Reports & Artifacts

After a test run:

- **Local:** Open `playwright-report/index.html` or run `npx playwright show-report`
- **CI:** Download the `playwright-report` artifact from the GitHub Actions run summary (retained for 30 days)

Traces (`.zip` files with DOM snapshots, network logs, and screenshots) are collected on every retry and are viewable at [trace.playwright.dev](https://trace.playwright.dev/).

---

<p align="center">
  Built with ❤️ using
  <a href="https://playwright.dev/">Playwright</a> ·
  <a href="https://www.typescriptlang.org/">TypeScript</a> ·
  <a href="https://docs.github.com/en/actions">GitHub Actions</a>
</p>
