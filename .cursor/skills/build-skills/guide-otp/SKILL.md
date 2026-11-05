---
name: guide-otp
description: >-
  Step-by-step setup for Supabase Auth email OTP (6-digit code) with Resend SMTP
  in new Expo React Native limbs. Covers Resend domain verification on auth.upilio.io,
  Supabase custom SMTP, redirect URLs, email templates with {{ .Token }}, env vars,
  expo-auth-session deep-link handling, and dev-client testing. Copy/adapt from
  People Keeper reference implementation. Use when setting up OTP auth, magic
  link fallback, Resend SMTP, Supabase email auth, passwordless sign-in, shared
  auth domain, or email verification for a new app/limb.
---

# Guide: Supabase Auth + Resend SMTP + Email OTP (Expo)

Set up passwordless **email OTP** (6-digit code) for a new limb/app. Adapted from the People Keeper production flow.

**Reference limb:** `limbs/limb-people-keeper`  
**Handoff doc:** `limbs/limb-people-keeper/step-by-step-setup-smtp-supabase-resend.md`  
**Shared auth domain:** `auth.upilio.io` — canonical Upilio sender for auth email (OTP, magic links) across all apps.

## Required input

The user must name the **target limb** (e.g. `limb-all-pets`). If missing, **stop and ask** — do not guess project refs, schemes, or domains.

Gather or confirm these placeholders before starting:

| Placeholder | Value | Where to set |
|-------------|-------|--------------|
| `{app-name}` | People Keeper / All the pets | Display / docs only |
| `{scheme}` | `peoplekeeper` / `allthepets` | `app.json` → `expo.scheme` |
| `{redirect-url}` | `peoplekeeper://auth` | Supabase URL config + optional env |
| `{supabase-project-ref}` | from the Supabase dashboard URL | Supabase Dashboard URL |
| `{shared-sender-domain}` | **`auth.upilio.io`** | Resend verified domain (**fixed — all Upilio apps**) |
| `{shared-sender-email}` | **`no-reply@auth.upilio.io`** | Supabase SMTP sender (**fixed — all Upilio apps**) |

**Multi-app rule:** Every Upilio app uses **`auth.upilio.io`** for auth outbound mail — not per-app domains like `peoplekeeper.upilio.io`. Reuse the same Resend API key and `{shared-sender-email}` in each Supabase project; differentiate with **Sender name** (`{app-name}`). DNS is in **Route 53**. See `limbs/limb-people-keeper/docs/migrate-to-shared-resend-domain.md`.

## Architecture

- **Auth provider:** Supabase Auth
- **Primary sign-in:** Email OTP — user enters 6-digit code in-app
- **Email delivery:** Resend via Supabase **custom SMTP** (not built-in Supabase mail)
- **Shared sender domain:** `auth.upilio.io` — one domain for auth email across the portfolio
- **Fallback:** Magic-link deep link (`{redirect-url}`) with hash/query session parsing
- **Platform:** Expo React Native — use **dev client**, not Expo Go, for auth deep links

Same API powers both flows: `supabase.auth.signInWithOtp`. Supabase sends a **link** by default; add `{{ .Token }}` to email templates to also send the **code**.

---

## Workflow checklist

Copy and track progress:

```
OTP setup progress:
- [ ] 1. Resend: verify shared domain auth.upilio.io (Route 53 DNS)
- [ ] 2. Supabase project + env vars in limb
- [ ] 3. Supabase custom SMTP (Resend credentials + no-reply@auth.upilio.io)
- [ ] 4. Supabase URL configuration (redirect URLs)
- [ ] 5. Supabase email templates ({{ .Token }})
- [ ] 6. Supabase client + auth helpers in app code
- [ ] 7. Auth UI (send code → verify code)
- [ ] 8. Deep-link session handler (magic-link fallback)
- [ ] 9. App scheme in app.json
- [ ] 10. Dev-client build + end-to-end test
```

---

## 1) Resend + shared auth domain (`auth.upilio.io`)

The domain is **already verified** for Upilio — new limbs wire Supabase SMTP only; do not add per-app Resend domains.

If setting up from scratch or onboarding a new Supabase project:

