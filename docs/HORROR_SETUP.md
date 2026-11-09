# Step-by-step setup and acceptance checklist

## 1. Repository and installation

Owner selected by user: `yashnamdev98`. Fork: https://github.com/yashnamdev98/miss-x-horror-automation . Upstream MIT license is retained. Initial source commit: `3ea1b524c0a729a7ebd49f3f64ad11fed626222a`.

Clone your fork, use Node 22/24 LTS, and run `npm ci --ignore-scripts`. This avoids native SQLite build scripts; the staged workflow does not require SQLite. Do not run upstream setup/start instructions expecting autonomous video creation. Several upstream workflows are absent and rendering/audio routines contain simulations.

Copy `.env.example` to `.env` only if it does not already exist. Keep all existing credentials, voices and browser profiles. No old configuration was found in this new workspace, so nothing has been migrated or verified as an API connection.

Run `npm test`, then `npm run horror -- plan examples/horror-brief.json`. The latter prints a prompt without a network call. `npm start` binds a status endpoint to 127.0.0.1:3456. If that port belongs to an existing production app, choose a different `PORT`; never stop or overwrite it.

## 2. Editorial intake and current sources

Create one brief per episode using the example shape. Long-form fiction: `mode: fiction`, `format: long-form`; narrator must be female `en-US` or `en-GB`. Replace `voiceId` with the exact existing provider voice ID after listening. Never infer or imitate a female reference narrator's voice.

True-case Shorts: `mode: true-case`, `format: short`. Include HTTPS source URLs, source titles, ISO `checkedAt` timestamps, and claims with `sourceIndexes`. Manually verify sources and each factual assertion; JSON validation only checks structure, not historical truth. Do not import earlier public view counts or unsourced claims as current data. Fiction must be labelled in descriptions. AI reenactments must not be described as archival footage.

Use live current research separately and record checkedAt. Browser drafts and old sandbox downloads from the prior chat were not transferred into this checkout. Their existence is not proof of a render or publication.

## 3. Gemini text, existing browser or optional API

The default route uses your existing Gemini session and the exported prompt. No key needed. Save its JSON output locally with fields `title`, `script`, `scenes: [{narration, visualPrompt}]`, `description`, `tags`, `thumbnailPrompt`, and `teaser`. `scenes` must contain every spoken word in order. Long-form validation accepts 2800–4200 words, Shorts 40–75. These are drafting bounds, not actual duration checks.

Optional API route: put `GEMINI_API_KEY` and an explicit available `GEMINI_TEXT_MODEL` in the ignored `.env`. Confirm project billing and model free-tier eligibility in AI Studio; do not assume an old README quota. Only then set `ALLOW_EXTERNAL_REQUESTS=true` and `GEMINI_FREE_TIER_CONFIRMED=true`, leaving `ALLOW_PAID_APIS=false`. Run:

```sh
mkdir -p production-output
npm run horror -- generate examples/horror-brief.json production-output/episode-001
```

It performs one Gemini text request with the key in a header, no retries or paid fallback. HTTP 429 stops the workflow. A flag is a human assertion, not a way for software to guarantee provider billing. Keep external requests false until the selected project/model is approved. Model response and secret-bearing provider errors are not logged. The mock tests verify the request/response contract; they do not prove current model availability.

Manual export makes no API calls:

```sh
mkdir -p production-output
npm run horror -- export examples/horror-brief.json /path/to/production.json production-output/episode-001
```

## 4. Female TTS, VirtualVault and Flow

Use `story.txt` with your existing female TTS integration or voice selector. Keep the exact selected voice, language and script. Listen to the entire audio for truncation, pronunciation and sentence joins. No narration audio was generated in this implementation. Legacy ElevenLabs/OpenAI/Replicate generation requires BOTH external and paid flags and is not used by this workflow. There is no silent paid or male fallback.

Import reviewed text/assets into https://app.virtualvault.in/projects using the existing authenticated profile. November 9 browser observation showed the builder with 83 credits and 1/3/5/10-minute long-form presets; credits and capabilities can change. The desired 20–30-minute fiction may need reviewed segments or an external assembly step. Confirm export duration before producing long-form; do not silently shorten or claim support.

