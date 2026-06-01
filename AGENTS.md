## Overview

- The git base branch is `main`.
- Use `bun` as the package manager.
- Keep changes focused and follow established patterns in the repository.

## Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## Workflow

1. Inspect nearby implementation, tests, and pattern docs before editing.
2. Prefer existing abstractions and conventions over introducing new ones.
3. For ad hoc runnable code, create a temporary file in `scratchpad/`, run it with `bun scratchpad/<file>.ts`, and delete it when done.
   The local runtime is Bun, which can run TypeScript files directly; use plain `bun` for local TypeScript probes.
4. Run the validation appropriate to the change type (see below).
5. Report which validation commands were run and any commands that could not be run.

Always run `bun run fmt` before linting

## Validation

Use the narrowest command that still covers the change. Always run `bun run fmt` before other checks.

| Change type | Command |
|-------------|---------|
| Formatting / style only | `bun run fmt` |
| Unit / package tests | `bun run test` (optionally scoped to changed paths) |

Typical combinations:

- **Backend / shared packages:** `bun run fmt` → `bun run check-ts` → `bun test` on touched packages
- **Admin API or frontend:** same as above; frontend uses `apps/admin-frontend` scripts where applicable
- **Prisma:** conventions in `prisma-conventions.mdc`, then generate, migrate, and `check-migration-sql`

## Changesets

Create a changeset in `.changeset/` for runtime behavior changes or exported type/API changes:

```md
---
"package-name": patch/minor/major
---

A description of the change.
```

Tests-only changes, internal refactors, docs-only changes, and JSDoc-only maintenance may skip changesets by maintainer decision.
