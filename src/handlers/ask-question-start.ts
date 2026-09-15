import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { addQA, getUser, timestamp } from "../data.js";
import { inlineButton, inlineKeyboard, registerMainMenuItem } from "../toolkit/index.js";

registerMainMenuItem({ label: "💬 Ask", data: "ask_question:start", order: 30 });
const composer = new Composer<Ctx>();
const forceReply = (placeholder: string) => ({ force_reply: true as const, input_field_placeholder: placeholder });

function language(ctx: Ctx) { return ctx.session.language ?? "en"; }
function answerFor(question: string, l: "en" | "ru") {
  const q = question.toLowerCase();
  if (/pass|передач|пас/.test(q)) return l === "ru" ? "Открой корпус до получения, проверь плечо и отдай мяч в свободное пространство. После паса сразу сместися, чтобы снова стать вариантом." : "Open your body before receiving, scan over your shoulder, and pass into space. Move again straight after the pass so you stay useful.";
  if (/defend|защит|оборон|tackle|отбор/.test(q)) return l === "ru" ? "Сначала закрой опасное пространство, затем замедлись и веди соперника в сторону. Отбирай мяч, когда он отдалился от ноги." : "Protect the dangerous space first, then slow down and guide the attacker wide. Tackle when the ball moves away from their foot.";
  if (/shoot|finish|удар|заверш/.test(q)) return l === "ru" ? "Перед ударом создай себе полшага: ложное движение, взгляд и рывок. Бей спокойно в дальний угол, если он открыт." : "Create half a step before you shoot with a check-away and a change of speed. Stay calm and finish across the goalkeeper when that corner is open.";
  return l === "ru" ? "Начни с простого: осмотрись до получения мяча, выбери следующий вариант и действуй с хорошим темпом. Повтори это в коротком упражнении, а затем добавь давление." : "Start simple: scan before the ball arrives, choose your next option, and act at a good tempo. Repeat it in a short drill, then add pressure.";
}
function medicalOrLegal(q: string) { return /medical|injur|pain|боль|травм|legal|law|юрид|право/.test(q.toLowerCase()); }

async function finish(ctx: Ctx, question: string, clarification?: string) {
  const l = language(ctx); const answer = medicalOrLegal(question) ? (l === "ru" ? "Я не могу давать медицинские или юридические советы. Обратись к квалифицированному специалисту — так будет безопаснее." : "I can’t give medical or legal advice. A qualified professional can guide you safely.") : answerFor(question, l);
  const id = `q-${ctx.from?.id ?? 0}-${timestamp()}`; const user = await getUser(ctx.from?.id ?? 0, ctx.from?.first_name ?? "Player", l);
  await addQA(user, { id, question, answer, at: timestamp(), clarification });
  ctx.session.step = "idle"; ctx.session.pendingQuestion = undefined; ctx.session.pendingQuestionId = id; ctx.session.currentAnswer = { id, title: question.slice(0, 40), snippet: answer };
  await ctx.reply(answer, { reply_markup: inlineKeyboard([[inlineButton(l === "ru" ? "⭐ Сохранить ответ" : "⭐ Save answer", `save:answer:${id}`), inlineButton(l === "ru" ? "🚩 Пожаловаться" : "🚩 Flag", `flag:${id}`)], [inlineButton(l === "ru" ? "Задать ещё" : "Ask another", "ask_question:start"), inlineButton(l === "ru" ? "В меню" : "Menu", "menu:main")]]) });
}

composer.callbackQuery("ask_question:start", async (ctx) => { await ctx.answerCallbackQuery(); ctx.session.step = "awaiting_question"; await ctx.reply(language(ctx) === "ru" ? "Напиши вопрос одним сообщением — разберёмся вместе." : "Send your question in one message and we’ll work through it together.", { reply_markup: forceReply(language(ctx) === "ru" ? "Например: как лучше открываться?" : "For example: how should I get open?") }); });

composer.on("message:text", async (ctx, next) => {
  if (ctx.session.step !== "awaiting_question" && ctx.session.step !== "awaiting_clarification") return next();
  const text = ctx.message.text.trim().replace(/[<>]/g, "").slice(0, 600); const l = language(ctx);
  if (!text) { await ctx.reply(l === "ru" ? "Напиши вопрос словами, и я помогу." : "Write a few words so I can help.", { reply_markup: forceReply(l === "ru" ? "Твой вопрос" : "Your question") }); return; }
  if (ctx.session.step === "awaiting_clarification") { await finish(ctx, `${ctx.session.pendingQuestion ?? ""} ${text}`, text); return; }
  if (text.length < 15 || /how do i improve|что делать$|как играть$/.test(text.toLowerCase())) {
    ctx.session.pendingQuestion = text; ctx.session.step = "awaiting_clarification";
    await ctx.reply(l === "ru" ? "Уточни, пожалуйста: о какой позиции или навыке ты спрашиваешь?" : "One quick clarification: which position or skill are you asking about?", { reply_markup: forceReply(l === "ru" ? "Позиция или навык" : "Position or skill") }); return;
  }
  await finish(ctx, text);
});

export default composer;
