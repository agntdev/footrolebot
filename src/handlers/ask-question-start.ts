import { Composer } from "grammy";

// SCAFFOLD — generated from the bot blueprint BEFORE the agent runs.
// Keep a LIVE registration (.command / .callbackQuery / …) so this feature is
// never an empty stub. Replace the reply body with real logic + copy; if you
// change the user-facing text, update tests/specs to match EXACTLY.
// Do NOT rewrite src/bot.ts — buildBot() already auto-loads this module.
// Menu: wire this into /start via registerMainMenuItem({ label: "Ask a question", data: "ask_question:start" }) if the toolkit exposes it.

const composer = new Composer();

composer.callbackQuery("ask_question:start", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply("Begin a free-text question flow. Bot uses ForceReply to capture the user's question.");
});

export default composer;
