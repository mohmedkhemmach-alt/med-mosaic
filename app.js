// ============================================
// MARINE ECO NEWS - Frontend App (app.js)
// Shared data, rendering, and language system
// ============================================

// ===== ARTICLES DATA =====
const ARTICLES = [
  {
    id: 1,
    title: "اكتشاف 12 نوعاً جديداً من الأسماك في أعماق المحيط الهندي",
    titleFr: "Découverte de 12 nouvelles espèces de poissons dans les profondeurs de l'océan Indien",
    titleEn: "12 New Fish Species Discovered in the Depths of the Indian Ocean",
    excerpt: "فريق من العلماء الدوليين يكشف عن أنواع بحرية لم تُعرف من قبل، مما يؤكد أن أعماق المحيطات لا تزال تخفي كنوزاً طبيعية.",
    excerptFr: "Une équipe de scientifiques internationaux révèle des espèces marines inconnues, confirmant que les profondeurs océaniques recèlent encore des trésors naturels.",
    excerptEn: "A team of international scientists reveals previously unknown marine species, confirming that the ocean depths still hide natural treasures.",
    tag: "تنوع بيولوجي",
    emoji: "🐠",
    author: "د. سارة بنعلي",
    date: "١٥ يناير ٢٠٢٥",
    views: 2140,
    status: "published"
  },
  {
    id: 2,
    title: "تلوث البلاستيك في البحر الأبيض المتوسط يصل لمستويات قياسية",
    titleFr: "La pollution plastique en Méditerranée atteint des niveaux records",
    titleEn: "Plastic Pollution in the Mediterranean Reaches Record Levels",
    excerpt: "دراسة جديدة تكشف أن البحر الأبيض المتوسط يحتوي على ضعف الكميات المتوقعة من النفايات البلاستيكية.",
    excerptFr: "Une nouvelle étude révèle que la Méditerranée contient le double des quantités attendues de déchets plastiques.",
    excerptEn: "A new study reveals that the Mediterranean contains twice the expected amount of plastic waste.",
    tag: "تلوث",
    emoji: "🏭",
    author: "فريق التحرير",
    date: "١٢ يناير ٢٠٢٥",
    views: 3850,
    status: "published"
  },
  {
    id: 3,
    title: "ارتفاع درجات حرارة المحيطات يهدد منظومة الشعاب المرجانية",
    titleFr: "La hausse des températures océaniques menace les récifs coralliens",
    titleEn: "Rising Ocean Temperatures Threaten Coral Reef Ecosystems",
    excerpt: "تقرير علمي جديد يحذر من أن استمرار الاحترار العالمي قد يؤدي إلى فقدان 90% من الشعاب المرجانية بحلول 2050.",
    excerptFr: "Un nouveau rapport scientifique avertit que le réchauffement climatique pourrait entraîner la perte de 90% des récifs coralliens d'ici 2050.",
    excerptEn: "A new scientific report warns that continued global warming could lead to the loss of 90% of coral reefs by 2050.",
    tag: "تغير مناخي",
    emoji: "🌡️",
    author: "أحمد الحسيني",
    date: "١٠ يناير ٢٠٢٥",
    views: 1920,
    status: "published"
  },
  {
    id: 4,
    title: "المغرب يطلق مبادرة وطنية لحماية 30% من سواحله البحرية",
    titleFr: "Le Maroc lance une initiative nationale pour protéger 30% de son littoral",
    titleEn: "Morocco Launches National Initiative to Protect 30% of Its Coastline",
    excerpt: "الحكومة المغربية تعلن عن خطة طموحة لإنشاء محميات بحرية جديدة على طول السواحل الأطلسية والمتوسطية.",
    excerptFr: "Le gouvernement marocain annonce un plan ambitieux pour créer de nouvelles réserves marines le long des côtes atlantiques et méditerranéennes.",
    excerptEn: "The Moroccan government announces an ambitious plan to establish new marine reserves along the Atlantic and Mediterranean coasts.",
    tag: "حماية",
    emoji: "🌿",
    author: "نادية المنصوري",
    date: "٨ يناير ٢٠٢٥",
    views: 4100,
    status: "published"
  },
  {
    id: 5,
    title: "علماء يكتشفون كائنات دقيقة تتغذى على البلاستيك في قاع البحر",
    titleFr: "Des scientifiques découvrent des micro-organismes se nourrissant de plastique au fond de la mer",
    titleEn: "Scientists Discover Microorganisms That Feed on Plastic at the Ocean Floor",
    excerpt: "اكتشاف علمي مثير قد يفتح آفاقاً جديدة في مكافحة تلوث المحيطات بالبلاستيك على المدى البعيد.",
    excerptFr: "Une découverte scientifique passionnante pourrait ouvrir de nouvelles perspectives dans la lutte contre la pollution plastique des océans.",
    excerptEn: "An exciting scientific discovery may open new avenues in combating ocean plastic pollution in the long term.",
    tag: "أبحاث",
    emoji: "🔬",
    author: "د. ياسمين أوزو",
    date: "٥ يناير ٢٠٢٥",
    views: 2780,
    status: "published"
  },
  {
    id: 6,
    title: "حملة تنظيف شواطئ أكادير تزيل 15 طناً من النفايات البحرية",
    titleFr: "La campagne de nettoyage des plages d'Agadir retire 15 tonnes de déchets marins",
    titleEn: "Agadir Beach Cleanup Campaign Removes 15 Tons of Marine Waste",
    excerpt: "متطوعون من مختلف أنحاء المغرب يشاركون في حملة تنظيف ضخمة على شواطئ أكادير ضمن مبادرة حماية البيئة البحرية.",
    excerptFr: "Des bénévoles de tout le Maroc participent à une grande campagne de nettoyage sur les plages d'Agadir dans le cadre d'une initiative de protection de l'environnement marin.",
    excerptEn: "Volunteers from across Morocco participate in a massive cleanup campaign on Agadir beaches as part of a marine environment protection initiative.",
    tag: "حماية",
    emoji: "🧹",
    author: "رشيد الزياني",
    date: "٣ يناير ٢٠٢٥",
    views: 1560,
    status: "published"
  }
];

