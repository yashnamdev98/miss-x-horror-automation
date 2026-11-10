# Validation record — November 9, 2026

- Source: OleLehmann/youtube-automation-agent, master commit 3ea1b524c0a729a7ebd49f3f64ad11fed626222a.
- Environment: Node v24.21.0, npm 11.19.0, macOS.
- Installation: npm ci --ignore-scripts passed. Native SQLite integration is not tested.
- npm test: 11 tests passed, zero failed. No live generation or upload calls.
- Dependency remediation: npm audit fix --ignore-scripts applied compatible lockfile updates. Audit reduced from 36 findings (2 critical) to 15: 2 low, 8 moderate, 4 high, 1 critical. Remaining critical tar chain is inherited via SQLite/node-gyp. Jimp, googleapis and node-cron also have findings. Major upgrades need separate compatibility work; production deployment remains blocked.
- Fork creation verified in Chrome as public fork under user-selected yashnamdev98.
- Connector code-write attempt initially rejected with HTTP 403 Resource not accessible by integration; repository read succeeded. After explicit user approval, installed the official ChatGPT Codex Connector for this repository only; list_installed_accounts and branch creation then succeeded. No tokens/keys were requested in chat or copied from browser sessions.
- Browser inventory showed existing VirtualVault, Flow and YouTube Studio tabs. VirtualVault builder was readable with 83 credits; no credits used. This is not API authentication or completed media proof.
- No Gemini free-tier project/model, female voice ID, Desktop OAuth client, API token, actual audio/render, private upload, public video or booked release is verified by this implementation.

## Follow-up setup and dependency remediation

- Upgraded sqlite3 to 6.0.1, googleapis to 189.0.0, node-cron to 4.6.0; removed unused jimp and added the previously missing sharp dependency at 0.35.5.
- Node requirement is now >=22, matching the upgraded Google client. Registry native build scripts approved only for sqlite3@6.0.1 and sharp@0.35.5.
- npm audit: 0 vulnerabilities. npm test: 14 passed, 0 failed, including real SQLite in-memory write/read, SVG-to-PNG rendering and Google PKCE compatibility.
- Live AI Studio inspection: existing project gen-lang-client-0367044484 is Tier 1 (paid), so no Gemini API requests were made and no free-tier assertion was enabled. Billing page showed zero credit balance and a payment-profile issue; no purchase, payment or billing change was performed.
- Existing Cloud project has no OAuth clients and its Google Auth Platform was not configured. Prepared testing-mode branding; accepting the User Data Policy and creating new account-access credentials require specific browser confirmation.
- User specifically approved Google User Data Policy acceptance, Desktop client creation and read-only YouTube authorization. Testing-mode consent configuration and the MISS X HORROR Local Read-only Desktop client were created. Secure client JSON save and token consent are pending because Chrome switched to an unrelated Zoho save dialog; no unrelated file was saved or overwritten.

## Live connection verification

- YouTube Data API v3 enabled after specific approval of its terms. Owner account saved as the sole OAuth test user; app remains in Testing.
- Desktop JSON downloaded directly to ignored config/oauth-client.json with mode 0600. Local config/tokens.json saved with mode 0600, containing only youtube.readonly authorization.
- Actual channels.list(mine=true) readback returned MISS X HORROR, channel UCA9ucFsWqyjqmJy4BI_aYDw. No upload/manage scope was requested.
- Added safe OAuth failure diagnostics: stage and sanitized status/code only; returned channel names/IDs on mismatch, never provider error bodies or tokens. A retry succeeded after API enablement.
- VirtualVault imported the original 46-word fictional test script into four scenes using 3 existing monthly credits (83 to 80), with included VV Exclusive female Luna narration. No credits purchased and no paid API enabled. Media/render/private upload validation still in progress.

## Actual MP4 verification — November 10, 2026

- Render short_1794209192488_iuia86 completed in VirtualVault; all 4 visuals, voiceovers and caption sets were ready. Monthly balance remained 80 after render (total use: 3 credits).
- Downloaded via the authenticated browser. File: the-last-ticket-test.mp4, 1,719,857 bytes. Actual container duration 15.57 seconds, H.264 720x1280 yuv420p at 30 fps, square pixels, AAC 48 kHz stereo.
- Full FFmpeg audio/video decode succeeded (exit 0). Measured integrated loudness -20.3 LUFS and true peak -7.0 dBFS. Representative decoded frames inspected across the clip.
- Offline tiny.en Whisper transcription recovered all four script sentences including the final words. This supports completeness but does not substitute for human listening on headphones/speakers.
- Release QA issue: captions in the exported file are too small; actual duration is below the 20–30-second series target. Do not publish this as a finished episode or unlock automatic publishing based on this technical test. No post-render speed stretching or padding was used.
- YouTube Studio dashboard for MISS X HORROR is accessible; private upload awaits the final upload-dialog terms acknowledgement.
