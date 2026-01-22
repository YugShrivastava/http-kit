# http-kit
## Project Scope

---

## Overview

**http-kit** is a lightweight developer utility toolkit intended to provide quick, usable HTTP and API primitives during development.

It consolidates two commonly needed backend utilities into a single codebase:

1. **Personal API Dashboard** – for exposing small, secure, user-owned data endpoints  
2. **Request Inspection Utility** – for capturing and inspecting incoming HTTP requests

The goal of the project is to offer pragmatic backend tooling that can be used while a full backend is under development, or for lightweight and temporary use cases where setting up dedicated infrastructure is unnecessary.

---

## Technical Focus

- Next.js App Router
- Server Components
- Server Actions
- Route Handlers
- Clerk Authentication
- shadcn/ui

---

## Intended Use Cases

- Exposing small JSON or text-based APIs during development
- Temporary configuration or data endpoints
- Debugging webhooks and third-party callbacks
- Inspecting raw HTTP requests without custom logging setup

---

## Module 1: Personal API Dashboard

### Purpose

The Personal API Dashboard allows authenticated users to define small data resources and expose them as secure HTTP endpoints.

Each resource behaves as a minimal backend primitive, suitable for lightweight data access without requiring a custom backend implementation.

---

### Problem Statement

Developers often need:
- Small JSON or text APIs
- Lightweight configuration endpoints
- Temporary data hosting during development

Implementing a full backend for these use cases often introduces unnecessary overhead.

---

### Functional Scope

#### Authentication & Ownership
- Authentication is handled via Clerk
- Each API resource is associated with exactly one user
- Ownership is enforced at both the UI and API levels

#### Resource Creation
Users can create a resource by providing:
- A resource name (e.g., “Landing Config”)
- Content (JSON or plain text)
- An auto-generated access token

Resource creation is implemented using Server Actions.

#### Dashboard Interface
The dashboard lists all user-owned resources and displays:
- Resource name
- API endpoint URL
- Masked API token
- Copy actions for endpoint URL and token
- Resource deletion controls

#### API Exposure
Each resource exposes a read-only HTTP endpoint:

```
GET /api/data/[id]?token=SECRET_TOKEN
```

Example response:
```json
{
  "name": "Landing Config",
  "data": {
    "theme": "dark",
    "cta": true
  }
}
```

---

### Data Model

**Resource**
- id
- userId
- name
- content
- token
- createdAt

---

### Routing Structure

```
app/
├─ (auth)/
├─ (dashboard)/
│  └─ dashboard/
└─ api/
   └─ data/
      └─ [id]/
```

---

### Key Technical Concepts

- Server Components
- Server Actions
- Route Handlers
- Dynamic routing
- Authentication boundaries
- Token-based API access

---

## Module 2: Request Inspection Utility

### Purpose

The Request Inspection Utility provides dynamically generated endpoints that capture and persist incoming HTTP requests.

It is intended for inspecting webhooks, callbacks, and third-party integrations during development and testing.

---

### Functional Scope

#### Authentication & Ownership
- Authentication via Clerk
- Each request bin is associated with a single user

#### Request Bin Creation
- Users can create a request bin
- Each bin generates a public endpoint:

```
/api/bin/[id]
```

#### Request Capture
Any HTTP request sent to the endpoint is logged with:
- HTTP method
- Headers
- Request body
- Query parameters
- Timestamp

All major HTTP methods are supported.

#### Log Inspection
The dashboard displays captured requests with:
- HTTP method
- Timestamp
- Payload size
- Expandable full request details

---

### Data Models

**Bin**
- id
- userId
- createdAt

**RequestLog**
- id
- binId
- method
- headers
- body
- createdAt

---

### Routing Structure

```
app/
├─ (dashboard)/
│  └─ bins/
│     └─ [id]/
└─ api/
   └─ bin/
      └─ [id]/
```

---

### Key Technical Concepts

- Route Handlers for request capture
- HTTP request parsing
- Dynamic routing
- Server Components for rendering request logs
- Separation between API logic and UI

---

## Combined Scope Summary

By combining both utilities, **http-kit** serves as a compact collection of backend-oriented tools that demonstrate:

- Practical backend problem-solving
- Secure API and request handling
- Advanced usage of the Next.js App Router
- Clear separation of concerns between utilities

The project is scoped as an open-source utility rather than a standalone service, focusing on reusability, clarity, and pragmatic backend workflows.

---

## Future Extensions

- Write support (POST / PUT) for API resources
- Expiring or time-bound API tokens
- Request replay for captured HTTP calls
- Rate limiting and payload size constraints
- Exporting request logs (JSON / CSV)
- Shared or team-based access