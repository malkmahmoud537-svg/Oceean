/**
 * OCEAN LIFE - INTERNATIONALIZATION (i18n) ENGINE (js/i18n.js)
 * Seamless English <-> Arabic Language Switcher
 * - Bi-directional text direction support (LTR / RTL)
 * - Typography adaptation for Arabic ('Cairo')
 * - Complete dictionary for Navigation, Hero, About, Marine Life, Explorer, Game, and Auth
 * - Persisted in localStorage ('ocean_lang')
 */

(function () {
  'use strict';

  const LANG_KEY = 'ocean_lang';

  const translations = {
    en: {
      // Navigation
      nav_brand_title: 'OCEAN LIFE',
      nav_brand_tag: 'Explore The Deep',
      nav_home: 'Home',
      nav_about: 'About Ocean',
      nav_marine: 'Marine Life',
      nav_explorer: 'Ocean Explorer',
      nav_login: 'Login',
      nav_community: 'Community',
      sound_title_on: 'Sound: ON',
      sound_title_off: 'Sound: OFF',

      // Hero
      hero_tag: 'The Final Planetary Frontier',
      hero_title_1: 'DIVE INTO THE',
      hero_title_2: 'UNKNOWN',
      hero_subtitle: 'Discover the hidden wonders of our oceans, meet extraordinary marine creatures, and explore the secrets of the underwater world.',
      hero_btn_explore: 'Explore the Ocean',
      hero_btn_marine: 'Discover Marine Life',
      hero_scroll: 'Scroll Down to Discover',

      // Ticker
      ticker_live: 'Live Oceanographic Satellite Telemetry',
      ticker_source: 'Real-Time NOAA & Open-Meteo',

      // 3 Cards
      cards_section_tag: 'Interactive Pathways',
      cards_section_title: 'CHOOSE YOUR DESCENT',
      cards_section_desc: 'Embark on a voyage across five global oceans, encounter magnificent pelagic wildlife, and champion the vital ecological movement to preserve our marine biospheres.',
      card_1_title: 'Discover Ocean Life',
      card_1_desc: 'Uncover the physics, depth zones, and geological wonders of the 5 planetary oceans, from sunlit shallows to the crushing abyss.',
      card_1_btn: 'Enter The World Beneath',
      card_2_title: 'Explore Marine Creatures',
      card_2_desc: 'Browse our comprehensive scientific biodiversity catalog featuring real-time wild observations from the global iNaturalist & GBIF databases.',
      card_2_btn: 'View Creatures Gallery',
      card_3_title: 'Protect Our Oceans',
      card_3_desc: 'Take the interactive pollution challenge, test your recycling instincts in the waste sorting simulation, and commit to life-saving conservation pledges.',
      card_3_btn: 'Start Ocean Defense',

      // Stats
      stats_tag: 'Empirical Measurements',
      stats_title: 'THE BLUE HEART OF OUR PLANET',
      stats_desc: 'Real oceanographic data documenting the scale and mystery of our global waters.',
      stat_species: 'Known Marine Species',
      stat_coverage: "Earth's Surface Covered",
      stat_oceans: 'Global Ocean Basins',
      stat_depth: 'Average Depth of Waters',

      // About Page
      about_tag: 'Oceanographic Overview',
      about_title: 'THE WORLD BENEATH THE WAVES',
      about_desc: "Vast, deep, and essential to all terrestrial life, our global ocean is a single, interconnected liquid biosphere holding 97% of Earth's water.",
      about_image_title: 'The Planetary Cradle',
      about_image_sub: '3.8 Billion Years of Continuous Marine Evolution',
      about_q1_title: 'What is the Ocean?',
      about_q1_desc: 'The ocean is a continuous body of saltwater covering 361 million square kilometers (71%) of the planet. It comprises over 1.33 billion cubic kilometers of water with an average salinity of 35 parts per thousand, forming Earth’s largest thermal heat reservoir.',
      about_q2_title: 'Why are Oceans Important?',
      about_q2_desc: "Every second breath we take comes from the ocean. Marine phytoplankton (prochlorococcus and diatoms) produce 50% to 80% of the world's atmospheric oxygen. The ocean also provides food security and livelihood for over 3 billion people worldwide.",
      about_q3_title: 'How Oceans Regulate Climate',
      about_q3_desc: 'The oceans absorb 90% of excess anthropogenic heat trapped by greenhouse gases and capture approximately 30% of global carbon emissions. The Global Ocean Conveyor Belt circulates warm water from the equator to poles, moderating continental weather.',
      about_q4_title: 'What Lives Beneath?',
      about_q4_desc: 'Scientists estimate between 700,000 and 1 million eukaryotic marine species inhabit our oceans, yet less than 25% have been formally described. Life spans from microscopic zooplankton to the colossal 190-ton blue whale.',
      oceans_section_tag: 'Global Ocean Basins',
      oceans_section_title: 'THE FIVE OCEANS',
      oceans_section_desc: 'Click any ocean card to inspect its geographic boundaries, extreme trenches, endemic species, and marine conditions.',
      ocean_btn_explore: 'Explore Facts',

      // Depth Explorer
      depth_section_tag: 'Vertical Stratification',
      depth_section_title: 'OCEAN DEPTH EXPLORER',
      depth_section_desc: 'Descend through the five vertical ocean zones. Watch the ambient illumination decrease, hydrostatic pressure escalate, and exotic deep-sea adaptations emerge.',
      gauge_range: 'Depth Range',
      gauge_light: 'Illumination',
      gauge_pressure: 'Pressure',
      gauge_temp: 'Temperature',
      depth_creatures_label: 'Signature Marine Organisms In This Zone:',

      // Marine Life Page
      marine_tag: 'Biodiversity Catalog',
      marine_title: 'MEET THE CREATURES OF THE DEEP',
      marine_desc: 'Explore 12 iconic marine species spanning fish, mammals, reptiles, and invertebrates. Click any animal to access its dedicated research file with live field sightings from global research networks.',
      search_placeholder: 'Search marine animals by common name, scientific classification, or description...',
      filter_all: 'All Creatures',
      filter_fish: '🐟 Fish',
      filter_mammals: '🐋 Mammals',
      filter_reptiles: '🐢 Reptiles',
      filter_inverts: '🐙 Invertebrates',
      btn_view_details: 'View Details',
      btn_back_gallery: 'Back to Marine Gallery',

      // Animal Detail General
      detail_stats_habitat: 'Habitat',
      detail_stats_diet: 'Diet',
      detail_stats_lifespan: 'Average Lifespan',
      detail_threats_title: 'Environmental Threats & Conservation',
      detail_sightings_title: 'Recent Field Sightings',
      detail_sightings_sub: 'Real-world research observations',

      // Explorer Page
      env_section_tag: 'Section A • Biome Telemetry',
      env_section_title: 'INTERACTIVE OCEAN EXPLORER',
      env_section_desc: 'Navigate between five distinct planetary underwater environments. Inspect unique ambient parameters, thermal regimes, and indigenous species.',
      env_tab_coral: '🪸 Coral Reefs',
      env_tab_deep: '🌌 Deep Sea Abyss',
      env_tab_open: '🌊 Open Ocean (Pelagic)',
      env_tab_polar: '❄️ Polar Ocean',
      env_tab_caves: '🦇 Underwater Caves',
      env_fauna_title: 'Indigenous Fauna:',

      pollution_section_tag: 'Section B • Ecological Crisis',
      pollution_section_title: 'THE CRISIS BENEATH THE SURFACE',
      pollution_section_desc: 'Human industrial activity is destabilizing ancient marine equilibriums. Examine the six critical pressures threatening our global waters.',
      slider_title: 'INTERACTIVE COMPARISON: Healthy Coral Reef vs. Polluted Wasteland',
      slider_desc: 'Drag the interactive cyan center handle left and right to witness the devastating contrast of human impact.',
      badge_polluted: '⚠️ Polluted & Bleached Reef',
      badge_healthy: '🌿 Pristine Living Sanctuary',

      game_section_tag: 'Section C • Interactive Simulation',
      game_section_title: 'OCEAN CLEANUP SORTING MISSION',
      game_section_desc: 'Marine debris is choking our coastal waters. Drag each floating waste object from the water pool into its correct recycling or containment bin before it damages the marine ecosystem!',
      game_score_label: 'Eco Score',
      game_streak_label: 'Clean Streak',
      game_progress_label: 'Mission Progress',
      game_reset_btn: 'Reset Simulation',
      game_drag_instruction: '↓ Drag floating items below into their corresponding categories ↓',
      game_win_title: 'HARBOR CLEANED & RESTORED!',
      game_win_score: 'Your Eco Score:',
      game_play_again: 'Play Simulation Again',

      pledge_section_tag: 'Section D • Tangible Action',
      pledge_section_title: 'THE OCEAN GUARDIAN PLEDGE',
      pledge_section_desc: 'Every conservation journey starts with everyday individual habits. Select the environmental actions you pledge to uphold. Your progress is saved locally to your device.',
      pledge_commit_title: 'Your Conservation Commitment',
      pledge_score_label: 'Commitment Score',
      pledge_join_btn: 'Join The Ocean Explorer Community',

      // Auth Page
      auth_title: 'EXPLORER PORTAL',
      auth_sub: 'Secure access to the global Ocean Life community',
      auth_tab_signin: 'Sign In',
      auth_tab_signup: 'Create Account',
      auth_email_label: 'Email Address',
      auth_pwd_label: 'Password',
      auth_remember: 'Remember me',
      auth_forgot: 'Forgot password?',
      auth_signin_btn: 'Sign In to Ocean Explorer',
      auth_name_label: 'Full Name',
      auth_create_pwd_label: 'Create Password',
      auth_pwd_hint: 'At least 8 characters with letters, numbers & symbols.',
      auth_confirm_pwd_label: 'Confirm Password',
      auth_signup_btn: 'Create Explorer Account',

      // Welcome Page
      welcome_tag: 'Verified Explorer Session',
      welcome_h1_1: 'WELCOME TO THE',
      welcome_h1_2: 'OCEAN EXPLORER COMMUNITY',
      welcome_desc: 'You are now part of an international alliance of oceanographers, marine biologists, divers, and planetary citizens dedicated to investigating and defending our blue biosphere.',
      welcome_logout: 'Sign Out',
      welcome_act1_title: 'Explore Marine Life',
      welcome_act1_desc: 'Access the verified scientific taxonomy database, filter by biological classification, and track live wild sightings recorded across global research coordinates.',
      welcome_act1_btn: 'Launch Species Catalog',
      welcome_act2_title: 'Start Ocean Explorer',
      welcome_act2_desc: 'Explore interactive underwater ecosystems ranging from sun-drenched shallow coral atolls to subterranean blue caves and the abyssal trench depths.',
      welcome_act2_btn: 'Enter Virtual Biomes',
      welcome_act3_title: 'Protect The Ocean',
      welcome_act3_desc: 'Play the interactive pollution debris sorting simulation, explore before-and-after reef degradation data, and record your conservation pledges.',
      welcome_act3_btn: 'Engage In Conservation',

      // Footer
      footer_desc: 'Dedicated to illuminating the mysteries of the oceanic depths, celebrating marine biodiversity, and driving global ocean preservation.',
      footer_quote: '"The sea, once it casts its spell, holds one in its net of wonder forever."',
      footer_quote_author: '— Jacques-Yves Cousteau',
      footer_nav_title: 'Navigation',
      footer_zones_title: 'Ocean Zones',
      footer_api_title: 'API Integrations',
      footer_copy: '© 2026 OCEAN LIFE – Explore the Unknown. Crafted for ocean conservation and scientific literacy.'
    },

    ar: {
      // Navigation
      nav_brand_title: 'حياة المحيط',
      nav_brand_tag: 'استكشف الأعماق',
      nav_home: 'الرئيسية',
      nav_about: 'عن المحيط',
      nav_marine: 'الحياة البحرية',
      nav_explorer: 'مستكشف المحيط',
      nav_login: 'تسجيل الدخول',
      nav_community: 'مجتمع المستكشفين',
      sound_title_on: 'الصوت: مشغل',
      sound_title_off: 'الصوت: متوقف',

      // Hero
      hero_tag: 'الحدود الكوكبية الأخيرة',
      hero_title_1: 'اغوص في',
      hero_title_2: 'المجهول',
      hero_subtitle: 'اكتشف عجائب محيطاتنا الخفية، وتعرف على الكائنات البحرية الاستثنائية، واستكشف أسرار العالم المائي العميق.',
      hero_btn_explore: 'استكشف المحيط',
      hero_btn_marine: 'اكتشف الكائنات البحرية',
      hero_scroll: 'مرر لأسفل للاستكشاف',

      // Ticker
      ticker_live: 'بيانات الأقمار الصناعية لعلوم المحيطات مباشرة',
      ticker_source: 'بيانات فورية من NOAA و Open-Meteo',

      // 3 Cards
      cards_section_tag: 'مسارات تفاعلية',
      cards_section_title: 'اختر وجهة هبوطك',
      cards_section_desc: 'انطلق في رحلة عبر خمسة محيطات عالمية، وتعرّف على الحياة البرية السابحة، وكن جزءاً من الحركة البيئية الحيوية للحفاظ على كرتنا الزرقاء.',
      card_1_title: 'اكتشف حياة المحيط',
      card_1_desc: 'استكشف فيزياء المحيطات، وطبقات الأعماق، وعجائب الجيولوجيا البحرية عبر 5 محيطات عالمية من المياه السطحية المشمسة حتى الهاوية السحيقة.',
      card_1_btn: 'ادخل العالم تحت الأمواج',
      card_2_title: 'استكشف الكائنات البحرية',
      card_2_desc: 'تصفح موسوعتنا العلمية للتنوع البيولوجي مع مشاهدات حية مباشرة موثقة من شبكات الأبحاث العالمية iNaturalist و GBIF.',
      card_2_btn: 'عرض معرض الكائنات',
      card_3_title: 'احمِ محيطاتنا',
      card_3_desc: 'خض تحدي مكافحة التلوث، واختبر مهاراتك في محاكاة فرز النفايات المائية، والتزم بتعهدات حقيقية لإنقاذ الحياة البحرية.',
      card_3_btn: 'ابدأ حماية المحيط',

      // Stats
      stats_tag: 'قياسات علمية دقيقة',
      stats_title: 'القلب الأزرق لكوكب الأرض',
      stats_desc: 'بيانات بحرية حقيقية توثق عظمة وأسرار مياه كوكبنا الشاسعة.',
      stat_species: 'الأنواع البحرية المعروفة',
      stat_coverage: 'تغطية سطح كوكب الأرض',
      stat_oceans: 'أحواض المحيطات العالمية',
      stat_depth: 'متوسط عمق المياه البحرية',

      // About Page
      about_tag: 'نظرة عامة على علوم المحيطات',
      about_title: 'العالم تحت الأمواج',
      about_desc: 'شاسع وعميق وضروري لبقاء كل أشكال الحياة الأرضية؛ محيطنا العالمي هو غلاف مائي حيوي متصل يحتوي على 97% من مياه الكوكب.',
      about_image_title: 'مهد الحياة الكوكبية',
      about_image_sub: '3.8 مليار سنة من التطور البيولوجي البحري المتواصل',
      about_q1_title: 'ما هو المحيط؟',
      about_q1_desc: 'المحيط هو مسطح مائي ملحي متصل يغطي 361 مليون كيلومتر مربع (71%) من سطح الكوكب. يحتوي على أكثر من 1.33 مليار كيلومتر مكعب من المياه بمتوسط ملوحة 35 جزءاً في الألف، مشكلاً أكبر خزان حراري على وجه الأرض.',
      about_q2_title: 'لماذا تعتبر المحيطات بالغة الأهمية؟',
      about_q2_desc: 'كل نفس ثانٍ نتنفسه يأتي من المحيط! العوالق النباتية البحرية (مثل Prochlorococcus و Diatoms) تنتج ما بين 50% إلى 80% من الأكسجين الجوي العالمي. كما يؤمّن المحيط الأمن الغذائي لثلاثة مليارات إنسان.',
      about_q3_title: 'كيف تنظم المحيطات مناخ الأرض؟',
      about_q3_desc: 'تمتص المحيطات 90% من الحرارة الزائدة الناتجة عن الاحتباس الحراري ونحو 30% من انبعاثات الكربون. ويقوم الحزام الناقل العالمي للمحيطات بنقل المياه الدافئة من خط الاستواء إلى القطبين لتلطيف طقس القارات.',
      about_q4_title: 'ما الذي يعيش في الأعماق؟',
      about_q4_desc: 'يقدّر العلماء وجود ما بين 700 ألف إلى مليون نوع بحري، ومع ذلك لم يتم وصف سوى 25% منها علمياً حتى الآن. تمتد الحياة من العوالق المجهرية الدقيقة حتى الحوت الأزرق العملاق بوزن 190 طناً.',
      oceans_section_tag: 'أحواض المحيطات الكبرى',
      oceans_section_title: 'المحيطات الخمسة',
      oceans_section_desc: 'انقر على أي محيط للاطلاع على حدوده الجغرافية، وأعمق خنادقه، وكائناته النادرة، وخصائصه المائية الفريدة.',
      ocean_btn_explore: 'استكشف الحقائق',

      // Depth Explorer
      depth_section_tag: 'التدرج العمودي للأعماق',
      depth_section_title: 'مستكشف أعماق المحيط',
      depth_section_desc: 'اهبط عبر طبقات المحيط الخمس الرأسية. شاهد كيف يتلاشى الضوء، ويتصاعد الضغط الهيدروستاتيكي، وتظهر تكيفات كائنات الأعماق المذهلة.',
      gauge_range: 'نطاق العمق',
      gauge_light: 'مستوى الإضاءة',
      gauge_pressure: 'الضغط الجوي',
      gauge_temp: 'درجة الحرارة',
      depth_creatures_label: 'أبرز الكائنات الحية في هذه الطبقة:',

      // Marine Life Page
      marine_tag: 'كتالوج التنوع البيولوجي',
      marine_title: 'تعرف على كائنات الأعماق',
      marine_desc: 'استكشف 12 نوعاً بحرياً شهيراً تضم الأسماك، الثدييات، الزواحف، واللافقاريات. انقر على أي كائن لفتح ملفه العلمي المخصص مع مشاهدات حية من شبكات الأبحاث العالمية.',
      search_placeholder: 'ابحث عن الكائنات البحرية بالاسم، التصنيف العلمي، أو الخصائص...',
      filter_all: 'جميع الكائنات',
      filter_fish: '🐟 الأسماك',
      filter_mammals: '🐋 الثدييات',
      filter_reptiles: '🐢 الزواحف',
      filter_inverts: '🐙 اللافقاريات',
      btn_view_details: 'عرض التفاصيل',
      btn_back_gallery: 'العودة لمعرض الكائنات',

      // Animal Detail General
      detail_stats_habitat: 'الموطن',
      detail_stats_diet: 'النظام الغذائي',
      detail_stats_lifespan: 'متوسط العمر',
      detail_threats_title: 'التهديدات البيئية وجهود الحماية',
      detail_sightings_title: 'أحدث المشاهدات الميدانية المباشرة',
      detail_sightings_sub: 'سجلات بحثية موثقة حول العالم',

      // Explorer Page
      env_section_tag: 'القسم أ • قياسات البيئات البحرية',
      env_section_title: 'مستكشف بيئات المحيط التفاعلي',
      env_section_desc: 'تنقل بين خمس بيئات بحرية فريدة على كوكب الأرض. تفحص المعايير الفيزيائية، وتدرج درجات الحرارة، والأنواع المتوطنة فيها.',
      env_tab_coral: '🪸 الشعاب المرجانية',
      env_tab_deep: '🌌 أعماق البحار السحيقة',
      env_tab_open: '🌊 المحيط المفتوح',
      env_tab_polar: '❄️ المحيط القطبي المتجمد',
      env_tab_caves: '🦇 الكهوف المائية والفتحات الزرقاء',
      env_fauna_title: 'الكائنات البحرية المتوطنة:',

      pollution_section_tag: 'القسم ب • الأزمة البيئية',
      pollution_section_title: 'الأزمة تحت السطح',
      pollution_section_desc: 'النشاط الصناعي البشري يهدد التوازنات البحرية التي استمرت لملايين السنين. تفحص العوامل الستة الحرجة التي تفتك بمياهنا.',
      slider_title: 'مقارنة تفاعلية: شعاب مرجانية حية وسليمة مقابل شعاب ملوثة ومتبيضة',
      slider_desc: 'اسحب مقبض المقارنة يميناً ويساراً لترى التباين الصادم والمدمر لتأثير التلوث البشري.',
      badge_polluted: '⚠️ شعاب ملوثة ومتبيضة',
      badge_healthy: '🌿 محمية بحرية نقية ونابضة',

      game_section_tag: 'القسم ج • محاكاة تعليمية تفاعلية',
      game_section_title: 'مهمة تنظيف وفرز نفايات المحيط',
      game_section_desc: 'المخلفات البحرية تخنق مياهنا الساحلية. اسحب كل جسم عائم في حوض المياه وضعه في حاوية إعادة التدوير المناسبة قبل أن يفتك بالحياة البحرية!',
      game_score_label: 'النقاط البيئية',
      game_streak_label: 'تتابع الصواب',
      game_progress_label: 'تقدم المهمة',
      game_reset_btn: 'إعادة المحاكاة',
      game_drag_instruction: '↓ اسحب المخلفات العائمة وضعها في حاويات الفرز المخصصة ↓',
      game_win_title: 'تم تنظيف وحماية الخليج البحري بنجاح!',
      game_win_score: 'مجموع نقاطك البيئية:',
      game_play_again: 'العب المحاكاة مجدداً',

      pledge_section_tag: 'القسم د • مبادرات عملية حقيقية',
      pledge_section_title: 'ميثاق حامي المحيطات',
      pledge_section_desc: 'تبدأ كل مبادرة بيئية من العادات الفردية اليومية. حدد الالتزامات التي تتعهد بتطبيقها في حياتك. يتم حفظ تقدمك تلقائياً على جهازك.',
      pledge_commit_title: 'مستوى التزامك بحماية البيئة البحرية',
      pledge_score_label: 'درجة الالتزام',
      pledge_join_btn: 'انضم لمجتمع مستكشفي المحيطات',

      // Auth Page
      auth_title: 'بوابة المستكشفين',
      auth_sub: 'وصول آمن لمجتمع حياة المحيط الدولي',
      auth_tab_signin: 'تسجيل الدخول',
      auth_tab_signup: 'إنشاء حساب جديد',
      auth_email_label: 'البريد الإلكتروني',
      auth_pwd_label: 'كلمة المرور',
      auth_remember: 'تذكرني على هذا الجهاز',
      auth_forgot: 'نسيت كلمة المرور؟',
      auth_signin_btn: 'الدخول إلى مستكشف المحيط',
      auth_name_label: 'الاسم الكامل',
      auth_create_pwd_label: 'إنشاء كلمة مرور',
      auth_pwd_hint: '8 أحرف على الأقل تحتوي حروفا وأرقاما ورموزا.',
      auth_confirm_pwd_label: 'تأكيد كلمة المرور',
      auth_signup_btn: 'إنشاء حساب مستكشف جديد',

      // Welcome Page
      welcome_tag: 'جلسة مستكشف معتمدة',
      welcome_h1_1: 'مرحباً بك في',
      welcome_h1_2: 'مجتمع مستكشفي المحيطات',
      welcome_desc: 'أنت الآن جزء من تحالف دولي يضم علماء المحيطات، وعلماء الأحياء البحرية، والغواصين، والمدافعين عن حماية الغلاف المائي لكوكبنا.',
      welcome_logout: 'تسجيل الخروج',
      welcome_act1_title: 'استكشف الحياة البحرية',
      welcome_act1_desc: 'تصفح قاعدة البيانات التصنيفية العلمية، وفلتر الكائنات حسب الرتب، وتابع المشاهدات الميدانية المباشرة حول العالم.',
      welcome_act1_btn: 'فتح كتالوج الكائنات',
      welcome_act2_title: 'ابدأ استكشاف المحيط',
      welcome_act2_desc: 'اكتشف الأنظمة البيئية الافتراضية من الشعاب المرجانية الضحلة حتى الكهوف الزرقاء وأعماق الخنادق السحيقة.',
      welcome_act2_btn: 'دخول البيئات الافتراضية',
      welcome_act3_title: 'احمِ البيئة البحرية',
      welcome_act3_desc: 'خض محاكاة فرز النفايات المائية التفاعلية، وتفحص بيانات تدهور الشعاب المرجانية، وسجل عهودك البيئية.',
      welcome_act3_btn: 'المشاركة في جهود الحماية',

      // Footer
      footer_desc: 'منصة مخصصة لكشف أسرار الأعماق البحرية، والاحتفاء بالتنوع البيولوجي، وقيادة جهود الحفاظ على المحيطات عالمياً.',
      footer_quote: '«البحر متى ما ألقى سحره عليك، يبقيك في شباك دهشته وإعجابه إلى الأبد.»',
      footer_quote_author: '— جاك إيف كوستو',
      footer_nav_title: 'روابط التنقل',
      footer_zones_title: 'طبقات المحيط',
      footer_api_title: 'مصادر البيانات الحية',
      footer_copy: '© 2026 حياة المحيط – استكشف المجهول. صُمم لنشر الوعي العلمي وحماية البيئة البحرية.'
    }
  };

  class I18nEngine {
    constructor() {
      this.currentLang = 'en';
      this.init();
    }

    init() {
      const savedLang = localStorage.getItem(LANG_KEY);
      if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
        this.currentLang = savedLang;
      } else {
        // Detect browser language
        const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        if (browserLang.startsWith('ar')) {
          this.currentLang = 'ar';
        } else {
          this.currentLang = 'en';
        }
      }

      this.applyLanguage(this.currentLang, false);
      this.setupListener();
    }

    t(key) {
      if (translations[this.currentLang] && translations[this.currentLang][key]) {
        return translations[this.currentLang][key];
      }
      if (translations.en && translations.en[key]) {
        return translations.en[key];
      }
      return key;
    }

    applyLanguage(lang, showNotification = true) {
      this.currentLang = lang;
      localStorage.setItem(LANG_KEY, lang);

      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

      // Translate text nodes with data-i18n
      const translatableElements = document.querySelectorAll('[data-i18n]');
      translatableElements.forEach((el) => {
        const key = el.getAttribute('data-i18n');
        const translated = this.t(key);
        if (translated && translated !== key) {
          el.textContent = translated;
        }
      });

      // Translate inputs with data-i18n-placeholder
      const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
      placeholderElements.forEach((el) => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translated = this.t(key);
        if (translated && translated !== key) {
          el.setAttribute('placeholder', translated);
        }
      });

      this.updateUI();

      window.dispatchEvent(new CustomEvent('ocean:languageChanged', { detail: { lang } }));

      if (showNotification && window.showToast) {
        const msg = lang === 'ar' ? 'تم تحويل لغة الموقع إلى العربية 🇸🇦' : 'Website language switched to English 🌐';
        window.showToast(msg, 'info');
      }
    }

    toggle() {
      const nextLang = this.currentLang === 'en' ? 'ar' : 'en';
      this.applyLanguage(nextLang, true);
      return this.currentLang;
    }

    updateUI() {
      const langBtns = document.querySelectorAll('.lang-toggle-btn');
      langBtns.forEach((btn) => {
        const labelSpan = btn.querySelector('.lang-btn-label');
        if (labelSpan) {
          labelSpan.textContent = this.currentLang === 'en' ? 'عربي' : 'EN';
        } else {
          btn.textContent = this.currentLang === 'en' ? 'عربي' : 'English';
        }
        btn.setAttribute('title', this.currentLang === 'en' ? 'التحويل إلى العربية' : 'Switch to English');
        btn.setAttribute('aria-label', this.currentLang === 'en' ? 'التحويل إلى العربية' : 'Switch to English');
      });
    }

    setupListener() {
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('.lang-toggle-btn');
        if (btn) {
          this.toggle();
        }
      });
    }
  }

  // Pre-seed attributes on html root immediately
  const initialLang = localStorage.getItem(LANG_KEY) || 'en';
  document.documentElement.setAttribute('lang', initialLang);
  document.documentElement.setAttribute('dir', initialLang === 'ar' ? 'rtl' : 'ltr');

  window.oceanI18n = new I18nEngine();

  document.addEventListener('DOMContentLoaded', () => {
    window.oceanI18n.applyLanguage(window.oceanI18n.currentLang, false);
  });
})();

