export type Language = "en" | "ru";

export interface Role {
  id: string;
  en: { name: string; purpose: string; skills: string; tips: string[]; drill: string };
  ru: { name: string; purpose: string; skills: string; tips: string[]; drill: string };
}

export interface Drill {
  id: string;
  title: string;
  roleTags: string[];
  skillTags: string[];
  duration: number;
  steps: string[];
  notes: string;
}

export const roles: Role[] = [
  { id: "gk", en: { name: "Goalkeeper", purpose: "Protects the goal and starts attacks with calm distribution.", skills: "Positioning, handling, footwork", tips: ["Set your feet before the shot.", "Talk early and clearly.", "Offer a safe pass after a save."], drill: "60 seconds of ready stance, side steps, and low catches." }, ru: { name: "Вратарь", purpose: "Защищает ворота и спокойно начинает атаки передачей.", skills: "Позиция, ловля, работа ног", tips: ["Ставь ноги до удара.", "Говори рано и чётко.", "После сейва ищи безопасный пас."], drill: "60 секунд стойки, приставных шагов и ловли низовых мячей." } },
  { id: "cb", en: { name: "Centre-back", purpose: "Keeps the defence compact, wins duels, and moves the ball forward.", skills: "Reading play, tackling, passing", tips: ["Scan over both shoulders.", "Stay goal-side of your mark.", "Pass through space, not just to feet."], drill: "90 seconds of shuffle, step, and pass through two gates." }, ru: { name: "Центральный защитник", purpose: "Держит оборону компактной, выигрывает единоборства и продвигает мяч.", skills: "Чтение игры, отбор, пас", tips: ["Проверяй оба плеча.", "Оставайся между соперником и воротами.", "Передавай в свободное пространство."], drill: "90 секунд приставных шагов и передач через две цели." } },
  { id: "fb", en: { name: "Full-back", purpose: "Defends the wide channel and supports attacks at the right moment.", skills: "1v1 defending, crossing, stamina", tips: ["Show the attacker away from goal.", "Check the runner before stepping out.", "Overlap only when cover is ready."], drill: "90 seconds of sprint, brake, and controlled cross." }, ru: { name: "Крайний защитник", purpose: "Защищает фланг и вовремя помогает атаке.", skills: "Защита 1 в 1, навес, выносливость", tips: ["Уводи соперника от ворот.", "Проверь рывок перед выходом.", "Подключайся, когда есть страховка."], drill: "90 секунд рывка, торможения и точного навеса." } },
  { id: "dm", en: { name: "Defensive midfielder", purpose: "Shields the defence and connects the first pass out.", skills: "Scanning, intercepting, tempo", tips: ["Scan before the ball arrives.", "Keep an angle behind the ball.", "Play the next pass early."], drill: "60 seconds of receive, scan, and two-touch passing." }, ru: { name: "Опорный полузащитник", purpose: "Страхует оборону и связывает первую передачу.", skills: "Сканирование, перехват, темп", tips: ["Осмотрись до получения мяча.", "Держи угол за мячом.", "Отдавай следующий пас быстро."], drill: "60 секунд приёма, осмотра и передач в два касания." } },
  { id: "cm", en: { name: "Central midfielder", purpose: "Controls rhythm, links teammates, and helps on both sides of the ball.", skills: "Passing, movement, awareness", tips: ["Move after every pass.", "Face forward when possible.", "Protect the middle after losing it."], drill: "90 seconds of pass-and-move around three cones." }, ru: { name: "Центральный полузащитник", purpose: "Управляет темпом, связывает партнёров и помогает в обеих фазах.", skills: "Пас, движение, обзор", tips: ["Двигайся после каждого паса.", "Разворачивайся вперёд, когда можешь.", "После потери закрывай центр."], drill: "90 секунд передач и движения вокруг трёх конусов." } },
  { id: "wing", en: { name: "Winger", purpose: "Stretches the defence, beats a marker, and creates chances from wide areas.", skills: "Speed, 1v1 skill, delivery", tips: ["Run behind when the defender looks at the ball.", "Change speed, not only direction.", "Check the box before crossing."], drill: "60 seconds of change-of-speed dribbles and a cutback." }, ru: { name: "Вингер", purpose: "Растягивает оборону, обыгрывает защитника и создаёт моменты с фланга.", skills: "Скорость, 1 в 1, передачи", tips: ["Убегай за спину, когда защитник смотрит на мяч.", "Меняй скорость, а не только направление.", "Проверь штрафную перед передачей."], drill: "60 секунд ведения со сменой скорости и прострела." } },
  { id: "am", en: { name: "Attacking midfielder", purpose: "Finds pockets between lines and turns possession into chances.", skills: "Turning, final pass, timing", tips: ["Arrive in space instead of waiting there.", "Scan the striker's run.", "Lose the ball? Press for three seconds."], drill: "90 seconds of receive between cones and slip pass." }, ru: { name: "Атакующий полузащитник", purpose: "Находит зоны между линиями и превращает владение в моменты.", skills: "Разворот, последний пас, тайминг", tips: ["Врывайся в пространство, а не стой в нём.", "Следи за рывком нападающего.", "Потерял мяч — прессингуй три секунды."], drill: "90 секунд приёма между конусами и разрезающего паса." } },
  { id: "st", en: { name: "Striker", purpose: "Threatens the goal, links play, and starts the first line of pressure.", skills: "Movement, finishing, pressing", tips: ["Separate from the defender before the pass.", "Finish across the goalkeeper when possible.", "Press toward a teammate's cover."], drill: "60 seconds of check-away, turn, and finish." }, ru: { name: "Нападающий", purpose: "Угрожает воротам, связывает игру и начинает первый прессинг.", skills: "Движение, завершение, прессинг", tips: ["Отделись от защитника до передачи.", "Бей в дальний угол, когда можешь.", "Направляй прессинг под страховку партнёра."], drill: "60 секунд ложного движения, разворота и удара." } },
];

