import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { getUser } from "../data.js";
import { mainMenuKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();
const welcome = {
  en: "👋 Welcome! Tap a button below to get started.",
  ru: "👋 Добро пожаловать в FootRoleBot! Выбери тему и развивай свою игру.",
};

composer.command("start", async (ctx) => {
  const language = (ctx.from?.language_code ?? "en").toLowerCase().startsWith("ru") ? "ru" : "en";
  ctx.session.language = language;
  ctx.session.step = "idle";
  if (ctx.from) await getUser(ctx.from.id, ctx.from.first_name ?? "Player", language);
  await ctx.reply(welcome[language], { reply_markup: mainMenuKeyboard() });
});

composer.callbackQuery("menu:main", async (ctx) => {
  await ctx.answerCallbackQuery();
  const language = ctx.session.language ?? "ru";
  await ctx.editMessageText(welcome[language], { reply_markup: mainMenuKeyboard() });
});

export default composer;
