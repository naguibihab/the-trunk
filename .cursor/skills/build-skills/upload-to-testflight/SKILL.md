---
name: upload-to-testflight
description: >-
  Builds a release iOS archive, exports an App Store–signed IPA, and uploads to
  App Store Connect with JWT (`altool`) using `--p8-file-path`. Always asks the
  user which marketing version to upload (defaulting to the current version)
  before archiving. After a successful upload, creates or updates the limb’s
  `the-conversation/build/status.md` with the latest marketing version and build
  number (and date/commit when helpful). Works for Expo prebuild, React Native,
  or plain Xcode projects. Covers ASC API key setup, env var naming
  (`CURSOR_ASC_*`), Xcode 26+ CLI flags, and common failures. Use when the user
  mentions TestFlight, App Store upload, IPA, `altool`, export compliance,
  archive, or “send build to ASC”. Also use when the user asks what changed
  since the last ship — read `status.md` first (see “Changes since last ship”).
---

# Upload to TestFlight (iOS)

## MCP vs local CLI

- **No Xcode archive / ASC upload MCP** in this workspace: `user-ios-simulator` is **simulator UI automation only**, not `xcodebuild` or Store uploads.
- **Run this flow in the terminal** on the Mac where Xcode, signing, and the `ios/` tree (or Xcode project) actually live.

## Preconditions

- **`cd` to the app repo root** — the directory that contains **`ios/`** (Expo/RN) or your **`.xcodeproj` / `.xcworkspace`** (native / some setups).
- **Apple Developer Program** + matching **bundle ID** registered in **App Store Connect**.
- **Release signing** works in Xcode (profiles/certs or automatic).
- Bump **build number** (`CFBundleVersion` / `CURRENT_PROJECT_VERSION`) each upload; ASC rejects duplicate **(marketing version, build)** pairs.

## 0) Confirm the version to upload (ask every run)

**Always ask the user which marketing version to upload before archiving** — do not assume. The **default is the current version** already set in the project.

1. Read the **current marketing version** so you can offer it as the default:

```bash
# From repo root; adjust the target plist for your app
/usr/libexec/PlistBuddy -c 'Print CFBundleShortVersionString' ios/<Target>/Info.plist
# Expo-managed projects: read "version" from app.json / app.config.* instead
```

2. **Ask the user**, e.g. *“Upload version **`1.4.0`** (current), or a different version?”* — accept their answer, defaulting to the current value if they don’t specify.

3. If they choose a **new** marketing version, set it **before** archiving:
   - **Native / prebuilt `ios/`:** update `CFBundleShortVersionString` (e.g. via `PlistBuddy -c 'Set ...'` or Xcode `MARKETING_VERSION`).
   - **Expo-managed:** update `version` in `app.json` / `app.config.*`, then re-run prebuild if applicable.

4. **Always bump the build number** (`CFBundleVersion` / `CURRENT_PROJECT_VERSION`) regardless of whether the marketing version changed — ASC rejects duplicate **(marketing version, build)** pairs.

## Names you need (workspace/project + scheme)

Defaults depend on the template; **don’t guess**—read them once:

**Expo prebuild / typical RN:** under `ios/` you usually have **one** `*.xcworkspace` (use `-workspace`; don’t use the inner `.xcodeproj` alone when CocoaPods created a workspace).

```bash
cd ios
ls *.xcworkspace *.xcodeproj 2>/dev/null
# Replace with your real filename(s):
xcodebuild -list -workspace "YourApp.xcworkspace"
# If there is only a project (no workspace):
xcodebuild -list -project "YourApp.xcodeproj"
```

Pick the **scheme** from the “Schemes:” list—often matches the app/target name (may differ from repo folder name).

Set shell variables for the commands below (example placeholders):

```bash
# Use ONE of: workspace OR project (not both required in the same command style)
export IOS_WORKSPACE="YourApp.xcworkspace"   # e.g. ios/MyApp.xcworkspace
export IOS_PROJECT=""                        # e.g. MyApp.xcodeproj if no workspace
export SCHEME="YourApp"                      # from xcodebuild -list
export ARCHIVE_PATH="build/${SCHEME}.xcarchive"
```

Adjust paths if your Xcode tree is not under `ios/` (some native apps live at repo root).

## 1) Archive (Release)

UTF-8 locale avoids common CocoaPods/script encoding failures:

```bash
export LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8
cd ios   # or repo root if your .xcworkspace is here

# Workspace + scheme (typical Expo / RN / CocoaPods):
xcodebuild archive \
  -workspace "$IOS_WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  -archivePath "$ARCHIVE_PATH" \
  -allowProvisioningUpdates
```

**If you only have a project** (no `.xcworkspace`):

