# Motia Intent-Based Backend Example

This example demonstrates how to build a backend using a declarative **Intent Definition**.

> **Time to Value**: Go from "Idea" to "Working API" in under 5 minutes.

## ⚠️ Important Note

**This does not replace learning Motia; it accelerates it.**

The Intent Generator produces **standard Motia Steps**. It is a learning bridge that generates best-practice code you can inspect, learn from, and customize.

## Before vs After

### Without Intent (The "Hard" Way)
1.  Create `user.create.step.ts` manually (30 lines).
2.  Create `user.list.step.ts` manually (20 lines).
3.  Create `user.get.step.ts` manually (25 lines).
4.  Write MongoDB connection logic manually.
5.  Debug imports and types.

### With Intent (The "Easy" Way)
1.  Write `intent.yaml` (15 lines):

    ```yaml
    entity: User
    database: { type: mongodb, collection: users }
    fields: { name: { type: string }, email: { type: string } }
    operations: { create: true, get_all: true }
    ```

2.  Run **one command**:
    ```bash
    intent-gen generate intent.yaml
    ```

3.  Result: **3 fully working Step files** are generated for you.

## How to use

1.  Edit `intent.yaml`.
2.  Run the generator:
    ```bash
    # From project root
    npx ts-node tools/intent-compiler/index.ts generate examples/intent-backend/intent.yaml
    ```
3.  See the result in `generated/`.
4.  Start Motia:
    ```bash
    npm run dev
    ```

## Extending

The generated files are yours. You can:
- Add a new field validation.
- Emit a custom event.
- Call an external API.

The generator respects your changes (unless you use `--force`).
