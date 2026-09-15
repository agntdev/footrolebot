# FootRoleBot — Bot specification

**Archetype:** education

**Voice:** warm and encouraging — write every user-facing message, button label, error, and empty state in this voice.

A Telegram bot that gives concise, practical explanations of football (soccer) roles, short role-specific drills, and answers player/coaching questions in simple language. Users can browse seeded roles and drills, ask free-text questions (with one clarifying question when needed), save favorites (up to 100), and send feedback to the owner/admin.

> This is the complete contract for the bot. Implement EVERY entry point, flow, feature, integration, and edge case below. The completeness review checks the bot against this document after each build pass.

## Primary audience

- amateur footballers
- semi-pro players
- youth players
- coaches
- curious fans seeking role/tactic clarity

## Success criteria

- Users receive a concise role explanation (position purpose, 3 tips, 1 short drill) when tapping a role
- Free-text question returns a short, plain-language answer or one clarifying question before answering
- Saved items persist and appear in 'My saved items' (per-user limit 100)
- Admin receives feedback and flagged questions in ADMIN_CHAT_ID reliably
- Per-user Q&A history is stored and capped at last 20 entries

## Entry points

Every feature must be reachable from the bot's command/button surface (button-first; only /start and /help are slash commands).

- **/start** (command, actor: user, command: /start) — Open main menu and set language context
- **Ask a question** (button, actor: user, callback: ask_question:start) — Begin a free-text question flow. Bot uses ForceReply to capture the user's question.
  - inputs: free-text question
  - outputs: short answer or clarifying question
- **Browse roles** (button, actor: user, callback: roles:list) — Show seeded list of ~8 common positions as inline keyboard; tap a role to view explanation.
  - outputs: role card (purpose, skills, 3 tips, 1 drill)
- **Drills** (button, actor: user, callback: drills:browse) — Browse short drills (30–120s) by role or skill using inline filters and pagination.
  - inputs: role or skill selection (button)
  - outputs: drill list, drill card
- **My saved items** (button, actor: user, callback: saved:list) — Open the user's saved explanations and drills; allow removal or export of a single item.
  - outputs: list of saved items (max 100), item actions
- **Feedback** (button, actor: user, callback: feedback:start) — Send a short message to the owner/admin (delivered to ADMIN_CHAT_ID).
  - inputs: free-text feedback
  - outputs: admin notification confirmation

## Flows

### Start / Main Menu
_Trigger:_ /start

1. Detect user language from /start message (default RU, fallback EN)
2. Create or load user profile
3. Present main menu with buttons: Ask a question, Browse roles, Drills, My saved items, Feedback

_Data touched:_ UserProfile

### Browse Roles
_Trigger:_ callback roles:list

1. Show inline keyboard with seeded role names (8 roles)
2. User taps a role -> fetch role content
3. Display role card: brief purpose, key skills, 3 tips, 1 short drill
4. Offer inline actions: Save, Back to roles, Ask related question

_Data touched:_ Role, SavedItem, QA History

### Ask Free-text Question
_Trigger:_ callback ask_question:start or ForceReply response

1. Bot prompts user to type their question (ForceReply)
2. User submits free-text question
3. Perform language detection and sanitize input
4. If question is ambiguous -> ask one clarifying question (button or ForceReply)
5. After clarification or if clear -> return concise answer (≤3 short paragraphs)
6. Store question+answer in QA history (cap to last 20)
7. Offer Save and Flag buttons; if flagged, notify admin

_Data touched:_ PlayerQuestion, QA History, SavedItem, Feedback

### Drills Browsing
_Trigger:_ callback drills:browse

1. Present filter buttons: by role, by skill
2. User selects filter -> show paginated list of drill cards (30–120s)
3. Tap drill -> show drill details, quick coaching notes
4. Offer inline actions: Save, Back, Ask about drill

_Data touched:_ Drill, SavedItem

### Save Item
_Trigger:_ callback Save

1. Check user's saved count (limit 100)
2. If under limit: persist SavedItem linked to user, confirm to user
3. If at limit: inform user and offer remove-old or replace options
4. Reflect saved item in My saved items list

_Data touched:_ SavedItem, UserProfile

### My Saved Items
_Trigger:_ callback saved:list

1. Fetch user's saved items, paginate if needed
2. Show item summary with actions: View, Remove, Export single
3. Removal updates persistent storage and confirms to user

_Data touched:_ SavedItem, UserProfile

### Feedback / Flagging
_Trigger:_ callback feedback:start or callback Flag

1. Prompt user for short feedback (ForceReply)
2. Send feedback payload to ADMIN_CHAT_ID with user id, language, and timestamp
3. Confirm receipt to user
4. Store feedback for owner review (retention policy applies)

_Data touched:_ Feedback, UserProfile

## Owner-supplied settings

The OWNER provides these; they are collected in chat and injected into the environment at deploy. Read each one from the environment where it is used (`ctx.env.<KEY>` / `env.<KEY>` on Cloudflare Workers; `process.env.<KEY>` only as a Node/harness fallback — never the sole read). Do NOT invent your own way of learning the value, do NOT ask for it in a bot message, and do NOT hardcode a default.