```bash
xcodebuild archive \
  -project "$IOS_PROJECT" \
  -scheme "$SCHEME" \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  -archivePath "$ARCHIVE_PATH" \
  -allowProvisioningUpdates
```

**Signing note:** Archive logs may show **Apple Development**; **`exportArchive`** can still yield an **Apple Distribution** IPA depending on export settings. Verify if needed: unzip the IPA and **`codesign -dvv`** on `Payload/*.app`.

## 2) Export IPA (App Store Connect)

Use an **Export Options** plist with **`method`** for App Store delivery (Apple labels may be **`app-store`** or **`app-store-connect`** depending on Xcode—follow Xcode’s own templates/warnings).

Typical keys: `method`, `teamID`, `signingStyle`, symbol upload options as needed.

```bash
xcodebuild -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportPath build \
  -exportOptionsPlist /path/to/ExportOptions.plist \
  -allowProvisioningUpdates
```

**Artifact:** `build/*.ipa`. **Do not commit** IPAs or bulky `build/` output—keep them **gitignored**.

## 3) App Store Connect API key (JWT)

- **Navigation:** App Store Connect → **Users and Access** → **Integrations** → **App Store Connect API** (`/access/integrations/api`).
- **Issuer ID:** team-level UUID at the top of that page.
- **Key ID:** per key; private file **`AuthKey_<KeyID>.p8`** downloads **once**.
- **Role:** Prefer **Developer** for upload/TestFlight automation unless you need broader ASC permissions.
- **Secrets:** Never commit **`.p8`** or paste JWT material into chat. Store outside repos (e.g. `~/.private/...`), **`chmod 600`**.

### Environment variables (recommended in this workspace)

Use a **`CURSOR_` prefix** so agent shells don’t collide with other tooling:

- `CURSOR_ASC_KEY_ID`
- `CURSOR_ASC_ISSUER_ID`
- `CURSOR_ASC_KEY_PATH` — absolute path to `AuthKey_<KeyID>.p8`

**Agent caveat:** Cursor’s non-interactive shell may **not** load `~/.zshrc`; export in-session or `source` your profile before **`altool`**.

Without **`--p8-file-path`**, **`altool`** only searches fixed locations (`./private_keys`, `~/private_keys`, `~/.appstoreconnect/private_keys`, **`$API_PRIVATE_KEYS_DIR`**, etc.).

## 4) Upload with `altool` (Xcode 26+)

On recent Xcode, JWT upload expects **`--api-key`**, **`--api-issuer`**, and **`--p8-file-path`**.

Older **`--apiKey` + `--apiKeyPath`**-only flows may fail **(-43)** if the `.p8` isn’t in a searched directory.

```bash
xcrun altool --upload-app \
  -f /absolute/path/to/your.ipa \
  --type ios \
  --api-key "$CURSOR_ASC_KEY_ID" \
  --api-issuer "$CURSOR_ASC_ISSUER_ID" \
  --p8-file-path "$CURSOR_ASC_KEY_PATH"
```

Verify flags with **`xcrun altool --help`**.

Success → **Delivery UUID**, “UPLOAD SUCCEEDED”. ASC → **TestFlight** → **Processing**, then testers when Apple finishes validation.

## 5) Create or update `the-conversation/build/status.md`

Shipped builds should be visible to PM/builders in the Limb conversation doc.

- **File:** from the **Limb repo root**, create or update **`the-conversation/build/status.md`** (the `build/` lane alongside `marketing/` and `revenue/`). **Create the file (and the `the-conversation/build/` folder) if they don’t exist yet.**
- **When:** immediately after **`altool`** reports success (or once you are confident the upload won’t be rolled back). Use **UTC** dates unless the project already standardizes on local time—stay consistent with the rest of that file.
- **What to record:** the **marketing version** the user chose in step 0 (`CFBundleShortVersionString`) and the **build** (`CFBundleVersion`). Optionally add **short git SHA** (`git rev-parse --short HEAD`) and a note that ASC is **processing** / TestFlight **ready**.

### Read version + build from the archive (recommended)

Paths inside the `.xcarchive` reflect what you actually uploaded:

```bash
APP_PLIST="$(find "$ARCHIVE_PATH" -maxdepth 6 -path '*/Applications/*.app/Info.plist' -print -quit)"
MARKETING="$(/usr/libexec/PlistBuddy -c 'Print CFBundleShortVersionString' "$APP_PLIST")"
BUILD="$(/usr/libexec/PlistBuddy -c 'Print CFBundleVersion' "$APP_PLIST")"
```

If `find` returns nothing, fall back to the repo’s **`ios/<Target>/Info.plist`** (or your native target’s plist) with the same **`PlistBuddy`** keys.

### What to write

