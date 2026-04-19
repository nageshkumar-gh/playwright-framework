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
{"type":"excalidraw/clipboard","workspaceId":"x2iCdjI1FfSTPGZHod8H","elements":[{"0":525,"1":340,"renderVersion":"20260419","strokeColor":"#d7d9dc","fillStyle":"solid","backgroundColor":"transparent","strokeWidth":1,"strokeStyle":"solid","roughness":1,"opacity":100,"strokeSharpness":"sharp","version":23,"isDeleted":false,"id":"pDfmry0V6UcJaqgDHfUS","code":"title CI Pipeline for Playwright Tests\ndirection right\n\n// Nodes\nPush to main [shape: oval, icon: git-commit, color: lightblue]\nBuild Docker image [icon: box, color: blue]\nSetup Kind cluster [icon: server, color: purple]\nRun Kubernetes job [icon: play, color: orange]\n\nResults [color: gray] {\n  Tests pass [shape: diamond, icon: check-circle, color: green]\n  Tests fail [shape: diamond, icon: x-circle, color: red]\n}\n\nUpload report artifact [icon: upload, color: blue]\nCleanup cluster [icon: trash-2, color: gray]\nPipeline complete [shape: oval, icon: flag, color: lightgreen]\n\n// Relationships\nPush to main > Build Docker image\nBuild Docker image > Setup Kind cluster: Load image; create secret\nSetup Kind cluster > Run Kubernetes job: kubectl apply\nRun Kubernetes job > Results\nTests pass > Upload report artifact: exit 0\nTests fail > Upload report artifact: exit 1; debug logs\nUpload report artifact > Cleanup cluster: always\nCleanup cluster > Pipeline complete","x":0,"y":0,"diagramType":"flowchart-diagram","forceAiMode":false,"isBeingGenerated":false,"lastEditMode":"ai","scale":1,"type":"diagram","width":1027.4884576416016,"height":475,"angle":0,"groupIds":[],"lockedGroupId":null,"seed":1258828336,"zIndex":0,"isSyntaxMissing":false,"isSyntaxBroken":false,"modifiedAt":1776626377238},{"id":"2dc1e338c23f650a2d650e69c2c29ad1","strokeColor":"gray","backgroundColor":"rgba(250,250,250, 1)","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":"round","roughness":0,"opacity":100,"elementStyle":1,"colorMode":0,"diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"Results","type":"rectangle","isContainer":true,"sizingMode":"auto","compound":{"type":"parent","containerType":"group","settings":{"color":"gray","colorMode":"pastel","styleMode":"shadow","typeface":"rough"},"children":{"label":"RESULTS"}},"x":37,"y":152,"width":227,"height":308,"angle":0,"groupIds":[],"lockedGroupId":null,"seed":1643401424,"version":9,"isDeleted":false,"modifiedAt":1776626377236,"zIndex":1},{"id":"34a68e05499cd99752b1334ae19e75cd","type":"diamond","containerId":"2dc1e338c23f650a2d650e69c2c29ad1","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"Tests pass","strokeColor":"#242424","backgroundColor":"#c0f8d0","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":[6,6,6,6],"roughness":0,"opacity":100,"elementStyle":1,"colorMode":0,"x":69,"y":207,"sizingMode":"auto","compound":{"type":"parent","containerType":"flow-node","settings":{"shape":"diamond","color":"green","colorMode":"pastel","styleMode":"shadow","typeface":"rough"},"children":{"label":"Tests\npass","icon":{"name":"check-circle"}}},"width":138,"height":104,"angle":0,"groupIds":[],"lockedGroupId":null,"seed":1097195056,"version":9,"isDeleted":false,"modifiedAt":1776626377236,"zIndex":2},{"id":"0812640d077c9e4c4f7d910f679df7e9","type":"diamond","containerId":"2dc1e338c23f650a2d650e69c2c29ad1","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"Tests fail","strokeColor":"#242424","backgroundColor":"#f8c0c0","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":[6,6,6,6],"roughness":0,"opacity":100,"elementStyle":1,"colorMode":0,"x":69,"y":336,"sizingMode":"auto","compound":{"type":"parent","containerType":"flow-node","settings":{"shape":"diamond","color":"red","colorMode":"pastel","styleMode":"shadow","typeface":"rough"},"children":{"label":"Tests\nfail","icon":{"name":"x-circle"}}},"width":138,"height":104,"angle":0,"groupIds":[],"lockedGroupId":null,"seed":281547312,"version":8,"isDeleted":false,"modifiedAt":1776626377236,"zIndex":3},{"id":"aca62fd352d902b0a691bac67ea8d8e1","type":"oval","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"Push to main","strokeColor":"#242424","backgroundColor":"lightblue","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":"round","roughness":0,"opacity":100,"elementStyle":1,"colorMode":0,"x":37,"y":30,"sizingMode":"auto","compound":{"type":"parent","containerType":"flow-node","settings":{"shape":"oval","color":"lightblue","colorMode":"pastel","styleMode":"shadow","typeface":"rough"},"children":{"label":"Push to main","icon":{"name":"git-commit"}}},"width":138,"height":72,"angle":0,"groupIds":[],"lockedGroupId":null,"seed":1814906416,"version":9,"isDeleted":false,"modifiedAt":1776626377236,"zIndex":4},{"id":"7bfbeab766cebff5ee7eab1f55524a12","type":"rectangle","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"Build Docker image","strokeColor":"#242424","backgroundColor":"#c7dcfc","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":[6,6,6,6],"roughness":0,"opacity":100,"elementStyle":1,"colorMode":0,"x":234,"y":30,"sizingMode":"auto","compound":{"type":"parent","containerType":"flow-node","settings":{"shape":"rectangle","color":"blue","colorMode":"pastel","styleMode":"shadow","typeface":"rough"},"children":{"label":"Build Docker\nimage","icon":{"name":"box"}}},"width":138,"height":72,"angle":0,"groupIds":[],"lockedGroupId":null,"seed":1859484208,"version":9,"isDeleted":false,"modifiedAt":1776626377236,"zIndex":5},{"id":"b9d5c4f15ba99c466bfd26a1fe644aab","type":"rectangle","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"Setup Kind cluster","strokeColor":"#242424","backgroundColor":"#f4c0f8","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":[6,6,6,6],"roughness":0,"opacity":100,"elementStyle":1,"colorMode":0,"x":510,"y":30,"sizingMode":"auto","compound":{"type":"parent","containerType":"flow-node","settings":{"shape":"rectangle","color":"purple","colorMode":"pastel","styleMode":"shadow","typeface":"rough"},"children":{"label":"Setup Kind\ncluster","icon":{"name":"server"}}},"width":138,"height":72,"angle":0,"groupIds":[],"lockedGroupId":null,"seed":1677766192,"version":9,"isDeleted":false,"modifiedAt":1776626377236,"zIndex":7},{"id":"02707089c356938a22ecef52d138f6a1","type":"rectangle","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"Run Kubernetes job","strokeColor":"#242424","backgroundColor":"#f8d8c0","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":[6,6,6,6],"roughness":0,"opacity":100,"elementStyle":1,"colorMode":0,"x":787,"y":30,"sizingMode":"auto","compound":{"type":"parent","containerType":"flow-node","settings":{"shape":"rectangle","color":"orange","colorMode":"pastel","styleMode":"shadow","typeface":"rough"},"children":{"label":"Run Kubernetes\njob","icon":{"name":"play"}}},"width":138,"height":72,"angle":0,"groupIds":[],"lockedGroupId":null,"seed":1190060592,"version":9,"isDeleted":false,"modifiedAt":1776626377236,"zIndex":10},{"id":"e8bd4a40f06f11b8437afcd7a56061a8","type":"rectangle","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"Upload report artifact","strokeColor":"#242424","backgroundColor":"#c7dcfc","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":[6,6,6,6],"roughness":0,"opacity":100,"elementStyle":1,"colorMode":0,"x":429,"y":288,"sizingMode":"auto","compound":{"type":"parent","containerType":"flow-node","settings":{"shape":"rectangle","color":"blue","colorMode":"pastel","styleMode":"shadow","typeface":"rough"},"children":{"label":"Upload report\nartifact","icon":{"name":"upload"}}},"width":138,"height":72,"angle":0,"groupIds":[],"lockedGroupId":null,"seed":1121982000,"version":7,"isDeleted":false,"modifiedAt":1776626377236,"zIndex":14},{"id":"ded0e3a346d50a0b281a50ffbdc6dfd1","type":"rectangle","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"Cleanup cluster","strokeColor":"#242424","backgroundColor":"gray","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":[6,6,6,6],"roughness":0,"opacity":100,"elementStyle":1,"colorMode":0,"x":671,"y":288,"sizingMode":"auto","compound":{"type":"parent","containerType":"flow-node","settings":{"shape":"rectangle","color":"gray","colorMode":"pastel","styleMode":"shadow","typeface":"rough"},"children":{"label":"Cleanup cluster","icon":{"name":"trash-2"}}},"width":138,"height":72,"angle":0,"groupIds":[],"lockedGroupId":null,"seed":856967728,"version":7,"isDeleted":false,"modifiedAt":1776626377236,"zIndex":19},{"id":"2c862c3aa7f1e836aef7a07103e72c11","type":"oval","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"Pipeline complete","strokeColor":"#242424","backgroundColor":"lightgreen","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":"round","roughness":0,"opacity":100,"elementStyle":1,"colorMode":0,"x":868,"y":288,"sizingMode":"auto","compound":{"type":"parent","containerType":"flow-node","settings":{"shape":"oval","color":"lightgreen","colorMode":"pastel","styleMode":"shadow","typeface":"rough"},"children":{"label":"Pipeline complete","icon":{"name":"flag"}}},"width":144.48845764160157,"height":72,"angle":0,"groupIds":[],"lockedGroupId":null,"seed":583761456,"version":7,"isDeleted":false,"modifiedAt":1776626377236,"zIndex":22},{"id":"afda4c354c1226869d17bbbc0b44fb20","type":"arrow","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"rel-Push to main-Build Docker image-forward","strokeColor":"#000000","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":"elbow","roughness":0,"opacity":100,"arrowHeadSize":12,"shouldApplyRoughness":true,"startArrowhead":null,"endArrowhead":"arrow","cardinalElbowData":{"isEnabled":true},"points":[[0,0],[55,0]],"x":177,"y":66,"diagramCodeElement":{"from":"Push to main","to":"Build Docker image","relationshipType":"FORWARD"},"lastCommittedPoint":null,"startBinding":{"elementId":"aca62fd352d902b0a691bac67ea8d8e1","bindingType":"portOrCenter","portLocationOptions":{"portLocation":"fixed.CustomPort","relativeOffset":[1.0289855072463767,0],"direction":"right"}},"endBinding":{"elementId":"7bfbeab766cebff5ee7eab1f55524a12","bindingType":"portOrCenter","portLocationOptions":{"portLocation":"fixed.CustomPort","relativeOffset":[-1.0289855072463767,0],"direction":"left"}},"width":55,"height":0,"angle":0,"groupIds":[],"lockedGroupId":null,"seed":1296413232,"version":6,"isDeleted":false,"modifiedAt":1776626377236,"zIndex":6},{"id":"f2508e8ee7cf7ba18d4b8c8bc0f9a643","type":"arrow","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"rel-Build Docker image-Setup Kind cluster-forward-Load image; create secret","strokeColor":"#000000","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":"elbow","roughness":0,"opacity":100,"arrowHeadSize":12,"shouldApplyRoughness":true,"startArrowhead":null,"endArrowhead":"arrow","cardinalElbowData":{"isEnabled":true},"points":[[0,0],[138,0]],"x":372,"y":66,"diagramCodeElement":{"from":"Build Docker image","to":"Setup Kind cluster","relationshipType":"FORWARD","label":"Load image; create secret"},"lastCommittedPoint":null,"startBinding":{"elementId":"7bfbeab766cebff5ee7eab1f55524a12","bindingType":"portOrCenter","portLocationOptions":{"portLocation":"fixed.CustomPort","relativeOffset":[1,0],"direction":"right"}},"endBinding":{"elementId":"b9d5c4f15ba99c466bfd26a1fe644aab","bindingType":"portOrCenter","portLocationOptions":{"portLocation":"fixed.CustomPort","relativeOffset":[-1,0],"direction":"left"}},"width":138,"height":0,"angle":0,"groupIds":["2aadc5fed4617c69f66182c68dc70630"],"lockedGroupId":"2aadc5fed4617c69f66182c68dc70630","seed":1489619152,"version":6,"isDeleted":false,"textGap":[36.00233459472656,-19.5,85.78125,37],"modifiedAt":1776626377236,"zIndex":8},{"strokeColor":"#000000","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":"sharp","roughness":0,"opacity":100,"scale":1,"fontSize":14,"fontFamily":2,"textAlign":"center","verticalAlign":"middle","id":"7a19fd7fd70c6e91915be911b9e111e2","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"rel-Build Docker image-Setup Kind cluster-forward-Load image; create secret","x":409.00233459472656,"y":47.5,"text":"Load image; create secret","type":"textbox","width":83.78125,"height":35,"angle":0,"groupIds":["2aadc5fed4617c69f66182c68dc70630"],"lockedGroupId":"2aadc5fed4617c69f66182c68dc70630","seed":1211100208,"version":7,"isDeleted":false,"mode":"normal","hasFixedBounds":true,"modifiedAt":1776626377236,"zIndex":9},{"id":"71e19ac507f26fcd7483d2e0f6339117","type":"arrow","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"rel-Setup Kind cluster-Run Kubernetes job-forward-kubectl apply","strokeColor":"#000000","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":"elbow","roughness":0,"opacity":100,"arrowHeadSize":12,"shouldApplyRoughness":true,"startArrowhead":null,"endArrowhead":"arrow","cardinalElbowData":{"isEnabled":true},"points":[[0,0],[139,0]],"x":648,"y":66,"diagramCodeElement":{"from":"Setup Kind cluster","to":"Run Kubernetes job","relationshipType":"FORWARD","label":"kubectl apply"},"lastCommittedPoint":null,"startBinding":{"elementId":"b9d5c4f15ba99c466bfd26a1fe644aab","bindingType":"portOrCenter","portLocationOptions":{"portLocation":"fixed.CustomPort","relativeOffset":[1,0],"direction":"right"}},"endBinding":{"elementId":"02707089c356938a22ecef52d138f6a1","bindingType":"portOrCenter","portLocationOptions":{"portLocation":"fixed.CustomPort","relativeOffset":[-1,0],"direction":"left"}},"width":139,"height":0,"angle":0,"groupIds":["7ae639825964fc7a120c221daf8d1649"],"lockedGroupId":"7ae639825964fc7a120c221daf8d1649","seed":70790864,"version":5,"isDeleted":false,"textGap":[41.28253936767578,-10.75,76.3046875,19.5],"modifiedAt":1776626377236,"zIndex":11},{"strokeColor":"#000000","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":"sharp","roughness":0,"opacity":100,"scale":1,"fontSize":14,"fontFamily":2,"textAlign":"center","verticalAlign":"middle","id":"ce10f820a362b364dcf38138e6973bc4","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"rel-Setup Kind cluster-Run Kubernetes job-forward-kubectl apply","x":690.2825393676758,"y":56.25,"text":"kubectl apply","type":"textbox","width":74.3046875,"height":17.5,"angle":0,"groupIds":["7ae639825964fc7a120c221daf8d1649"],"lockedGroupId":"7ae639825964fc7a120c221daf8d1649","seed":499312176,"version":6,"isDeleted":false,"mode":"normal","hasFixedBounds":true,"modifiedAt":1776626377236,"zIndex":12},{"id":"9cd9f116fa2e7bd3d404f472f20db6c8","type":"arrow","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"rel-Run Kubernetes job-Results-forward","strokeColor":"#000000","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":"elbow","roughness":0,"opacity":100,"arrowHeadSize":12,"shouldApplyRoughness":true,"startArrowhead":null,"endArrowhead":"arrow","cardinalElbowData":{"isEnabled":true},"points":[[0,0],[30,0],[30,70],[-910,70],[-910,206],[-888,206]],"x":925,"y":66,"diagramCodeElement":{"from":"Run Kubernetes job","to":"Results","relationshipType":"FORWARD"},"lastCommittedPoint":null,"startBinding":{"elementId":"02707089c356938a22ecef52d138f6a1","bindingType":"portOrCenter","portLocationOptions":{"portLocation":"fixed.CustomPort","relativeOffset":[1,0],"direction":"right"}},"endBinding":{"elementId":"2dc1e338c23f650a2d650e69c2c29ad1","bindingType":"portOrCenter","portLocationOptions":{"portLocation":"fixed.CustomPort","relativeOffset":[-1,-0.22077922077922077],"direction":"left"}},"width":940,"height":206,"angle":0,"groupIds":[],"lockedGroupId":null,"seed":1089066192,"version":2,"isDeleted":false,"modifiedAt":1776626377236,"zIndex":13},{"id":"d48b6a9a1c440537e066077519d4ba14","type":"arrow","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"rel-Tests pass-Upload report artifact-forward-exit 0","strokeColor":"#000000","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":"elbow","roughness":0,"opacity":100,"arrowHeadSize":12,"shouldApplyRoughness":true,"startArrowhead":null,"endArrowhead":"arrow","cardinalElbowData":{"isEnabled":true},"points":[[0,0],[198.9461883004934,0],[198.9461883004934,53],[223.9461883004934,53]],"x":203.0538116995066,"y":259,"diagramCodeElement":{"from":"Tests pass","to":"Upload report artifact","relationshipType":"FORWARD","label":"exit 0"},"lastCommittedPoint":null,"startBinding":{"elementId":"34a68e05499cd99752b1334ae19e75cd","bindingType":"portOrCenter","portLocationOptions":{"portLocation":"fixed.CustomPort","relativeOffset":[0.9428088652102408,0],"direction":"right"}},"endBinding":{"elementId":"e8bd4a40f06f11b8437afcd7a56061a8","bindingType":"portOrCenter","portLocationOptions":{"portLocation":"fixed.CustomPort","relativeOffset":[-1.0289855072463767,-0.3333333333333333],"direction":"left"}},"width":223.9461883004934,"height":53,"angle":0,"groupIds":["5319b3cd289fa97a3a88360d015de3b4"],"lockedGroupId":"5319b3cd289fa97a3a88360d015de3b4","seed":2061934640,"version":4,"isDeleted":false,"textGap":[123.21355280244651,-10.25,32.046875,19.5],"modifiedAt":1776626377236,"zIndex":15},{"strokeColor":"#000000","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":"sharp","roughness":0,"opacity":100,"scale":1,"fontSize":14,"fontFamily":2,"textAlign":"center","verticalAlign":"middle","id":"ffa8b43c6bfa149874fb3cbacb49b828","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"rel-Tests pass-Upload report artifact-forward-exit 0","x":327.2673645019531,"y":249.75,"text":"exit 0","type":"textbox","width":30.046875,"height":17.5,"angle":0,"groupIds":["5319b3cd289fa97a3a88360d015de3b4"],"lockedGroupId":"5319b3cd289fa97a3a88360d015de3b4","seed":74889936,"version":5,"isDeleted":false,"mode":"normal","hasFixedBounds":true,"modifiedAt":1776626377236,"zIndex":16},{"id":"02b17ac769a681b30cdb6eee597313ac","type":"arrow","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"rel-Tests fail-Upload report artifact-forward-exit 1; debug logs","strokeColor":"#000000","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":"elbow","roughness":0,"opacity":100,"arrowHeadSize":12,"shouldApplyRoughness":true,"startArrowhead":null,"endArrowhead":"arrow","cardinalElbowData":{"isEnabled":true},"points":[[0,0],[198.9461883004934,0],[198.9461883004934,-52],[223.9461883004934,-52]],"x":203.0538116995066,"y":388,"diagramCodeElement":{"from":"Tests fail","to":"Upload report artifact","relationshipType":"FORWARD","label":"exit 1; debug logs"},"lastCommittedPoint":null,"startBinding":{"elementId":"0812640d077c9e4c4f7d910f679df7e9","bindingType":"portOrCenter","portLocationOptions":{"portLocation":"fixed.CustomPort","relativeOffset":[0.9428088652102408,0],"direction":"right"}},"endBinding":{"elementId":"e8bd4a40f06f11b8437afcd7a56061a8","bindingType":"portOrCenter","portLocationOptions":{"portLocation":"fixed.CustomPort","relativeOffset":[-1.0289855072463767,0.3333333333333333],"direction":"left"}},"width":223.9461883004934,"height":52,"angle":0,"groupIds":["38d314cae3199993ae02027da61825b6"],"lockedGroupId":"38d314cae3199993ae02027da61825b6","seed":797121072,"version":4,"isDeleted":false,"textGap":[88.52995905244651,-10.25,101.4140625,19.5],"modifiedAt":1776626377236,"zIndex":17},{"strokeColor":"#000000","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":"sharp","roughness":0,"opacity":100,"scale":1,"fontSize":14,"fontFamily":2,"textAlign":"center","verticalAlign":"middle","id":"a605ac3e3e720f5196c17d75d1601533","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"rel-Tests fail-Upload report artifact-forward-exit 1; debug logs","x":292.5837707519531,"y":378.75,"text":"exit 1; debug logs","type":"textbox","width":99.4140625,"height":17.5,"angle":0,"groupIds":["38d314cae3199993ae02027da61825b6"],"lockedGroupId":"38d314cae3199993ae02027da61825b6","seed":1366745296,"version":5,"isDeleted":false,"mode":"normal","hasFixedBounds":true,"modifiedAt":1776626377236,"zIndex":18},{"id":"67bc16651fd915c87f29cf5651a00dfd","type":"arrow","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"rel-Upload report artifact-Cleanup cluster-forward-always","strokeColor":"#000000","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":"elbow","roughness":0,"opacity":100,"arrowHeadSize":12,"shouldApplyRoughness":true,"startArrowhead":null,"endArrowhead":"arrow","cardinalElbowData":{"isEnabled":true},"points":[[0,0],[103,0]],"x":567,"y":324,"diagramCodeElement":{"from":"Upload report artifact","to":"Cleanup cluster","relationshipType":"FORWARD","label":"always"},"lastCommittedPoint":null,"startBinding":{"elementId":"e8bd4a40f06f11b8437afcd7a56061a8","bindingType":"portOrCenter","portLocationOptions":{"portLocation":"fixed.CustomPort","relativeOffset":[1,0],"direction":"right"}},"endBinding":{"elementId":"ded0e3a346d50a0b281a50ffbdc6dfd1","bindingType":"portOrCenter","portLocationOptions":{"portLocation":"fixed.CustomPort","relativeOffset":[-1.0144927536231885,0],"direction":"left"}},"width":103,"height":0,"angle":0,"groupIds":["39053137f1e0ba5ae22099609fa2d856"],"lockedGroupId":"39053137f1e0ba5ae22099609fa2d856","seed":1317033008,"version":4,"isDeleted":false,"textGap":[41.995269775390625,-10.75,40.2109375,19.5],"modifiedAt":1776626377236,"zIndex":20},{"strokeColor":"#000000","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":"sharp","roughness":0,"opacity":100,"scale":1,"fontSize":14,"fontFamily":2,"textAlign":"center","verticalAlign":"middle","id":"e9dc0bc0dd438a955e649d468b34c4b2","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"rel-Upload report artifact-Cleanup cluster-forward-always","x":609.9952697753906,"y":314.25,"text":"always","type":"textbox","width":38.2109375,"height":17.5,"angle":0,"groupIds":["39053137f1e0ba5ae22099609fa2d856"],"lockedGroupId":"39053137f1e0ba5ae22099609fa2d856","seed":394413776,"version":5,"isDeleted":false,"mode":"normal","hasFixedBounds":true,"modifiedAt":1776626377236,"zIndex":21},{"id":"2bef111e342a2fd22f4342a81373e3c5","type":"arrow","diagramId":"pDfmry0V6UcJaqgDHfUS","diagramEntityId":"rel-Cleanup cluster-Pipeline complete-forward","strokeColor":"#000000","backgroundColor":"transparent","fillStyle":"solid","strokeWidth":0.75,"strokeStyle":"solid","strokeSharpness":"elbow","roughness":0,"opacity":100,"arrowHeadSize":12,"shouldApplyRoughness":true,"startArrowhead":null,"endArrowhead":"arrow","cardinalElbowData":{"isEnabled":true},"points":[[0,0],[57,0]],"x":809,"y":324,"diagramCodeElement":{"from":"Cleanup cluster","to":"Pipeline complete","relationshipType":"FORWARD"},"lastCommittedPoint":null,"startBinding":{"elementId":"ded0e3a346d50a0b281a50ffbdc6dfd1","bindingType":"portOrCenter","portLocationOptions":{"portLocation":"fixed.CustomPort","relativeOffset":[1,0],"direction":"right"}},"endBinding":{"elementId":"2c862c3aa7f1e836aef7a07103e72c11","bindingType":"portOrCenter","portLocationOptions":{"portLocation":"fixed.CustomPort","relativeOffset":[-1.0276838722295856,0],"direction":"left"}},"width":57,"height":0,"angle":0,"groupIds":[],"lockedGroupId":null,"seed":1304841776,"version":4,"isDeleted":false,"modifiedAt":1776626377236,"zIndex":23}],"diagramMetadata":{"settings":{"colorMode":"pastel","styleMode":"shadow","typeface":"rough","direction":"right"},"diagramType":"flowchart-diagram","diagramId":"pDfmry0V6UcJaqgDHfUS","connections":[{"from":"Push to main","to":"Build Docker image","connectionType":">"},{"from":"Build Docker image","to":"Setup Kind cluster","connectionType":">","label":"Load image; create secret"},{"from":"Setup Kind cluster","to":"Run Kubernetes job","connectionType":">","label":"kubectl apply"},{"from":"Run Kubernetes job","to":"Results","connectionType":">"},{"from":"Tests pass","to":"Upload report artifact","connectionType":">","label":"exit 0"},{"from":"Tests fail","to":"Upload report artifact","connectionType":">","label":"exit 1; debug logs"},{"from":"Upload report artifact","to":"Cleanup cluster","connectionType":">","label":"always"},{"from":"Cleanup cluster","to":"Pipeline complete","connectionType":">"}],"entitySettings":{"Results":{"colorMode":"pastel","styleMode":"shadow","typeface":"rough","color":"gray"},"Tests pass":{"colorMode":"pastel","styleMode":"shadow","typeface":"rough","color":"green","icon":"check-circle","shape":"diamond"},"Tests fail":{"colorMode":"pastel","styleMode":"shadow","typeface":"rough","color":"red","icon":"x-circle","shape":"diamond"},"Push to main":{"colorMode":"pastel","styleMode":"shadow","typeface":"rough","color":"lightblue","icon":"git-commit","shape":"oval"},"Build Docker image":{"colorMode":"pastel","styleMode":"shadow","typeface":"rough","color":"blue","icon":"box"},"Setup Kind cluster":{"colorMode":"pastel","styleMode":"shadow","typeface":"rough","color":"purple","icon":"server"},"Run Kubernetes job":{"colorMode":"pastel","styleMode":"shadow","typeface":"rough","color":"orange","icon":"play"},"Upload report artifact":{"colorMode":"pastel","styleMode":"shadow","typeface":"rough","color":"blue","icon":"upload"},"Cleanup cluster":{"colorMode":"pastel","styleMode":"shadow","typeface":"rough","color":"gray","icon":"trash-2"},"Pipeline complete":{"colorMode":"pastel","styleMode":"shadow","typeface":"rough","color":"lightgreen","icon":"flag","shape":"oval"},"rel-Build Docker image-Setup Kind cluster-forward-Load image; create secret":{"colorMode":"pastel","styleMode":"shadow","typeface":"rough"},"rel-Setup Kind cluster-Run Kubernetes job-forward-kubectl apply":{"colorMode":"pastel","styleMode":"shadow","typeface":"rough"},"rel-Tests pass-Upload report artifact-forward-exit 0":{"colorMode":"pastel","styleMode":"shadow","typeface":"rough"},"rel-Tests fail-Upload report artifact-forward-exit 1; debug logs":{"colorMode":"pastel","styleMode":"shadow","typeface":"rough"},"rel-Upload report artifact-Cleanup cluster-forward-always":{"colorMode":"pastel","styleMode":"shadow","typeface":"rough"}}}}

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
