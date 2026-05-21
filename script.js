/* ═══════════════════════════════════════════════════
   RPG PORTFOLIO — Game Logic, Sound & i18n
   ═══════════════════════════════════════════════════ */

// ─── STATE ───
const state = {
  lang: 'en',
  soundOn: false,
  crtOn: true,
  activeTab: 'status',
  stats: { str: 85, agi: 72, int: 95, luk: 60 },
  sp: 5,
  hp: 920,
  mp: 780,
  audioCtx: null,
  footerTimeout: null,
  equipped: { weapon: null, armor: null, accessory: null },
};

const INITIAL_STATS = { str: 85, agi: 72, int: 95, luk: 60 };
const INITIAL_SP = 5;
let eggUnlocked = false;

// ─── EQUIPMENT DATABASE ───
const EQUIPMENT_DATABASE = {
  react: {
    name: 'React.js',
    slot: 'weapon',
    icon: '⚔️',
    bonuses: { str: 15, agi: 5 },
    rarity: 'legendary'
  },
  next: {
    name: 'Next.js',
    slot: 'weapon',
    icon: '🗡️',
    bonuses: { str: 10, int: 10 },
    rarity: 'legendary'
  },
  typescript: {
    name: 'TypeScript',
    slot: 'weapon',
    icon: '🏹',
    bonuses: { str: 5, agi: 10 },
    rarity: 'epic'
  },
  postgresql: {
    name: 'PostgreSQL',
    slot: 'weapon',
    icon: '🪄',
    bonuses: { int: 12, luk: 3 },
    rarity: 'epic'
  },
  python: {
    name: 'Python',
    slot: 'weapon',
    icon: '🔮',
    bonuses: { int: 8 },
    rarity: 'rare'
  },
  node: {
    name: 'Node.js',
    slot: 'armor',
    icon: '🛡️',
    bonuses: { str: 10, int: 5 },
    rarity: 'epic'
  },
  docker: {
    name: 'Docker',
    slot: 'accessory',
    icon: '💎',
    bonuses: { int: 5, agi: 3 },
    rarity: 'rare'
  },
  git: {
    name: 'Git',
    slot: 'accessory',
    icon: '📜',
    bonuses: { agi: 4, luk: 2 },
    rarity: 'uncommon'
  },
  gemini: {
    name: "Gemini's Blessing",
    slot: 'accessory',
    icon: '✨',
    bonuses: { str: 10, agi: 10, int: 10, luk: 10 },
    rarity: 'legendary-egg'
  }
};

// ─── MONSTER DATABASE ───
const MONSTER_DATABASE = [
  // Common tier (weight: high)
  { id: 'bug_slime',      name: { en: 'Bug Slime',           vi: 'Slime Lỗi' },         sprite: '🐛', tier: 'common',   hp: 80,   atk: 8,   def: 2,  xp: 20,  gold: 5  },
  { id: 'null_beetle',    name: { en: 'Null Pointer Beetle',  vi: 'Bọ Null Pointer' },    sprite: '🪲', tier: 'common',   hp: 100,  atk: 10,  def: 3,  xp: 25,  gold: 7  },
  { id: 'css_goblin',     name: { en: 'CSS Goblin',           vi: 'Yêu Tinh CSS' },       sprite: '👺', tier: 'common',   hp: 120,  atk: 12,  def: 4,  xp: 30,  gold: 8  },
  { id: 'div_bat',        name: { en: 'Div Nesting Bat',      vi: 'Dơi Lồng Div' },       sprite: '🦇', tier: 'common',   hp: 90,   atk: 15,  def: 2,  xp: 22,  gold: 6  },
  // Uncommon tier
  { id: 'regex_troll',    name: { en: 'Regex Troll',          vi: 'Quỷ Regex' },          sprite: '👹', tier: 'uncommon', hp: 250,  atk: 22,  def: 8,  xp: 60,  gold: 18 },
  { id: 'callback_spider',name: { en: 'Callback Spider',      vi: 'Nhện Callback' },      sprite: '🕷️', tier: 'uncommon', hp: 200,  atk: 28,  def: 5,  xp: 55,  gold: 15 },
  { id: 'mem_leak_wraith',name: { en: 'Memory Leak Wraith',   vi: 'Bóng Ma Rò Rỉ Bộ Nhớ' }, sprite: '👻', tier: 'uncommon', hp: 280,  atk: 20,  def: 10, xp: 65,  gold: 20 },
  // Rare tier
  { id: 'deadlock_dragon',name: { en: 'Deadlock Dragon',      vi: 'Rồng Deadlock' },      sprite: '🐉', tier: 'rare',     hp: 500,  atk: 35,  def: 15, xp: 120, gold: 45 },
  { id: 'race_hydra',     name: { en: 'Race Condition Hydra',  vi: 'Hydra Xung Đột Luồng' }, sprite: '🐍', tier: 'rare',  hp: 600,  atk: 30,  def: 18, xp: 140, gold: 50 },
  { id: 'spaghetti_golem',name: { en: 'Spaghetti Code Golem', vi: 'Golem Mã Rối' },       sprite: '🗿', tier: 'rare',     hp: 700,  atk: 25,  def: 25, xp: 150, gold: 55 },
  { id: 'cors_demon',     name: { en: 'CORS Demon',           vi: 'Ác Quỷ CORS' },        sprite: '😈', tier: 'rare',     hp: 550,  atk: 40,  def: 12, xp: 130, gold: 48 },
  // Boss tier
  { id: 'prod_outage',    name: { en: 'The Production Outage',vi: 'Sự Cố Production' },   sprite: '💀', tier: 'boss',     hp: 1500, atk: 50,  def: 20, xp: 500, gold: 200 },
  { id: 'legacy_titan',   name: { en: 'Legacy Codebase Titan',vi: 'Titan Mã Kế Thừa' },  sprite: '🏴‍☠️', tier: 'boss',   hp: 2000, atk: 45,  def: 30, xp: 600, gold: 250 },
  { id: 'infinite_loop',  name: { en: 'The Infinite Loop',    vi: 'Vòng Lặp Vô Tận' },   sprite: '🌀', tier: 'boss',     hp: 1800, atk: 55,  def: 18, xp: 550, gold: 220 },
];

