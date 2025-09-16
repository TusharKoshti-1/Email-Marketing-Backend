# Email Marketing Backend (Complete)

Includes:
- NestJS backend with Users, Auth (JWT), Campaigns
- BullMQ queue producer (queue.service) and a worker script (src/worker/email.worker.ts)
- Docker Compose (Postgres + Redis + backend service)

## Run locally
1. Extract the zip to a folder.
2. Copy `backend/.env.example` to `backend/.env` and edit if needed.
3. Start Postgres and Redis:

```bash
docker-compose up -d
```

4. Install dependencies and run server:

```bash
cd backend
npm install
npm run start:dev
```

5. Start the worker (in a separate terminal):

```bash
cd backend
npm run worker
```

## Test endpoints
- Register: POST http://localhost:8000/api/auth/register { "email":"a@b.com", "password":"secret" }
- Login: POST http://localhost:8000/api/auth/login { "email":"a@b.com", "password":"secret" }
  - Response: { access_token: "..." }
- Create campaign (auth required): POST http://localhost:8000/api/campaigns
  - Header: Authorization: Bearer <token>
  - Body: { "subject":"Hello", "content":"<h1>Hi</h1>" }

- Add email job (example): Use queue service by calling an endpoint later; worker will process jobs from 'email' queue.