// ===== TRANSLATIONS =====
const TRANSLATIONS = {
  ar: {
    siteTitle: "البيئة البحرية",
    home: "الرئيسية",
    news: "الأخبار",
    map: "الخريطة",
    ai: "الذكاء الاصطناعي",
    comments: "التعليقات",
    login: "تسجيل الدخول",
    readMore: "اقرأ المزيد",
    latestNews: "آخر الأخبار",
    viewAll: "عرض الكل ←",
    heroTitle: "حماية المحيطات<br/>مسؤوليتنا المشتركة",
    heroSub: "آخر الأخبار والتقارير العلمية حول البيئة البحرية، التلوث، وجهود الحفاظ على التنوع البيولوجي",
    exploreNews: "استكشف الأخبار",
    talkAI: "تحدث مع الذكاء الاصطناعي"
  },
  fr: {
    siteTitle: "Éco Marin",
    home: "Accueil",
    news: "Actualités",
    map: "Carte",
    ai: "Intelligence Artificielle",
    comments: "Commentaires",
    login: "Connexion",
    readMore: "Lire la suite",
    latestNews: "Dernières Actualités",
    viewAll: "Voir tout →",
    heroTitle: "Protéger les Océans<br/>Notre Responsabilité Commune",
    heroSub: "Les dernières nouvelles et rapports scientifiques sur l'environnement marin, la pollution et les efforts de préservation",
    exploreNews: "Explorer les Actualités",
    talkAI: "Parler à l'IA"
  },
  en: {
    siteTitle: "Marine Eco News",
    home: "Home",
    news: "News",
    map: "Map",
    ai: "AI Assistant",
    comments: "Comments",
    login: "Login",
    readMore: "Read More",
    latestNews: "Latest News",
    viewAll: "View All →",
    heroTitle: "Protecting Oceans<br/>Our Shared Responsibility",
    heroSub: "Latest news and scientific reports on marine environment, pollution and conservation efforts",
    exploreNews: "Explore News",
    talkAI: "Talk to AI"
  }
};

// ===== LANGUAGE SYSTEM =====
function setLang(lang) {
  localStorage.setItem('marine-lang', lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim().toLowerCase() === lang);
  });

  const t = TRANSLATIONS[lang];
  if (!t) return;

  // Update document language
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Update text elements with data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      if (el.innerHTML.includes('<br')) {
        el.innerHTML = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });

  // Re-render news in the selected language
  if (typeof renderNews === 'function') {
    renderNews(null, lang);
  }
}

// ===== RENDER NEWS CARDS =====
function renderNews(articles, lang) {
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  const list = articles || ARTICLES;
  const currentLang = lang || localStorage.getItem('marine-lang') || 'ar';

  grid.innerHTML = list.map(a => {
    const title = currentLang === 'fr' ? (a.titleFr || a.title) : currentLang === 'en' ? (a.titleEn || a.title) : a.title;
    const excerpt = currentLang === 'fr' ? (a.excerptFr || a.excerpt) : currentLang === 'en' ? (a.excerptEn || a.excerpt) : a.excerpt;

    return `
      <article class="news-card" onclick="location.href='article.html?id=${a.id}'">
        <div class="news-card-img" style="font-size:52px">${a.emoji}</div>
        <div class="news-card-body">
          <span class="news-tag">${a.tag}</span>
          <h3>${title}</h3>
          <p>${excerpt}</p>
          <div class="news-meta">
            <span>📅 ${a.date}</span>
            <span>👁 ${a.views.toLocaleString()}</span>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('marine-lang') || 'ar';

  // Render news grid if exists
  if (document.getElementById('news-grid')) {
    renderNews(ARTICLES.slice(0, 6), savedLang);
  }

  // Apply saved language
  setLang(savedLang);
});