// ─── i18n DICTIONARY ───
const i18n = {
  en: {
    game_title_1: "DUC'S",
    game_title_2: 'QUEST',
    subtitle: "~ An Adventurer's Portfolio ~",
    press_start: '▶ PRESS START',
    sound_on: '🔊 SOUND',
    sound_off: '🔇 SOUND',
    lang_label: '🌐 EN',
    crt_label: '📺 CRT',
    menu_title: 'MAIN MENU',
    char_name: 'DUC',
    char_class: "Lv.99 Full-Stack Dev",
    cmd_status: 'STATUS',
    cmd_skills: 'EQUIP',
    cmd_quests: 'QUESTS',
    cmd_log: 'LOG',
    cmd_tavern: 'TAVERN',
    status_title: "📜 Adventurer's Tale",
    status_p1: 'Greetings, traveler! I am <strong>Duc</strong>, a wandering Full-Stack Developer who has ventured through the vast realms of code since the ancient times.',
    status_p2: "My quest began in the Kingdom of Computer Science, where I forged my first weapons — HTML shields and CSS armor. Over the years, I mastered the arcane arts of JavaScript sorcery and conquered the dungeons of Backend engineering.",
    status_p3: "Today, I seek new adventures and worthy allies. Whether it be building enchanted web applications, slaying bugs in the darkest codebases, or crafting pixel-perfect interfaces — I am ready for the challenge!",
    skills_title: '⚔️ Equipment & Skills',
    eq_weapon: 'Weapon',
    eq_armor: 'Armor',
    eq_bow: 'Bow',
    eq_spell: 'Spell',
    eq_gem: 'Gem',
    eq_scroll: 'Scroll',
    eq_wand: 'Wand',
    quests_title: '📋 Quest Board',
    quest1_desc: 'Built a full-stack e-commerce platform with payment integration, inventory management, and real-time order tracking.',
    quest2_desc: 'Designed and developed an analytics dashboard with real-time data visualization, user management, and role-based access.',
    quest3_desc: 'Currently building an AI-powered application that helps adventurers (users) navigate complex data landscapes with intelligent search.',
    quest_completed: 'COMPLETED',
    quest_active: 'IN PROGRESS',
    quest_demo: '▶ Demo',
    quest_github: '⌂ Github',
    log_title: '📖 Adventure Log',
    log_present: 'Present',
    log1_title: 'Senior Developer — Tech Guild',
    log1_desc: 'Leading a party of developers on epic quests. Architecting large-scale web applications and mentoring junior adventurers.',
    log2_title: 'Full-Stack Developer — Digital Realm',
    log2_desc: 'Crafted numerous web applications using React, Node.js, and cloud technologies. Defeated many production bugs.',
    log3_title: "Bachelor of Computer Science — The Academy",
    log3_desc: 'Studied the ancient arts of algorithms, data structures, and software engineering. Graduated with honors.',
    tavern_title: '🍺 Tavern — Message Board',
    tavern_intro: "Welcome to the Tavern! Leave a message on the board and I'll receive it by carrier pigeon (email).",
    tavern_name_label: 'Your Name',
    tavern_email_label: 'Carrier Pigeon Address (Email)',
    tavern_msg_label: 'Your Message',
    tavern_send: 'SEND MESSAGE',
    footer_hint: 'Use the command menu to explore. Press [+] to allocate stat points!',
    stat_str_label: 'STR',
    stat_agi_label: 'AGI',
    stat_int_label: 'INT',
    stat_luk_label: 'LUK',
    egg_name: "Gemini's Blessing",
    egg_type: "Legendary Relic",
    slot_weapon: 'Weapon Slot',
    slot_armor: 'Armor Slot',
    slot_accessory: 'Accessory Slot',
    slot_empty: 'Empty Slot',
    click_to_equip: 'Click to Equip',
    click_to_unequip: 'Click to Unequip',
    // Battle i18n
    cmd_battle: 'BATTLE',
    battle_title: '⚔️ Idle Battle Arena',
    battle_start: '⚔️ START BATTLE',
    battle_stop: '⏸️ PAUSE',
    battle_kills: 'Kills',
    battle_gold: 'Gold',
    battle_waiting: '⏳ Awaiting orders... Enter the arena to begin!',
    system_memory_title: 'SYSTEM MEMORY',
    auto_save_active: 'AUTO-SAVE',
    save_export: 'EXPORT PROGRESS',
    save_import: 'IMPORT PROGRESS',
    save_reset: 'RESET DATA',
    save_confirm_reset: '⚠️ DANGER! Are you sure you want to reset all game data? This cannot be undone!',
    save_import_success: '💾 System Memory Restored Successfully! Refreshing...',
    save_import_invalid: '❌ Error: Invalid save file format!',
    tavern_board_title: '📌 TAVERN BULLETIN BOARD',
    tavern_post_success: '✨ Pinned to the board!',
  },
  vi: {
    game_title_1: "ĐỨC",
    game_title_2: 'PHIÊU LƯU KÝ',
    subtitle: '~ Hồ Sơ Của Nhà Phiêu Lưu ~',
    press_start: '▶ BẮT ĐẦU',
    sound_on: '🔊 ÂM THANH',
    sound_off: '🔇 ÂM THANH',
    lang_label: '🌐 VI',
    crt_label: '📺 CRT',
    menu_title: 'MENU CHÍNH',
    char_name: 'ĐỨC',
    char_class: 'Lv.99 Lập Trình Viên',
    cmd_status: 'TIỂU SỬ',
    cmd_skills: 'TRANG BỊ',
    cmd_quests: 'NHIỆM VỤ',
    cmd_log: 'NHẬT KÝ',
    cmd_tavern: 'QUÁN RƯỢU',
    status_title: '📜 Câu Chuyện Phiêu Lưu',
    status_p1: 'Xin chào, lữ khách! Ta là <strong>Đức</strong>, một Lập Trình Viên Full-Stack lang thang đã phiêu bạt qua vô vàn vương quốc mã nguồn từ thuở hồng hoang.',
    status_p2: 'Hành trình của ta bắt đầu tại Vương quốc Khoa học Máy tính, nơi ta rèn những vũ khí đầu tiên — Khiên HTML và Giáp CSS. Theo năm tháng, ta đã tinh thông phép thuật JavaScript và chinh phục những hầm ngục Backend đáng sợ.',
    status_p3: 'Ngày nay, ta tìm kiếm những cuộc phiêu lưu mới và những đồng minh xứng đáng. Dù là xây dựng ứng dụng web ma thuật, tiêu diệt bug trong những codebase tăm tối nhất, hay tạo ra giao diện pixel-perfect — ta luôn sẵn sàng!',
    skills_title: '⚔️ Trang Bị & Kỹ Năng',
    eq_weapon: 'Vũ khí',
    eq_armor: 'Giáp',
    eq_bow: 'Cung',
    eq_spell: 'Phép thuật',
    eq_gem: 'Ngọc quý',
    eq_scroll: 'Cuộn giấy',
    eq_wand: 'Đũa phép',
    quests_title: '📋 Bảng Nhiệm Vụ',
    quest1_desc: 'Xây dựng nền tảng thương mại điện tử full-stack với tích hợp thanh toán, quản lý kho hàng và theo dõi đơn hàng thời gian thực.',
    quest2_desc: 'Thiết kế và phát triển bảng điều khiển phân tích với trực quan hóa dữ liệu thời gian thực, quản lý người dùng và phân quyền truy cập.',
    quest3_desc: 'Đang xây dựng ứng dụng sử dụng AI giúp các nhà phiêu lưu (người dùng) điều hướng trong thế giới dữ liệu phức tạp bằng tìm kiếm thông minh.',
    quest_completed: 'HOÀN THÀNH',
    quest_active: 'ĐANG THỰC HIỆN',
    quest_demo: '▶ Demo',
    quest_github: '⌂ Github',
    log_title: '📖 Nhật Ký Phiêu Lưu',
    log_present: 'Hiện tại',
    log1_title: 'Lập Trình Viên Cao Cấp — Hội Công Nghệ',
    log1_desc: 'Dẫn dắt đội ngũ lập trình viên trong những nhiệm vụ huyền thoại. Kiến trúc ứng dụng web quy mô lớn và hướng dẫn các chiến binh trẻ.',
    log2_title: 'Lập Trình Viên Full-Stack — Vương Quốc Số',
    log2_desc: 'Tạo ra vô số ứng dụng web bằng React, Node.js và công nghệ đám mây. Tiêu diệt nhiều bug khét tiếng.',
    log3_title: 'Cử nhân Khoa học Máy tính — Học Viện',
    log3_desc: 'Nghiên cứu các bộ môn cổ đại: thuật toán, cấu trúc dữ liệu và kỹ thuật phần mềm. Tốt nghiệp với danh hiệu xuất sắc.',
    tavern_title: '🍺 Quán Rượu — Bảng Tin Nhắn',
    tavern_intro: 'Chào mừng đến Quán Rượu! Để lại tin nhắn trên bảng và ta sẽ nhận được qua chim bồ câu đưa thư (email).',
    tavern_name_label: 'Tên của bạn',
    tavern_email_label: 'Địa chỉ Chim Bồ Câu (Email)',
    tavern_msg_label: 'Tin nhắn của bạn',
    tavern_send: 'GỬI TIN NHẮN',
    footer_hint: 'Dùng menu lệnh để khám phá. Nhấn [+] để phân bổ điểm chỉ số!',
    stat_str_label: 'SỨC',
    stat_agi_label: 'NÉ',
    stat_int_label: 'TRÍ',
    stat_luk_label: 'MAY',
    egg_name: "Chúc Phúc Gemini",
    egg_type: "Thánh Vật Huyền Thoại",
    slot_weapon: 'Ô Vũ Khí',
    slot_armor: 'Ô Áo Giáp',
    slot_accessory: 'Ô Phụ Kiện',
    slot_empty: 'Ô Trống',
    click_to_equip: 'Click để Trang bị',
    click_to_unequip: 'Click để Tháo',
    // Battle i18n
    cmd_battle: 'CHIẾN ĐẤU',
    battle_title: '⚔️ Đấu Trường Tự Động',
    battle_start: '⚔️ BẮT ĐẦU',
    battle_stop: '⏸️ TẠM DỪNG',
    battle_kills: 'Hạ gục',
    battle_gold: 'Vàng',
    battle_waiting: '⏳ Chờ lệnh... Vào đấu trường để bắt đầu!',
    system_memory_title: 'BỘ NHỚ HỆ THỐNG',
    auto_save_active: 'TỰ ĐỘNG LƯU',
    save_export: 'XUẤT TIẾN TRÌNH',
    save_import: 'NHẬP TIẾN TRÌNH',
    save_reset: 'XÓA TIẾN TRÌNH',
    save_confirm_reset: '⚠️ NGUY HIỂM! Bạn có chắc chắn muốn xóa toàn bộ dữ liệu game không? Hành động này không thể hoàn tác!',
    save_import_success: '💾 Bộ Nhớ Hệ Thống Đã Được Khôi Phục! Đang tải lại...',
    save_import_invalid: '❌ Lỗi: Định dạng file sao lưu không hợp lệ!',
    tavern_board_title: '📌 BẢNG TIN QUÁN RƯỢU',
    tavern_post_success: '✨ Đã ghim lên bảng!',
  },
};

