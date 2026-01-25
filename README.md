# http-kit

A lightweight toolkit of HTTP and API utilities for rapid backend prototyping.

---

## Features

- Rapid backend and API prototyping  
- Type-safe request validation with Zod  
- Authentication powered by Clerk  
- Database access via Prisma ORM  
- SQLite database for fast local development  
- Modern UI with Tailwind CSS and shadcn/ui  
- Fully typed Next.js 16.x application  
- Unit and integration testing with Vitest  

---

## Tech Stack

- **Framework**: Next.js 16.1.4
- **Language**: TypeScript  
- **Authentication**: Clerk
- **ORM**: Prisma  
- **Database**: SQLite  
- **UI Components**: shadcn/ui  
- **Testing**: Vitest  
- **Validation**: Zod

---

## Setup

### Install dependencies
```bash
npm install
````

### Environment variables

Create a `.env` file in the project root:

```env
# database
DATABASE_URL="file:./dev.db"                                                    # url to sqlite db

# clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=                                              # clerk publishable key
CLERK_SECRET_KEY=entropy_in_software_is_inevitable                              # clerk secret

# public
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run database migrations

```bash
npx prisma migrate dev --name init
```

### Generate Prisma client

```bash
npx prisma generate
```

### Run tests

```bash
npm run test
```

---

## Development

Start the development server:

```bash
npm run dev
```

---

## Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

---

## Prisma Utilities

Open Prisma Studio:

```bash
npx prisma studio
```