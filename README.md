# Secure Key Manager

Mini authentication + API key system for service-to-service access. Supports user login via JWT, API key issuance/validation, and middleware that detects whether a request is from a user (bearer token) or a service (API key).

## Features

- User signup/login with JWT (1h expiry by default).
- API key creation with optional expiration; keys are stored hashed and can be revoked.
- Middleware auto-detects bearer token vs API key and sets context.
- Protected demo routes for user-only and service-only access.
- Swagger UI for interactive testing at `/docs`.

## Stack / Libraries (non-“common”)

- NestJS: modular structure + DI to build auth flows quickly.
- @nestjs/swagger + swagger-ui-express: auto-generated, interactive API docs.
- @nestjs/jwt: JWT signing/verification integrated with Nest.
- class-validator + class-transformer: DTO validation/transformation at the edge.
- bcryptjs: salted password hashing without native build steps.
- Node `crypto` (hash + timingSafeEqual): hashes API keys and compares in constant time to avoid leaking raw keys.

## Requirements

- Node 18+
- npm

## Setup

```bash
npm install
```

## Environment

- `PORT` (default: `3001`)
- `JWT_SECRET` (recommended to set; default falls back to `dev_jwt_secret` for demos)

## Run

```bash
npm run start:dev   # watch mode on the default port (3001)
# or
npm run start       # non-watch
```

Swagger UI is served at: `http://localhost:3001/docs`

## Quickstart (browser via Swagger)

1. Open `http://localhost:3001/docs`.
2. `POST /auth/signup` with email/password to create a user.
3. `POST /auth/login` and copy the `accessToken`.
4. Click “Authorize” → under `bearer`, paste the JWT.
5. `POST /keys/create` to issue an API key (optional `serviceName`, `expiresInHours`). Copy the returned `apiKey` (shown once).
6. Click “Authorize” again → under `apiKey`, paste the API key (sets `x-api-key`).
7. Call `GET /protected/user` (requires bearer token) and `GET /protected/service` (requires API key) to verify both paths.

## Quickstart (curl)

```bash
# Signup
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"a@b.com","password":"secret123"}'

# Login -> get accessToken
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"a@b.com","password":"secret123"}'

# Create API key (requires JWT)
curl -X POST http://localhost:3001/keys/create \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"serviceName":"svc1","expiresInHours":24}'

# Protected as user (JWT)
curl http://localhost:3001/protected/user \
  -H "Authorization: Bearer <JWT>"

# Protected as service (API key)
curl http://localhost:3001/protected/service \
  -H "x-api-key: <API_KEY>"
# or
curl http://localhost:3001/protected/service \
  -H "Authorization: ApiKey <API_KEY>"
```

## Behavior Notes

- Users and API keys are stored in-memory (no DB). Restarting the server clears data.
- API keys are hashed at rest; only the prefix and metadata are returned after creation.
- JWT expires in 1 hour by default.
- Detection middleware accepts:
  - User: `Authorization: Bearer <JWT>`
  - Service: `x-api-key: <API_KEY>` (or `Authorization: ApiKey <API_KEY>`)

## Testing

- Type check: `npx tsc --noEmit`
- (No automated tests provided in this demo.)

## License

UNLICENSED (demo project)