// ═══════════════════════════════════════════════════
// WEB AUDIO API — 8-bit SOUND SYNTHESIZER
// ═══════════════════════════════════════════════════
function ensureAudio() {
  if (!state.audioCtx) {
    state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (state.audioCtx.state === 'suspended') {
    state.audioCtx.resume();
  }
  return state.audioCtx;
}

function playTone(freq, duration = 0.08, type = 'square', vol = 0.12) {
  if (!state.soundOn) return;
  const ctx = ensureAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function playHoverSound()   { playTone(880, 0.04, 'square', 0.06); }
function playSelectSound()  { playTone(523.25, 0.06, 'square', 0.1); setTimeout(() => playTone(659.25, 0.08, 'square', 0.1), 60); }
function playStartSound()   {
  playTone(523.25, 0.1, 'square', 0.15);
  setTimeout(() => playTone(659.25, 0.1, 'square', 0.15), 100);
  setTimeout(() => playTone(783.99, 0.15, 'square', 0.15), 200);
  setTimeout(() => playTone(1046.5, 0.25, 'square', 0.12), 350);
}
function playStatUpSound()  { playTone(1046.5, 0.05, 'square', 0.1); setTimeout(() => playTone(1318.5, 0.08, 'square', 0.1), 50); }
function playErrorSound()   { playTone(220, 0.15, 'sawtooth', 0.1); }

function playSaveSound() {
  if (!state.soundOn) return;
  playTone(587.33, 0.06, 'triangle', 0.1); // D5
  setTimeout(() => playTone(698.46, 0.06, 'triangle', 0.1), 60); // F5
  setTimeout(() => playTone(880, 0.06, 'triangle', 0.1), 120); // A5
  setTimeout(() => playTone(1174.66, 0.15, 'square', 0.08), 180); // D6
}

function playResetSound() {
  if (!state.soundOn) return;
  playTone(440, 0.12, 'sawtooth', 0.12); // A4
  setTimeout(() => playTone(349.23, 0.12, 'sawtooth', 0.12), 100); // F4
  setTimeout(() => playTone(261.63, 0.15, 'sawtooth', 0.12), 200); // C4
  setTimeout(() => playTone(130.81, 0.3, 'sawtooth', 0.15), 300); // C3
}

function playTackSound() {
  if (!state.soundOn) return;
  playTone(600, 0.03, 'square', 0.05); // sharp high-pitch click
  setTimeout(() => {
    playTone(180, 0.06, 'triangle', 0.12); // low woody thud
  }, 10);
}

function playEquipSound() {
  if (!state.soundOn) return;
  const ctx = ensureAudio();
  playTone(523.25, 0.06, 'square', 0.1); // C5
  setTimeout(() => playTone(659.25, 0.06, 'square', 0.1), 50); // E5
  setTimeout(() => playTone(783.99, 0.06, 'square', 0.1), 100); // G5
  setTimeout(() => playTone(1046.5, 0.12, 'square', 0.1), 150); // C6
}

function playUnequipSound() {
  if (!state.soundOn) return;
  playTone(392, 0.08, 'triangle', 0.1); // G4
  setTimeout(() => playTone(261.63, 0.12, 'triangle', 0.1), 60); // C4
}

// ─── BGM RETRO DICTIONARY & SCHEDULER ───
const BGM_MELODY = [
  261.63, 329.63, 392.00, 493.88, // Cmaj7 (C4, E4, G4, B4)
  440.00, 523.25, 659.25, 783.99, // Am9 (A4, C5, E5, G5)
  349.23, 440.00, 523.25, 659.25, // Fmaj7 (F4, A4, C5, E5)
  392.00, 493.88, 587.33, 783.99  // G7 (G4, B4, D5, G5)
];

let bgmInterval = null;
let bgmIndex = 0;

function playBGMStep() {
  if (!state.soundOn) return;
  const ctx = ensureAudio();
  if (!ctx || ctx.state === 'suspended') return;

  const freq = BGM_MELODY[bgmIndex];
  bgmIndex = (bgmIndex + 1) % BGM_MELODY.length;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle'; // Soothing, soft vintage synth tone
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  // Softer retro attack and decay curve
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.05); // Ultra quiet background volume
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);
}

function startBGM() {
  if (bgmInterval) clearInterval(bgmInterval);
  if (!state.soundOn) return;
  if (!menuScreen.classList.contains('active')) return;

  bgmIndex = 0;
  // Play a beautiful note arpeggio every 180ms
  bgmInterval = setInterval(playBGMStep, 180);
}

function stopBGM() {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
}

// ─── MECHANICAL KEY CLICK SYNTHESIZER ───
function playTypeSound() {
  if (!state.soundOn) return;
  const ctx = ensureAudio();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. High frequency click (Keyboard key switch metal contact click)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'triangle';
  const freq = 1200 + Math.random() * 400; // randomized mechanical variance
  osc1.frequency.setValueAtTime(freq, now);
  gain1.gain.setValueAtTime(0.012, now); // soft, non-intrusive
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.025);

  // 2. Low frequency bottom-out thud (Key bottoming out on board)
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(100 + Math.random() * 30, now);
  gain2.gain.setValueAtTime(0.008, now);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now);
  osc2.stop(now + 0.035);
}


// ═══════════════════════════════════════════════════
// DOM REFERENCES
// ═══════════════════════════════════════════════════
const $ = (id) => document.getElementById(id);

const startScreen = $('start-screen');
const menuScreen  = $('menu-screen');

const btnStart    = $('btn-start');
const btnLang     = $('btn-lang');
const btnSound    = $('btn-sound');
const btnCrt      = $('btn-crt');

const menuBtnLang  = $('menu-btn-lang');
const menuBtnSound = $('menu-btn-sound');
const menuBtnCrt   = $('menu-btn-crt');

const crtOverlay   = $('crt-overlay');
const spCount      = $('sp-count');
const btnResetStats = $('btn-reset-stats');

// ─── DYNAMIC LOGGING & STAT INTEGRATION FUNCTIONS ───
function logMessage(enMsg, viMsg) {
  const footer = $('footer-hint');
  if (!footer) return;
  footer.removeAttribute('data-i18n');
  footer.textContent = state.lang === 'en' ? enMsg : viMsg;
  clearTimeout(state.footerTimeout);
  state.footerTimeout = setTimeout(() => {
    footer.setAttribute('data-i18n', 'footer_hint');
    setLang(state.lang);
  }, 3500);
}

function getEquippedBonuses() {
  const bonuses = { str: 0, agi: 0, int: 0, luk: 0 };
  Object.keys(state.equipped).forEach(slot => {
    const itemId = state.equipped[slot];
    if (itemId && EQUIPMENT_DATABASE[itemId]) {
      const item = EQUIPMENT_DATABASE[itemId];
      Object.keys(item.bonuses).forEach(stat => {
        bonuses[stat] += item.bonuses[stat];
      });
    }
  });
  return bonuses;
}

function updateStatsDisplay() {
  const bonuses = getEquippedBonuses();

  // 1. Render stats + bonus badges in Left Status Panel
  Object.keys(state.stats).forEach(statKey => {
    const base = state.stats[statKey];
    const bonus = bonuses[statKey];
    const statEl = $('stat-' + statKey);
    if (statEl) {
      if (bonus > 0) {
        statEl.innerHTML = `${base}<span class="stat-bonus">(+${bonus})</span>`;
      } else {
        statEl.textContent = base;
      }
    }
  });

  // 2. Update dynamic HP/MP bars (STR and INT equipment bonuses increase Max HP/MP)
  const currentSTR = state.stats.str + bonuses.str;
  const currentINT = state.stats.int + bonuses.int;
  const maxHP = currentSTR * 10 + 150;
  const maxMP = currentINT * 10 + 50;

  if (state.hp > maxHP) state.hp = maxHP;
  if (state.mp > maxMP) state.mp = maxMP;

  const hpPercent = Math.round((state.hp / maxHP) * 100);
  const mpPercent = Math.round((state.mp / maxMP) * 100);

  const hpFill = $('hp-fill');
  const hpValue = $('hp-value');
  const mpFill = $('mp-fill');
  const mpValue = $('mp-value');

  if (hpFill) hpFill.style.width = `${hpPercent}%`;
  if (hpValue) hpValue.textContent = `${state.hp}/${maxHP}`;
  if (mpFill) mpFill.style.width = `${mpPercent}%`;
  if (mpValue) mpValue.textContent = `${state.mp}/${maxMP}`;

  // 3. Render Equipped Slots on Left Panel
  const defaultIcons = { weapon: '⚔️', armor: '🛡️', accessory: '💍' };
  Object.keys(state.equipped).forEach(slot => {
    const itemId = state.equipped[slot];
    const slotEl = $('slot-' + slot);
    if (!slotEl) return;

    const iconEl = slotEl.querySelector('.slot-icon');
    const tooltipEl = slotEl.querySelector('.slot-tooltip');

    // Reset classes
    slotEl.className = 'equip-slot';
    
    if (itemId && EQUIPMENT_DATABASE[itemId]) {
      const item = EQUIPMENT_DATABASE[itemId];
      slotEl.classList.add(item.rarity);
      if (iconEl) iconEl.textContent = item.icon;

      // Tooltip translation & content
      if (tooltipEl) {
        const bonusTexts = Object.entries(item.bonuses).map(([k, v]) => `+${v} ${k.toUpperCase()}`).join(', ');
        const actionText = state.lang === 'en' ? 'Click to Unequip' : 'Nhấp để Tháo';
        const rarityStars = '★'.repeat(
          item.rarity.includes('legendary') ? 5 : item.rarity === 'epic' ? 4 : item.rarity === 'rare' ? 3 : 2
        );
        const slotName = i18n[state.lang]['slot_' + slot] || slot.toUpperCase();
        
        tooltipEl.innerHTML = `
          <span class="tooltip-title">${slotName}</span>
          <span class="tooltip-item-name">${item.name}</span>
          <span class="tooltip-rarity ${item.rarity}">${rarityStars}</span>
          <span class="tooltip-bonus">${bonusTexts}</span>
          <span class="tooltip-action">${actionText}</span>
        `;
      }
    } else {
      slotEl.classList.add('empty');
      if (iconEl) iconEl.textContent = defaultIcons[slot];
      
      if (tooltipEl) {
        const slotName = i18n[state.lang]['slot_' + slot] || slot.toUpperCase();
        const emptyText = i18n[state.lang].slot_empty || 'Empty';
        tooltipEl.innerHTML = `
          <span class="tooltip-title">${slotName}</span>
          <span class="tooltip-status">${emptyText}</span>
        `;
      }
    }
  });

  // 4. Update Cards Equipped visual indicator
  document.querySelectorAll('.equip-card').forEach(card => {
    const id = card.dataset.equipId || card.getAttribute('data-equip-id');
    if (id) {
      const item = EQUIPMENT_DATABASE[id];
      if (item && state.equipped[item.slot] === id) {
        card.classList.add('equipped');
      } else {
        card.classList.remove('equipped');
      }
    }
  });

  // 5. Re-check Easter egg (LUK includes base + equipment bonuses)
  checkEasterEgg();

  // 6. Refresh battle stats if battle system is loaded
  if (typeof updateBattleStatsDisplay === 'function') {
    updateBattleStatsDisplay();
  }
}