export const drills: Drill[] = [
  { id: "scan-pass", title: "Scan and pass", roleTags: ["dm", "cm"], skillTags: ["passing", "awareness"], duration: 60, steps: ["Place two gates nearby.", "Look over both shoulders before receiving.", "Play through the open gate in two touches."], notes: "Check your next picture before the ball arrives." },
  { id: "wide-cross", title: "Sprint and cross", roleTags: ["fb", "wing"], skillTags: ["speed", "crossing"], duration: 90, steps: ["Sprint to a cone.", "Slow down under control.", "Play a low cross to a target."], notes: "Accuracy matters more than power." },
  { id: "defend-channel", title: "Defend the channel", roleTags: ["cb", "fb"], skillTags: ["defending", "1v1"], duration: 60, steps: ["Start side-on.", "Guide the attacker away from the middle.", "Touch the ball only when it is exposed."], notes: "Stay patient and protect the dangerous space." },
  { id: "keeper-ready", title: "Ready hands", roleTags: ["gk"], skillTags: ["handling", "footwork"], duration: 60, steps: ["Set your feet.", "Take two quick side steps.", "Catch a low ball and reset."], notes: "Balanced feet make the save simpler." },
  { id: "turn-between", title: "Turn between lines", roleTags: ["am", "cm"], skillTags: ["turning", "awareness"], duration: 90, steps: ["Check away from the cone.", "Check your shoulder.", "Receive on the back foot and turn."], notes: "Your first touch should face the next action." },
  { id: "finish-move", title: "Check and finish", roleTags: ["st"], skillTags: ["finishing", "movement"], duration: 60, steps: ["Step away from the marker.", "Change direction toward goal.", "Finish low and reset quickly."], notes: "Create separation before asking for the ball." },
];

export function roleText(role: Role, language: Language) { return role[language]; }
