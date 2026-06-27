/* ============================================================
   Med Mosaic — Shared i18n engine
   Default language: EN. Supports EN / FR / AR (with RTL).
   Works by matching visible text, so no data-* markup needed.
   Re-applies automatically to JS-rendered content (MutationObserver).
   ============================================================ */
(function () {
  "use strict";

  // EN source string  ->  { fr, ar }
  const T = {
    /* ---- Nav / chrome ---- */
    "Home": { fr: "Accueil", ar: "الرئيسية" },
    "News": { fr: "Actualités", ar: "الأخبار" },
    "Map": { fr: "Carte", ar: "الخريطة" },
    "AI Assistant": { fr: "Assistant IA", ar: "المساعد الذكي" },
    "Comments": { fr: "Commentaires", ar: "التعليقات" },
    "Login": { fr: "Connexion", ar: "تسجيل الدخول" },

    /* ---- Hero (index) ---- */
    "🌊 Breaking Marine News — June 2025": { fr: "🌊 Actualités marines à la une — Juin 2025", ar: "🌊 أخبار بحرية عاجلة — يونيو 2025" },
    "Our Oceans": { fr: "Nos Océans", ar: "محيطاتنا" },
    "Latest news and scientific reports on marine ecosystems, pollution, and biodiversity conservation in Morocco and worldwide.":
      { fr: "Dernières actualités et rapports scientifiques sur les écosystèmes marins, la pollution et la préservation de la biodiversité au Maroc et dans le monde.",
        ar: "آخر الأخبار والتقارير العلمية حول النظم البيئية البحرية والتلوث وحماية التنوع البيولوجي في المغرب والعالم." },
    "Explore News": { fr: "Explorer les actualités", ar: "تصفّح الأخبار" },
    "🤖 Talk to AI Assistant": { fr: "🤖 Parler à l'assistant IA", ar: "🤖 تحدّث مع المساعد الذكي" },

    /* ---- Ticker ---- */
    "⚡ BREAKING": { fr: "⚡ À LA UNE", ar: "⚡ عاجل" },

    /* ---- Stats ---- */
    "of Earth's surface covered by oceans": { fr: "de la surface de la Terre couverte par les océans", ar: "من سطح الأرض تغطّيه المحيطات" },
    "tons of plastic enter oceans every year": { fr: "tonnes de plastique entrent dans les océans chaque année", ar: "طن من البلاستيك يدخل المحيطات كل عام" },
    "of coral reefs are threatened with extinction": { fr: "des récifs coralliens sont menacés d'extinction", ar: "من الشعاب المرجانية مهدّدة بالانقراض" },
    "average ocean temperature rise since 1900": { fr: "hausse moyenne de la température des océans depuis 1900", ar: "متوسط ارتفاع حرارة المحيطات منذ 1900" },
    "marine species discovered so far": { fr: "espèces marines découvertes à ce jour", ar: "نوع بحري تم اكتشافه حتى الآن" },

    /* ---- Section headers ---- */
    "Featured Stories": { fr: "À la une", ar: "أبرز المواضيع" },
    "Latest News": { fr: "Dernières actualités", ar: "أحدث الأخبار" },
    "Photo Gallery": { fr: "Galerie photos", ar: "معرض الصور" },
    "View All →": { fr: "Tout voir →", ar: "عرض الكل →" },
    "More →": { fr: "Plus →", ar: "المزيد →" },
    "Read More →": { fr: "Lire la suite →", ar: "اقرأ المزيد →" },
    "Read Full Article →": { fr: "Lire l'article complet →", ar: "اقرأ المقال كاملاً →" },
    "Real images from our marine environment": { fr: "Images réelles de notre environnement marin", ar: "صور حقيقية من بيئتنا البحرية" },

    /* ---- Tags / categories ---- */
    "🪸 Marine Ecology": { fr: "🪸 Écologie marine", ar: "🪸 البيئة البحرية" },
    "🚨 Pollution": { fr: "🚨 Pollution", ar: "🚨 التلوث" },
    "🐬 Marine Life": { fr: "🐬 Vie marine", ar: "🐬 الحياة البحرية" },
    "🌿 Conservation": { fr: "🌿 Conservation", ar: "🌿 الحفاظ على البيئة" },
    "🏖️ Tourism": { fr: "🏖️ Tourisme", ar: "🏖️ السياحة" },
    "🔬 Research": { fr: "🔬 Recherche", ar: "🔬 البحث العلمي" },
    "All": { fr: "Tout", ar: "الكل" },
    "Pollution": { fr: "Pollution", ar: "التلوث" },
    "Biodiversity": { fr: "Biodiversité", ar: "التنوع البيولوجي" },
    "Climate": { fr: "Climat", ar: "المناخ" },
    "Protection": { fr: "Protection", ar: "الحماية" },
    "Protected": { fr: "Protégé", ar: "محمي" },
    "Research": { fr: "Recherche", ar: "بحث علمي" },

    /* ---- Featured / latest card content (index) ---- */
    "Coral Reefs: Cities of the Ocean Under Climate Threat": { fr: "Récifs coralliens : les cités de l'océan menacées par le climat", ar: "الشعاب المرجانية: مدن المحيط تحت تهديد المناخ" },
    "Coral reefs cover less than 1% of the ocean floor, yet shelter over 25% of all marine species. An investigation into global warming risks.":
      { fr: "Les récifs coralliens couvrent moins de 1 % des fonds marins, mais abritent plus de 25 % des espèces marines. Enquête sur les risques du réchauffement climatique.",
        ar: "تغطّي الشعاب المرجانية أقل من 1٪ من قاع المحيط، لكنها تأوي أكثر من 25٪ من الأنواع البحرية. تحقيق في مخاطر الاحترار العالمي." },
    "8 Million Tons of Plastic Choking Our Oceans Every Year": { fr: "8 millions de tonnes de plastique étouffent nos océans chaque année", ar: "8 ملايين طن من البلاستيك تخنق محيطاتنا كل عام" },
    "UN Report 2025": { fr: "Rapport de l'ONU 2025", ar: "تقرير الأمم المتحدة 2025" },
    "Dolphins Return to Agadir Shores After Years of Absence": { fr: "Les dauphins reviennent sur les côtes d'Agadir après des années d'absence", ar: "الدلافين تعود إلى شواطئ أكادير بعد سنوات من الغياب" },
    "Groups of spotted dolphins spotted near the Moroccan coast": { fr: "Des groupes de dauphins tachetés observés près de la côte marocaine", ar: "مجموعات من الدلافين المرقّطة شوهدت قرب الساحل المغربي" },
    "Oil Spill Threatens Morocco's Northern Coast — Emergency Teams Mobilized": { fr: "Une marée noire menace la côte nord du Maroc — Équipes d'urgence mobilisées", ar: "تسرب نفطي يهدد الساحل الشمالي للمغرب — تعبئة فرق الطوارئ" },
    "Moroccan environmental authorities deploy rapid response teams to contain an oil spill detected near the Strait of Gibraltar, fearing it may reach the coastline.":
      { fr: "Les autorités environnementales marocaines déploient des équipes d'intervention rapide pour contenir une marée noire détectée près du détroit de Gibraltar, craignant qu'elle n'atteigne le littoral.",
        ar: "تنشر السلطات البيئية المغربية فرق تدخل سريع لاحتواء تسرب نفطي رُصد قرب مضيق جبل طارق، خشية وصوله إلى الساحل." },
    "Morocco Expands Marine Protected Areas to 10% of Territorial Waters": { fr: "Le Maroc étend ses aires marines protégées à 10 % des eaux territoriales", ar: "المغرب يوسّع المناطق البحرية المحمية لتشمل 10٪ من المياه الإقليمية" },
    "A historic announcement raising Morocco's marine protected area coverage ahead of COP30, scheduled to be held in Marrakech.":
      { fr: "Une annonce historique augmentant la couverture des aires marines protégées du Maroc avant la COP30, prévue à Marrakech.",
        ar: "إعلان تاريخي يرفع نسبة المناطق البحرية المحمية في المغرب قبل قمة COP30 المقرر عقدها في مراكش." },
    "Agadir Beaches Awarded European Blue Flag for the Third Consecutive Year": { fr: "Les plages d'Agadir reçoivent le Pavillon Bleu européen pour la troisième année consécutive", ar: "شواطئ أكادير تنال العلم الأزرق الأوروبي للعام الثالث على التوالي" },
    "International recognition for Agadir's water quality and cleanliness, reflecting sustained efforts by the municipality and civil society to protect the coastal ecosystem.":
      { fr: "Une reconnaissance internationale de la qualité et de la propreté des eaux d'Agadir, reflet des efforts soutenus de la municipalité et de la société civile pour protéger l'écosystème côtier.",
        ar: "اعتراف دولي بجودة ونظافة مياه أكادير، يعكس الجهود المتواصلة للبلدية والمجتمع المدني لحماية النظام البيئي الساحلي." },
    "Scientists Reveal First-Ever Comprehensive Map of Global Ocean Currents": { fr: "Des scientifiques dévoilent la toute première carte complète des courants océaniques mondiaux", ar: "علماء يكشفون عن أول خريطة شاملة على الإطلاق لتيارات المحيطات العالمية" },
    "A massive research project spanning 47 countries presents the first 3D map of global ocean currents with unprecedented accuracy, set to transform our understanding of world climate.":
      { fr: "Un vaste projet de recherche couvrant 47 pays présente la première carte 3D des courants océaniques mondiaux avec une précision inédite, appelée à transformer notre compréhension du climat mondial.",
        ar: "مشروع بحثي ضخم يشمل 47 دولة يقدّم أول خريطة ثلاثية الأبعاد لتيارات المحيطات العالمية بدقة غير مسبوقة، ستغيّر فهمنا لمناخ العالم." },
    "Morocco Environment Agency": { fr: "Agence marocaine de l'environnement", ar: "الوكالة المغربية للبيئة" },
    "Mubashir Morocco": { fr: "Moubachir Maroc", ar: "مباشر المغرب" },

    /* ---- Promo: Map ---- */
    "Interactive Marine Pollution Map": { fr: "Carte interactive de la pollution marine", ar: "خريطة تفاعلية للتلوث البحري" },
    "Explore in real time pollution zones, environmental monitoring stations, and conservation efforts along the Moroccan coast and territorial waters.":
      { fr: "Explorez en temps réel les zones de pollution, les stations de surveillance environnementale et les efforts de conservation le long de la côte marocaine et des eaux territoriales.",
        ar: "استكشف في الوقت الفعلي مناطق التلوث ومحطات المراقبة البيئية وجهود الحفاظ على طول الساحل المغربي والمياه الإقليمية." },
    "🗺️ Open Interactive Map": { fr: "🗺️ Ouvrir la carte interactive", ar: "🗺️ افتح الخريطة التفاعلية" },
    "🟢 Live Update": { fr: "🟢 Mise à jour en direct", ar: "🟢 تحديث مباشر" },

    /* ---- Promo: AI assistant ---- */
    "Marine Eco Assistant": { fr: "Assistant Éco Marin", ar: "المساعد البيئي البحري" },
    "Online now": { fr: "En ligne", ar: "متصل الآن" },
    "Hi! I'm the Marine Eco Assistant. I can answer your questions about oceans, marine life and pollution. How can I help you?":
      { fr: "Bonjour ! Je suis l'Assistant Éco Marin. Je peux répondre à vos questions sur les océans, la vie marine et la pollution. Comment puis-je vous aider ?",
        ar: "مرحباً! أنا المساعد البيئي البحري. يمكنني الإجابة على أسئلتك حول المحيطات والحياة البحرية والتلوث. كيف يمكنني مساعدتك؟" },
    "What causes coral bleaching?": { fr: "Qu'est-ce qui provoque le blanchissement des coraux ?", ar: "ما الذي يسبب ابيضاض المرجان؟" },
    "Coral bleaching occurs when water temperatures rise above normal for weeks. Corals expel the symbiotic algae that give them color and supply 90% of their food, turning white. If thermal stress continues, the corals die.":
      { fr: "Le blanchissement des coraux survient lorsque la température de l'eau dépasse la normale pendant des semaines. Les coraux expulsent les algues symbiotiques qui leur donnent leur couleur et 90 % de leur nourriture, et blanchissent. Si le stress thermique persiste, les coraux meurent.",
        ar: "يحدث ابيضاض المرجان عندما ترتفع حرارة الماء فوق المعدّل لأسابيع. تطرد الشعاب الطحالب المتعايشة التي تمنحها لونها و90٪ من غذائها فتتحول إلى الأبيض. وإذا استمر الإجهاد الحراري تموت الشعاب." },
    "How can we protect them?": { fr: "Comment pouvons-nous les protéger ?", ar: "كيف يمكننا حمايتها؟" },
    "Marine AI Assistant": { fr: "Assistant IA marin", ar: "المساعد الذكي البحري" },
    "Ask anything about the marine environment. Our assistant is powered by the latest AI models and replies instantly in Arabic, French, or English.":
      { fr: "Posez toutes vos questions sur l'environnement marin. Notre assistant s'appuie sur les derniers modèles d'IA et répond instantanément en arabe, français ou anglais.",
        ar: "اسأل أي شيء عن البيئة البحرية. يعتمد مساعدنا على أحدث نماذج الذكاء الاصطناعي ويجيب فوراً بالعربية أو الفرنسية أو الإنجليزية." },
    "Coral Reefs": { fr: "Récifs coralliens", ar: "الشعاب المرجانية" },
    "Up-to-date scientific info": { fr: "Infos scientifiques à jour", ar: "معلومات علمية محدّثة" },
    "Marine Mammals": { fr: "Mammifères marins", ar: "الثدييات البحرية" },
    "Whales, dolphins & more": { fr: "Baleines, dauphins et plus", ar: "حيتان ودلافين والمزيد" },
    "Pollution & Crises": { fr: "Pollution & crises", ar: "التلوث والأزمات" },
    "Causes and scientific solutions": { fr: "Causes et solutions scientifiques", ar: "الأسباب والحلول العلمية" },
    "Climate Change": { fr: "Changement climatique", ar: "تغيّر المناخ" },
    "Its impact on the oceans": { fr: "Son impact sur les océans", ar: "تأثيره على المحيطات" },
    "Start Chatting Now": { fr: "Commencer à discuter", ar: "ابدأ المحادثة الآن" },

    /* ---- Partners + newsletter ---- */
    "OUR PARTNERS & INFORMATION SOURCES": { fr: "NOS PARTENAIRES & SOURCES D'INFORMATION", ar: "شركاؤنا ومصادر معلوماتنا" },
    "📩 Stay Informed": { fr: "📩 Restez informé", ar: "📩 ابقَ على اطّلاع" },
    "Subscribe to our weekly newsletter and receive the latest marine environment news directly in your inbox.":
      { fr: "Abonnez-vous à notre newsletter hebdomadaire et recevez les dernières actualités de l'environnement marin directement dans votre boîte mail.",
        ar: "اشترك في نشرتنا الأسبوعية واستقبل آخر أخبار البيئة البحرية مباشرة في بريدك." },
    "Subscribe": { fr: "S'abonner", ar: "اشترك" },
    "✓ Subscribed!": { fr: "✓ Abonné !", ar: "✓ تم الاشتراك!" },

    /* ---- Footer ---- */
    "Marine Journalism": { fr: "Journalisme marin", ar: "الصحافة البحرية" },
    "A specialized news platform covering marine environment and ocean news, dedicated to raising environmental awareness in Morocco and beyond.":
      { fr: "Une plateforme d'information spécialisée couvrant l'environnement marin et l'actualité des océans, dédiée à la sensibilisation écologique au Maroc et au-delà.",
        ar: "منصة إخبارية متخصصة تغطي البيئة البحرية وأخبار المحيطات، مكرّسة لرفع الوعي البيئي في المغرب وخارجه." },
    "Quick Links": { fr: "Liens rapides", ar: "روابط سريعة" },
    "Marine News": { fr: "Actualités marines", ar: "الأخبار البحرية" },
    "Interactive Map": { fr: "Carte interactive", ar: "الخريطة التفاعلية" },
    "Topics": { fr: "Thématiques", ar: "المواضيع" },
    "Ocean Pollution": { fr: "Pollution des océans", ar: "تلوث المحيطات" },
    "Marine Reserves": { fr: "Réserves marines", ar: "المحميات البحرية" },
    "Contact Us": { fr: "Contactez-nous", ar: "اتصل بنا" },
    "📍 Agadir, Morocco": { fr: "📍 Agadir, Maroc", ar: "📍 أكادير، المغرب" },
    "🕐 24/7 Support": { fr: "🕐 Support 24/7", ar: "🕐 دعم على مدار الساعة" },
    "Marine Journalism · Agadir, Morocco 🌊 · All rights reserved":
      { fr: "Journalisme marin · Agadir, Maroc 🌊 · Tous droits réservés",
        ar: "الصحافة البحرية · أكادير، المغرب 🌊 · جميع الحقوق محفوظة" },

    /* ---- News page ---- */
    "Latest Articles": { fr: "Derniers articles", ar: "أحدث المقالات" },
    "Latest reports and updates on the marine environment and oceans": { fr: "Derniers rapports et mises à jour sur l'environnement marin et les océans", ar: "آخر التقارير والمستجدات حول البيئة البحرية والمحيطات" },
    "😕 No matching results found": { fr: "😕 Aucun résultat correspondant", ar: "😕 لا توجد نتائج مطابقة" },

    /* ---- Article page ---- */
    "Share:": { fr: "Partager :", ar: "مشاركة:" },
    "💬 Comments": { fr: "💬 Commentaires", ar: "💬 التعليقات" },
    "📰 Related Articles": { fr: "📰 Articles liés", ar: "📰 مقالات ذات صلة" },
    "🤖 Ask the AI Assistant": { fr: "🤖 Demander à l'assistant IA", ar: "🤖 اسأل المساعد الذكي" },
    "Have questions about this topic? Our marine AI assistant is ready to help.":
      { fr: "Des questions sur ce sujet ? Notre assistant IA marin est prêt à vous aider.",
        ar: "هل لديك أسئلة حول هذا الموضوع؟ مساعدنا الذكي البحري جاهز للمساعدة." },
    "Post Comment ➤": { fr: "Publier le commentaire ➤", ar: "أضف تعليقاً ➤" },

    /* ---- Map page ---- */
    "🗺️ Marine Environment Map": { fr: "🗺️ Carte de l'environnement marin", ar: "🗺️ خريطة البيئة البحرية" },
    "Pollution zones and protection efforts around the world": { fr: "Zones de pollution et efforts de protection dans le monde", ar: "مناطق التلوث وجهود الحماية حول العالم" },
    "Map Layers": { fr: "Couches de la carte", ar: "طبقات الخريطة" },
    "Pollution Zones": { fr: "Zones de pollution", ar: "مناطق التلوث" },
    "Protected Areas": { fr: "Zones protégées", ar: "المناطق المحمية" },
    "Research Stations": { fr: "Stations de recherche", ar: "محطات البحث" },
    "Latest Incidents": { fr: "Derniers incidents", ar: "آخر الحوادث" },

    /* ---- Chatbot page ---- */
    "Online & Ready": { fr: "En ligne et prêt", ar: "متصل وجاهز" },
    "Suggested Questions": { fr: "Questions suggérées", ar: "أسئلة مقترحة" },
    "How does plastic affect marine life?": { fr: "Comment le plastique affecte-t-il la vie marine ?", ar: "كيف يؤثر البلاستيك على الحياة البحرية؟" },
    "What is the impact of rising ocean temperatures?": { fr: "Quel est l'impact de la hausse des températures océaniques ?", ar: "ما تأثير ارتفاع درجات حرارة المحيطات؟" },
    "Explain the life cycle of sea turtles": { fr: "Expliquez le cycle de vie des tortues marines", ar: "اشرح دورة حياة السلاحف البحرية" },
    "How can we reduce marine pollution?": { fr: "Comment réduire la pollution marine ?", ar: "كيف يمكننا الحد من التلوث البحري؟" },
    "What are the most polluted ocean zones?": { fr: "Quelles sont les zones océaniques les plus polluées ?", ar: "ما هي أكثر مناطق المحيطات تلوثاً؟" },
    "What are the deepest points in the world's oceans?": { fr: "Quels sont les points les plus profonds des océans du monde ?", ar: "ما هي أعمق نقاط في محيطات العالم؟" },
    "🗑️ Clear Conversation": { fr: "🗑️ Effacer la conversation", ar: "🗑️ مسح المحادثة" },
    "Conversation cleared. How can I help you? 🌊": { fr: "Conversation effacée. Comment puis-je vous aider ? 🌊", ar: "تم مسح المحادثة. كيف يمكنني مساعدتك؟ 🌊" }
  };

  const LANGS = ["en", "fr", "ar"];
  const STORE_KEY = "medmosaic_lang";
  const originals = new WeakMap(); // text node -> original EN string

  function translateNode(node, lang) {
    const raw = node.nodeValue;
    if (!originals.has(node)) {
      if (!raw || !raw.trim()) return;
      originals.set(node, raw);
    }
    const orig = originals.get(node);
    const key = orig.trim();
    if (lang === "en") {
      if (node.nodeValue !== orig) node.nodeValue = orig;
      return;
    }
    const entry = T[key];
    if (entry && entry[lang]) {
      // preserve surrounding whitespace
      node.nodeValue = orig.replace(key, entry[lang]);
    } else if (node.nodeValue !== orig) {
      node.nodeValue = orig; // fall back to source for untranslated strings
    }
  }

  function walk(root, lang) {
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentNode;
        if (!p) return NodeFilter.FILTER_REJECT;
        const tag = p.nodeName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return NodeFilter.FILTER_REJECT;
        return n.nodeValue && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    let n;
    while ((n = tw.nextNode())) translateNode(n, lang);
  }

  function translateAttrs(lang) {
    document.querySelectorAll("[placeholder]").forEach(function (el) {
      if (!el.dataset.i18nPh) el.dataset.i18nPh = el.getAttribute("placeholder");
      const o = el.dataset.i18nPh, k = o.trim(), e = T[k];
      el.setAttribute("placeholder", lang !== "en" && e && e[lang] ? e[lang] : o);
    });
  }

  function setActiveButtons(lang) {
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.classList.toggle("active", b.id === "lb-" + lang);
    });
    var sel = document.getElementById("langSelect");
    if (sel && sel.value !== lang) sel.value = lang;
  }

  let current = "en";
  function applyLang(lang) {
    if (LANGS.indexOf(lang) === -1) lang = "en";
    current = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body && (document.body.style.direction = lang === "ar" ? "rtl" : "ltr");
    walk(document.body, lang);
    translateAttrs(lang);
    setActiveButtons(lang);
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
  }

  // public hooks (keep old inline onclick="setLang('fr')" working)
  window.setLang = applyLang;
  window.applyI18n = applyLang;
  window.getLang = function () { return current; };

  // Re-translate JS-rendered content (news cards, chat messages, popups…)
  function startObserver() {
    const mo = new MutationObserver(function (muts) {
      if (current === "en") return;
      for (const m of muts) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) walk(node, current);
          else if (node.nodeType === 3) translateNode(node, current);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  function injectStyles() {
    if (document.getElementById("mm-enhance")) return;
    const css = document.createElement("style");
    css.id = "mm-enhance";
    css.textContent = [
      /* keep nav links reachable on mobile instead of hiding them */
      "@media(max-width:860px){",
      "  .nav-links{display:flex !important;gap:.1rem;overflow-x:auto;-webkit-overflow-scrolling:touch;",
      "    scrollbar-width:none;max-width:100%;}",
      "  .nav-links::-webkit-scrollbar{display:none;}",
      "  .nav-links a{white-space:nowrap;font-size:.82rem;padding:.4rem .55rem;}",
      "  .nav-inner{gap:.6rem;}",
      "}",
      /* RTL fine-tuning for Arabic */
      "[dir=rtl] .logo-sub,[dir=rtl] .footer-logo-sub{letter-spacing:0;}",
      "[dir=rtl] .ticker-label{border-radius:0 0 0 8px;}",
      "[dir=rtl] .read-more,[dir=rtl] .view-all{direction:rtl;}",
      /* clearer active language button */
      ".lang-switcher{display:flex;gap:.3rem;}",
      ".lang-btn{background:none;border:1px solid rgba(0,201,200,.25);color:var(--muted,#7fb3c8);",
      "  font-size:.8rem;font-family:inherit;padding:.3rem .6rem;border-radius:6px;cursor:pointer;transition:all .15s;}",
      ".lang-btn:hover{color:var(--text,#cce8f0);border-color:rgba(0,201,200,.5);}",
      ".lang-btn.active{background:var(--cyan,#00c9c8);color:var(--deep,#020b18);border-color:var(--cyan,#00c9c8);",
      "  font-weight:700;box-shadow:0 0 0 2px rgba(0,201,200,.30);}"
    ].join("\n");
    document.head.appendChild(css);
  }

  function init() {
    injectStyles();
    let saved = "en";
    try { saved = localStorage.getItem(STORE_KEY) || "en"; } catch (e) {}
    applyLang(saved);
    startObserver();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
