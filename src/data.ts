import { resolveSessionStorage } from "./toolkit/index.js";
import type { Language } from "./content.js";

export interface SavedItem { id: string; type: "role" | "drill" | "answer"; sourceId: string; title: string; snippet: string; createdAt: string; }
export interface QAEntry { id: string; question: string; answer: string; at: string; clarification?: string; }
export interface FeedbackEntry { id: string; text: string; at: string; relatedQuestionId?: string; sent: boolean; }
export interface UserData { userId: number; displayName: string; language: Language; createdAt: string; lastActiveAt: string; saved: SavedItem[]; qa: QAEntry[]; feedback: FeedbackEntry[]; }

interface RecordValue { data: UserData }
const store = resolveSessionStorage<RecordValue>(undefined);
let clock: () => Date = () => new Date();
export const now = () => clock();
export function setClock(next: () => Date) { clock = next; }
export function timestamp() { return now().toISOString(); }

function key(userId: number) { return `footrole:user:${userId}`; }
export async function getUser(userId: number, displayName = "Player", language: Language = "en"): Promise<UserData> {
  const found = await store.read(key(userId));
  const at = timestamp();
  if (found?.data) {
    found.data.lastActiveAt = at;
    if (displayName) found.data.displayName = displayName;
    found.data.language = language;
    await store.write(key(userId), found);
    return found.data;
  }
  const data: UserData = { userId, displayName, language, createdAt: at, lastActiveAt: at, saved: [], qa: [], feedback: [] };
  await store.write(key(userId), { data });
  return data;
}
export async function saveUser(data: UserData) { await store.write(key(data.userId), { data }); }
export async function addQA(data: UserData, entry: QAEntry) { data.qa = [...data.qa, entry].slice(-20); await saveUser(data); }
export async function addFeedback(data: UserData, entry: FeedbackEntry) { data.feedback = [...data.feedback, entry].slice(-100); await saveUser(data); }
