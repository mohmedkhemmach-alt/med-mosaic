<<<<<<< HEAD
# 🌊 Marine Eco News - مشروع البيئة البحرية

## 📁 هيكل المشروع

```
marine-eco-news/
│
├── frontend/                   ← واجهة الموقع العامة
│   ├── index.html             ← الصفحة الرئيسية
│   ├── news.html              ← قائمة الأخبار البحرية
│   ├── article.html           ← صفحة قراءة المقال
│   ├── map.html               ← خريطة Leaflet التفاعلية
│   ├── chatbot.html           ← مساعد الذكاء الاصطناعي
│   ├── comments.html          ← التعليقات والنقاشات
│   ├── login.html             ← تسجيل الدخول / التسجيل
│   ├── app.js                 ← منطق المشاركة (بيانات، ترجمة)
│   └── style.css              ← التصميم العام RTL/LTR
│
├── admin/                      ← لوحة الإدارة
│   ├── dashboard.html         ← إحصائيات وملخص النشاط
│   ├── articles.html          ← إدارة المقالات (CRUD + AI)
│   ├── comments.html          ← إدارة التعليقات ومراجعتها
│   ├── breaking.html          ← الأخبار العاجلة
│   ├── users.html             ← إدارة المستخدمين والأدوار
│   ├── permissions.html       ← مصفوفة الصلاحيات
│   ├── settings.html          ← إعدادات الموقع
│   └── ai.html                ← مركز خدمات الذكاء الاصطناعي
│
├── schema.sql                  ← قاعدة البيانات MySQL/PostgreSQL
├── server.js                   ← Backend API Node.js/Express
└── README.md                   ← هذا الملف
```

## 🚀 التشغيل السريع

### Frontend (بدون Backend)
افتح `frontend/index.html` مباشرة في المتصفح — يعمل بدون سيرفر.

### Backend API
```bash
cd marine-eco-news
npm install express cors bcryptjs jsonwebtoken
node server.js
# API يعمل على http://localhost:3001
```

### قاعدة البيانات
```sql
-- MySQL
mysql -u root -p < schema.sql
```

## 🌟 المميزات الرئيسية

| الميزة | الوصف |
|--------|-------|
| 🌐 **متعدد اللغات** | العربية / French / English مع دعم RTL |
| 🗺️ **خريطة تفاعلية** | Leaflet.js مع نقاط تلوث وحماية |
| 🤖 **ذكاء اصطناعي** | Claude Sonnet 4.6 للشات بوت والتوليد |
| 📰 **إدارة محتوى** | CRUD كامل للمقالات والتعليقات |
| 🔐 **صلاحيات متدرجة** | Admin / Editor / User |
| 📱 **متجاوب** | يعمل على الهاتف والحاسوب |

## 🔑 حسابات التجربة

| الدور | البريد | كلمة المرور |
|-------|--------|------------|
| Admin | admin@marine-eco.ma | admin123 |
| User | m.alami@email.ma | user123 |

## 🤖 خدمات الذكاء الاصطناعي (Claude API)

- **الشات بوت البحري** — `chatbot.html`
- **توليد المقالات** — `admin/ai.html`
- **الترجمة التلقائية** — AR ↔ FR ↔ EN
- **الأخبار العاجلة** — `admin/breaking.html`
- **تلخيص المحتوى** — `admin/ai.html`

## 📡 API Endpoints

```
POST /api/auth/login          ← تسجيل الدخول
POST /api/auth/register       ← إنشاء حساب
GET  /api/articles            ← قائمة المقالات
POST /api/articles            ← إضافة مقال (admin)
PUT  /api/articles/:id        ← تعديل مقال (admin)
DELETE /api/articles/:id      ← حذف مقال (admin)
GET  /api/comments            ← التعليقات
POST /api/comments            ← إضافة تعليق (auth)
PUT  /api/comments/:id/approve← الموافقة (admin)
GET  /api/users               ← قائمة المستخدمين (admin)
GET  /api/stats               ← الإحصائيات (admin)
GET  /api/settings            ← الإعدادات
PUT  /api/settings            ← تعديل الإعدادات (admin)
```

## 🏗️ التقنيات المستخدمة

**Frontend:** HTML5, CSS3 (Variables, Grid, Flexbox), Vanilla JS  
**خريطة:** Leaflet.js 1.9.4 + OpenStreetMap  
**خطوط:** Cairo (Google Fonts) — دعم كامل للعربية  
**Backend:** Node.js + Express.js  
**قاعدة البيانات:** MySQL / PostgreSQL  
**AI:** Anthropic Claude Sonnet 4.6  

---
© 2025 البيئة البحرية · Marine Eco News · Agadir, Morocco 🌊
=======
# med-mosaic
Marine Eco News Website
>>>>>>> b8938f07c67408e5263e742567a9310e0b7a6f8d