1. Use the existing [Resend](https://resend.com) account (Upilio shared).
2. Confirm **`auth.upilio.io`** is **Verified** in Resend → Domains.
3. Sender address: **`no-reply@auth.upilio.io`**.
4. DNS: Route 53 (`upilio.io` hosted zone) — DKIM/SPF per Resend.

**Critical gotcha:** SMTP error `550 The <domain> domain is not verified` means the Supabase sender is not on a Resend-verified domain. Sender must be `@auth.upilio.io`.

**Legacy (retired):** `peoplekeeper.upilio.io`, `peoplekeepr.upilio.io` — do not use for new apps.

---

## 2) Environment variables

In the limb root, copy `.env.example` → `.env` (or create):

```env
EXPO_PUBLIC_SUPABASE_URL=https://{supabase-project-ref}.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key-from-dashboard>
# Optional — only needed for magic-link redirect flow:
EXPO_PUBLIC_AUTH_REDIRECT_URL={redirect-url}
```

- Values: Supabase Dashboard → **Project Settings → API**
- **Restart Metro** after changing `.env` — Expo reads env only at bundler startup
- Never commit real keys; use `.env.example` with placeholders
- Resend API key and sender live in **Supabase Dashboard only** — not in `.env`

**Example:** project ref `{supabase-project-ref}`, redirect `peoplekeeper://auth`.

---

## 3) Supabase custom SMTP (Resend)

Supabase Dashboard → **Authentication → SMTP Settings** → enable custom SMTP:

| Field | Value |
|-------|-------|
| Host | `smtp.resend.com` |
| Port | `465` (SSL) or `587` (TLS) |
| Username | `resend` |
| Password | Resend API key (`re_...`) |
| Sender email | `no-reply@auth.upilio.io` |
| Sender name | `{app-name}` (distinguishes apps sharing one From address) |

Save and send a test email if the dashboard offers it.

Also review **Authentication → Rate Limits** — built-in SMTP has low limits; custom SMTP + raised limits resolved `429 over_email_send_rate_limit` in People Keeper.

---

## 4) Supabase URL configuration

Dashboard → **Authentication → URL Configuration**:

| Setting | Recommended value |
|---------|-------------------|
| Site URL | `http://localhost:3000` (acceptable fallback for mobile-only apps) |
| Redirect URLs | `{redirect-url}` (and `{redirect-url}/callback` if used in code) |

**People Keeper:** `peoplekeeper://auth` (canonical).

Rules:

- `emailRedirectTo` in code must **exactly match** an allowed redirect URL
- If links open `http://localhost:3000/#access_token=...`, Supabase fell back to Site URL — redirect config or `emailRedirectTo` mismatch
- For **OTP-only** apps, redirect URLs matter mainly for magic-link fallback; still configure them

---

## 5) Email templates (OTP token)

Dashboard → **Authentication → Email Templates**.

Update at minimum **Magic link** and **Confirm sign up** to include the OTP code:

```html
<p>Your verification code is: {{ .Token }}</p>
```

Without `{{ .Token }}`, Supabase sends only a clickable link — fine for magic links, wrong for in-app code entry.

Keep subject/body readable; the 6-digit code is what users type in the auth screen.

---

## 6) Supabase client (React Native)

Copy pattern from `limbs/limb-people-keeper/src/lib/supabase.ts`:

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // RN handles URLs manually
  },
});
```

Dependencies (adjust versions to limb's Expo SDK):

- `@supabase/supabase-js`
- `@react-native-async-storage/async-storage`

---

## 7) OTP auth helpers

Copy/adapt from `limbs/limb-people-keeper/src/lib/auth/emailAuth.ts`:

**Send code:**

```typescript
await supabase.auth.signInWithOtp({
  email: normalizedEmail,
  options: { shouldCreateUser: true },
});
```

**Verify code:**

```typescript
await supabase.auth.verifyOtp({ email, token, type: "email" });
// Fallback for newly created users:
await supabase.auth.verifyOtp({ email, token, type: "signup" });
```

Do **not** pass `emailRedirectTo` unless implementing magic-link redirect — OTP flow verifies in-app.

---

## 8) Auth UI

Copy/adapt from:

- `limbs/limb-people-keeper/src/features/auth/screens/AuthScreen.tsx`
- `limbs/limb-people-keeper/app/auth.tsx`

Pattern:

1. Email input → **Send sign-in code** → `sendEmailSignInOtp`
2. OTP input → **Verify code** → `verifyEmailSignInOtp`
3. **Resend code** → call `sendEmailSignInOtp` again
4. Auth gate: if session exists → app home; else → auth screen

Wire `supabase.auth.onAuthStateChange` in your root store/provider (see `AppStore.tsx`).

---

## 9) Magic-link fallback — deep-link session handling

Even with OTP-primary UX, implement callback parsing for magic links and future-proofing.

Copy from `limbs/limb-people-keeper/src/lib/auth/redirectSession.ts`:

- Use `expo-auth-session/build/QueryParams` for query params
- Parse URL **hash fragment** manually (`#access_token=...`)
- If `access_token` + `refresh_token` → `supabase.auth.setSession(...)`
- Else if `token_hash` + `type` → `supabase.auth.verifyOtp(...)`

**App-level listeners** (in root provider, see `AppStore.tsx`):

```typescript
Linking.getInitialURL()          // cold start
Linking.addEventListener("url")  // runtime
// both → applySessionFromAuthUrl(url)
```

If using magic links with redirect, hardcode during setup:

```typescript
emailRedirectTo: "{redirect-url}"  // e.g. peoplekeeper://auth
```

Avoid `makeRedirectUri(...)` until redirect config is stable — it produces environment-specific values that confuse debugging.

---

## 10) App scheme

In `app.json`:

```json
{
  "expo": {
    "scheme": "{scheme}"
  }
}
```

Enables `{scheme}://auth` deep links.

**People Keeper:** `"scheme": "peoplekeeper"`.

