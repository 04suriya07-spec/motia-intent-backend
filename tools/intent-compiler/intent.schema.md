# Motia Intent Schema (v1 MVP)

This document defines the schema for `intent.yaml` files used by the Motia Intent Generator.

> **Design Goal**: A strictly typed, declarative format for non-coders to define backend entities.

## Root Structure

```yaml
entity: string      # Name of the entity (e.g., "User")
database:
  type: "mongodb"   # ONLY "mongodb" is supported in v1
  collection: string # MongoDB collection name (e.g., "users")

fields:             # Map of field names to definitions
  [fieldName]: FieldDefinition

  get_by: string[]  # List of fields to allow lookup by

jobs:               # Optional background jobs
  - name: string
    schedule: string # Cron expression (e.g. "0 * * * *")
    description: string
```

## Field Definition

Fields are flat key-value pairs. Nested objects are NOT supported in v1.

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `type` | `string` | **Yes** | One of: `string`, `number`, `boolean`. |
| `required` | `boolean` | No | Defaults to `false`. |
| `unique` | `boolean` | No | If `true`, enforces uniqueness (validation + index). |

**Example Field:**
```yaml
email:
  type: string
  required: true
  unique: true
```

## Supported Operations

| Operation | HTTP Method | Route | Description |
| :--- | :--- | :--- | :--- |
| `create: true` | `POST` | `/[collection]` | Creates a new document. |
| `get_all: true` | `GET` | `/[collection]` | Returns all documents (limit 100). |
| `get_by: ['email']` | `GET` | `/[collection]/by-email` | Finds specific document by query param. |

## Example `intent.yaml`

```yaml
entity: User
database:
  type: mongodb
  collection: users

fields:
  name:
    type: string
    required: true
  email:
    type: string
    unique: true
  active:
    type: boolean

  get_by:
    - email

jobs:
  - name: PeriodicCleanup
    schedule: "0 * * * *" # Every hour
    description: "Cleans up old user records"
```

## Constraints (Non-Goals)

1.  **No Relations**: You cannot define `author_id` pointing to another entity.
2.  **No Auth**: All generated endpoints are public.
3.  **No Nested Objects**: Fields must be primitives.
