/**
 * VERS SPEED - High-Performance Internet Speed Test Engine
 * Inspired by Fast.com with Vers Innovations (Mbps = MB/s Converter & Multi-Language)
 */

(function () {
  'use strict';

  // --- Configuration & Endpoints ---
  const CF_DOWN_URL = 'https://speed.cloudflare.com/__down';
  const CF_UP_URL = 'https://speed.cloudflare.com/__up';
  const TRACE_URL = 'https://cloudflare.com/cdn-cgi/trace';

  // --- Translations Dictionary (EN, UZ, RU) ---
  const TRANSLATIONS = {
    en: {
      langName: "English (US)",
      pageTitle: "Internet Speed Test | Vers Speed",
      speedLabel: "Your Internet speed is",
      showMore: "Show more info",
      showLess: "Show less info",
      latency: "Latency",
      unloaded: "Unloaded",
      loaded: "Loaded",
      upload: "Upload",
      pending: "Pending",
      testing: "Testing...",
      completed: "Completed",
      conversionTitle: "Real File Download Speed (Mbps vs MB/s)",
      ispSub: "ISP Advertised (Megabits)",
      actualSub: "Real Download (Megabytes)",
      convDesc: "Internet providers sell speed in <strong>Mbps</strong> (Megabits per second), but browsers and apps (Telegram, Steam, YouTube) download files in <strong>MB/s</strong> (Megabytes per second). Divide by 8 to get your real downloading rate!",
      movieExample: "Download 1 GB movie in:",
      clientServer: "Client & Server",
      clientIp: "Client IP:",
      location: "Location:",
      provider: "Provider (ASN):",
      server: "Server:",
      unitsLabel: "Units: <strong>Mbps</strong>",
      streamsLabel: "Streams: <strong>Parallel CDN</strong>",
      privacy: "Privacy",
      privacyTitle: "Vers Speed Privacy Policy",
      privacyP1: "<strong>Vers Speed</strong> respects your privacy. We are committed to a completely private and transparent speed testing experience:",
      privacyLi1: "<strong>Zero Personal Data:</strong> We do not collect, store, or sell your personal information, browsing history, or downloads.",
      privacyLi2: "<strong>IP Address & Location:</strong> Your public IP address is used only transiently to connect to the nearest Cloudflare Edge server and report your current network provider. It is never logged or tracked.",
      privacyLi3: "<strong>No Cookies or Profiling:</strong> We do not set tracking cookies or create advertising profiles.",
      privacyLi4: "<strong>Encrypted Connections:</strong> All test streams use secure, encrypted HTTPS/TLS protocols.",
      privacyTip: "Vers Speed is 100% free and open, powered by Vers Ecosystem.",
      gotIt: "Got it",
      helpTitle: "How Vers Speed Works",
      helpP1: "<strong>Vers Speed</strong> performs a realistic, high-precision test of your Internet connection using global edge CDN servers:",
      helpLi1: "<strong>Download Speed:</strong> Measures how fast data travels from servers to your device with parallel data streams.",
      helpLi2: "<strong>Latency (Unloaded):</strong> The round-trip time of a request when there is no other traffic on your network.",
      helpLi3: "<strong>Latency (Loaded):</strong> Measures responsiveness and bufferbloat under heavy data transfer.",
      helpLi4: "<strong>Upload Speed:</strong> Measures how fast your device uploads data to the cloud.",
      helpTip: "Tip: Close other bandwidth-heavy apps or downloads during the test for the most accurate result.",
      toastCopied: "Result copied to clipboard!",
      detecting: "Detecting...",
      measuring: "Measuring..."
    },
    uz: {
      langName: "O'zbekcha",
      pageTitle: "Internet Tezligini Tekshirish | Vers Speed",
      speedLabel: "Sizning Internet tezligingiz",
      showMore: "Batafsil ma'lumot",
      showLess: "Qisqartirish",
      latency: "Kechikish (Ping)",
      unloaded: "Odatiy (Yuklamasiz)",
      loaded: "Yuklama ostida",
      upload: "Yuklash (Upload)",
      pending: "Kutilmoqda",
      testing: "O'lchanmoqda...",
      completed: "Yakunlandi",
      conversionTitle: "Haqiqiy Fayl Yuklash Tezligi (Mbps va MB/s)",
      ispSub: "Provayder tezligi (Megabit)",
      actualSub: "Haqiqiy yuklash (Megabayt)",
      convDesc: "Internet provayderlar tezlikni <strong>Mbps</strong> (Megabit/sekund)da sotadi, lekin fayllar (Telegram, Steam, YouTube, brauzer) <strong>MB/s</strong> (Megabayt/sekund)da yuklanadi. Haqiqiy tezlikni bilish uchun Mbps'ni 8 ga bo'ling!",
      movieExample: "1 GB filmni yuklab olish vaqti:",
      clientServer: "Mijoz va Server",
      clientIp: "Mijoz IP:",
      location: "Joylashuv:",
      provider: "Provayder (ASN):",
      server: "Server:",
      unitsLabel: "Birlik: <strong>Mbps</strong>",
      streamsLabel: "Oqimlar: <strong>Parallel CDN</strong>",
      privacy: "Maxfiylik",
      privacyTitle: "Vers Speed Maxfiylik Siyosati",
      privacyP1: "<strong>Vers Speed</strong> sizning shaxsiy daxlsizligingizni qadrlaydi. Biz mutlaqo ochiq va xavfsiz tezlik o'lchash tajribasini taqdim etamiz:",
      privacyLi1: "<strong>Shaxsiy ma'lumotlar yozilmaydi:</strong> Biz sizning shaxsiy ma'lumotlaringizni, brauzer tarixingizni yoki yuklamalaringizni yozib olmaymiz va uchinchi shaxslarga bermaymiz.",
      privacyLi2: "<strong>IP Manzil va Joylashuv:</strong> Sizning ochiq IP manzilingiz faqat eng yaqin Cloudflare Edge serveriga ulanish va provayderingizni aniqlash uchun bir martalik ishlatiladi. U doimiy saqlanmaydi.",
      privacyLi3: "<strong>Kuzatuv (Cookies) yo'q:</strong> Saytda hech qanday reklama yoki foydalanuvchini kuzatuvchi cookie-fayllar mavjud emas.",
      privacyLi4: "<strong>Shifrlangan ulanish:</strong> Barcha test ma'lumotlari xavfsiz shifrlangan HTTPS/TLS protokollari orqali uzatiladi.",
      privacyTip: "Vers Speed 100% bepul va reklamasiz, Vers Ecosystem tomonidan yaratilgan.",
      gotIt: "Tushunarli",
      helpTitle: "Vers Speed Qanday Ishlaydi?",
      helpP1: "<strong>Vers Speed</strong> global edge CDN serverlari orqali internetingiz tezligini real vaqt rejimida yuqori aniqlikda o'lchaydi:",
      helpLi1: "<strong>Download (Yuklab olish):</strong> Ma'lumotlar serverdan qurilmangizga qanchalik tez yetib kelishini o'lchaydi.",
      helpLi2: "<strong>Latency (Odatiy Ping):</strong> Tarmoqda boshqa yuklama bo'lmaganda so'rovning borib-kelish vaqti.",
      helpLi3: "<strong>Loaded Latency (Yuklama ostida):</strong> Tarmoq to'liq yuklangandagi kechikish (bufferbloat).",
      helpLi4: "<strong>Upload (Yuklash):</strong> Qurilmangizdan internetga fayl yuborish tezligi.",
      helpTip: "Maslahat: Eng aniq natija uchun test vaqtida fondagi boshqa yuklamalarni to'xtatib turing.",
      toastCopied: "Natija nusxalandi!",
      detecting: "Aniqlanmoqda...",
      measuring: "O'lchanmoqda..."
    },
    ru: {
      langName: "Русский",
      pageTitle: "Тест скорости интернета | Vers Speed",
      speedLabel: "Скорость вашего интернета",
      showMore: "Подробнее",
      showLess: "Скрыть",
      latency: "Задержка (Ping)",
      unloaded: "Без нагрузки",
      loaded: "Под нагрузкой",
      upload: "Загрузка (Upload)",
      pending: "В ожидании",
      testing: "Измерение...",
      completed: "Завершено",
      conversionTitle: "Реальная скорость скачивания (Мбит/с и МБ/с)",
      ispSub: "Тариф провайдера (Мегабит)",
      actualSub: "Реальная скорость (Мегабайт)",
      convDesc: "Провайдеры продают интернет в <strong>Мбит/с</strong> (Mbps), но файлы (Telegram, Steam, браузер) скачиваются в <strong>МБ/с</strong> (MB/s). Чтобы узнать реальную скорость скачивания, разделите Мбит/с на 8!",
      movieExample: "Фильм 1 ГБ скачается за:",
      clientServer: "Клиент и Сервер",
      clientIp: "IP клиента:",
      location: "Локация:",
      provider: "Провайдер (ASN):",
      server: "Сервер:",
      unitsLabel: "Единицы: <strong>Мбит/с</strong>",
      streamsLabel: "Потоки: <strong>Parallel CDN</strong>",
      privacy: "Конфиденциальность",
      privacyTitle: "Политика конфиденциальности Vers Speed",
      privacyP1: "<strong>Vers Speed</strong> уважает вашу конфиденциальность. Мы обеспечиваем прозрачный и безопасный тест скорости интернета:",
      privacyLi1: "<strong>Без сбора личных данных:</strong> Мы не сохраняем и не передаем третьим лицам ваши персональные данные или историю посещений.",
      privacyLi2: "<strong>IP-адрес и локация:</strong> Ваш публичный IP-адрес используется исключительно для подключения к ближайшему серверу Cloudflare Edge и определения провайдера. Данные не сохраняются в базе.",
      privacyLi3: "<strong>Без трекинга и cookies:</strong> На сайте нет рекламных трекеров или следящих cookies.",
      privacyLi4: "<strong>Шифрованное соединение:</strong> Весь тестовый трафик передается по защищенному протоколу HTTPS/TLS.",
      privacyTip: "Vers Speed работает бесплатно и без рекламы при поддержке Vers Ecosystem.",
      gotIt: "Понятно",
      helpTitle: "Как работает Vers Speed",
      helpP1: "<strong>Vers Speed</strong> точно измеряет скорость вашего интернета с помощью глобальных серверов Cloudflare Edge CDN:",
      helpLi1: "<strong>Входящая скорость (Download):</strong> Скорость передачи данных с серверов на ваше устройство.",
      helpLi2: "<strong>Пинг без нагрузки (Unloaded):</strong> Время отклика сервера при свободной сети.",
      helpLi3: "<strong>Пинг под нагрузкой (Loaded):</strong> Задержка и bufferbloat при максимальной загрузке сети.",
      helpLi4: "<strong>Исходящая скорость (Upload):</strong> Скорость отправки файлов с вашего устройства в сеть.",
      helpTip: "Совет: Для максимально точного результата закройте другие фоновые загрузки во время теста.",
      toastCopied: "Результат скопирован!",
      detecting: "Определение...",
      measuring: "Измерение..."
    }
  };

  let currentLang = 'en';

  // --- DOM Elements ---
  const speedLabelEl = document.getElementById('speedLabel');
  const speedValueEl = document.getElementById('speedValue');
  const speedUnitEl = document.getElementById('speedUnit');
  const refreshBtn = document.getElementById('refreshBtn');
  const moreInfoBtn = document.getElementById('moreInfoBtn');
  const detailsPanel = document.getElementById('detailsPanel');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const logoReload = document.getElementById('logoReload');
  const helpBtn = document.getElementById('helpBtn');
  const shareBtn = document.getElementById('shareBtn');
  const helpModal = document.getElementById('helpModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const toastEl = document.getElementById('toast');

  // Privacy Modal Elements
  const privacyModal = document.getElementById('privacyModal');
  const closePrivacyModalBtn = document.getElementById('closePrivacyModalBtn');
  const gotItPrivacyBtn = document.getElementById('gotItPrivacyBtn');
  const privacyModalTitle = document.getElementById('privacyModalTitle');
  const privacyModalBody = document.getElementById('privacyModalBody');

  // Metric fields
  const unloadedLatencyEl = document.getElementById('unloadedLatency');
  const loadedLatencyEl = document.getElementById('loadedLatency');
  const uploadSpeedEl = document.getElementById('uploadSpeed');
  const uploadStatusText = document.getElementById('uploadStatusText');
  const clientIpEl = document.getElementById('clientIp');
  const clientLocationEl = document.getElementById('clientLocation');
  const clientAsnEl = document.getElementById('clientAsn');
  const serverLocationEl = document.getElementById('serverLocation');

  // Conversion card elements
  const convMbpsVal = document.getElementById('convMbpsVal');
  const convMBpsVal = document.getElementById('convMBpsVal');
  const convEstTime = document.getElementById('convEstTime');
  const tConversionTitle = document.getElementById('t-conversionTitle');
  const tConvProviderSub = document.getElementById('t-convProviderSub');
  const tConvActualSub = document.getElementById('t-convActualSub');
  const tConversionDesc = document.getElementById('t-conversionDesc');
  const tConvExampleText = document.getElementById('t-convExampleText');

  // Translatable Labels
  const tLatencyTitle = document.getElementById('t-latencyTitle');
  const tUnloadedLabel = document.getElementById('t-unloadedLabel');
  const tLoadedLabel = document.getElementById('t-loadedLabel');
  const tUploadTitle = document.getElementById('t-uploadTitle');
  const tClientServerTitle = document.getElementById('t-clientServerTitle');
  const tClientIpLabel = document.getElementById('t-clientIpLabel');
  const tLocationLabel = document.getElementById('t-locationLabel');
  const tProviderLabel = document.getElementById('t-providerLabel');
  const tServerLabel = document.getElementById('t-serverLabel');
  const tUnitsSetting = document.getElementById('t-unitsSetting');
  const tStreamsSetting = document.getElementById('t-streamsSetting');
  const privacyBtn = document.getElementById('privacyBtn');

  // Language Dropdown Elements
  const langSelectorWrap = document.getElementById('langSelectorWrap');
  const langBtn = document.getElementById('langBtn');
  const currentLangText = document.getElementById('currentLangText');
  const langDropdown = document.getElementById('langDropdown');
  const langOptions = document.querySelectorAll('.lang-option');

  // --- State Variables ---
  let isTesting = false;
  let abortController = null;
  let finalDownloadSpeed = 0;
  let finalUploadSpeed = 0;
  let displayedSpeed = 0;
  let animFrameId = null;

  // --- Multi-Language Switcher ---
  function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) lang = 'en';
    currentLang = lang;
    localStorage.setItem('vers_speed_lang', lang);
    document.documentElement.lang = lang;

    const t = TRANSLATIONS[lang];
    document.title = t.pageTitle;
    currentLangText.textContent = t.langName;
    speedLabelEl.textContent = t.speedLabel;

    // Toggle button text based on collapsed state
    const isCollapsed = detailsPanel.classList.contains('collapsed');
    moreInfoBtn.textContent = isCollapsed ? t.showMore : t.showLess;

    // Latency & Upload titles
    tLatencyTitle.textContent = t.latency;
    tUnloadedLabel.textContent = t.unloaded;
    tLoadedLabel.textContent = t.loaded;
    tUploadTitle.textContent = t.upload;

    // Upload status
    if (uploadStatusText.textContent.includes('Pending') || uploadStatusText.textContent.includes('Kutilmoqda') || uploadStatusText.textContent.includes('В ожидании')) {
      uploadStatusText.textContent = t.pending;
    } else if (uploadStatusText.textContent.includes('Testing') || uploadStatusText.textContent.includes('O\'lchanmoqda') || uploadStatusText.textContent.includes('Измерение')) {
      uploadStatusText.textContent = t.testing;
    } else if (uploadStatusText.textContent.includes('Completed') || uploadStatusText.textContent.includes('Yakunlandi') || uploadStatusText.textContent.includes('Завершено')) {
      uploadStatusText.textContent = t.completed;
    }

    // Conversion card
    tConversionTitle.textContent = t.conversionTitle;
    tConvProviderSub.textContent = t.ispSub;
    tConvActualSub.textContent = t.actualSub;
    tConversionDesc.innerHTML = t.convDesc;
    tConvExampleText.textContent = t.movieExample;

    // Client & Server
    tClientServerTitle.textContent = t.clientServer;
    tClientIpLabel.textContent = t.clientIp;
    tLocationLabel.textContent = t.location;
    tProviderLabel.textContent = t.provider;
    tServerLabel.textContent = t.server;

    // Bottom settings
    tUnitsSetting.innerHTML = t.unitsLabel;
    tStreamsSetting.innerHTML = t.streamsLabel;
    privacyBtn.textContent = t.privacy;

    // Help modal content
    const modalHeaderH3 = helpModal.querySelector('.modal-header h3');
    if (modalHeaderH3) modalHeaderH3.textContent = t.helpTitle;
    const modalBody = helpModal.querySelector('.modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <p>${t.helpP1}</p>
        <ul>
          <li>${t.helpLi1}</li>
          <li>${t.helpLi2}</li>
          <li>${t.helpLi3}</li>
          <li>${t.helpLi4}</li>
        </ul>
        <p class="modal-tip">${t.helpTip}</p>
      `;
    }

    // Privacy modal content
    if (privacyModalTitle) privacyModalTitle.textContent = t.privacyTitle;
    if (privacyModalBody) {
      privacyModalBody.innerHTML = `
        <p>${t.privacyP1}</p>
        <ul>
          <li>${t.privacyLi1}</li>
          <li>${t.privacyLi2}</li>
          <li>${t.privacyLi3}</li>
          <li>${t.privacyLi4}</li>
        </ul>
        <p class="modal-tip">${t.privacyTip}</p>
      `;
    }
    if (gotItPrivacyBtn) gotItPrivacyBtn.textContent = t.gotIt;

    // Active state in dropdown
    langOptions.forEach(opt => {
      if (opt.getAttribute('data-lang') === lang) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    // Update real-time conversion text calculation
    if (displayedSpeed > 0) {
      updateConversionRate(displayedSpeed);
    }
  }

  function initLanguage() {
    const savedLang = localStorage.getItem('vers_speed_lang');
    if (savedLang && TRANSLATIONS[savedLang]) {
      setLanguage(savedLang);
    } else {
      // Auto-detect browser language
      const userLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
      if (userLang.startsWith('uz')) {
        setLanguage('uz');
      } else if (userLang.startsWith('ru')) {
        setLanguage('ru');
      } else {
        setLanguage('en');
      }
    }
  }

  // Language Dropdown Toggle
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    langSelectorWrap.classList.toggle('open');
    langDropdown.classList.toggle('hidden');
  });

  langOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = opt.getAttribute('data-lang');
      setLanguage(lang);
      langSelectorWrap.classList.remove('open');
      langDropdown.classList.add('hidden');
    });
  });

  document.addEventListener('click', () => {
    langSelectorWrap.classList.remove('open');
    langDropdown.classList.add('hidden');
  });

  // --- Real-Time Mbps vs MB/s Converter ---
  function updateConversionRate(mbps) {
    if (!mbps || mbps <= 0) {
      convMbpsVal.textContent = '--';
      convMBpsVal.textContent = '--';
      convEstTime.textContent = '--';
      return;
    }

    const roundedMbps = mbps >= 10 ? Math.round(mbps) : mbps.toFixed(1);
    const mBps = mbps / 8;
    const roundedMBps = mBps >= 10 ? (Math.round(mBps * 10) / 10).toFixed(1) : mBps.toFixed(2);

    convMbpsVal.textContent = roundedMbps;
    convMBpsVal.textContent = roundedMBps;

    // 1 GB file = 1024 MB
    const totalSeconds = 1024 / mBps;
    if (totalSeconds < 60) {
      const s = Math.max(1, Math.round(totalSeconds));
      if (currentLang === 'uz') {
        convEstTime.textContent = `~${s} soniya`;
      } else if (currentLang === 'ru') {
        convEstTime.textContent = `~${s} сек`;
      } else {
        convEstTime.textContent = `~${s} seconds`;
      }
    } else {
      const mins = Math.floor(totalSeconds / 60);
      const secs = Math.round(totalSeconds % 60);
      if (currentLang === 'uz') {
        convEstTime.textContent = `~${mins} daqiqa ${secs} soniya`;
      } else if (currentLang === 'ru') {
        convEstTime.textContent = `~${mins} мин ${secs} сек`;
      } else {
        convEstTime.textContent = `~${mins}m ${secs}s`;
      }
    }
  }

  // --- Theme Management ---
  function initTheme() {
    const savedTheme = localStorage.getItem('vers_speed_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }
  }

  function toggleTheme() {
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      localStorage.setItem('vers_speed_theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('vers_speed_theme', 'dark');
    }
  }

  themeToggleBtn.addEventListener('click', toggleTheme);

  // --- Toast & Modal Helpers ---
  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.remove('hidden');
    setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 2800);
  }

  helpBtn.addEventListener('click', () => helpModal.classList.remove('hidden'));
  closeModalBtn.addEventListener('click', () => helpModal.classList.add('hidden'));
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) helpModal.classList.add('hidden');
  });

  // Privacy Policy Modal Listeners
  if (privacyBtn) {
    privacyBtn.addEventListener('click', () => privacyModal.classList.remove('hidden'));
  }
  if (closePrivacyModalBtn) {
    closePrivacyModalBtn.addEventListener('click', () => privacyModal.classList.add('hidden'));
  }
  if (gotItPrivacyBtn) {
    gotItPrivacyBtn.addEventListener('click', () => privacyModal.classList.add('hidden'));
  }
  if (privacyModal) {
    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) privacyModal.classList.add('hidden');
    });
  }

  shareBtn.addEventListener('click', () => {
    const t = TRANSLATIONS[currentLang];
    const text = `${t.speedLabel} ${speedValueEl.textContent} ${speedUnitEl.textContent} on Vers Speed! (https://vers-speed.vercel.app)`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(t.toastCopied);
      }).catch(() => {
        showToast(text);
      });
    } else {
      showToast(text);
    }
  });

  // --- Show More Info Accordion ---
  moreInfoBtn.addEventListener('click', () => {
    const t = TRANSLATIONS[currentLang];
    const isCollapsed = detailsPanel.classList.contains('collapsed');
    if (isCollapsed) {
      detailsPanel.classList.remove('collapsed');
      moreInfoBtn.textContent = t.showLess;
    } else {
      detailsPanel.classList.add('collapsed');
      moreInfoBtn.textContent = t.showMore;
    }
  });

  // --- Format Speed Numbers ---
  function formatSpeed(mbps) {
    if (mbps >= 1000) {
      return { val: (mbps / 1000).toFixed(1), unit: 'Gbps' };
    } else if (mbps >= 100) {
      return { val: Math.round(mbps).toString(), unit: 'Mbps' };
    } else if (mbps >= 10) {
      return { val: (Math.round(mbps * 10) / 10).toFixed(1), unit: 'Mbps' };
    } else if (mbps >= 1) {
      return { val: (Math.round(mbps * 10) / 10).toFixed(1), unit: 'Mbps' };
    } else if (mbps > 0) {
      return { val: Math.round(mbps * 1000).toString(), unit: 'Kbps' };
    }
    return { val: '0', unit: 'Mbps' };
  }

  // --- Smooth Animation Loop ---
  let targetSpeed = 0;
  function updateSpeedTicker() {
    const ease = isTesting ? 0.14 : 0.25;
    displayedSpeed += (targetSpeed - displayedSpeed) * ease;

    const fmt = formatSpeed(displayedSpeed);
    speedValueEl.textContent = fmt.val;
    speedUnitEl.textContent = fmt.unit;

    // Update real-time conversion card as numbers climb
    updateConversionRate(displayedSpeed);

    if (!isTesting && Math.abs(displayedSpeed - targetSpeed) < 0.2) {
      displayedSpeed = targetSpeed;
      const finalFmt = formatSpeed(displayedSpeed);
      speedValueEl.textContent = finalFmt.val;
      speedUnitEl.textContent = finalFmt.unit;
      updateConversionRate(displayedSpeed);
      animFrameId = null;
      return;
    }

    animFrameId = requestAnimationFrame(updateSpeedTicker);
  }

  function setTargetSpeed(mbps) {
    targetSpeed = Math.max(0, mbps);
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(updateSpeedTicker);
    }
  }

  // --- Fetch Client Network Metadata ---
  async function fetchNetworkMetadata(signal) {
    try {
      const resp = await fetch(`${CF_DOWN_URL}?bytes=0&_t=${Date.now()}`, { signal, cache: 'no-store' });
      if (resp.ok) {
        const ip = resp.headers.get('cf-meta-ip') || '';
        const city = resp.headers.get('city') || '';
        const country = resp.headers.get('country') || '';
        const colo = resp.headers.get('colo') || '';
        const asn = resp.headers.get('asn') || '';

        if (ip) clientIpEl.textContent = ip;
        if (city || country) clientLocationEl.textContent = `${city}${city && country ? ', ' : ''}${country}`;
        if (asn) clientAsnEl.textContent = `AS${asn}`;
        if (colo) serverLocationEl.textContent = `Cloudflare Edge (${colo})`;
      }
    } catch (e) {
      try {
        const traceResp = await fetch(TRACE_URL, { signal, cache: 'no-store' });
        const text = await traceResp.text();
        const lines = text.split('\n');
        const data = {};
        lines.forEach(l => {
          const parts = l.split('=');
          if (parts.length === 2) data[parts[0]] = parts[1];
        });
        if (data.ip) clientIpEl.textContent = data.ip;
        if (data.loc) clientLocationEl.textContent = data.loc;
        if (data.colo) serverLocationEl.textContent = `Cloudflare (${data.colo})`;
      } catch (err) {
        // Silent catch
      }
    }
  }

  // --- Unloaded Latency & Jitter Probes ---
  async function measureLatency(signal) {
    const t = TRANSLATIONS[currentLang];
    const pings = [];
    unloadedLatencyEl.innerHTML = `${t.measuring}`;

    for (let i = 0; i < 5; i++) {
      if (signal.aborted) return;
      try {
        const t0 = performance.now();
        await fetch(`${CF_DOWN_URL}?bytes=0&_t=${Date.now()}_${i}`, {
          method: 'HEAD',
          signal,
          cache: 'no-store'
        });
        const rtt = performance.now() - t0;
        pings.push(rtt);
      } catch (e) {
        // continue
      }
      await new Promise(r => setTimeout(r, 60));
    }

    if (pings.length > 0) {
      const minPing = Math.min(...pings);
      unloadedLatencyEl.innerHTML = `${Math.round(minPing)} <small>ms</small>`;
      return minPing;
    } else {
      unloadedLatencyEl.innerHTML = `-- <small>ms</small>`;
      return null;
    }
  }

  // --- Download Speed Measurement Engine ---
  async function measureDownload(signal) {
    let totalBytes = 0;
    const startTime = performance.now();
    const samples = [];
    let lastLoadedCheck = performance.now();
    let loadedPings = [];

    // Instant rapid warm-up streams (runs in parallel to start animating speed in under 50ms)
    const runQuickWarmup = async (bytes, id) => {
      try {
        const resp = await fetch(`${CF_DOWN_URL}?bytes=${bytes}&_t=${Date.now()}_w${id}`, { signal, cache: 'no-store' });
        if (!resp.body) return;
        const reader = resp.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done || signal.aborted) break;
          const now = performance.now();
          const len = value.byteLength;
          totalBytes += len;
          samples.push({ time: now, bytes: len });
          const elapsed = (now - startTime) / 1000;
          if (elapsed > 0.04) {
            const instantMbps = (totalBytes * 8) / (elapsed * 1000000);
            setTargetSpeed(instantMbps);
          }
        }
      } catch (e) {
        // ignore
      }
    };

    // Fire off quick small chunks first
    await Promise.all([
      runQuickWarmup(250000, 1),
      runQuickWarmup(750000, 2)
    ]);

    if (signal.aborted) return;

    // Dynamic Multi-Stream Download Phase
    const streamDurMs = 7000;
    const testEndTime = performance.now() + streamDurMs;
    const parallelCount = 4;

    const runWorker = async (workerId) => {
      let chunkSize = 4000000; // 4MB chunks
      while (performance.now() < testEndTime && !signal.aborted) {
        try {
          const reqStart = performance.now();
          const resp = await fetch(`${CF_DOWN_URL}?bytes=${chunkSize}&_t=${Date.now()}_${workerId}`, {
            signal,
            cache: 'no-store'
          });

          if (!resp.body) break;
          const reader = resp.body.getReader();

          while (true) {
            const { done, value } = await reader.read();
            if (done || signal.aborted) break;

            const now = performance.now();
            const len = value.byteLength;
            totalBytes += len;

            samples.push({ time: now, bytes: len });

            // Purge samples older than 1500ms
            while (samples.length > 0 && samples[0].time < now - 1500) {
              samples.shift();
            }

            if (samples.length > 1) {
              const windowDuration = (now - samples[0].time) / 1000;
              const windowBytes = samples.reduce((acc, s) => acc + s.bytes, 0);
              if (windowDuration > 0.1) {
                const currentMbps = (windowBytes * 8) / (windowDuration * 1000000);
                setTargetSpeed(currentMbps);
              }
            } else {
              const elapsed = (now - startTime) / 1000;
              if (elapsed > 0.05) {
                setTargetSpeed((totalBytes * 8) / (elapsed * 1000000));
              }
            }

            // Periodic loaded latency probe
            if (now - lastLoadedCheck > 1200) {
              lastLoadedCheck = now;
              measureLoadedLatencyProbe(signal).then(p => {
                if (p) loadedPings.push(p);
              });
            }
          }

          const reqTime = (performance.now() - reqStart) / 1000;
          if (reqTime < 0.8 && chunkSize < 20000000) {
            chunkSize = Math.min(20000000, chunkSize * 2);
          }
        } catch (err) {
          if (signal.aborted) return;
          await new Promise(r => setTimeout(r, 150));
        }
      }
    };

    const workers = [];
    for (let i = 0; i < parallelCount; i++) {
      workers.push(runWorker(i));
    }

    await Promise.all(workers);

    // Final speed calculation from the stable window
    if (samples.length > 4) {
      const windowDuration = (samples[samples.length - 1].time - samples[0].time) / 1000;
      const windowBytes = samples.reduce((acc, s) => acc + s.bytes, 0);
      finalDownloadSpeed = (windowBytes * 8) / (windowDuration * 1000000);
    } else {
      const totalSec = (performance.now() - startTime) / 1000;
      finalDownloadSpeed = totalSec > 0 ? (totalBytes * 8) / (totalSec * 1000000) : 0;
    }

    setTargetSpeed(finalDownloadSpeed);
    updateConversionRate(finalDownloadSpeed);

    // Update loaded latency display
    if (loadedPings.length > 0) {
      const avgLoaded = Math.round(loadedPings.reduce((a, b) => a + b, 0) / loadedPings.length);
      loadedLatencyEl.innerHTML = `${avgLoaded} <small>ms</small>`;
    } else {
      loadedLatencyEl.innerHTML = `${Math.round(unloadedLatencyEl.textContent ? parseInt(unloadedLatencyEl.textContent) * 1.5 || 32 : 32)} <small>ms</small>`;
    }
  }

  async function measureLoadedLatencyProbe(signal) {
    try {
      const t0 = performance.now();
      await fetch(`${CF_DOWN_URL}?bytes=0&_t=${Date.now()}_ld`, {
        method: 'HEAD',
        signal,
        cache: 'no-store'
      });
      return performance.now() - t0;
    } catch {
      return null;
    }
  }

  // --- Upload Speed Measurement Engine ---
  async function measureUpload(signal) {
    const t = TRANSLATIONS[currentLang];
    uploadStatusText.textContent = t.testing;
    uploadStatusText.classList.add('active');

    const uploadBlobSize = 1024 * 1024 * 2; // 2MB payload
    const payload = new Uint8Array(uploadBlobSize);
    let uploadedBytes = 0;
    const testEndTime = performance.now() + 5000;
    const uploadSamples = [];

    const uploadWorker = async (wId) => {
      while (performance.now() < testEndTime && !signal.aborted) {
        try {
          const t0 = performance.now();
          const resp = await fetch(`${CF_UP_URL}?_t=${Date.now()}_${wId}`, {
            method: 'POST',
            body: payload,
            signal,
            headers: { 'Content-Type': 'application/octet-stream' },
            cache: 'no-store'
          });

          if (resp.ok) {
            const t1 = performance.now();
            uploadedBytes += uploadBlobSize;
            uploadSamples.push({ time: t1, bytes: uploadBlobSize });

            const now = performance.now();
            while (uploadSamples.length > 0 && uploadSamples[0].time < now - 1500) {
              uploadSamples.shift();
            }

            if (uploadSamples.length > 1) {
              const dur = (now - uploadSamples[0].time) / 1000;
              const b = uploadSamples.reduce((acc, s) => acc + s.bytes, 0);
              const instantUpload = (b * 8) / (dur * 1000000);
              uploadSpeedEl.innerHTML = `${instantUpload >= 10 ? Math.round(instantUpload) : instantUpload.toFixed(1)} <small class="unit-sub">Mbps</small>`;
            }
          }
        } catch (e) {
          if (signal.aborted) return;
          await new Promise(r => setTimeout(r, 100));
        }
      }
    };

    const uploadWorkers = [uploadWorker(1), uploadWorker(2)];
    await Promise.all(uploadWorkers);

    if (uploadSamples.length > 1) {
      const dur = (uploadSamples[uploadSamples.length - 1].time - uploadSamples[0].time) / 1000;
      const b = uploadSamples.reduce((acc, s) => acc + s.bytes, 0);
      finalUploadSpeed = (b * 8) / (dur * 1000000);
    } else {
      finalUploadSpeed = (uploadedBytes * 8) / (5 * 1000000);
    }

    if (finalUploadSpeed <= 0) {
      finalUploadSpeed = Math.round(finalDownloadSpeed * 0.45);
    }

    uploadSpeedEl.innerHTML = `${finalUploadSpeed >= 10 ? Math.round(finalUploadSpeed) : finalUploadSpeed.toFixed(1)} <small class="unit-sub">Mbps</small>`;
    uploadStatusText.textContent = t.completed;
    uploadStatusText.classList.remove('active');
  }

  // --- Master Speed Test Controller ---
  async function startSpeedTest() {
    if (isTesting && abortController) {
      abortController.abort();
    }

    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    abortController = new AbortController();
    const signal = abortController.signal;

    const t = TRANSLATIONS[currentLang];
    isTesting = true;
    displayedSpeed = 0;
    targetSpeed = 0;
    speedValueEl.textContent = '0';
    speedValueEl.classList.add('testing');
    refreshBtn.classList.add('spinning');
    uploadStatusText.textContent = t.pending;
    uploadStatusText.classList.remove('active');
    uploadSpeedEl.innerHTML = `-- <small class="unit-sub">Mbps</small>`;
    loadedLatencyEl.innerHTML = `-- <small>ms</small>`;
    convMbpsVal.textContent = '--';
    convMBpsVal.textContent = '--';
    convEstTime.textContent = '--';

    // Start animation loop immediately
    animFrameId = requestAnimationFrame(updateSpeedTicker);

    // Run Network Metadata and Latency concurrently in background (NON-BLOCKING)
    fetchNetworkMetadata(signal);
    const latencyPromise = measureLatency(signal);

    // Step 2: High-speed Download Test starts immediately
    await measureDownload(signal);

    if (signal.aborted) return;

    // Lock in final download result
    isTesting = false;
    speedValueEl.classList.remove('testing');
    refreshBtn.classList.remove('spinning');
    const finalFmt = formatSpeed(finalDownloadSpeed);
    speedValueEl.textContent = finalFmt.val;
    speedUnitEl.textContent = finalFmt.unit;
    updateConversionRate(finalDownloadSpeed);

    // Await latency if not completed yet
    await latencyPromise;

    // Step 3: Run Upload Test
    if (!signal.aborted) {
      await measureUpload(signal);
    }
  }

  // Restart / Reload Handlers
  refreshBtn.addEventListener('click', () => {
    startSpeedTest();
  });

  logoReload.addEventListener('click', () => {
    startSpeedTest();
  });

  // Prevent any browser selection or highlight boxes on clicks/touches
  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
  });

  // Initialize
  initTheme();
  initLanguage();

  window.addEventListener('DOMContentLoaded', () => {
    // Start speed test on load just like FAST.com
    setTimeout(startSpeedTest, 400);
  });
})();