function updateDynamicBars() {
  updateStatsDisplay();
}

function checkEasterEgg() {
  const equipGrid = $('equip-grid');
  if (!equipGrid) return;
  
  const bonuses = getEquippedBonuses();
  const currentLUK = state.stats.luk + bonuses.luk;

  if (currentLUK >= 65) {
    if (!eggUnlocked) {
      eggUnlocked = true;
      
      // Celebratory melody
      playTone(523.25, 0.08, 'square', 0.12);
      setTimeout(() => playTone(659.25, 0.08, 'square', 0.12), 80);
      setTimeout(() => playTone(783.99, 0.08, 'square', 0.12), 160);
      setTimeout(() => playTone(1046.5, 0.12, 'square', 0.12), 240);
      setTimeout(() => playTone(1318.51, 0.25, 'square', 0.12), 340);

      logMessage("★ Unlocked Legendary Relic: Gemini's Blessing!", "★ Mở khóa Thánh vật Huyền thoại: Chúc Phúc Gemini!");

      const card = document.createElement('div');
      card.className = 'equip-card legendary-egg';
      card.id = 'egg-card';
      card.setAttribute('data-equip-id', 'gemini');
      card.innerHTML = `
        <span class="equip-icon">✨</span>
        <span class="equip-name" data-i18n="egg_name">${i18n[state.lang].egg_name}</span>
        <span class="equip-rarity">★★★★★★★</span>
        <span class="equip-type" data-i18n="egg_type">${i18n[state.lang].egg_type}</span>
      `;
      card.addEventListener('mouseenter', playHoverSound);
      equipGrid.appendChild(card);
    }
  } else {
    if (eggUnlocked) {
      eggUnlocked = false;
      // If equipped, remove it from accessory slot
      if (state.equipped.accessory === 'gemini') {
        state.equipped.accessory = null;
      }
      const card = $('egg-card');
      if (card) card.remove();
    }
  }
}

// ═══════════════════════════════════════════════════
// SCREEN TRANSITIONS
// ═══════════════════════════════════════════════════
btnStart.addEventListener('click', () => {
  playStartSound();
  startScreen.classList.remove('active');
  setTimeout(() => {
    menuScreen.classList.add('active');
    if (state.soundOn) {
      startBGM();
    }
    triggerTypewriter();
  }, 500);
});

// ═══════════════════════════════════════════════════
// SOUND TOGGLE
// ═══════════════════════════════════════════════════
function toggleSound() {
  state.soundOn = !state.soundOn;
  const t = i18n[state.lang];
  const label = state.soundOn ? t.sound_on : t.sound_off;
  btnSound.textContent = label;
  btnSound.classList.toggle('active', state.soundOn);
  menuBtnSound.textContent = state.soundOn ? '🔊' : '🔇';
  menuBtnSound.classList.toggle('active', state.soundOn);
  if (state.soundOn) {
    ensureAudio();
    playSelectSound();
    startBGM();
  } else {
    stopBGM();
  }
  saveGame();
}
btnSound.addEventListener('click', toggleSound);
menuBtnSound.addEventListener('click', toggleSound);

// ═══════════════════════════════════════════════════
// CRT TOGGLE
// ═══════════════════════════════════════════════════
function toggleCrt() {
  state.crtOn = !state.crtOn;
  crtOverlay.classList.toggle('active', state.crtOn);
  document.body.classList.toggle('crt-active', state.crtOn);
  btnCrt.classList.toggle('active', state.crtOn);
  menuBtnCrt.classList.toggle('active', state.crtOn);
  playSelectSound();
  saveGame();
}
btnCrt.addEventListener('click', toggleCrt);
menuBtnCrt.addEventListener('click', toggleCrt);

// ═══════════════════════════════════════════════════
// LANGUAGE TOGGLE
// ═══════════════════════════════════════════════════
function setLang(lang) {
  state.lang = lang;
  const t = i18n[lang];

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    
    // Skip typewriter paragraphs to prevent double render collision
    if (state.activeTab === 'status' && (key === 'status_p1' || key === 'status_p2' || key === 'status_p3')) {
      return;
    }
    
    if (t[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        // skip
      } else {
        el.innerHTML = t[key];
      }
    }
  });

  // Update specific elements
  const titleLines = document.querySelectorAll('.title-line');
  if (titleLines[0]) titleLines[0].textContent = t.game_title_1;
  if (titleLines[1]) titleLines[1].textContent = t.game_title_2;

  $('subtitle').textContent = t.subtitle;
  btnStart.querySelector('.blink').textContent = t.press_start;
  btnLang.textContent = t.lang_label;
  $('menu-title-text').textContent = t.menu_title;
  $('char-name').textContent = t.char_name;
  $('char-class').textContent = t.char_class;

  // Sound button label
  const soundLabel = state.soundOn ? t.sound_on : t.sound_off;
  btnSound.textContent = soundLabel;

  // Stat labels
  $('stat-str-label').textContent = t.stat_str_label;
  $('stat-agi-label').textContent = t.stat_agi_label;
  $('stat-int-label').textContent = t.stat_int_label;
  $('stat-luk-label').textContent = t.stat_luk_label;

  updateStatsDisplay();
  
  if (typeof renderTavernMessages === 'function') {
    renderTavernMessages();
  }

  // Hot-swap typewriter if on status page
  if (state.activeTab === 'status') {
    if (menuScreen.classList.contains('active')) {
      triggerTypewriter();
    }
  } else {
    clearTypewriter();
  }
}

function toggleLang() {
  const newLang = state.lang === 'en' ? 'vi' : 'en';
  setLang(newLang);
  playSelectSound();
  saveGame();
}

btnLang.addEventListener('click', toggleLang);
menuBtnLang.addEventListener('click', toggleLang);

// ─── SEQUENTIAL TYPEWRITER FLOW ENGINE ───
let typewriterTimeouts = [];

function clearTypewriter() {
  typewriterTimeouts.forEach(t => clearTimeout(t));
  typewriterTimeouts = [];
}

function triggerTypewriter() {
  clearTypewriter();

  const p1 = $('tab-status').querySelector('[data-i18n="status_p1"]');
  const p2 = $('tab-status').querySelector('[data-i18n="status_p2"]');
  const p3 = $('tab-status').querySelector('[data-i18n="status_p3"]');

  if (!p1 || !p2 || !p3) return;

  const t = i18n[state.lang];
  const text1 = t.status_p1;
  const text2 = t.status_p2;
  const text3 = t.status_p3;

  p1.innerHTML = '';
  p2.innerHTML = '';
  p3.innerHTML = '';

  // HTML Tokenizer to preserve tags like <strong> without spelling them out
  function tokenize(htmlStr) {
    const tokens = [];
    const regex = /(<[^>]+>)/g;
    const parts = htmlStr.split(regex);
    for (const part of parts) {
      if (part) {
        tokens.push({
          text: part,
          isTag: part.startsWith('<') && part.endsWith('>')
        });
      }
    }
    return tokens;
  }

  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);
  const tokens3 = tokenize(text3);

  function typewriteTokens(el, tokens, onComplete) {
    let tokenIndex = 0;
    let charIndex = 0;
    let currentHTML = '';

    function nextStep() {
      if (tokenIndex >= tokens.length) {
        if (onComplete) onComplete();
        return;
      }

      const token = tokens[tokenIndex];

      if (token.isTag) {
        currentHTML += token.text;
        el.innerHTML = currentHTML;
        tokenIndex++;
        charIndex = 0;
        nextStep();
      } else {
        if (charIndex < token.text.length) {
          const char = token.text[charIndex];
          currentHTML += char;
          el.innerHTML = currentHTML;
          charIndex++;

          playTypeSound();

          const timeout = setTimeout(nextStep, 25);
          typewriterTimeouts.push(timeout);
        } else {
          tokenIndex++;
          charIndex = 0;
          nextStep();
        }
      }
    }

    nextStep();
  }

  typewriteTokens(p1, tokens1, () => {
    typewriteTokens(p2, tokens2, () => {
      typewriteTokens(p3, tokens3);
    });
  });
}

