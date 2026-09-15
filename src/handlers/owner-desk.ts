import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { adminChatId, inlineButton, inlineKeyboard, requireOwner } from "../toolkit/index.js";
import { getUser } from "../data.js";

const composer = new Composer<Ctx>();
composer.callbackQuery("owner:desk", async (ctx) => {
  await ctx.answerCallbackQuery();
  if (!(await requireOwner(ctx as never))) return;
  const target = adminChatId(ctx as unknown as { env?: Record<string, unknown> });
  await ctx.reply(target ? "Owner desk is ready. Feedback is delivered to this chat and kept for review." : "Owner access isn't set up yet.", { reply_markup: inlineKeyboard([[inlineButton("View my saved items", "saved:list")]]) });
});
composer.callbackQuery(/^owner:profile:(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  if (!(await requireOwner(ctx as never))) return;
  const user = await getUser(Number(ctx.match[1]));
  await ctx.reply(`Saved: ${user.saved.length}\nQuestions kept: ${user.qa.length}\nFeedback entries: ${user.feedback.length}`);
});
export default composer;