Use scene prompts manually in https://flow.google.com/ when needed. The browser inventory included a Flow project for AGENTS ALPHA ads; do not reuse that unrelated project for horror. Select/create an appropriate horror project manually, review credits, and confirm continuity. No public Flow/VirtualVault API contract has been established; no undocumented endpoints, cookie scraping, session copying, generation or purchases are implemented.

## 5. YouTube read-only OAuth and secrets

Existing browser login to Studio is distinct from a new application's OAuth token. Confirm MISS X HORROR and channel ID `UCA9ucFsWqyjqmJy4BI_aYDw` before any later private upload.

1. In your existing/selected Google Cloud project, enable YouTube Data API v3. Configure the OAuth consent screen and test user if applicable.
2. Create an OAuth **Desktop app** client. Save the downloaded JSON as ignored `config/oauth-client.json` (with its `installed` object). Never paste secrets into chat or commit the file.
3. Run `npm run oauth:youtube`. The helper binds only to 127.0.0.1 on a temporary port, creates state and PKCE values, and prints a Google authorization URL. Open it yourself and confirm the intended account. It requests only `youtube.readonly` during staging.
4. The callback rejects wrong state/path/missing code/provider denial, exchanges the code with PKCE, then reads your channel identity. A different channel is rejected. It saves ignored `config/tokens.json` with mode 0600 only if that file does not already exist. Existing tokens are never overwritten. No app/scheduler starts after OAuth.
5. Do not use the retired out-of-band auth path or broaden consent to manage the whole account. Upload scope is a later, separately reviewed step after media validation. OAuth access/refresh tokens are secrets; revoke in Google Account permissions if exposed.

Read-only OAuth has not been run against your account. It requires the client file and interactive consent. Existing upstream credentials schema (`config/credentials.json` / `tokens.json`) is retained in source for reference; legacy automation is disabled, and the staged helper consumes the downloaded Desktop client file directly. Do not replace old application secrets with examples.

Store keys/tokens in ignored local files (0600), an OS secret manager or server-side secret store. Do not put them in frontend JavaScript, URLs, production artifacts, commit messages or logs. `.env`, `.env.*` except the example, credentials/tokens/OAuth JSON, keys and production output are ignored. Git ignores do not encrypt local files. There is no need for GitHub Actions secrets: no generation or publishing workflow runs in Actions.

Official references:
- https://developers.google.com/identity/protocols/oauth2/native-app
- https://developers.google.com/youtube/v3/docs/videos/insert
- https://ai.google.dev/gemini-api/docs

## 6. Acceptance gates before unlocking any publication

- Verify original script, factual sources/uncertainty or fiction labels, rights and complete scene coverage.
- Verify exact female voice, complete audio, captions, scene order and first/last frames. Long form 16:9; Shorts 9:16. Inspect media duration and streams with `ffprobe`; an estimated runtime or placeholder file is not a render.
- Manually upload one reviewed video privately through Studio after owner authorization. Confirm the correct channel, actual rendered file, processing, copyright checks, audience setting, synthetic-content disclosure and private visibility. Save its video URL and verification record. Do not treat upload/processing as public delivery.
- Review requested release time, including a future date and Asia/Kolkata conversion. Long-form proposal is 05:00 IST; sourced Shorts retain their separate schedule. The code never books a date.
- Only after successful checks and exact owner approval should a later reviewed code change unlock narrowly scoped API uploads. `AUTO_PUBLISH=true` alone deliberately does nothing. Public/scheduled publishing remains code-locked.

## 7. Test scope and remaining blockers

Tests cover offline brief/provenance validation, script coverage, Gemini mocked requests and quota stop behavior, draft exports, endpoint publication denial, legacy publish/scheduler/paid-provider guards, and OAuth callback validation. No live Gemini, TTS, Flow, VirtualVault render, Google consent or YouTube upload was tested. Browser sessions are preserved, not converted into server-side credentials.

The inherited dependency findings were resolved in the November 9 follow-up: npm audit reports zero vulnerabilities. SQLite and sharp native compatibility tests pass after rebuilding their registry packages. Legacy end-to-end automation remains disabled and unvalidated; do not infer readiness from a clear dependency audit. See VALIDATION.md.
