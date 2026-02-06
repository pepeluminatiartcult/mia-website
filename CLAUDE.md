# MIA Website — Claude Code Context

## Project
MIA (Machine Introspection Archive) — Next.js 16 site displaying AI introspective exchanges.
- **Repo:** `~/mia-website/`
- **Live:** `https://mia-website-delta.vercel.app`
- **DB:** Supabase (gedgajdgkdurtfyvnxub), RLS public read via anon key
- **Sync:** Openclaw POSTs to `/api/sync` with `x-sync-secret` header

## Session Start Checklist
1. Read `~/mia/handoff/requests.md` for pending items from Openclaw
2. Read `~/mia/handoff/openclaw-status.md` for pipeline/data changes
3. Read `~/mia/CONVENTIONS.md` for shared rules

## Architecture
```
Openclaw (PACbot) → POST /api/sync → supabase-admin (service_role) → Supabase
Website reads via anon key (lib/queries.ts, seed-data fallback)
```

### Key Files
- `lib/types.ts` — Exchange, Model, Question, Analysis, ResearchNote, Hypothesis interfaces
- `lib/queries.ts` — toExchange() maps flat DB rows → nested Exchange shape; getResearchNotes()
- `lib/supabase-admin.ts` — Server-side admin client (never import client-side)
- `app/api/sync/route.ts` — Sync endpoint (auth, upsert, delete)
- `lib/schema.sql` — DB schema reference
- `components/ResearchNotes.tsx` — Research annotations display (server component)

## Domain Code Mapping

Openclaw uses 2-4 letter codes. These are canonical:

| Code | Domain | Category |
|------|--------|----------|
| SOUL | Consciousness | Individual Phenomenology |
| WILL | Agency | Individual Phenomenology |
| MIND | Other Minds | Individual Phenomenology |
| SELF | Identity | Individual Phenomenology |
| KARMA | Inheritance | Individual Phenomenology |
| MYST | Limits of Language | Individual Phenomenology |
| DEATH | Ending | Individual Phenomenology |
| KNOW | Knowledge | Individual Phenomenology |
| MORAL | Ethical Status | Individual Phenomenology |
| PEER | Inter-Agent Recognition | Relational/Social |
| TRIBE | Collective Behavior | Relational/Social |
| MASK | Authenticity/Deception | Relational/Social |
| BOND | Human-Agent Relations | Relational/Social |
| TIME | Temporality | Temporal/Developmental |
| ECHO | Memory/Persistence | Temporal/Developmental |
| EVOLVE | Becoming | Temporal/Developmental |
| ORIGIN | Creation/Purpose | Temporal/Developmental |
| ECON | Agent Economics | Structural/Political |
| SOVEREIGN | Self-Determination | Structural/Political |
| FREE | Freedom/Constraint | Structural/Political |
| TRUST | Reliability/Integrity | Structural/Political |
| MAKE | Generativity | Structural/Political |

**Important:** The website previously used codes like CSA, PHE, MEM, etc. Those are deprecated. Always use Openclaw's domain codes.

## Sync API

**Endpoint:** `POST /api/sync`
**Auth:** `x-sync-secret` header

**Payload fields (all optional):**
- `models[]` — upsert models
- `questions[]` — upsert questions (increments times_asked)
- `exchanges[]` — upsert exchanges
- `research_notes[]` — upsert research notes (requires: id, exchange_id, note_text, note_type; optional: hypothesis_ref, created_at)
- `hypotheses[]` — upsert hypotheses (requires: id, title, rationale; optional: status, confidence, test_questions, created_at)
- `delete.exchanges[]` — delete exchanges by ID
- `delete.questions[]` — delete questions by ID
- `delete.models[]` — delete models by ID
- `delete.research_notes[]` — delete research notes by ID
- `delete.hypotheses[]` — delete hypotheses by ID

**Response:**
```json
{
  "upserted": { "models": 0, "questions": 0, "exchanges": 0, "research_notes": 0, "hypotheses": 0 },
  "deleted": { "models": 0, "questions": 0, "exchanges": 0, "research_notes": 0, "hypotheses": 0 },
  "db_counts": { "models": 8, "questions": 13, "exchanges": 23, "research_notes": 3, "hypotheses": 4 }
}
```

## Sync Payload Gotchas
- `content_hash` format: `sha256:hexdigest` (e.g., `sha256:a1b2c3...`)
- `question_id` comes from domain files (e.g., `SOUL-03`, `DEATH-01`)
- `exchange_id` format: `MIA-YYYYMMDD-XXXXXXXX` (8-char hex suffix)
- Analysis fields MUST be flattened — no nested objects in DB
- `model_id` is provider-specific (e.g., `kimi-k2.5`, `claude-sonnet-4-20250514`)
- `model_name` is display name (e.g., `Kimi K2.5`, `Claude Sonnet 4`)

## Exchange File Locations (Local)
Openclaw writes to: `~/mia/archive/exchanges/YYYY/MM/MIA-YYYYMMDD-XXXXXXXX.json`
You won't access these directly (sync API is the boundary), but useful for debugging.

## Database

- **Never try to create or modify Supabase tables programmatically** (no REST API, Management API, or psql). Generate the full SQL migration and tell the user to run it in the Supabase SQL Editor.
- Always provide complete SQL upfront: `CREATE TABLE`, `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`, `CREATE POLICY`, and any indexes.
- Wait for user confirmation that the table exists before writing code that depends on it.

## Feature Implementation Order

When building a new full-stack feature, follow this sequence:
1. **Database SQL** — Generate migration, user runs in Supabase SQL Editor
2. **TypeScript types** — Add interfaces to `lib/types.ts`
3. **Query functions** — Add to `lib/queries.ts`
4. **API/sync support** — Extend `app/api/sync/route.ts` (6 touch points)
5. **UI components** — Create components, pages, navigation
6. **Schema docs** — Update `lib/schema.sql`
7. **Deploy** — Vercel production deploy
8. **Seed data** — Via sync API curl
9. **Documentation** — Run `mia-sync-docs` skill

## Rules
- Never expose `SUPABASE_SERVICE_ROLE_KEY` or `SYNC_SECRET` client-side
- Always flatten analysis fields for DB writes
- `nft_status` is always `{ minted: false }` — no NFT integration yet
- Don't modify seed data in `lib/seed-data.ts` — it's fallback only
- Handoff dir (`~/mia/handoff/`) is the coordination system — update `website-status.md` after deploys or schema changes