// ═══════════════════════════════════════════════════
// COMMAND / TAB SWITCHING
// ═══════════════════════════════════════════════════
const cmdBtns = document.querySelectorAll('.cmd-btn');
const tabContents = document.querySelectorAll('.tab-content');

cmdBtns.forEach(btn => {
  btn.addEventListener('mouseenter', playHoverSound);
  btn.addEventListener('click', () => {
    const cmd = btn.dataset.cmd;
    if (!cmd) return;
    if (cmd === state.activeTab) return;

    playSelectSound();
    state.activeTab = cmd;

    // Update button states
    cmdBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update tab content
    tabContents.forEach(tc => tc.classList.remove('active'));
    const target = $('tab-' + cmd);
    if (target) target.classList.add('active');

    if (cmd === 'status') {
      triggerTypewriter();
    } else {
      clearTypewriter();
    }
  });
});

// ═══════════════════════════════════════════════════
// STAT ALLOCATION
// ═══════════════════════════════════════════════════
document.querySelectorAll('.stat-up').forEach(btn => {
  btn.addEventListener('click', () => {
    if (state.sp <= 0) {
      playErrorSound();
      return;
    }
    const statKey = btn.dataset.stat;
    state.stats[statKey]++;
    state.sp--;
    
    // Core game integration mechanics
    if (statKey === 'str') {
      state.hp += 15;
      logMessage(`STR +1! Max HP increased.`, `SỨC +1! HP Tối đa tăng lên.`);
    } else if (statKey === 'int') {
      state.mp += 10;
      logMessage(`INT +1! Max MP increased.`, `TRÍ +1! MP Tối đa tăng lên.`);
    } else if (statKey === 'agi') {
      logMessage(`AGI +1! Evasion Rate increased.`, `NÉ +1! Tỷ lệ Né tránh tăng.`);
    } else if (statKey === 'luk') {
      logMessage(`LUK +1! Critical Rate increased.`, `MAY +1! Tỷ lệ Chí mạng tăng.`);
    }

    updateStatsDisplay();
    spCount.textContent = state.sp;
    playStatUpSound();
    saveGame();

    // Animate the value
    const valueEl = $('stat-' + statKey);
    if (valueEl) {
      valueEl.style.color = 'var(--color-gold)';
      valueEl.style.transform = 'scale(1.3)';
      valueEl.style.transition = 'all 0.15s';
      setTimeout(() => {
        valueEl.style.color = '';
        valueEl.style.transform = '';
      }, 300);
    }
  });
});

// ═══════════════════════════════════════════════════
// STAT RESET
// ═══════════════════════════════════════════════════
if (btnResetStats) {
  btnResetStats.addEventListener('click', () => {
    const isInitial = Object.keys(INITIAL_STATS).every(k => state.stats[k] === INITIAL_STATS[k]) && state.sp === INITIAL_SP;
    if (isInitial) {
      playErrorSound();
      return;
    }

    // Play retro magic tone for resetting
    playTone(783.99, 0.08, 'triangle', 0.15);
    setTimeout(() => playTone(659.25, 0.08, 'triangle', 0.15), 80);
    setTimeout(() => playTone(523.25, 0.15, 'triangle', 0.15), 160);

    // Reset state values
    state.stats = { ...INITIAL_STATS };
    state.sp = INITIAL_SP;
    state.hp = 920;
    state.mp = 780;
    state.equipped = { weapon: null, armor: null, accessory: null };

    // Update SP text
    if (spCount) spCount.textContent = state.sp;

    // Trigger update calls
    updateStatsDisplay();
    saveGame();

    logMessage("Stats reset to initial values.", "Đã khôi phục điểm chỉ số ban đầu.");
  });
}

// ═══════════════════════════════════════════════════
// HOVER SOUNDS for option buttons
// ═══════════════════════════════════════════════════
document.querySelectorAll('.option-btn, .mini-btn, .stat-up').forEach(el => {
  el.addEventListener('mouseenter', playHoverSound);
});

// ═══════════════════════════════════════════════════
// INTERACTIVE EQUIPMENT BINDINGS & CLICK EVENTS
// ═══════════════════════════════════════════════════
function toggleEquipItem(itemId) {
  const item = EQUIPMENT_DATABASE[itemId];
  if (!item) return;

  const slot = item.slot;
  if (state.equipped[slot] === itemId) {
    state.equipped[slot] = null;
    playUnequipSound();
    logMessage(`Unequipped ${item.name}.`, `Đã tháo ${item.name}.`);
  } else {
    const oldItemId = state.equipped[slot];
    state.equipped[slot] = itemId;
    playEquipSound();
    if (oldItemId && EQUIPMENT_DATABASE[oldItemId]) {
      logMessage(`Swapped ${EQUIPMENT_DATABASE[oldItemId].name} for ${item.name}.`, `Đã đổi ${EQUIPMENT_DATABASE[oldItemId].name} lấy ${item.name}.`);
    } else {
      logMessage(`Equipped ${item.name}!`, `Đã trang bị ${item.name}!`);
    }
  }

  updateStatsDisplay();
  saveGame();
}

// Delegate skill card click events
const equipGrid = $('equip-grid');
if (equipGrid) {
  equipGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.equip-card');
    if (!card) return;
    const itemId = card.dataset.equipId || card.getAttribute('data-equip-id');
    if (!itemId) return;
    toggleEquipItem(itemId);
  });
  
  // Use hover delegated event listener for hover sound on skill cards
  equipGrid.addEventListener('mouseover', (e) => {
    const card = e.target.closest('.equip-card');
    if (card && !card.dataset.hoverBound) {
      card.dataset.hoverBound = 'true';
      card.addEventListener('mouseenter', playHoverSound);
    }
  });
}

// Bind unequip click listeners directly to Left status slots
document.querySelectorAll('.equip-slot').forEach(slotEl => {
  slotEl.addEventListener('click', () => {
    const slot = slotEl.dataset.slotType;
    const itemId = state.equipped[slot];
    if (itemId && EQUIPMENT_DATABASE[itemId]) {
      state.equipped[slot] = null;
      playUnequipSound();
      logMessage(`Unequipped ${EQUIPMENT_DATABASE[itemId].name}.`, `Đã tháo ${EQUIPMENT_DATABASE[itemId].name}.`);
      updateStatsDisplay();
      saveGame();
    }
  });
  slotEl.addEventListener('mouseenter', playHoverSound);
});

// ═══════════════════════════════════════════════════
// TAVERN MESSAGE BOARD SYSTEM (LocalStorage & Parchment Scrolls)
// ═══════════════════════════════════════════════════
const TAVERN_MESSAGES_KEY = 'ducs_quest_messages';

const MOCK_TAVERN_MESSAGES = [
  {
    name: { en: "Frontend Mage 🧙‍♂️", vi: "Pháp sư Frontend 🧙‍♂️" },
    message: {
      en: "CSS in this tavern is truly magical! 10/10.",
      vi: "CSS ở quán rượu này thực sự rất ma thuật! 10/10."
    },
    timestamp: { en: "Day 140, 12:45", vi: "Ngày 140, 12:45" }
  },
  {
    name: { en: "Backend Warrior ⚔️", vi: "Chiến binh Backend ⚔️" },
    message: {
      en: "Slayed 100 NullPointer dragons with my Java sword. Need more beer! 🍺",
      vi: "Đã tiêu diệt 100 con rồng NullPointer bằng thanh gươm Java. Cần thêm bia! 🍺"
    },
    timestamp: { en: "Day 139, 21:10", vi: "Ngày 139, 21:10" }
  },
  {
    name: { en: "Bug Hunter 🏹", vi: "Kẻ Săn Bug 🏹" },
    message: {
      en: "Someone dropped broken CSS at the entrance, almost tripped. ⚠️",
      vi: "Ai đó đã rải mảnh kính (broken CSS) ở lối vào, suýt nữa tôi bị vấp ngã. ⚠️"
    },
    timestamp: { en: "Day 138, 08:30", vi: "Ngày 138, 08:30" }
  }
];

