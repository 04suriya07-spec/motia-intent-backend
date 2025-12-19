# 🚀 Motia Intent Backend

**The Unified Backend Framework - "Backend Reloaded" Hackathon Submission**

Motia is a unified backend framework that eliminates runtime fragmentation. This project introduces the **Intent-to-Backend Layer**, allowing you to define production-grade APIs and background jobs using a single declarative primitive (`intent.yaml`).

---

## 🏆 Hackathon Submission Details
- **Project Name**: Motia Intent Backend
- **Summary**: A declarative abstraction layer for Motia that compiles high-level intents into functional, observable, and production-ready Motia Steps.
- **Hackathon**: [Backend Reloaded Hackathon](https://backend-reloaded.devpost.com/)
- **Date**: December 2025
- **Team Members**: 
  - Suriya R V (@04suriya07-spec)
- **Commit Range**: [View Commits](https://github.com/04suriya07-spec/motia-intent-backend/commits/main)

---

## ✨ Features Built during the Hackathon

1.  **Intent Schema**: A strictly typed YAML/JSON format to define entities, database collections, fields, and operations (APIs + Jobs).
2.  **Intent Generator (CLI)**: A robust TypeScript tool that validates intents using Zod and compiles them into Motia `.step.ts` files.
3.  **Unified Background Jobs**: Support for time-based automation (Cron) defined directly in the intent file.
4.  **Production-Grade Infrastructure**:
    - **Docker Lite-Mode**: Optimized container build that runs the entire monorepo in a memory-efficient way.
    - **Render Blueprint**: One-click deployment configuration (`render.yaml`).
    - **MongoDB Integration**: Shared, lazily-connected DB client for all generated steps.
5.  **Observability & State**: Every generated step automatically inherits Motia's built-in tracing, logging, and state management.

---

## 🏗️ How it works: Steps & Workflows

Motia uses **Steps** as its core primitive. Our Intent Layer maps declarative definitions to these Steps:

| Intent Operation | Generated File | Motia Primitive |
| :--- | :--- | :--- |
| `create: true` | `[entity].create.step.ts` | `type: 'api' (POST)` |
| `get_all: true` | `[entity].list.step.ts` | `type: 'api' (GET)` |
| `get_by: ['email']` | `[entity].getByEmail.step.ts` | `type: 'api' (GET)` |
| `jobs: - name: Cleanup` | `[entity].job.cleanup.step.ts` | `type: 'cron'` |

All generated code is **standard TypeScript** and can be manually extended or customized at any time.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 10+
- MongoDB (Local or Remote)

### Local Setup
1.  **Install dependencies**:
    ```bash
    pnpm install
    ```
2.  **Build the Intent Compiler**:
    ```bash
    cd tools/intent-compiler && pnpm build && cd ../..
    ```
3.  **Generate your Backend**:
    ```bash
    node tools/intent-compiler/dist/index.js generate examples/intent-backend/intent.yaml
    ```
4.  **Run the Server**:
    ```bash
    pnpm run dev
    ```

### Environment Variables
| Variable | Description | Default |
| :--- | :--- | :--- |
| `MONGO_URI` | MongoDB Connection String | `mongodb://localhost:27017/motia_local` |
| `PORT` | API Port | `3000` |

---

## 🛠️ Reproducible Build & Testing

We ensure "Backend Reloaded" quality with automated checks:

```bash
# Typecheck the playground
pnpm --filter playground run test:tsc-check

# Run unit tests
pnpm --filter playground test
```

---

## 🗺️ Project Structure

- `tools/intent-compiler/`: The core logic for parsing and generating backends.
- `examples/intent-backend/`: A sample project demonstrating "Intent-to-Value in under 5 minutes".
- `packages/core/`: The underlying Motia framework.
- `playground/`: The runtime environment where the generated backend is hosted.

---

## 📜 Third-Party Assets & Licenses
- **Motia Core**: Licensed under ELv2.
- **Dependencies**: `js-yaml`, `zod`, `mongodb`.
- **Assets**: All banners and icons generated/provided by the Motia project.

---
*Built with ❤️ for the Backend Reloaded Hackathon.*