# MISS X HORROR — supervised production workflow

Separate MIT-licensed fork of [OleLehmann/youtube-automation-agent](https://github.com/OleLehmann/youtube-automation-agent), pinned initially at `3ea1b524c0a729a7ebd49f3f64ad11fed626222a`.

**Staging only. Automatic publishing, scheduled jobs and paid provider calls are disabled by default.** The legacy automation launcher and publication methods are locked pending end-to-end validation. `npm start` opens a local status endpoint, not an autonomous production service.

## Start step by step

Use Node 22 or 24 LTS. The first stage needs no credentials.

```sh
npm ci --ignore-scripts
cp .env.example .env
npm test
npm run horror -- plan examples/horror-brief.json
npm start
```

The plan command makes no network calls. Review the prompt, prepare the production JSON with your existing Gemini session, and export it:

```sh
npm run horror -- export examples/horror-brief.json /path/to/approved-production.json production-output/episode-001
```

Create `production-output` first; each episode directory must be new. The exporter validates script length and full scene coverage, records a script digest, and writes `story.txt`, `prompts.md`, `metadata.json`, `production.json`, `manifest.json`, and `handoff.md`. It does not claim to have generated narration or video.

An optional Gemini REST text adapter is available with explicit project/model configuration and opt-in. No API calls were made during implementation. See [setup and integration guide](docs/HORROR_SETUP.md) before enabling it.

## Existing sources stay in the workflow

| Source | Implementation state |
|---|---|
| Gemini | Existing browser use retained; optional opt-in REST text adapter, mocked tests only |
| Female TTS | Full narration script and fixed female voice/locale handoff; existing provider voice must be confirmed |
| VirtualVault | Manual import/render handoff using existing login; no invented API or cookie export |
| Google Flow | Scene prompt handoff using existing login; no automatic generation or credit use |
| YouTube | Existing Studio retained; new read-only OAuth helper validates channel ID before saving; uploads locked |

The default long-form brief is original fiction, female British English, targeting 20–30 minutes with a proposed 05:00 Asia/Kolkata release after review. TRUE HORRORS OF AMERICA remains a separate sourced 20–30-second Short format with its own schedule. No release is scheduled by this software.

Read [setup, blockers and validation gates](docs/HORROR_SETUP.md). Historical upstream code remains for reference; its simulations, marketing claims, free-tier limits and costs are not verified production features of this fork.