function getRetroTimestamp() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return state.lang === 'en' ? `Day ${dayOfYear}, ${timeStr}` : `Ngày ${dayOfYear}, ${timeStr}`;
}

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function loadTavernMessages() {
  try {
    const saved = localStorage.getItem(TAVERN_MESSAGES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load tavern messages:', e);
  }
  return [...MOCK_TAVERN_MESSAGES];
}

function saveTavernMessages(messages) {
  try {
    if (Array.isArray(messages)) {
      localStorage.setItem(TAVERN_MESSAGES_KEY, JSON.stringify(messages));
    }
  } catch (e) {
    console.error('Failed to save tavern messages:', e);
  }
}

function renderTavernMessages() {
  const container = $('scrolls-container');
  if (!container) return;

  const messages = loadTavernMessages();
  container.innerHTML = '';

  if (!Array.isArray(messages)) return;

  // Render messages in reverse chronological order (newest on top)
  messages.slice().reverse().forEach((msg, idx) => {
    if (!msg) return;
    const name = (typeof msg.name === 'object' ? (msg.name[state.lang] || msg.name.en) : msg.name) || 'Brave Adventurer';
    const message = (typeof msg.message === 'object' ? (msg.message[state.lang] || msg.message.en) : msg.message) || '';
    const timestamp = (typeof msg.timestamp === 'object' ? (msg.timestamp[state.lang] || msg.timestamp.en) : msg.timestamp) || 'Day 99';

    const scroll = document.createElement('div');
    scroll.className = 'parchment-scroll';
    scroll.style.animationDelay = `${idx * 0.15}s`;

    scroll.innerHTML = `
      <span class="scroll-tack">📌</span>
      <div class="scroll-header">
        <span class="scroll-sender">👤 ${escapeHTML(name)}</span>
        <span class="scroll-time">${escapeHTML(timestamp)}</span>
      </div>
      <div class="scroll-body">${escapeHTML(message)}</div>
    `;
    container.appendChild(scroll);
  });
}

function addTavernMessage(name, messageText) {
  const messages = loadTavernMessages();
  const timestamp = getRetroTimestamp();
  
  const newMessage = {
    name: name,
    message: messageText,
    timestamp: timestamp
  };
  
  messages.push(newMessage);
  saveTavernMessages(messages);
  
  // Directly prepend the new scroll into DOM for rollout animation
  const container = $('scrolls-container');
  if (container) {
    const scroll = document.createElement('div');
    scroll.className = 'parchment-scroll';
    scroll.innerHTML = `
      <span class="scroll-tack">📌</span>
      <div class="scroll-header">
        <span class="scroll-sender">👤 ${escapeHTML(name)}</span>
        <span class="scroll-time">${escapeHTML(timestamp)}</span>
      </div>
      <div class="scroll-body">${escapeHTML(messageText)}</div>
    `;
    container.insertBefore(scroll, container.firstChild);
    
    // Auto-scroll scrolls-container to the top to see the new scroll unroll
    container.scrollTop = 0;
  }
  
  playTackSound();
}

// Bind Tavern Form submit event
$('tavern-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const nameInput = $('tavern-name');
  const messageInput = $('tavern-message');
  if (!nameInput || !messageInput) return;

  const nameVal = nameInput.value.trim();
  const messageVal = messageInput.value.trim();
  
  if (!nameVal || !messageVal) return;

  // Add the message to local storage and display it
  addTavernMessage(nameVal, messageVal);

  // Visual success feedback on Submit Button
  const submitBtn = $('tavern-submit');
  if (submitBtn) {
    const textSpan = submitBtn.querySelector('span:not(.cmd-cursor)');
    if (textSpan) {
      const origText = textSpan.textContent;
      const hasD18n = textSpan.hasAttribute('data-i18n');
      
      if (hasD18n) textSpan.removeAttribute('data-i18n');
      textSpan.textContent = state.lang === 'en' ? '✨ PINNED TO BOARD!' : '✨ ĐÃ GHIM LÊN BẢNG!';
      submitBtn.style.borderColor = 'var(--color-accent-alt)';
      submitBtn.style.color = 'var(--color-accent-alt)';
      
      // Pulse save LED indicator
      pulseSaveLed();

      setTimeout(() => {
        if (hasD18n) textSpan.setAttribute('data-i18n', 'tavern_send');
        textSpan.textContent = state.lang === 'en' ? 'SEND MESSAGE' : 'GỬI TIN NHẮN';
        submitBtn.style.borderColor = '';
        submitBtn.style.color = '';
        $('tavern-form').reset();
      }, 2000);
    } else {
      $('tavern-form').reset();
    }
  } else {
    $('tavern-form').reset();
  }
});

// ═══════════════════════════════════════════════════
// BATTLE SOUND EFFECTS (8-bit chiptune)
// ═══════════════════════════════════════════════════
function playBattleHitSound() {
  if (!state.soundOn) return;
  playTone(200, 0.04, 'square', 0.1);
  setTimeout(() => playTone(800, 0.03, 'square', 0.08), 30);
}

function playCriticalSound() {
  if (!state.soundOn) return;
  playTone(523.25, 0.05, 'square', 0.12);
  setTimeout(() => playTone(783.99, 0.05, 'square', 0.12), 40);
  setTimeout(() => playTone(1046.5, 0.08, 'square', 0.12), 80);
  setTimeout(() => playTone(1318.51, 0.15, 'sawtooth', 0.1), 120);
}

function playDodgeSound() {
  if (!state.soundOn) return;
  playTone(1200, 0.03, 'triangle', 0.08);
}

function playMonsterDeathSound() {
  if (!state.soundOn) return;
  playTone(800, 0.05, 'square', 0.1);
  setTimeout(() => playTone(600, 0.05, 'square', 0.1), 40);
  setTimeout(() => playTone(400, 0.06, 'square', 0.1), 80);
  setTimeout(() => playTone(200, 0.1, 'sawtooth', 0.08), 120);
}

function playBossAppearSound() {
  if (!state.soundOn) return;
  playTone(110, 0.2, 'sawtooth', 0.12);
  setTimeout(() => playTone(130.81, 0.15, 'sawtooth', 0.1), 150);
  setTimeout(() => playTone(164.81, 0.15, 'square', 0.12), 300);
  setTimeout(() => playTone(196, 0.25, 'square', 0.15), 450);
}

function playHealSound() {
  if (!state.soundOn) return;
  playTone(523.25, 0.08, 'triangle', 0.08);
  setTimeout(() => playTone(659.25, 0.08, 'triangle', 0.08), 70);
  setTimeout(() => playTone(783.99, 0.08, 'triangle', 0.08), 140);
  setTimeout(() => playTone(1046.5, 0.12, 'triangle', 0.08), 210);
}

// ═══════════════════════════════════════════════════
// BATTLE ENGINE — IDLE COMBAT SYSTEM
// ═══════════════════════════════════════════════════
const battleState = {
  active: false,
  intervalId: null,
  currentMonster: null,
  monsterHp: 0,
  monsterMaxHp: 0,
  kills: 0,
  gold: 0,
  battleTime: 0,  // seconds counter for timestamps
  playerBattleHp: 0,
  playerBattleMaxHp: 0,
};

function getBattleStats() {
  const bonuses = getEquippedBonuses();
  const str = state.stats.str + bonuses.str;
  const agi = state.stats.agi + bonuses.agi;
  const intStat = state.stats.int + bonuses.int;
  const luk = state.stats.luk + bonuses.luk;

  const hasWeapon = state.equipped.weapon !== null;
  const hasArmor = state.equipped.armor !== null;

  const atk = str + (hasWeapon ? Math.floor(str * 0.3) : 0) + Math.floor(Math.random() * (agi / 4));
  const def = hasArmor ? Math.floor(str * 0.2 + intStat * 0.1) : Math.floor(str * 0.05);
  const dodgeChance = Math.min(Math.floor(agi / 2.5), 45); // max 45%
  const critChance = Math.min(luk, 80); // max 80%

  return { atk, def, dodgeChance, critChance, str, agi, int: intStat, luk };
}

function updateBattleStatsDisplay() {
  const stats = getBattleStats();
  const atkEl = $('battle-atk');
  const defEl = $('battle-def');
  const dodgeEl = $('battle-dodge');
  const critEl = $('battle-crit');

  if (atkEl) atkEl.textContent = stats.atk;
  if (defEl) defEl.textContent = stats.def;
  if (dodgeEl) dodgeEl.textContent = stats.dodgeChance + '%';
  if (critEl) critEl.textContent = stats.critChance + '%';
}

