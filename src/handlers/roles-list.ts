import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { roles, roleText } from "../content.js";
import { inlineButton, inlineKeyboard, registerMainMenuItem } from "../toolkit/index.js";

registerMainMenuItem({ label: "⚽ Roles", data: "roles:list", order: 10 });
const composer = new Composer<Ctx>();
const back = (label: string) => inlineKeyboard([[inlineButton(label, "menu:main")]]);

function rolesKeyboard(language: "en" | "ru") {
  return inlineKeyboard([...roles.map((r) => [inlineButton(roleText(r, language).name, `role:${r.id}`)]), [inlineButton(language === "ru" ? "⬅️ Назад" : "⬅️ Back", "menu:main")]]);
}

composer.callbackQuery("roles:list", async (ctx) => {
  await ctx.answerCallbackQuery();
  const language = ctx.session.language ?? "en";
  await ctx.editMessageText(language === "ru" ? "Выбери позицию — разберём её просто и по делу." : "Pick a position and we’ll break it down simply.", { reply_markup: rolesKeyboard(language) });
});

composer.callbackQuery(/^role:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const role = roles.find((item) => item.id === ctx.match[1]);
  if (!role) { await ctx.reply("I couldn't find that role. Tap Roles and try again.", { reply_markup: back("⬅️ Back") }); return; }
  const language = ctx.session.language ?? "en";
  const text = roleText(role, language);
  ctx.session.currentItem = { type: "role", id: role.id };
  await ctx.editMessageText(`${text.name}\n\n${text.purpose}\n\nKey skills: ${text.skills}\n\nThree tips:\n• ${text.tips.join("\n• ")}\n\nQuick drill: ${text.drill}`, { reply_markup: inlineKeyboard([[inlineButton(language === "ru" ? "⭐ Сохранить" : "⭐ Save", `save:role:${role.id}`)], [inlineButton(language === "ru" ? "⬅️ К позициям" : "⬅️ Roles", "roles:list"), inlineButton(language === "ru" ? "Задать вопрос" : "Ask a question", "ask_question:start")]]) });
});

export default composer;
