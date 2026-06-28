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
// ===== ADMIN FOLDER PROTECTION =====
app.use('/admin', (req, res, next) => {
  const token = req.query.token || req.headers['authorization']?.split(' ')[1];
  if (!token) return res.redirect('/login.html');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.redirect('/login.html');
    next();
  } catch(e) {
    return res.redirect('/login.html');
  }
});

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
      content LONGTEXT NOT NULL,
      tag VARCHAR(100),
      emoji VARCHAR(10) DEFAULT NULL,
      author VARCHAR(100),
      author_id INT,
      status ENUM('draft','pending','published','archived') DEFAULT 'draft',
      views INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

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
        `INSERT INTO articles (title, content, tag, emoji, author, author_id, status, views) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "اكتشاف 12 نوعاً جديداً من الأسماك", "محتوى المقال...", "تنوع بيولوجي", "🐠", "د. سارة بنعلي", 1, "published", 2140,
          "تلوث البلاستيك في المتوسط", "محتوى المقال...", "تلوث", "🏭", "فريق التحرير", 1, "published", 3850,
          "ارتفاع حرارة المحيطات", "محتوى المقال...", "تغير مناخي", "🌡️", "أحمد الحسيني", 2, "pending", 1920
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
  const { tag, search, page = 1, limit = 10 } = req.query;
  try {
    let query = "SELECT * FROM articles WHERE status = 'published'";
    const params = [];
    if (tag) { query += " AND tag = ?"; params.push(tag); }
    if (search) { query += " AND (title LIKE ? OR content LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }
    const [all] = await pool.execute(query, params);
    const total = all.length;
    const start = (page - 1) * limit;
    const paginated = all.slice(start, start + parseInt(limit));
    res.json({ articles: paginated, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET /api/articles/:id
app.get("/api/articles/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM articles WHERE id = ?", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: "المقال غير موجود" });
    await pool.execute("UPDATE articles SET views = views + 1 WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST /api/articles (admin)
app.post("/api/articles", authMiddleware, adminMiddleware, async (req, res) => {
  const { title, content, tag, emoji, status = "draft" } = req.body;
  if (!title || !content) return res.status(400).json({ error: "العنوان والمحتوى مطلوبان" });
  try {
    const [userRows] = await pool.execute("SELECT name FROM users WHERE id = ?", [req.user.id]);
    const [result] = await pool.execute(
      "INSERT INTO articles (title, content, tag, emoji, author, author_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, content, tag, emoji || "📰", userRows[0]?.name, req.user.id, status]
    );
    res.status(201).json({ id: result.insertId, title, content, tag, status });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/articles/:id (admin)
app.put("/api/articles/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { title, content, tag, emoji, status } = req.body;
  try {
    await pool.execute(
      "UPDATE articles SET title=?, content=?, tag=?, emoji=?, status=? WHERE id=?",
      [title, content, tag, emoji, status, req.params.id]
    );
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
