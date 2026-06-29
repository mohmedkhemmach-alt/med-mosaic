// ============================================
// MARINE ECO NEWS - Backend API (Node.js/Express)
// ============================================
// Install: npm install express cors bcryptjs jsonwebtoken
// Run: node server.js
// ============================================

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = "marine-eco-secret-2025";

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ===== MySQL CONNECTION =====
const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 5,
  charset: 'UTF8MB4_UNICODE_CI'
}).promise();

// ===== INIT DATABASE TABLES =====
async function initDB() {
  const conn = await pool.getConnection();
  try {
    await conn.execute(`CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('admin','editor','user') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await conn.execute(`CREATE TABLE IF NOT EXISTS articles (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(300) NOT NULL,
      title_fr VARCHAR(300),
      title_en VARCHAR(300),
      content LONGTEXT NOT NULL,
      excerpt VARCHAR(500),
      cover_image VARCHAR(500),
      tag VARCHAR(100),
      emoji VARCHAR(10) DEFAULT NULL,
      author VARCHAR(100),
      author_id INT,
      status ENUM('draft','pending','published','archived') DEFAULT 'draft',
      views INT DEFAULT 0,
      published_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // إضافة الأعمدة الجديدة بأمان — كل عمود في try/catch منفصل
    const addCol = async (sql) => { try { await conn.execute(sql); } catch(e) { /* already exists */ } };
    await addCol("ALTER TABLE articles ADD COLUMN title_fr VARCHAR(300)");
    await addCol("ALTER TABLE articles ADD COLUMN title_en VARCHAR(300)");
    await addCol("ALTER TABLE articles ADD COLUMN excerpt VARCHAR(500)");
    await addCol("ALTER TABLE articles ADD COLUMN cover_image VARCHAR(500)");
    await addCol("ALTER TABLE articles ADD COLUMN published_at TIMESTAMP NULL");

    await conn.execute(`CREATE TABLE IF NOT EXISTS comments (
      id INT PRIMARY KEY AUTO_INCREMENT,
      text TEXT NOT NULL,
      article_id INT NOT NULL,
      user_id INT,
      user_name VARCHAR(100),
      status ENUM('pending','approved','rejected') DEFAULT 'pending',
      likes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await conn.execute(`CREATE TABLE IF NOT EXISTS settings (
      \`key\` VARCHAR(100) PRIMARY KEY,
      \`value\` TEXT
    )`);

    // إضافة مستخدمين افتراضيين إذا لم يوجدوا
    const [users] = await conn.execute("SELECT COUNT(*) as cnt FROM users");
    if (users[0].cnt === 0) {
      await conn.execute(
        "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?), (?, ?, ?, ?)",
        [
          "Admin", "admin@marine-eco.ma", bcrypt.hashSync("Marine@2025!", 10), "admin",
          "Mohammed Alami", "m.alami@email.ma", bcrypt.hashSync("user123", 10), "user"
        ]
      );
    }

    // إضافة مقالات افتراضية إذا لم توجد
    const [arts] = await conn.execute("SELECT COUNT(*) as cnt FROM articles");
    if (arts[0].cnt === 0) {
      await conn.execute(
        `INSERT INTO articles (title, content, excerpt, tag, emoji, author, author_id, status, views, published_at) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()), (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()), (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          "اكتشاف 12 نوعاً جديداً من الأسماك في المحيط الهندي",
          "<p>في اكتشاف علمي مثير، تمكّن فريق دولي من العلماء من رصد وتوثيق <strong>12 نوعاً جديداً من الأسماك</strong> في أعماق المحيط الهندي.</p>",
          "فريق دولي يوثّق أنواعاً جديدة في أعماق المحيط الهندي تتجاوز 3000 متر.",
          "بحث علمي", "🐠", "د. سارة بنعلي", 1, "published", 2140,

          "تلوث البلاستيك يهدد المتوسط: 8 ملايين طن سنوياً",
          "<p>تكشف أحدث الدراسات أن <strong>8 ملايين طن</strong> من البلاستيك تصل إلى المحيطات كل عام، مما يهدد النظام البيئي البحري.</p>",
          "أحدث الدراسات تكشف أرقاماً مقلقة عن حجم التلوث البلاستيكي في البحر المتوسط.",
          "تلوث", "🏭", "فريق التحرير", 1, "published", 3850,

          "ارتفاع حرارة المحيطات يُنذر بكارثة مرجانية",
          "<p>يُحذّر العلماء من أن ارتفاع درجة حرارة المحيطات بمعدل <strong>2.1 درجة مئوية</strong> خلال العقد الماضي يُهدد الشعاب المرجانية بالانقراض.</p>",
          "العلماء يُحذّرون من تأثير ارتفاع حرارة المحيطات على الشعاب المرجانية.",
          "تغير مناخي", "🌡️", "أحمد الحسيني", 1, "published", 1920
        ]
      );
    }

    console.log("✅ Database initialized");
  } finally {
    conn.release();
  }
}

// ===== IN-MEMORY SETTINGS (fallback) =====
let DB = {
  settings: {
    siteName: "البيئة البحرية",
    breakingNews: "🔴 ارتفاع درجة حرارة المحيطات بنسبة 2.1 درجة خلال العقد الماضي",
    maintenanceMode: false
  }
};

// ===== MIDDLEWARE =====
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "غير مصرح" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "رمز غير صالح" });
  }
}

function adminMiddleware(req, res, next) {
  if (req.user?.role !== "admin") return res.status(403).json({ error: "ليس لديك صلاحية" });
  next();
}

// ===== AUTH ROUTES =====
// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const [exists] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length > 0) return res.status(400).json({ error: "البريد الإلكتروني مستخدم بالفعل" });
    const hash = bcrypt.hashSync(password, 10);
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')",
      [name, email, hash]
    );
    const token = jwt.sign({ id: result.insertId, email, role: "user" }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: result.insertId, name, email, role: "user" } });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET /api/auth/me
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT id, name, email, role FROM users WHERE id = ?", [req.user.id]);
    if (!rows[0]) return res.status(404).json({ error: "المستخدم غير موجود" });
    res.json(rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ===== ARTICLES ROUTES =====
// GET /api/articles
app.get("/api/articles", async (req, res) => {
  const { tag, search, page = 1, limit = 10, status = 'published' } = req.query;
  const limitInt  = Math.max(1, parseInt(limit)  || 10);
  const pageInt   = Math.max(1, parseInt(page)   || 1);
  const offsetInt = (pageInt - 1) * limitInt;
  try {
    // بناء query الـ COUNT
    let countQuery = "SELECT COUNT(*) as total FROM articles WHERE status = ?";
    const countParams = [status];
    if (tag)    { countQuery += " AND tag = ?";                           countParams.push(tag); }
    if (search) { countQuery += " AND (title LIKE ? OR content LIKE ?)"; countParams.push(`%${search}%`, `%${search}%`); }

    // بناء query البيانات — LIMIT/OFFSET مضمّنة كأرقام مباشرة (لا prepared params)
    let dataQuery = "SELECT id, title, excerpt, cover_image, tag, emoji, author, status, views, published_at, created_at FROM articles WHERE status = ?";
    const dataParams = [status];
    if (tag)    { dataQuery += " AND tag = ?";                           dataParams.push(tag); }
    if (search) { dataQuery += " AND (title LIKE ? OR content LIKE ?)"; dataParams.push(`%${search}%`, `%${search}%`); }
    dataQuery += ` ORDER BY COALESCE(published_at, created_at) DESC LIMIT ${limitInt} OFFSET ${offsetInt}`;

    const [[countRow]] = await pool.execute(countQuery, countParams);
    const [articles]   = await pool.execute(dataQuery,  dataParams);

    res.json({
      articles,
      total:      countRow.total,
      page:       pageInt,
      totalPages: Math.ceil(countRow.total / limitInt)
    });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET /api/articles/:id
app.get("/api/articles/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM articles WHERE id = ?", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "المقال غير موجود" });
    res.json(rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/articles/:id/view  — زيادة المشاهدات منفصلة
app.post("/api/articles/:id/view", async (req, res) => {
  try {
    await pool.execute("UPDATE articles SET views = views + 1 WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/articles (admin)
app.post("/api/articles", authMiddleware, adminMiddleware, async (req, res) => {
  const { title, title_fr, title_en, content, excerpt, cover_image, tag, emoji, status = "draft" } = req.body;
  if (!title || !content) return res.status(400).json({ error: "العنوان والمحتوى مطلوبان" });
  try {
    const [userRows] = await pool.execute("SELECT name FROM users WHERE id = ?", [req.user.id]);
    const publishedAt = status === 'published' ? new Date() : null;
    // نبني الـ query ديناميكياً حسب الأعمدة الموجودة
    const [cols] = await pool.execute("SHOW COLUMNS FROM articles");
    const colNames = cols.map(c => c.Field);
    const has = (col) => colNames.includes(col);
    let fields = "title, content, tag, emoji, author, author_id, status";
    let values = [title, content, tag, emoji || "📰", userRows[0]?.name, req.user.id, status];
    if (has('title_fr'))    { fields += ", title_fr";    values.push(title_fr    || null); }
    if (has('title_en'))    { fields += ", title_en";    values.push(title_en    || null); }
    if (has('excerpt'))     { fields += ", excerpt";     values.push(excerpt     || null); }
    if (has('cover_image')) { fields += ", cover_image"; values.push(cover_image || null); }
    if (has('published_at')){ fields += ", published_at";values.push(publishedAt); }
    const placeholders = values.map(() => '?').join(', ');
    const [result] = await pool.execute(
      `INSERT INTO articles (${fields}) VALUES (${placeholders})`, values
    );
    res.status(201).json({ id: result.insertId, title, status });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/articles/:id (admin)
app.put("/api/articles/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { title, title_fr, title_en, content, excerpt, cover_image, tag, emoji, status } = req.body;
  try {
    const [existing] = await pool.execute("SELECT status, published_at FROM articles WHERE id = ?", [req.params.id]);
    const wasPublished = existing[0]?.status === 'published';
    const nowPublished = status === 'published';
    const publishedAt  = nowPublished && !wasPublished ? new Date() : (existing[0]?.published_at || null);
    const [cols] = await pool.execute("SHOW COLUMNS FROM articles");
    const colNames = cols.map(c => c.Field);
    const has = (col) => colNames.includes(col);
    let setParts = ["title=?","content=?","tag=?","emoji=?","status=?"];
    let values   = [title, content, tag, emoji, status];
    if (has('title_fr'))    { setParts.push("title_fr=?");    values.push(title_fr    || null); }
    if (has('title_en'))    { setParts.push("title_en=?");    values.push(title_en    || null); }
    if (has('excerpt'))     { setParts.push("excerpt=?");     values.push(excerpt     || null); }
    if (has('cover_image')) { setParts.push("cover_image=?"); values.push(cover_image || null); }
    if (has('published_at')){ setParts.push("published_at=?");values.push(publishedAt); }
    values.push(req.params.id);
    await pool.execute(`UPDATE articles SET ${setParts.join(', ')} WHERE id=?`, values);
    res.json({ message: "تم التعديل" });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/articles/:id (admin)
app.delete("/api/articles/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await pool.execute("DELETE FROM articles WHERE id = ?", [req.params.id]);
    res.json({ message: "تم حذف المقال" });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ===== COMMENTS ROUTES =====
// GET /api/comments?articleId=
app.get("/api/comments", async (req, res) => {
  const { articleId } = req.query;
  try {
    let query = "SELECT * FROM comments WHERE status = 'approved'";
    const params = [];
    if (articleId) { query += " AND article_id = ?"; params.push(parseInt(articleId)); }
    query += " ORDER BY created_at DESC";
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/comments (بدون auth — أي زائر يستطيع التعليق)
app.post("/api/comments", async (req, res) => {
  const { text, articleId, userName } = req.body;
  if (!text || !articleId) return res.status(400).json({ error: "النص ورقم المقال مطلوبان" });
  try {
    const name = userName || "زائر";
    const [result] = await pool.execute(
      "INSERT INTO comments (text, article_id, user_name, status) VALUES (?, ?, ?, 'approved')",
      [text, parseInt(articleId), name]
    );
    res.status(201).json({ id: result.insertId, text, articleId, userName: name, status: "approved", message: "تم إضافة تعليقك" });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/comments/:id/approve (admin)
app.put("/api/comments/:id/approve", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await pool.execute("UPDATE comments SET status = 'approved' WHERE id = ?", [req.params.id]);
    res.json({ message: "تم قبول التعليق" });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/comments/:id (admin)
app.delete("/api/comments/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await pool.execute("DELETE FROM comments WHERE id = ?", [req.params.id]);
    res.json({ message: "تم حذف التعليق" });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ===== USERS ROUTES (admin) =====
app.get("/api/users", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT id, name, email, role, created_at FROM users");
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put("/api/users/:id/role", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await pool.execute("UPDATE users SET role = ? WHERE id = ?", [req.body.role, req.params.id]);
    res.json({ message: "تم تعديل الدور" });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ===== SETTINGS =====
app.get("/api/settings", (req, res) => res.json(DB.settings));
app.put("/api/settings", authMiddleware, adminMiddleware, (req, res) => {
  DB.settings = { ...DB.settings, ...req.body };
  res.json(DB.settings);
});

// ===== STATS =====
app.get("/api/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [[arts]]     = await pool.execute("SELECT COUNT(*) as total FROM articles");
    const [[published]]= await pool.execute("SELECT COUNT(*) as total FROM articles WHERE status='published'");
    const [[pending]]  = await pool.execute("SELECT COUNT(*) as total FROM articles WHERE status='pending'");
    const [[users]]    = await pool.execute("SELECT COUNT(*) as total FROM users");
    const [[comms]]    = await pool.execute("SELECT COUNT(*) as total FROM comments");
    const [[pendComm]] = await pool.execute("SELECT COUNT(*) as total FROM comments WHERE status='pending'");
    const [[views]]    = await pool.execute("SELECT SUM(views) as total FROM articles");
    res.json({
      totalArticles: arts.total,
      publishedArticles: published.total,
      pendingArticles: pending.total,
      totalUsers: users.total,
      totalComments: comms.total,
      pendingComments: pendComm.total,
      totalViews: views.total || 0
    });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ===== GROQ AI ROUTES =====

// route مشترك — يستقبل طلبات من chatbot.html و ai.html
async function callXAI(messages, maxTokens = 1024) {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY not set in environment');
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model:      'llama-3.3-70b-versatile',
      max_tokens: maxTokens,
      messages
    })
  });
  const data = await response.json();
  if (!response.ok || data.error) {
    const msg = data.error?.message || JSON.stringify(data);
    console.error('Groq API error:', msg);
    throw new Error(msg);
  }
  return data.choices[0].message.content;
}

// POST /api/ai/chat  ← chatbot.html
app.post('/api/ai/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });
  try {
    const messages = [
      {
        role: 'system',
        content: `You are a specialist assistant in marine environment, oceans, and marine biology.
You work on a trilingual news website (Arabic/French/English) dedicated to marine environment.
- Answer questions about oceans, fish, coral reefs, marine pollution, climate change
- Respond in the SAME language the user writes in
- Use emojis moderately
- Stay on marine/ocean topics`
      },
      ...history,
      { role: 'user', content: message }
    ];
    const reply = await callXAI(messages, 1024);
    res.json({ reply });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/ai/generate  ← ai.html (توليد مقال)
app.post('/api/ai/generate', authMiddleware, async (req, res) => {
  const { topic, lang = 'ar', tone = 'informative' } = req.body;
  if (!topic) return res.status(400).json({ error: 'Topic required' });
  try {
    const langLabel = lang === 'ar' ? 'Arabic' : lang === 'fr' ? 'French' : 'English';
    const reply = await callXAI([
      { role: 'system', content: 'You are a professional marine environment journalist.' },
      { role: 'user',   content: `Write a complete ${tone} news article in ${langLabel} about: "${topic}".
Structure: Title, Introduction paragraph, 2-3 body sections with H2 headers, Conclusion.
Use HTML tags (p, h2, blockquote, ul/li). Make it 400-600 words. Marine environment focus.` }
    ], 2000);
    res.json({ content: reply });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/ai/translate  ← ai.html (ترجمة)
app.post('/api/ai/translate', authMiddleware, async (req, res) => {
  const { text, targetLangs = ['fr', 'en'] } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });
  try {
    const results = {};
    for (const lang of targetLangs) {
      const langLabel = lang === 'fr' ? 'French' : lang === 'en' ? 'English' : 'Arabic';
      results[lang] = await callXAI([
        { role: 'system', content: 'You are a professional translator. Translate accurately preserving HTML tags and marine terminology.' },
        { role: 'user',   content: `Translate this to ${langLabel}. Keep all HTML tags intact. Return ONLY the translation:\n\n${text}` }
      ], 2000);
    }
    res.json({ translations: results });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/ai/headlines  ← ai.html (أخبار عاجلة)
app.post('/api/ai/headlines', authMiddleware, async (req, res) => {
  const { topic = 'marine environment Morocco' } = req.body;
  try {
    const reply = await callXAI([
      { role: 'system', content: 'You are a breaking news editor for a marine environment news site.' },
      { role: 'user',   content: `Generate 5 breaking news headlines about: "${topic}".
Format as JSON array: [{"text": "🔴 headline here", "severity": "high|medium|low"}]
Return ONLY the JSON array, no other text.` }
    ], 600);
    // parse JSON بأمان
    const clean = reply.replace(/```json|```/g, '').trim();
    const headlines = JSON.parse(clean);
    res.json({ headlines });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/ai/summarize  ← ai.html (تلخيص)
app.post('/api/ai/summarize', authMiddleware, async (req, res) => {
  const { text, lang = 'ar' } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });
  try {
    const langLabel = lang === 'ar' ? 'Arabic' : lang === 'fr' ? 'French' : 'English';
    const reply = await callXAI([
      { role: 'system', content: 'You are an expert content summarizer for a marine news website.' },
      { role: 'user',   content: `Summarize in ${langLabel} in 2-3 sentences max (excerpt for article card):\n\n${text}` }
    ], 300);
    res.json({ summary: reply });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ===== START =====
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🌊 Marine Eco News API running on port ${PORT}`);
    console.log(`✅ Connected to MySQL on Clever Cloud`);
  });
}).catch(err => {
  console.error("❌ Database connection failed:", err.message);
  process.exit(1);
});