function pickMonster() {
  // Weighted random: common 50%, uncommon 28%, rare 17%, boss 5%
  const roll = Math.random() * 100;
  let tier;
  if (roll < 50) tier = 'common';
  else if (roll < 78) tier = 'uncommon';
  else if (roll < 95) tier = 'rare';
  else tier = 'boss';

  // After 10 kills, increase boss chance
  if (battleState.kills > 0 && battleState.kills % 10 === 0) {
    tier = 'boss';
  }

  const candidates = MONSTER_DATABASE.filter(m => m.tier === tier);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function spawnMonster() {
  const monster = pickMonster();
  battleState.currentMonster = monster;

  // Scale HP slightly with kills for progression
  const scale = 1 + Math.floor(battleState.kills / 15) * 0.15;
  battleState.monsterMaxHp = Math.floor(monster.hp * scale);
  battleState.monsterHp = battleState.monsterMaxHp;

  // Update UI
  const nameEl = $('monster-name');
  const tierEl = $('monster-tier');
  const spriteEl = $('monster-sprite');
  const hpFill = $('monster-hp-fill');
  const hpText = $('monster-hp-text');

  const mName = monster.name[state.lang] || monster.name.en;
  if (nameEl) nameEl.textContent = mName;
  if (tierEl) {
    tierEl.textContent = monster.tier.toUpperCase();
    tierEl.className = 'monster-tier ' + monster.tier;
  }
  if (spriteEl) {
    spriteEl.textContent = monster.sprite;
    spriteEl.classList.remove('shake', 'entrance');
    void spriteEl.offsetWidth; // force reflow
    spriteEl.classList.add('entrance');
  }
  if (hpFill) hpFill.style.width = '100%';
  if (hpText) hpText.textContent = `${battleState.monsterMaxHp}/${battleState.monsterMaxHp}`;

  // Log appearance
  const isBoss = monster.tier === 'boss';
  if (isBoss) {
    playBossAppearSound();
    addLogLine('boss-appear', `⚠️ BOSS: ${mName} ${state.lang === 'en' ? 'appears' : 'xuất hiện'}! [HP: ${battleState.monsterMaxHp}]`);
  } else {
    addLogLine('monster-appear', `🐉 ${mName} ${state.lang === 'en' ? 'appears' : 'xuất hiện'}! [HP: ${battleState.monsterMaxHp}]`);
  }
}

function formatBattleTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function addLogLine(type, text) {
  const log = $('combat-log');
  if (!log) return;

  const line = document.createElement('div');
  line.className = 'log-line ' + type;
  line.innerHTML = `<span class="log-time">${formatBattleTime(battleState.battleTime)}</span><span class="log-text">${text}</span>`;
  log.appendChild(line);

  // Limit to 100 lines
  while (log.children.length > 100) {
    log.removeChild(log.firstChild);
  }

  // Auto-scroll to bottom
  log.scrollTop = log.scrollHeight;
}

function updateMonsterHpBar() {
  const hpFill = $('monster-hp-fill');
  const hpText = $('monster-hp-text');
  const percent = Math.max(0, (battleState.monsterHp / battleState.monsterMaxHp) * 100);
  if (hpFill) hpFill.style.width = percent + '%';
  if (hpText) hpText.textContent = `${Math.max(0, battleState.monsterHp)}/${battleState.monsterMaxHp}`;
}

function combatTick() {
  if (!battleState.active || !battleState.currentMonster) return;

  battleState.battleTime++;
  const stats = getBattleStats();
  const monster = battleState.currentMonster;
  const mName = monster.name[state.lang] || monster.name.en;
  const playerName = state.lang === 'en' ? 'Duc' : 'Đức';

  // === PLAYER ATTACKS ===
  let isCrit = Math.random() * 100 < stats.critChance;
  let baseDmg = Math.max(1, stats.atk - monster.def + Math.floor(Math.random() * 10));

  // INT adds magic bonus damage
  if (stats.int > 80) {
    const magicBonus = Math.floor((stats.int - 80) * 0.5);
    baseDmg += magicBonus;
  }

  let totalDmg = isCrit ? baseDmg * 2 : baseDmg;

  if (isCrit) {
    playCriticalSound();
    addLogLine('critical', `💥 ${state.lang === 'en' ? 'CRITICAL HIT' : 'CHÍ MẠNG'}! ${playerName} → ${mName}: ${totalDmg} dmg!`);
  } else {
    playBattleHitSound();
    // Randomize attack flavor text
    const atkMsgs = state.lang === 'en'
      ? [`⚔️ ${playerName} strikes ${mName} for ${totalDmg} damage!`, `⚔️ ${playerName} slashes ${mName}! -${totalDmg} HP`, `⚔️ ${playerName} attacks ${mName} for ${totalDmg}!`]
      : [`⚔️ ${playerName} tấn công ${mName} gây ${totalDmg} sát thương!`, `⚔️ ${playerName} chém ${mName}! -${totalDmg} HP`, `⚔️ ${playerName} đánh ${mName} gây ${totalDmg}!`];
    addLogLine('attack', atkMsgs[Math.floor(Math.random() * atkMsgs.length)]);
  }

  // Shake monster sprite
  const spriteEl = $('monster-sprite');
  if (spriteEl) {
    spriteEl.classList.remove('shake');
    void spriteEl.offsetWidth;
    spriteEl.classList.add('shake');
  }

  battleState.monsterHp -= totalDmg;
  updateMonsterHpBar();

  // === MONSTER DEFEATED? ===
  if (battleState.monsterHp <= 0) {
    battleState.kills++;
    battleState.gold += monster.gold;

    playMonsterDeathSound();
    addLogLine('loot', `✨ ${mName} ${state.lang === 'en' ? 'defeated' : 'bị hạ gục'}! +${monster.xp} XP, +${monster.gold} Gold`);

    // Update counters
    const killEl = $('kill-count');
    const goldEl = $('gold-count');
    if (killEl) killEl.textContent = battleState.kills;
    if (goldEl) goldEl.textContent = battleState.gold;
    saveGame();

    // Footer ticker
    logMessage(
      `⚔️ ${mName} slain! Total kills: ${battleState.kills}`,
      `⚔️ Hạ gục ${mName}! Tổng: ${battleState.kills}`
    );

    // Short delay then spawn next
    setTimeout(() => {
      if (battleState.active) spawnMonster();
    }, 800);
    return;
  }

  // === MONSTER ATTACKS BACK (after short delay) ===
  setTimeout(() => {
    if (!battleState.active || battleState.monsterHp <= 0) return;

    // Dodge check
    if (Math.random() * 100 < stats.dodgeChance) {
      playDodgeSound();
      addLogLine('dodge', `💨 ${playerName} ${state.lang === 'en' ? 'dodges the attack' : 'né được đòn'}! (AGI: ${stats.agi})`);
      return;
    }

    // Monster damage
    const monsterDmg = Math.max(1, monster.atk - stats.def + Math.floor(Math.random() * 5));
    const weaponName = state.equipped.weapon ? EQUIPMENT_DATABASE[state.equipped.weapon]?.name : null;

    // Blocked damage display
    if (stats.def > 0 && state.equipped.armor) {
      const armorName = EQUIPMENT_DATABASE[state.equipped.armor]?.name || 'Armor';
      const blocked = Math.floor(stats.def * 0.5);
      addLogLine('damage', `🛡️ ${mName} ${state.lang === 'en' ? 'attacks' : 'tấn công'}! -${monsterDmg} HP (${state.lang === 'en' ? 'Blocked' : 'Chặn'} ${blocked} — ${armorName})`);
    } else {
      addLogLine('damage', `💔 ${mName} ${state.lang === 'en' ? 'attacks' : 'tấn công'}! -${monsterDmg} HP`);
    }

    // Track player battle HP for visual drama
    battleState.playerBattleHp -= monsterDmg;
    if (battleState.playerBattleHp <= battleState.playerBattleMaxHp * 0.25) {
      // Auto-heal
      playHealSound();
      battleState.playerBattleHp = battleState.playerBattleMaxHp;
      addLogLine('heal', `💊 ${state.lang === 'en' ? 'Auto-Potion! HP restored to full.' : 'Tự động dùng thuốc! HP hồi đầy.'}`);
    }
  }, 600);
}

function startBattle() {
  if (battleState.active) return;

  battleState.active = true;
  const stats = getBattleStats();
  battleState.playerBattleMaxHp = stats.str * 10 + 200;
  battleState.playerBattleHp = battleState.playerBattleMaxHp;

  const toggleBtn = $('btn-battle-toggle');
  if (toggleBtn) {
    toggleBtn.classList.add('active');
    const label = toggleBtn.querySelector('[data-i18n]');
    if (label) {
      label.setAttribute('data-i18n', 'battle_stop');
      label.textContent = i18n[state.lang].battle_stop;
    }
  }

  addLogLine('system', `⚔️ ${state.lang === 'en' ? 'Battle begins!' : 'Trận chiến bắt đầu!'}`);
  updateBattleStatsDisplay();
  spawnMonster();

  battleState.intervalId = setInterval(combatTick, 2500);
}

function pauseBattle() {
  battleState.active = false;
  if (battleState.intervalId) {
    clearInterval(battleState.intervalId);
    battleState.intervalId = null;
  }

  const toggleBtn = $('btn-battle-toggle');
  if (toggleBtn) {
    toggleBtn.classList.remove('active');
    const label = toggleBtn.querySelector('[data-i18n]');
    if (label) {
      label.setAttribute('data-i18n', 'battle_start');
      label.textContent = i18n[state.lang].battle_start;
    }
  }

  addLogLine('system', `⏸️ ${state.lang === 'en' ? 'Battle paused.' : 'Trận chiến tạm dừng.'}`);
}

function toggleBattle() {
  if (battleState.active) {
    pauseBattle();
  } else {
    startBattle();
  }
  playSelectSound();
}

// Battle toggle button
const btnBattleToggle = $('btn-battle-toggle');
if (btnBattleToggle) {
  btnBattleToggle.addEventListener('click', toggleBattle);
  btnBattleToggle.addEventListener('mouseenter', playHoverSound);
}

// Battle stats are automatically refreshed via updateStatsDisplay() hook

// ═══════════════════════════════════════════════════
// KEYBOARD NAVIGATION
// ═══════════════════════════════════════════════════
document.addEventListener('keydown', (e) => {
  // On start screen, Enter = start
  if (startScreen.classList.contains('active') && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    btnStart.click();
    return;
  }
  // On menu screen, number keys switch tabs
  if (menuScreen.classList.contains('active')) {
    const cmds = ['status', 'skills', 'quests', 'log', 'battle', 'tavern'];
    const idx = parseInt(e.key) - 1;
    if (idx >= 0 && idx < cmds.length) {
      const btn = document.querySelector(`.cmd-btn[data-cmd="${cmds[idx]}"]`);
      if (btn) btn.click();
    }
  }
});

// ═══════════════════════════════════════════════════
// LOCAL SAVE SYSTEM (Database Alternative)
// ═══════════════════════════════════════════════════
const SAVE_KEY = 'ducs_quest_save';

// Trigger visual pulse of the AUTO-SAVE LED
function pulseSaveLed() {
  const led = document.querySelector('.led-dot');
  if (led) {
    led.classList.remove('pulse');
    // Rapid amber-red flash to indicate storage write
    led.style.backgroundColor = 'var(--color-accent)';
    led.style.boxShadow = '0 0 12px var(--color-accent)';
    setTimeout(() => {
      led.style.backgroundColor = '';
      led.style.boxShadow = '';
      led.classList.add('pulse');
    }, 300);
  }
}

function saveGame(isManual = false) {
  try {
    const saveData = {
      state: {
        lang: state.lang,
        soundOn: state.soundOn,
        crtOn: state.crtOn,
        stats: { ...state.stats },
        sp: state.sp,
        equipped: { ...state.equipped }
      },
      battleState: {
        kills: battleState.kills,
        gold: battleState.gold
      },
      eggUnlocked: eggUnlocked
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    pulseSaveLed();
    if (isManual) {
      playSaveSound();
    }
  } catch (e) {
    console.error('Failed to save game:', e);
  }
}

function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return false;

    const data = JSON.parse(saved);
    if (!data) return false;

    // 1. Restore state variables with safeguards
    if (data.state) {
      if (data.state.lang) state.lang = data.state.lang;
      if (typeof data.state.soundOn === 'boolean') state.soundOn = data.state.soundOn;
      if (typeof data.state.crtOn === 'boolean') state.crtOn = data.state.crtOn;
      if (data.state.stats) {
        state.stats = {
          str: data.state.stats.str ?? INITIAL_STATS.str,
          agi: data.state.stats.agi ?? INITIAL_STATS.agi,
          int: data.state.stats.int ?? INITIAL_STATS.int,
          luk: data.state.stats.luk ?? INITIAL_STATS.luk,
        };
      }
      if (typeof data.state.sp === 'number') state.sp = data.state.sp;
      if (data.state.equipped) {
        state.equipped = {
          weapon: data.state.equipped.weapon ?? null,
          armor: data.state.equipped.armor ?? null,
          accessory: data.state.equipped.accessory ?? null,
        };
      }
    }

    // 2. Restore battleState
    if (data.battleState) {
      if (typeof data.battleState.kills === 'number') battleState.kills = data.battleState.kills;
      if (typeof data.battleState.gold === 'number') battleState.gold = data.battleState.gold;
    }

    // 3. Restore easter egg state
    if (typeof data.eggUnlocked === 'boolean') {
      eggUnlocked = data.eggUnlocked;
      if (eggUnlocked) {
        // If they unlocked the easter egg, ensure it stays unlocked visually
        const secretSkill = $('secret-skill') || document.querySelector('[data-equip-id="gemini"]');
        if (secretSkill) {
          secretSkill.style.display = 'block';
        }
      }
    }

    // 4. Update UI to reflect loaded state
    
    // Sound buttons visual sync
    const soundLabel = state.soundOn ? 'sound_on' : 'sound_off';
    const soundText = i18n[state.lang][soundLabel];
    if (btnSound) {
      btnSound.textContent = soundText;
      btnSound.classList.toggle('active', state.soundOn);
    }
    if (menuBtnSound) {
      menuBtnSound.textContent = state.soundOn ? '🔊' : '🔇';
      menuBtnSound.classList.toggle('active', state.soundOn);
    }

    // CRT visual sync
    if (state.crtOn) {
      crtOverlay.classList.add('active');
      document.body.classList.add('crt-active');
      btnCrt.classList.add('active');
      menuBtnCrt.classList.add('active');
    } else {
      crtOverlay.classList.remove('active');
      document.body.classList.remove('crt-active');
      btnCrt.classList.remove('active');
      menuBtnCrt.classList.remove('active');
    }

    // Language visual sync
    const langBtn = $('btn-lang');
    if (langBtn) langBtn.textContent = i18n[state.lang].lang_label;
    const menuLangBtn = $('menu-btn-lang');
    if (menuLangBtn) menuLangBtn.textContent = state.lang === 'en' ? '🌐 EN' : '🌐 VI';
    setLang(state.lang);

    // Stats & Battle Displays
    updateStatsDisplay();
    updateBattleStatsDisplay();
    updateDynamicBars();

    // Equipment visual sync
    refreshEquippedItemsUI();

    // Battle counters sync
    const killEl = $('kill-count');
    const goldEl = $('gold-count');
    if (killEl) killEl.textContent = battleState.kills;
    if (goldEl) goldEl.textContent = battleState.gold;

    return true;
  } catch (e) {
    console.error('Failed to load game:', e);
    return false;
  }
}