Ensure any Expo Router auth route (e.g. `/auth/callback`) actually exists if you reference it in redirect URLs.

---

## 11) Dependencies and runtime

Install in the limb:

```bash
yarn add @supabase/supabase-js @react-native-async-storage/async-storage expo-auth-session expo-linking expo-dev-client
```

**Do not rely on Expo Go** for auth deep links — SDK/version mismatches break the flow. Use dev client:

```bash
yarn expo start --dev-client --port 8082 --clear
yarn expo run:ios --port 8082
```

If native modules fail (`ExpoLinking`, `PlatformConstants`):

```bash
yarn expo prebuild --platform ios --clean
yarn expo run:ios --port 8082
```

Align Expo SDK with stable native deps (People Keeper uses SDK 54).

---

## 12) Testing checklist

### OTP flow (primary)

- [ ] `.env` has correct URL + anon key; Metro restarted
- [ ] Resend domain `auth.upilio.io` verified; SMTP test passes
- [ ] Email templates include `{{ .Token }}`
- [ ] Enter email → receive email from `no-reply@auth.upilio.io` with 6-digit code
- [ ] Enter code → session created → auth gate passes
- [ ] Resend code works; wrong code shows error
- [ ] New user signup OTP works (`type: "signup"` fallback)
- [ ] Sign out → returns to auth screen

### Supabase logs

Dashboard → **Logs → Auth** — validate:

- `POST /otp` succeeds
- `POST /verify` succeeds
- Watch for: `email rate limit exceeded`, SMTP 550, token expired

If `/verify` appears in logs but app doesn't sign in → app-side issue, not email delivery.

### Magic-link fallback (simulator)

Open deep link manually (quote the full URL):

```bash
xcrun simctl openurl booted "{redirect-url}#access_token=TOKEN&refresh_token=TOKEN&..."
```

**Manual workaround** when redirect misbehaves:

1. Email opens `http://localhost:3000/#access_token=...`
2. Copy fragment after `#`
3. Build `{redirect-url}#access_token=...&refresh_token=...`
4. Open with `xcrun simctl openurl booted "<full-url>"`

---

## 13) Reference files (People Keeper)

Copy these as templates when wiring a new limb:

| Purpose | Path |
|---------|------|
| Supabase client | `limbs/limb-people-keeper/src/lib/supabase.ts` |
| Send + verify OTP | `limbs/limb-people-keeper/src/lib/auth/emailAuth.ts` |
| Deep-link session | `limbs/limb-people-keeper/src/lib/auth/redirectSession.ts` |
| Auth UI | `limbs/limb-people-keeper/src/features/auth/screens/AuthScreen.tsx` |
| Auth route | `limbs/limb-people-keeper/app/auth.tsx` |
| URL listeners + session | `limbs/limb-people-keeper/src/state/AppStore.tsx` |
| Env template | `limbs/limb-people-keeper/.env.example` |
| App scheme | `limbs/limb-people-keeper/app.json` |
| Setup handoff | `limbs/limb-people-keeper/step-by-step-setup-smtp-supabase-resend.md` |
| Shared auth domain | `limbs/limb-people-keeper/docs/migrate-to-shared-resend-domain.md` |

After copying, replace `{scheme}`, `{redirect-url}`, and env values for the new app. **Do not** change `{shared-sender-domain}` or `{shared-sender-email}`.

---

## 14) Known pitfalls

| Symptom | Likely cause |
|---------|--------------|
| `550 domain is not verified` | Sender not on `auth.upilio.io`; wrong Resend domain |
| `429 over_email_send_rate_limit` | Built-in SMTP limits — switch to Resend custom SMTP |
| Email has link but no code | Templates missing `{{ .Token }}` |
| Link opens localhost in browser | `emailRedirectTo` not in Supabase redirect allowlist |
| Tap link, nothing happens | Missing deep-link parser or URL listener |
| OTP verify fails for new users | Try `verifyOtp` with `type: "signup"` |
| Stale / invalid token | Request fresh code; tokens expire and are single-use |
| Shell URL test fails | Unquoted `&` in URL — wrap entire URL in quotes |
| Deep link to missing route | Expo Router path doesn't exist |
| Env changes ignored | Metro not restarted after `.env` edit |
| Per-app sender domain | Use `auth.upilio.io` + Sender name, not a new subdomain |

---

## 15) New-app quick start (agent steps)

When the user asks to add OTP auth to a new limb:

1. Confirm `{scheme}`, `{supabase-project-ref}`, `{redirect-url}`. Sender is always `no-reply@auth.upilio.io`.
2. Configure Supabase custom SMTP with shared Resend credentials (sections 1, 3).
3. Add env vars + `.env.example` (section 2).
4. Configure Supabase URLs + email templates (sections 4, 5).
5. Copy PK auth files into the limb; adjust imports/paths (sections 6–10).
6. Add auth gate in root layout/index.
7. Install deps; run dev-client iOS build (section 11).
8. Walk through testing checklist (section 12).
9. Document in the limb's `the-conversation/brief.md` (auth domain `auth.upilio.io`, project ref).
