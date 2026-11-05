# Common issues (tester agent watchlist)

Use this list when exercising the app or reviewing changes. These are **recurring risk areas**, not a full test plan.

## 1. Persistence: changes never reach the backend

**Risk:** UI appears to succeed but data is only local, lost on refresh, or never synced.

**Watch for:**

- Create/update/delete flows that show success but **do not appear** after kill-and-relaunch, another device, or direct checks against the API/database.
- Optimistic UI with **no error surfaced** when the network or server rejects the write.
- Operations that **only touch local state** (memory, AsyncStorage, etc.) while the product implies cloud/shared data.
- Missing or broken **loading/error states** after mutations (silent failures).

**When reporting:** Note the exact steps, expected persistence (where it should show up), and what you observed after a hard refresh or cold start.

## 2. Dead weight: unused code and unused schema

**Risk:** Orphaned implementations confuse future work; unused tables/columns suggest drift between schema and app behavior.

**Watch for:**

- **Code:** exports, hooks, screens, flags, or repositories **never imported or routed**; commented-out call sites with no replacement path.
- **Database:** tables, columns, or enums **never read or written** by app code or Edge Functions you rely on; migrations that add fields **never referenced** in types or queries.

**When reporting:** Point to file paths or migration names and say whether usage was searched (e.g. repo-wide symbol/table/column name search). Prefer evidence over guesses.

---

*Add more bullets here as patterns recur.*
