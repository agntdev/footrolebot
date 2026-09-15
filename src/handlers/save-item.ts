import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { drills, roles, roleText } from "../content.js";
import { getUser, saveUser, timestamp } from "../data.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();
function lang(ctx: Ctx) { return ctx.session.language ?? "ru"; }
composer.callbackQuery(/^save:(role|drill|answer):(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery(); const type = ctx.match[1] as "role" | "drill" | "answer"; const sourceId = ctx.match[2]; const l = lang(ctx); const user = await getUser(ctx.from?.id ?? 0, ctx.from?.first_name ?? "Player", l);
  let title = "Answer"; let snippet = ctx.session.currentAnswer?.snippet ?? "";
  if (type === "role") { const item = roles.find((r) => r.id === sourceId); if (item) { title = roleText(item, l).name; snippet = roleText(item, l).purpose; } }
  if (type === "drill") { const item = drills.find((d) => d.id === sourceId); if (item) { title = item.title; snippet = item.notes; } }
  const existing = user.saved.find((item) => item.type === type && item.sourceId === sourceId);
  if (existing) { await ctx.reply(l === "ru" ? "Этот материал уже сохранён." : "That item is already saved."); return; }
  if (user.saved.length >= 100) { await ctx.reply(l === "ru" ? "Сохранено уже 100 материалов. Удали один старый, чтобы добавить новый." : "You already have 100 saved items. Remove one before adding another.", { reply_markup: inlineKeyboard([[inlineButton(l === "ru" ? "Мои сохранённые" : "My saved items", "saved:list")]]) }); return; }
  user.saved.push({ id: `s-${user.userId}-${type}-${sourceId}`, type, sourceId, title, snippet, createdAt: timestamp() }); await saveUser(user);
  await ctx.reply(l === "ru" ? `Сохранено: ${title}.` : `Saved: ${title}.`, { reply_markup: inlineKeyboard([[inlineButton(l === "ru" ? "Мои сохранённые" : "My saved items", "saved:list")]]) });
});
export default composer;
