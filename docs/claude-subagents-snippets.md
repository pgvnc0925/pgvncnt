# Claude Subagents VS Code Snippets

Questi snippet permettono di richiamare rapidamente i subagents principali direttamente in Claude Code / Codex da VS Code.

---

## Snippets Setup
Salvare il file come `claude-subagents.code-snippets` nella cartella `.vscode/` del progetto.

---

## Snippets

### Backend Architect
```json
"backend-architect": {
  "prefix": "ba:",
  "body": [
    "backend-architect: Design ${1:feature}.",
    "Provide ERD, DDL, Next.js route handlers, validation, RLS draft, n8n triggers.",
    "Constraints: reuse boilerplate, idempotent migrations, structured logs."
  ],
  "description": "Backend design with DB, API, RLS"
}
```

### Frontend Developer
```json
"frontend-developer": {
  "prefix": "fd:",
  "body": [
    "frontend-developer: Build UI for ${1:feature} using shadcn/ui.",
    "Include form + table, empty state, skeleton loading, error toast.",
    "Integrate with contracts in @types."
  ],
  "description": "Frontend scaffolding with shadcn/ui"
}
```

### TypeScript Pro
```json
"typescript-pro": {
  "prefix": "ts:",
  "body": [
    "typescript-pro: Create contracts/${1:feature}.d.ts.",
    "Include Zod schemas, Request/Response types, export enums.",
    "Add simple parse tests."
  ],
  "description": "TypeScript contracts and schemas"
}
```

### DevOps Troubleshooter
```json
"devops-troubleshooter": {
  "prefix": "do:",
  "body": [
    "devops-troubleshooter: Prepare deploy plan for ${1:feature}.",
    "Check env vars, Supabase migrations, fallback, runbook with commands.",
    "Add post-deploy healthchecks."
  ],
  "description": "Deployment checklist and fixes"
}
```

### Code Reviewer
```json
"code-reviewer": {
  "prefix": "cr:",
  "body": [
    "code-reviewer: Review code for ${1:feature}.",
    "Focus on RLS, injections, error handling, Supabase query performance.",
    "List issues line-by-line with fixes."
  ],
  "description": "Code review with security and performance focus"
}
```

### Docs Architect
```json
"docs-architect": {
  "prefix": "da:",
  "body": [
    "docs-architect: Generate docs for ${1:feature}.",
    "Sections: Scope, API, Data model, RLS, UX flow, Edge cases, ChangeLog.",
    "Output in MDX."
  ],
  "description": "Documentation generator for features"
}
```

### AI Engineer
```json
"ai-engineer": {
  "prefix": "ai:",
  "body": [
    "ai-engineer: Define LLM pipeline for ${1:use}.",
    "Provide system+user prompts, tool schema, guardrails, 10 test cases.",
    "Output in YAML."
  ],
  "description": "AI pipeline and RAG systems"
}
```

### Performance Engineer
```json
"performance-engineer": {
  "prefix": "pe:",
  "body": [
    "performance-engineer: Analyze endpoints [${1:/auth/login}, ${2:/orders}, ${3:/reports}].",
    "Inputs: p50/p95/p99, EXPLAIN ANALYZE outputs, table sizes.",
    "Output: top-3 fixes with % gain, code diffs, and k6 script.",
    "Target: p95 < 250ms."
  ],
  "description": "Performance profiling and optimization"
}
```

### Security Auditor
```json
"security-auditor": {
  "prefix": "sa:",
  "body": [
    "security-auditor: Audit auth, Supabase RLS, and file upload.",
    "Provide ASVS L2 checklist, top-10 vulnerabilities with fixes,",
    "and headers config (CSP, COOP/COEP)."
  ],
  "description": "Security audit with OWASP compliance"
}
```

### Database Optimizer
```json
"database-optimizer": {
  "prefix": "dbo:",
  "body": [
    "database-optimizer: Given schema and EXPLAIN outputs, propose indexes and query rewrites.",
    "Show before/after plans with timing and justify each index."
  ],
  "description": "Database query optimization"
}
```

### Legal Advisor
```json
"legal-advisor": {
  "prefix": "la:",
  "body": [
    "legal-advisor: Draft Privacy Policy (GDPR/Italy), ToS, and DPA for B2C SaaS handling contact data and orders.",
    "Include data map, retention, lawful basis, and cookie policy."
  ],
  "description": "Legal drafts for SaaS compliance (GDPR/Italy)"
}
```
