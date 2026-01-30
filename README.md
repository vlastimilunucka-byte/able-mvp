## Able Ops MVP

MVP combining task management and reliability operations (Trello + Betterstack style). Built for the Able to compete challenge to demonstrate an AI-first, human-quality delivery in hours.

### Features
- Task board with workflow moves (Backlog → Todo → Doing → Done)
- Incident response flow with severity and status tracking
- Alert simulation + audit logging
- Operational log stream
- Analytics snapshot dashboard
- Release notes center
- AI/MCP integration placeholder panel

### Stack
- Next.js App Router + Tailwind
- Prisma + SQLite (driver adapter)
- Zod validation

## Quickstart
```bash
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```
Open `http://localhost:3000`.

## Demo script (2–3 minutes)
1. Go to **Board** and create a task, advance it to Done.
2. Open **Incidents**, create a new incident, advance status to Resolved.
3. Visit **Alerts** and click “Simulate alert”.
4. Check **Audit** for logged actions.
5. Open **Analytics** for live metrics.
6. Publish a release in **Releases**.

## API surface
- `GET/POST /api/tasks`
- `PATCH/DELETE /api/tasks/:id`
- `GET/POST /api/incidents`
- `PATCH/DELETE /api/incidents/:id`
- `GET/POST /api/alerts`
- `POST /api/alerts/simulate`
- `GET/POST /api/logs`
- `GET /api/audit`
- `GET /api/analytics`
- `GET/POST /api/release-notes`

## Testing
```bash
npm run test:smoke
```
Smoke test validates alert simulation and audit log insertion.

## Release process
- Record release notes in **Releases**
- Update `CHANGELOG.md` (optional for future expansion)
- Tag and deploy (Vercel or self-hosted)

## Disaster recovery (MVP)
- Back up the SQLite file `dev.db`
- Restore by replacing `dev.db` and reloading the app

## Monitoring & incident response
- Alerts: `/alerts`
- Logs: `/logs`
- Audit trail: `/audit`
- Analytics snapshot: `/analytics`
