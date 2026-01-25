# http-kit

A lightweight toolkit of HTTP and API utilities for rapid backend prototyping.

---

## Features

- Rapid backend and API prototyping  
- Type-safe request validation with Zod  
- Authentication powered by Better Auth  
- Database access via Prisma ORM  
- SQLite database for fast local development  
- Modern UI with Tailwind CSS and shadcn/ui  
- Fully typed Next.js 16.x application  
- Unit and integration testing with Vitest  

---

## Tech Stack

- **Framework**: Next.js 16.1.4
- **Language**: TypeScript  
- **Authentication**: Better Auth  
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
DATABASE_URL="file:./dev.db"                                        # url to sqlite db

# better-auth
BETTER_AUTH_SECRET=entropy_in_software_is_inevitable___~sun_tzu     # auth secret
BETTER_AUTH_URL=http://localhost:3000                               # base url of the app

# public
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Generate Prisma client

```bash
npx prisma generate
```

### Run database migrations

```bash
npx prisma migrate dev
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