- **ADMIN_CHAT_ID** — Where feedback and flagged questions are sent (owner/admin Telegram chat id)
  - this is the OWNER's own chat id; the platform already knows it. Read `ADMIN_CHAT_ID` via `ctx.env` (prefer toolkit `adminChatId` / `requireOwner`) — never ask a user, never treat whoever writes first as the admin, never invent claim-admin or open manage for everyone.
  - may be UNSET at runtime: the bot must still start, and the feature needing ADMIN_CHAT_ID must say so plainly instead of failing.

Your behavioral specs run WITHOUT these values, so no spec may depend on one.

## Data entities

Durable data (must survive a restart) uses the toolkit's persistent store, never in-memory maps.

An entity that merely NAMES an owner-supplied setting above (an admin chat, an API account) is not something to store or discover — read it from the environment.

- **UserProfile** _(retention: persistent)_ — Minimal per-user record to map saves, language preference, and timestamps
  - fields: user_id (telegram id), display_name, language_hint, created_at, last_active_at
- **PlayerQuestion** _(retention: persistent)_ — A single free-text question submitted by a user
  - fields: question_id, user_id, text, language, timestamp, clarified_by, flagged
- **QA History** _(retention: persistent)_ — Stored Q&A pairs for context; capped at last 20 per user
  - fields: question_id, answer_text, answer_timestamp, clarification_text (optional)
- **Role** _(retention: persistent)_ — Seeded content for common positions and role cards
  - fields: role_id, name, purpose, key_skills, three_tips, short_drill_snippet, language
- **Drill** _(retention: persistent)_ — Short practice exercise entries (30–120s) with coaching notes
  - fields: drill_id, title, role_tags, skill_tags, duration_seconds, steps, coaching_notes, language
- **SavedItem** _(retention: persistent)_ — User-saved explanations or drills (max 100 per user)
  - fields: saved_id, user_id, item_type (role/drill/answer), source_id, title, snippet, created_at
- **Feedback** _(retention: persistent)_ — User feedback or flagged question sent to admin
  - fields: feedback_id, user_id, text, timestamp, related_question_id (optional)

## Integrations

- **Telegram** (required) — Bot API messaging, inline keyboards, callbacks, ForceReply and admin notifications
Call external APIs against their real contract (correct endpoints, ids, params); credentials from env. Do not fake responses.

## Owner controls

- Edit seeded roles and drills content (per-language)
- Set or update ADMIN_CHAT_ID (owner admin target)
- View/mark resolved flagged questions and feedback
- Export per-user saved items (CSV) and delete a user's data on request
- Set language fallback and translations policy
- Adjust saved item cap (owner-settable, default 100)

## Notifications

- User: confirmation when an item is saved or removed
- User: confirmation when feedback is delivered
- Admin: immediate notification for feedback and flagged questions with user id, language, and timestamp
- User: error messages if save limit reached or on system errors

## Permissions & privacy

- We store only minimal user data: Telegram user id, display name, language hint, saved items and the last 20 Q&A pairs
- No PII beyond Telegram profile data is requested or stored
- Saved items are private to the user; feedback/flags are sent to ADMIN_CHAT_ID and retained for owner review
- If a user requests deletion, owner can export and delete that user's data via owner controls
- Bot returns a medical/legal disclaimer for requests that ask for clinical or legal advice and will not provide specialized guidance

## Edge cases

- Ambiguous question: bot asks a single clarifying question before answering
- Unsupported language: attempt to detect language; if unsupported, reply in English and note fallback
- Save limit reached: inform user and offer remove or replace option
- Duplicate save attempt: inform user item already saved
- ADMIN_CHAT_ID missing or invalid: queue admin notifications and alert owner at next privileged access; inform user feedback delivery failed
- Storage failures: surface a friendly error and retry path; avoid data loss (idempotent save attempts)
- User submits medical or legal question: return a disclaimer and recommend a professional; optionally notify admin if flagged

## Required tests

- Dialog-level acceptance test: /start -> main menu appears in the correct language
- Role browse test: tapping each of the 8 seeded roles returns a complete role card
- Ask question test: submit clear question -> concise answer returned and saved to QA history
- Clarifying question test: submit ambiguous question -> bot asks one clarification then answers
- Save item test: save a role/drill/answer -> appears in 'My saved items' and persists
- Saved items limit test: reach 100 saves -> user receives informative error and cannot exceed limit
- Feedback delivery test: send feedback -> message arrives at ADMIN_CHAT_ID with metadata
- QA history cap test: create 25 Q&A items -> only last 20 retained
- Language fallback test: start in Russian and English; ensure replies match detected language, fallback to English
- Failure modes test: admin id missing, storage error and duplicate save handling produce safe, user-friendly messages

## Assumptions

- Content for the 8 seeded roles and drills is owner-provided or curated and stored in the bot; not generated by external AI unless owner specifies
- Default bot name is FootRoleBot; platform will set bot username separately
- No payments or external analytics are required
- Answers are short and non-medical; if medical/legal topics arise the bot returns a disclaimer
- Language detection chooses Russian by default when user starts in Russian; otherwise English fallback