// Function to refresh the equipped slots and items list visually
function refreshEquippedItemsUI() {
  // Update equipped slots in left column
  const slots = ['weapon', 'armor', 'accessory'];
  slots.forEach(slot => {
    const slotEl = $(`slot-${slot}`);
    if (!slotEl) return;

    const itemId = state.equipped[slot];
    if (itemId && EQUIPMENT_DATABASE[itemId]) {
      const item = EQUIPMENT_DATABASE[itemId];
      slotEl.classList.remove('empty');
      slotEl.classList.add(item.rarity);
      slotEl.querySelector('.slot-icon').textContent = item.icon;
      
      const statusEl = slotEl.querySelector('.tooltip-status');
      if (statusEl) {
        statusEl.textContent = `${item.name} (${state.lang === 'en' ? 'Equipped' : 'Đang trang bị'})`;
        statusEl.removeAttribute('data-i18n'); // clear i18n translation override
      }
    } else {
      slotEl.className = `equip-slot empty`;
      slotEl.querySelector('.slot-icon').textContent = slot === 'weapon' ? '⚔️' : slot === 'armor' ? '🛡️' : '💍';
      
      const statusEl = slotEl.querySelector('.tooltip-status');
      if (statusEl) {
        statusEl.setAttribute('data-i18n', 'slot_empty');
        statusEl.textContent = i18n[state.lang].slot_empty;
      }
    }
  });

  // Update equipped styling in inventory grid cards
  document.querySelectorAll('.equip-card').forEach(card => {
    const id = card.dataset.equipId || card.getAttribute('data-equip-id');
    if (id) {
      const item = EQUIPMENT_DATABASE[id];
      if (item && state.equipped[item.slot] === id) {
        card.classList.add('equipped');
      } else {
        card.classList.remove('equipped');
      }
    }
  });
}

function resetGame() {
  const confirmMsg = i18n[state.lang].save_confirm_reset;
  if (confirm(confirmMsg)) {
    playResetSound();
    localStorage.removeItem(SAVE_KEY);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
}

function exportSave() {
  try {
    // Save current state first to ensure it's up to date
    saveGame();
    const currentSave = localStorage.getItem(SAVE_KEY);
    if (!currentSave) return;

    const blob = new Blob([currentSave], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ducs_quest_save_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    playSaveSound();
  } catch (e) {
    console.error('Failed to export save:', e);
    playErrorSound();
  }
}

function importSave(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const content = e.target.result;
      const parsed = JSON.parse(content);

      // Validation check
      if (parsed && typeof parsed === 'object' && parsed.state && parsed.battleState) {
        localStorage.setItem(SAVE_KEY, content);
        playSaveSound();
        alert(i18n[state.lang].save_import_success);
        window.location.reload();
      } else {
        throw new Error('Invalid format');
      }
    } catch (err) {
      console.error(err);
      playErrorSound();
      alert(i18n[state.lang].save_import_invalid);
    }
  };
  reader.readAsText(file);
}

// Register Save Buttons
const btnExportSave = $('btn-export-save');
const btnImportSave = $('btn-import-save');
const saveFileInput = $('save-file-input');
const btnResetSave = $('btn-reset-save');

if (btnExportSave) btnExportSave.addEventListener('click', () => { playSelectSound(); exportSave(); });
if (btnImportSave) btnImportSave.addEventListener('click', () => { playSelectSound(); saveFileInput.click(); });
if (saveFileInput) saveFileInput.addEventListener('change', importSave);
if (btnResetSave) btnResetSave.addEventListener('click', resetGame);

// ═══════════════════════════════════════════════════
// INITIALIZE CRT & Dynamic bars on load
// ═══════════════════════════════════════════════════
// Attempt to load previous save game first
const saveLoaded = loadGame();

if (!saveLoaded) {
  // If no save exists, apply defaults
  if (state.crtOn) {
    document.body.classList.add('crt-active');
  }
  btnCrt.classList.add('active');
  menuBtnCrt.classList.add('active');
  updateDynamicBars();
  updateBattleStatsDisplay();
}

// Always render tavern messages on load
renderTavernMessages();


