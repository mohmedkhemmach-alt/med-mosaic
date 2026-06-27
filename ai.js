// ============================================
// MARINE ECO NEWS - AI Services
// Uses Groq API (OpenAI-compatible)
// ============================================
// npm install node-fetch
// ============================================

const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_KEY = 'YOUR_API_KEY_HERE';
const MODEL = 'llama-3.3-70b-versatile';

async function groqChat(messages, systemPrompt = null) {
  const msgs = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;
  const res = await fetch(GROQ_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({ model: MODEL, max_tokens: 1024, messages: msgs })
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// ===== 1. MARINE CHATBOT =====
async function marineChat(messages, lang = "ar") {
  const langInstruct = { ar: "أجب باللغة العربية", fr: "Répondez en français", en: "Answer in English" };
  const system = `أنت خبير في البيئة البحرية والمحيطات. ${langInstruct[lang]}
    أجب بدقة علمية مع أسلوب مفهوم للعموم. استخدم الرموز التعبيرية باعتدال.`;
  return await groqChat(messages, system);
}

// ===== 2. ARTICLE GENERATION =====
async function generateArticle(topic, lang = "ar") {
  const prompt = lang === "ar"
    ? `اكتب مقالاً صحفياً احترافياً عن: ${topic}. أجب بتنسيق JSON: { "title": "...", "excerpt": "...", "content": "...", "tag": "..." }`
    : `Write a professional article about: ${topic} (marine context). JSON: { "title": "...", "excerpt": "...", "content": "...", "tag": "..." }`;
  const text = await groqChat([{ role: 'user', content: prompt }]);
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return { title: topic, content: text, tag: "عام", excerpt: "" };
  }
}

// ===== 3. TRANSLATION =====
async function translateText(text, targetLang) {
  const langNames = { ar: "العربية", fr: "الفرنسية", en: "الإنجليزية" };
  return await groqChat([{
    role: 'user',
    content: `ترجم النص التالي إلى ${langNames[targetLang]}. أعد النص المترجم فقط بدون أي تعليقات:\n\n${text}`
  }]);
}

// ===== 4. NEWS MONITORING =====
async function generateNewsSummary(newsItems) {
  const newsText = newsItems.map((n, i) => `${i+1}. ${n}`).join("\n");
  const text = await groqChat([{
    role: 'user',
    content: `لخص هذه الأخبار البحرية وحدد الأكثر أهمية:\n\n${newsText}\n\nأجب بـ JSON: { "topStory": "...", "summary": "...", "breakingAlert": null, "categories": {} }`
  }]);
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return { topStory: newsItems[0], summary: text, breakingAlert: null, categories: {} };
  }
}

// ===== 5. COMMENT MODERATION =====
async function moderateComment(comment) {
  const text = await groqChat([{
    role: 'user',
    content: `هل هذا التعليق مناسب للنشر على موقع بيئي عائلي؟\n\n"${comment}"\n\nأجب بـ JSON فقط: { "approved": true/false, "reason": "السبب إن رفض" }`
  }]);
  try {
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    return { approved: true, reason: null };
  }
}

// ===== EXPORT =====
module.exports = { marineChat, generateArticle, translateText, generateNewsSummary, moderateComment };

// ===== DEMO =====
if (require.main === module) {
  (async () => {
    console.log("Testing Groq AI Services...");
    const chatReply = await marineChat([{ role: "user", content: "ما هي الشعاب المرجانية؟" }]);
    console.log("Bot:", chatReply.slice(0, 150) + "...");
    console.log("Groq AI Services working!");
  })().catch(console.error);
}