**If `the-conversation/build/status.md` does not exist**, create it with a `# Build status` heading, a **Latest** line for the current version, and a `## Ship / TestFlight` history section, for example:

```markdown
# Build status

_Update as you ship._

**Latest:** **`1.4.0`** (build **`105`**) — TestFlight, ASC processing (2026-05-20 UTC).
**TestFlight:** https://appstoreconnect.apple.com/teams/<TEAM_UUID>/apps/<APP_ID>/testflight/ios

## Ship / TestFlight

- **TestFlight upload (2026-05-20 UTC):** **`1.4.0`** (build **`105`**); limb **`a1b2c3d`**; `altool` OK — ASC processing.
```

Keep the **TestFlight** link line (with the resolved `<APP_ID>`) so future runs and PM/builders can reuse it without re-resolving the App ID.

**If the file already exists:**

1. Ensure a **`## Ship / TestFlight`** section exists (append **near the top**, typically **after** the one-line *Update as you ship.* tagline and **before** the first major `##` section—mirror whatever ordering that file already uses).
2. Append a **new dated bullet** so history stays visible (same format as above).
3. Update the **Latest** line to the version/build you just uploaded.

Match the voice of the existing file (bold/emphasis, backticks for literals).

- **Optional (trunk):** When you next touch **`the-trunk/apps.json`** for this app, set **`apps[].build.lastReleaseDate`** to the upload’s calendar date (**`YYYY-MM-DD`**) so the PM dashboard **Build** column shows **Last release**.

### Changes since last ship

When the user asks whether **anything material changed** since the last App
Store / TestFlight release:

1. **`status.md` is source of truth** — read **Latest** and the newest
   `## Ship / TestFlight` bullet for version, build, and git SHA.
2. **`git diff` / `git log`** from that SHA to `HEAD` on binary paths:
   `src/`, `app/`, `ios/`, `android/`, `app.json`, `package.json`.
3. Ignore `the-conversation/`, docs, `.env.example`, `.cursor/` unless asked.
4. **Always record the short SHA** on each upload bullet so future checks do
   not depend on dates alone.

## 6) Give the user the TestFlight link

After a successful upload, build and surface a direct link to the app’s TestFlight page so the user can jump straight to it:

```
https://appstoreconnect.apple.com/teams/<TEAM_UUID>/apps/<APP_ID>/testflight/ios
```

Resolve the two variables, then **print the final URL in your reply** (and include it in `status.md`, below).

### `<TEAM_UUID>` — App Store Connect team UUID (account-level)

This is the **ASC web team UUID**, **not** the Developer Program `teamID` (`S3G47449N7`) in `ExportOptions.plist`, and **not** the issuer ID.

- Use **`$CURSOR_ASC_TEAM_UUID`** if set.
- Otherwise, default to this workspace’s value: **`b3338cc1-55e3-48f8-b881-d02eec591a25`** (all apps here are on the same ASC team).
- If neither resolves, ask the user (it’s the UUID in any `appstoreconnect.apple.com/teams/<UUID>/...` URL — not a secret).

### `<APP_ID>` — numeric Apple App ID (per limb)

Resolve in this order; stop at the first hit:

1. **`eas.json`** → `submit.production.ascAppId` (EAS-managed limbs, e.g. the bowl apps).
2. **`app.config.*` / `app.json`** → `extra.appleAppId`, or the `EXPO_PUBLIC_APPLE_APP_ID` env it reads from.
3. **Marketing docs** → `the-conversation/marketing/asoHealth.md` (the `App ID` row) or the App Store URL `.../id<APP_ID>` in `liveListing.md` / `productHuntTodos.md`.
4. **Ask the user** for the numeric App Store ID, then **record it** in `status.md` (see below) so future runs skip straight to it.

> The numeric App ID is **not** the bundle identifier (`io.upilio.peoplekeeper`) and is **not** returned by `altool`.

## 7) Troubleshooting (short)

| Symptom | Likely fix |
|--------|------------|
| Auth **(-43)**, wrong key lookup dir | **`--p8-file-path`** or **`API_PRIVATE_KEYS_DIR`**. |
| Agent missing env vars | Export in **same shell** / `source ~/.zshrc`. |
| Duplicate build | Bump **build number**, re-archive/export. |
| Wrong signing in IPA | Fix export plist / profiles; **`codesign -dvv`** on `Payload/*.app`. |
| Wrong scheme/workspace | Re-run **`xcodebuild -list`**; scheme names are easy to typo. |

## 8) Optional: ASC encryption prompts

Add **`ITSAppUsesNonExemptEncryption`** (and **`ITSEncryptionExportComplianceCode`** if applicable) in **`Info.plist`** per Apple’s [encryption export](https://developer.apple.com/documentation/security/complying_with_encryption_export_regulations) docs to reduce repeated compliance questions.
