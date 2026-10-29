const PUZZLES = [
  { title: "What comes next?", category: "NUMBER PATTERNS", description: "Find the hidden rhythm in the numbers.", difficulty: "Easy", time: "2 min", points: 100, prompt: "Look closely at this sequence. What number should come next?", sequence: "2, 6, 12, 20, 30, ?", choices: ["36", "40", "42", "48"], answer: 2, hint: "Look at the difference between each pair of numbers. The gap grows by two every time." },
  { title: "The switched labels", category: "LOGIC", description: "One small truth changes everything.", difficulty: "Easy", time: "3 min", points: 120, prompt: "Three jars are labeled APPLES, ORANGES, and MIXED. Every label is wrong. You may pick one fruit from one jar. Which jar do you choose to correctly identify all three?", sequence: "", choices: ["The jar labeled APPLES", "The jar labeled ORANGES", "The jar labeled MIXED", "It cannot be done"], answer: 2, hint: "Since every label is wrong, the jar labeled MIXED cannot be mixed. Start there." },
  { title: "A clever crossing", category: "RIDDLE", description: "A riddle that rewards a fresh angle.", difficulty: "Easy", time: "2 min", points: 100, prompt: "A farmer has a fox, a chicken, and a bag of grain. The boat carries the farmer and only one of the three. What must the farmer take across first?", sequence: "", choices: ["The fox", "The chicken", "The grain", "It doesn't matter"], answer: 1, hint: "Think about which two cannot be left alone together." },
  { title: "The missing square", category: "NUMBER PATTERNS", description: "Spot the rule hiding in plain sight.", difficulty: "Medium", time: "3 min", points: 150, prompt: "Each row follows the same rule. What number belongs in the last box?", sequence: "2 → 4 → 8\n3 → 6 → 12\n5 → 10 → ?", choices: ["15", "18", "20", "25"], answer: 2, hint: "In each row, each number is double the one before it." },
  { title: "Who said it?", category: "DEDUCTION", description: "Only one person is telling the truth.", difficulty: "Medium", time: "3 min", points: 160, prompt: "A missing cookie was eaten by Ava, Ben, or Cleo. Ava says, “Ben did it.” Ben says, “I didn't do it.” Cleo says, “Ava did it.” Exactly one person is telling the truth. Who took the cookie?", sequence: "", choices: ["Ava", "Ben", "Cleo", "There isn't enough information"], answer: 1, hint: "Try each culprit. If Ben took it, Ava's statement is true and the other two are false." },
  { title: "Clockwork", category: "NUMBER PATTERNS", description: "Read the clock's unusual pattern.", difficulty: "Medium", time: "3 min", points: 160, prompt: "A clock shows 3:15. What is the smaller angle between the hour hand and the minute hand?", sequence: "", choices: ["0°", "7.5°", "15°", "22.5°"], answer: 1, hint: "At 3:15 the minute hand is at 90°, but the hour hand has moved a quarter of the way from 3 to 4." },
  { title: "The silent sequence", category: "PATTERN SPOTTING", description: "A classic pattern with a twist.", difficulty: "Hard", time: "4 min", points: 200, prompt: "What comes next in this sequence?", sequence: "1, 11, 21, 1211, 111221, ?", choices: ["312211", "311221", "123121", "211211"], answer: 0, hint: "Read each number aloud as a description of the digits in the previous one: one 1, then two 1s, then one 2 and one 1…" },
  { title: "The last lantern", category: "LOGIC", description: "Bring all your reasoning together.", difficulty: "Hard", time: "5 min", points: 250, prompt: "One of 9 identical-looking lanterns is slightly heavier. Using a balance scale only twice, what is the largest number of lanterns you can still guarantee identifying the heavier one from?", sequence: "", choices: ["6 lanterns", "8 lanterns", "9 lanterns", "12 lanterns"], answer: 2, hint: "Divide the lanterns into three groups of three. One weighing narrows it to a group of three, and a second weighing identifies the heavier one." }
];

const STORAGE_KEY = "mindspace-v1";
const DEMO_ADMIN_EMAIL = "admin@mindchallenge.demo";
const DEMO_ADMIN_PASSWORD = "MindChallengeAdmin2026!";
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const icon = (name) => {
  const paths = {
    brain: '<path d="M12 4.2a3.1 3.1 0 0 0-5.8 1.5A3.5 3.5 0 0 0 5 12a3.4 3.4 0 0 0 2 5.7A3.1 3.1 0 0 0 12 20"/><path d="M12 4.2a3.1 3.1 0 0 1 5.8 1.5A3.5 3.5 0 0 1 19 12a3.4 3.4 0 0 1-2 5.7A3.1 3.1 0 0 1 12 20M12 4v16m-3-10h3m3 4h-3"/>',
    spark: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    award: '<circle cx="12" cy="8" r="5"/><path d="m8.2 12-1.1 9L12 18l4.9 3-1.1-9"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pattern: '<path d="M4 18 10 6l4 8 3-5 3 9"/><circle cx="4" cy="18" r="1"/><circle cx="10" cy="6" r="1"/><circle cx="14" cy="14" r="1"/><circle cx="17" cy="9" r="1"/>',
    logic: '<path d="M7 4h10a3 3 0 0 1 3 3v3h-5v4h5v3a3 3 0 0 1-3 3h-3v-5H9v5H7a3 3 0 0 1-3-3v-3h5V9H4V7a3 3 0 0 1 3-3Z"/>',
    riddle: '<path d="M9.5 9a2.6 2.6 0 1 1 4.3 2c-1.1.9-1.8 1.4-1.8 3"/><path d="M12 17.5v.1"/><circle cx="12" cy="12" r="9"/>',
    deduction: '<path d="M4 5h16M4 10h10M4 15h13M4 20h8"/><circle cx="18" cy="17" r="3"/>',
    pattern2: '<path d="M4 7h16M7 12h10M10 17h4"/><circle cx="6" cy="7" r="1"/><circle cx="17" cy="12" r="1"/><circle cx="9" cy="17" r="1"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.spark}</svg>`;
};

function freshState() {
  return { users: {}, currentEmail: null, guest: { score: 0, completed: [], streak: 0, lastPlayed: null, displayName: "Guest player" }, theme: "dark" };
}
function createId() {
  return globalThis.crypto?.randomUUID?.() || `user-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
function defaultSeedClients() {
  return {
    "sarah.j@example.com": {
      id: "client-sarah-101",
      displayName: "Sarah Jenkins",
      name: "Sarah Jenkins",
      email: "sarah.j@example.com",
      role: "client",
      joinedAt: "2026-10-14T08:45:00.000Z",
      updatedAt: "2026-10-28T09:12:00.000Z",
      score: 1180,
      completed: [0, 1, 2, 3, 4, 6],
      streak: 5,
      lastPlayed: "2026-10-28",
      notes: "UX Product Designer. Regular weekday client who plays a puzzle with morning coffee. High accuracy in logic & riddles."
    },
    "lucas.m@studio-logic.com": {
      id: "client-lucas-102",
      displayName: "Lucas Moreau",
      name: "Lucas Moreau",
      email: "lucas.m@studio-logic.com",
      role: "client",
      joinedAt: "2026-09-29T14:10:00.000Z",
      updatedAt: "2026-10-28T11:05:00.000Z",
      score: 1430,
      completed: [0, 1, 2, 3, 4, 5, 6, 7],
      streak: 12,
      lastPlayed: "2026-10-28",
      notes: "Master solver who solved all 8 challenges! Very consistent player with an ongoing 12-day streak."
    },
    "camille.m@mindspace.demo": {
      id: "client-camille-103",
      displayName: "Camille Martin",
      name: "Camille Martin",
      email: "camille.m@mindspace.demo",
      role: "client",
      joinedAt: "2026-10-18T10:30:00.000Z",
      updatedAt: "2026-10-27T16:40:00.000Z",
      score: 880,
      completed: [0, 1, 2, 3],
      streak: 3,
      lastPlayed: "2026-10-27",
      notes: "Student client focusing on number patterns and deduction. Steady progress on medium-level puzzles."
    },
    "elena.r@academ.org": {
      id: "client-elena-104",
      displayName: "Elena Rostova",
      name: "Elena Rostova",
      email: "elena.r@academ.org",
      role: "client",
      joinedAt: "2026-10-24T17:15:00.000Z",
      updatedAt: "2026-10-28T08:00:00.000Z",
      score: 520,
      completed: [0, 1, 2],
      streak: 2,
      lastPlayed: "2026-10-28",
      notes: "Recent subscriber. Uses Mindspace for short cognitive warm-up sessions before study."
    }
  };
}
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object") return { ...freshState(), users: defaultSeedClients() };
    const restored = { ...freshState(), ...saved, users: saved.users && typeof saved.users === "object" ? saved.users : {}, guest: { ...freshState().guest, ...(saved.guest || {}) } };
    
    // Seed default example clients if storage has no client accounts
    const clientCount = Object.values(restored.users).filter((u) => u && u.email !== DEMO_ADMIN_EMAIL).length;
    if (clientCount === 0) {
      Object.assign(restored.users, defaultSeedClients());
    }

    Object.entries(restored.users).forEach(([email, user]) => {
      if (!user || typeof user !== "object") { delete restored.users[email]; return; }
      user.id ||= createId();
      user.email ||= email;
      user.role = email === DEMO_ADMIN_EMAIL ? "admin" : "client";
      user.updatedAt ||= user.joinedAt || new Date().toISOString();
      user.completed = Array.isArray(user.completed) ? user.completed : [];
      user.score = Number.isFinite(user.score) ? user.score : 0;
    });
    if (restored.currentEmail === DEMO_ADMIN_EMAIL || (restored.currentEmail && !restored.users[restored.currentEmail])) restored.currentEmail = null;
    return restored;
  } catch (error) {
    console.error("Mind Challenge could not load saved progress.", error);
    return { ...freshState(), users: defaultSeedClients() };
  }
}
let state = loadState();
let activePage = "home";
let authMode = "login";
let activePuzzleIndex = null;
let answered = false;
let hintShown = false;
let earnedPoints = 0;
let toastTimer;
let adminAuthenticated = false;
let adminSection = "Affichage";
let adminSearch = "";
let adminRoleFilter = "all";
let selectedUserId = "";
let confirmResolver = null;

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (error) { console.error("Mind Challenge could not save progress.", error); showToast("Progress couldn't be saved in this browser."); }
}
function player() {
  return state.currentEmail ? state.users[state.currentEmail] : state.guest;
}
function hasAdminAccess() {
  return adminAuthenticated && state.currentEmail === DEMO_ADMIN_EMAIL;
}
function allUsers() {
  return Object.values(state.users).filter((user) => user && typeof user === "object");
}
function userRole(user) {
  return user?.role === "admin" ? "Admin" : "Client";
}
function completedSet() {
  return new Set(Array.isArray(player().completed) ? player().completed : []);
}
function isUnlocked(index) {
  return index === 0 || completedSet().has(index - 1);
}
function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}
function initials(name = "Guest player") {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase() || "?";
}
function dateLabel() {
  return new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());
}
function render() {
  renderHeader();
  renderPage();
}
function renderHeader() {
  const data = player();
  const name = data.displayName || data.name || "Guest player";
  $("#top-name").textContent = name;
  $("#top-avatar").textContent = initials(name);
  $("#top-subtitle").textContent = state.currentEmail ? state.currentEmail : "Create your account";
  $("#top-streak").textContent = data.streak || 0;
  const adminNav = $(".admin-nav-link");
  if (adminNav) adminNav.hidden = true;
  $("#nav-count").textContent = String(PUZZLES.length).padStart(2, "0");
  document.body.classList.toggle("light-theme", state.theme === "light");
  $("#theme-toggle").setAttribute("aria-label", `Switch to ${state.theme === "light" ? "dark" : "light"} mode`);
  const themeText = $("#theme-toggle span:nth-child(2)");
  if (themeText) themeText.textContent = state.theme === "light" ? "Dark appearance" : "Light appearance";
}
function renderPage() {
  const content = $("#page-content");
  if (activePage === "admin") {
    if (hasAdminAccess()) {
      window.location.href = "admin.html";
      return;
    }
    activePage = "home";
    showToast("Admin dashboard is accessible at admin.html with administrator permissions.");
  }
  const labels = { home: "Overview", levels: "All challenges", leaderboard: "Leaderboard", profile: "My profile", admin: "Back Office" };
  $("#breadcrumb-current").textContent = labels[activePage] || "Overview";
  $$(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.page === activePage));
  if (activePage === "home") content.innerHTML = renderHome();
  if (activePage === "levels") content.innerHTML = renderLevels();
  if (activePage === "leaderboard") content.innerHTML = renderLeaderboard();
  if (activePage === "profile") content.innerHTML = renderProfile();
  if (activePage === "admin") content.innerHTML = renderAdmin();
  bindPageActions(content);
}
function renderHome() {
  const data = player();
  const completed = completedSet();
  const nextIndex = PUZZLES.findIndex((_, index) => !completed.has(index) && isUnlocked(index));
  const allComplete = nextIndex === -1;
  const next = PUZZLES[allComplete ? 0 : nextIndex];
  const done = completed.size;
  const progress = Math.round(done / PUZZLES.length * 100);
  const name = data.displayName || data.name || "curious mind";
  const greetingName = state.currentEmail ? escapeHtml(name.split(" ")[0]) : "curious mind";
  const challengeCards = [0, 1, 2].map((index) => challengeCard(index)).join("");
  return `
    <section class="welcome-row">
      <div><div class="eyebrow"><span class="eyebrow-dot"></span> A FRESH DAY, A FRESH PERSPECTIVE</div>
      <h1 class="welcome-title">Good to see you, <em>${greetingName}.</em></h1>
      <p class="welcome-subtitle">A little curiosity goes a long way. Ready for today's brain stretch?</p></div>
      <div class="date-label">${dateLabel()}</div>
    </section>
    <section class="hero-card" aria-label="Featured challenge">
      <div class="hero-copy"><div class="hero-kicker">✦ &nbsp; ${allComplete ? "A BRILLIANT LITTLE MILESTONE" : "YOUR NEXT LITTLE CHALLENGE"}</div>
        <h2 class="hero-title">${allComplete ? "Every puzzle, solved." : escapeHtml(next.title)}</h2>
        <p class="hero-description">${allComplete ? "You've given every challenge your best thinking. Take a well-earned bow, or revisit your favorite." : `${escapeHtml(next.description)} Take a breath, trust your instincts, and see where your thinking takes you.`}</p>
        <button class="button-primary" data-play="${allComplete ? 0 : nextIndex}">${allComplete ? "Revisit a challenge" : "Let's play"} <span aria-hidden="true">→</span></button>
        <div class="hero-details"><span>${icon("clock")} <b>${escapeHtml(next.time)}</b></span><span>${icon("spark")} <b>${next.points} points</b></span><span>${escapeHtml(next.difficulty)}</span></div>
      </div>
      <div class="hero-art" aria-hidden="true"><div class="orbit"></div><div class="orbit orbit-two"></div><div class="orbit orbit-three"></div><span class="orbit-dot dot-one"></span><span class="orbit-dot dot-two"></span><span class="orbit-dot dot-three"></span><div class="art-core">${icon("brain")}</div></div>
    </section>
    <section class="stats-grid" aria-label="Your progress">
      <div class="stat-card"><div class="stat-icon stat-purple">${icon("spark")}</div><div class="stat-copy"><span class="stat-label">Total points</span><strong class="stat-value">${(data.score || 0).toLocaleString()}</strong><span class="stat-note">Your brain, in its element</span></div></div>
      <div class="stat-card"><div class="stat-icon stat-green">${icon("check")}</div><div class="stat-copy"><span class="stat-label">Solved</span><strong class="stat-value">${done}<span style="font-size:11px;color:var(--muted);font-weight:400"> / ${PUZZLES.length}</span></strong><span class="stat-note">Little wins add up</span></div></div>
      <div class="stat-card"><div class="stat-icon stat-gold">${icon("target")}</div><div class="stat-copy"><span class="stat-label">Completion</span><strong class="stat-value">${progress}%</strong><span class="stat-note">Your progress is yours</span></div></div>
      <div class="stat-card"><div class="stat-icon stat-pink">${icon("award")}</div><div class="stat-copy"><span class="stat-label">Current streak</span><strong class="stat-value">${data.streak || 0} <span style="font-size:11px;font-weight:400">${data.streak === 1 ? "day" : "days"}</span></strong><span class="stat-note">Keep your curiosity alive</span></div></div>
    </section>
    <section class="section-heading"><div><h2 class="section-title">A few good places to start</h2><p class="section-subtitle">Small puzzles. Surprisingly satisfying.</p></div><button class="text-button" data-go="levels">See all challenges →</button></section>
    <section class="challenge-grid">${challengeCards || '<div class="empty-state">You have completed every challenge. What a brilliant run!</div>'}</section>`;
}
function categoryIcon(category) {
  if (category.includes("LOGIC")) return ["logic", "mark-purple"];
  if (category.includes("RIDDLE")) return ["riddle", "mark-gold"];
  if (category.includes("DEDUCTION")) return ["deduction", "mark-green"];
  if (category.includes("PATTERN SPOTTING")) return ["pattern2", "mark-blue"];
  return ["pattern", "mark-purple"];
}
function challengeCard(index) {
  const puzzle = PUZZLES[index], done = completedSet().has(index);
  const [iconName, markClass] = categoryIcon(puzzle.category);
  const unlocked = isUnlocked(index);
  return `<article class="challenge-card ${unlocked ? "" : "locked"}" ${unlocked ? `data-play="${index}" tabindex="0" role="button" aria-label="Play ${escapeHtml(puzzle.title)}"` : `aria-label="${escapeHtml(puzzle.title)}, locked"`}>
    <div class="challenge-card-top"><span class="category-mark ${markClass}">${icon(iconName)}</span><span class="difficulty">${escapeHtml(puzzle.difficulty)}</span></div>
    <h3 class="challenge-title">${escapeHtml(puzzle.title)}</h3><p class="challenge-description">${escapeHtml(puzzle.description)}</p>
    <div class="challenge-card-bottom"><span>${escapeHtml(puzzle.time)} &nbsp;·&nbsp; <b>+${puzzle.points} pts</b></span><span class="${done ? "challenge-complete" : ""}">${done ? "✓ Solved" : unlocked ? "Try it →" : "Locked"}</span></div></article>`;
}
function renderLevels() {
  const done = completedSet();
  const pct = Math.round(done.size / PUZZLES.length * 100);
  return `<section class="page-heading"><div class="eyebrow"><span class="eyebrow-dot"></span> YOUR PERSONAL PUZZLE PATH</div><h1>Choose your next challenge.</h1><p>Each little victory unlocks a new way to think.</p></section>
    <section class="levels-progress"><div class="levels-progress-copy"><strong>Your journey so far</strong><span>${done.size} of ${PUZZLES.length} challenges solved</span></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><span class="levels-progress-total">${pct}%</span></section>
    <section class="level-list" aria-label="Puzzle levels">${PUZZLES.map((puzzle, index) => {
      const unlocked = isUnlocked(index), solved = done.has(index);
      return `<article class="level-row ${solved ? "is-done" : ""} ${unlocked ? "" : "locked"}" ${unlocked ? `data-play="${index}" tabindex="0" role="button"` : ""}>
        <span class="level-number">${solved ? "✓" : unlocked ? String(index + 1).padStart(2, "0") : "· · ·"}</span>
        <span class="level-info"><strong>${escapeHtml(puzzle.title)}</strong><span>${escapeHtml(puzzle.category.toLowerCase().replace(/\\b\\w/g, (letter) => letter.toUpperCase()))} &nbsp;·&nbsp; ${escapeHtml(puzzle.description)}</span></span>
        <span class="level-meta"><span>${escapeHtml(puzzle.difficulty)}</span><b>+${puzzle.points} pts</b></span>
        <span class="level-status">${solved ? "Completed" : unlocked ? `${escapeHtml(puzzle.time)} →` : "Locked"}</span>
      </article>`;
    }).join("")}</section>`;
}
function leaderboardEntries() {
  const registered = Object.values(state.users).filter((u) => u && u.role !== "admin" && (u.score || 0) > 0);
  const examples = registered.length > 0 ? registered.map((c) => ({
    name: c.displayName || c.name || "Client",
    score: c.score || 0,
    level: Array.isArray(c.completed) ? c.completed.length : 0,
    initials: initials(c.displayName || c.name || "Client"),
    note: c.email === state.currentEmail ? "That's you" : (c.notes ? c.notes.slice(0, 24) + "..." : "Curious mind"),
    isPlayer: c.email === state.currentEmail
  })) : [
    { name: "Nova M.", score: 1520, level: 8, initials: "N", note: "The pattern finder" },
    { name: "Elliot R.", score: 1180, level: 7, initials: "E", note: "The late-night thinker" },
    { name: "Sam K.", score: 940, level: 6, initials: "S", note: "The riddle solver" },
    { name: "Rory J.", score: 720, level: 5, initials: "R", note: "The curious one" }
  ];

  const data = player();
  if (!state.currentEmail && (data.score || 0) > 0) {
    examples.push({ name: data.displayName || data.name || "You", score: data.score, level: completedSet().size, initials: initials(data.displayName || data.name || "You"), note: "That's you", isPlayer: true });
  }
  return examples.sort((a, b) => b.score - a.score).map((entry, index) => ({ ...entry, rank: index + 1, isPlayer: entry.isPlayer || entry.name === (data.displayName || data.name) }));
}
function renderLeaderboard() {
  const rows = leaderboardEntries().map((entry) => `<div class="leaderboard-row ${entry.isPlayer ? "is-player" : ""}">
    <span class="rank-number ${entry.rank <= 3 ? "top-rank" : ""}">${String(entry.rank).padStart(2, "0")}</span>
    <span class="player-name-cell"><span class="mini-avatar">${escapeHtml(entry.initials)}</span><span>${escapeHtml(entry.name)}<small>${escapeHtml(entry.note)}</small></span></span>
    <span class="player-score">${entry.score.toLocaleString()} pts</span><span class="player-level">Level ${entry.level}</span>
  </div>`).join("");
  return `<section class="page-heading"><div class="eyebrow"><span class="eyebrow-dot"></span> A LITTLE FRIENDLY INSPIRATION</div><h1>Curious minds, together.</h1><p>Some example scores to get you going. Solve a puzzle to join in.</p></section>
    <section class="leaderboard-panel"><div class="leaderboard-heading"><span>RANK</span><span>PLAYER</span><span>POINTS</span><span>LEVEL</span></div>${rows}</section>
    <p style="color:var(--muted);font-size:9px;line-height:1.6">The names above are friendly demo examples. This project runs entirely in your browser, so there's no shared online leaderboard.</p>`;
}
function renderProfile() {
  const data = player();
  const name = data.displayName || data.name || "Guest player";
  const achievements = [
    ["First spark", completedSet().size >= 1], ["Getting curious", completedSet().size >= 3], ["Mind in motion", completedSet().size >= 5], ["Full circle", completedSet().size === PUZZLES.length]
  ];
  const created = data.joinedAt ? new Date(data.joinedAt).toLocaleDateString(undefined, { month: "long", year: "numeric" }) : "Just getting started";
  return `<section class="page-heading"><div class="eyebrow"><span class="eyebrow-dot"></span> YOUR OWN LITTLE CORNER</div><h1>All about you.</h1><p>Every profile has a mind behind it. This one's yours.</p></section>
    <section class="profile-panel"><div class="profile-card-head"><span class="profile-avatar">${escapeHtml(initials(name))}</span><div class="profile-identity"><h2>${escapeHtml(name)}</h2><p>${state.currentEmail ? escapeHtml(state.currentEmail) : "Playing as a guest"} &nbsp;·&nbsp; ${state.currentEmail ? `${userRole(data)} account` : "Guest player"}</p></div><button class="button-secondary" data-edit-profile>Edit profile</button></div>
    <div class="profile-details"><div class="profile-detail"><span>DISPLAY NAME</span><strong>${escapeHtml(name)}</strong></div><div class="profile-detail"><span>EMAIL ADDRESS</span><strong>${state.currentEmail ? escapeHtml(state.currentEmail) : "Not linked"}</strong></div>
    <div class="profile-detail"><span>MEMBER SINCE</span><strong>${escapeHtml(created)}</strong></div><div class="profile-detail"><span>CHALLENGES SOLVED</span><strong>${completedSet().size} of ${PUZZLES.length}</strong></div></div>
    <div class="profile-achievements"><h3>A few things you've earned</h3><div class="badge-list">${achievements.map(([label, earned]) => `<span class="achievement-badge ${earned ? "" : "locked-badge"}">${earned ? "✦" : "◇"} &nbsp;${label}</span>`).join("")}</div></div></section>
    ${state.currentEmail ? `<div class="profile-actions"><button class="button-secondary" data-sign-out>Sign out</button>${hasAdminAccess() ? '<span class="prototype-note">Demo administrator account · protected from deletion</span>' : '<button class="button-secondary danger-outline" data-delete-own-account>Delete my account</button>'}</div>` : '<button class="button-primary" data-auth-mode="register">Create a free account <span aria-hidden="true">→</span></button><p style="margin-top:10px;color:var(--muted);font-size:9px">Your guest progress stays saved in this browser.</p>'}`;
}
function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}
function findUserById(id) {
  return allUsers().find((user) => user.id === id);
}
function selectedAdminUser() {
  return findUserById(selectedUserId) || allUsers().find((user) => user.email !== DEMO_ADMIN_EMAIL) || null;
}
function filteredAdminUsers() {
  const query = adminSearch.trim().toLowerCase();
  return allUsers().filter((user) => {
    const role = userRole(user).toLowerCase();
    const matchesRole = adminRoleFilter === "all" || role === adminRoleFilter;
    const matchesSearch = !query || [user.id, user.displayName, user.name, user.email].some((value) => String(value || "").toLowerCase().includes(query));
    return matchesRole && matchesSearch;
  }).sort((a, b) => String(a.displayName || a.name || "").localeCompare(String(b.displayName || b.name || "")));
}
function renderAdmin() {
  const sections = ["Affichage", "Ajouter", "Modifier", "Supprimer", "Mise à jour"];
  let sectionContent = "";
  if (adminSection === "Affichage") {
    const rows = filteredAdminUsers().map((user) => `<tr data-admin-select="${escapeHtml(user.id)}" tabindex="0">
      <td><code>${escapeHtml(user.id)}</code></td><td><strong>${escapeHtml(user.displayName || user.name || "Unnamed")}</strong></td>
      <td>${escapeHtml(user.email || "—")}</td><td>${escapeHtml(formatDate(user.joinedAt))}</td><td>${escapeHtml(formatDate(user.updatedAt))}</td>
      <td>${Number(user.score || 0).toLocaleString()} pts</td><td><span class="role-badge ${userRole(user) === "Admin" ? "role-admin" : ""}">${userRole(user)}</span></td></tr>`).join("");
    sectionContent = `<div class="admin-toolbar"><label class="admin-search"><span>⌕</span><input id="admin-search" type="search" value="${escapeHtml(adminSearch)}" placeholder="Rechercher un nom, e-mail ou ID…" /></label><label class="admin-filter"><span>Rôle</span><select id="admin-role-filter"><option value="all" ${adminRoleFilter === "all" ? "selected" : ""}>Tous les rôles</option><option value="client" ${adminRoleFilter === "client" ? "selected" : ""}>Clients</option><option value="admin" ${adminRoleFilter === "admin" ? "selected" : ""}>Admins</option></select></label><span class="admin-user-count">${filteredAdminUsers().length} utilisateur(s)</span><button class="button-secondary" data-admin-refresh>↻ Actualiser</button></div>
      <div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>ID</th><th>Nom</th><th>E-mail</th><th>Inscription</th><th>Dernière mise à jour</th><th>Score</th><th>Rôle</th></tr></thead><tbody>${rows || `<tr><td colspan="7"><div class="admin-empty">Aucun utilisateur trouvé. Modifiez la recherche ou ajoutez un client.</div></td></tr>`}</tbody></table></div><p class="admin-help">Sélectionnez une ligne pour modifier ou supprimer un compte. Le compte administrateur de démonstration est protégé.</p>`;
  } else if (adminSection === "Ajouter") {
    sectionContent = `<form class="admin-form" id="admin-add-form" novalidate><div class="admin-form-intro"><span class="admin-form-icon">＋</span><div><h2>Ajouter un client</h2><p>Créez un compte client. Les nouveaux comptes ne peuvent pas obtenir le rôle Admin.</p></div></div><div class="admin-form-grid"><div class="form-field"><label for="add-name">NOM COMPLET</label><input id="add-name" name="name" maxlength="32" placeholder="Ex. Camille Martin" required /></div><div class="form-field"><label for="add-email">ADRESSE E-MAIL</label><input id="add-email" name="email" type="email" placeholder="camille@example.com" required /></div><div class="form-field"><label for="add-password">MOT DE PASSE (8 CARACTÈRES MINIMUM)</label><input id="add-password" name="password" type="password" minlength="8" placeholder="Mot de passe temporaire" required /></div><div class="form-field"><label>RÔLE ATTRIBUÉ</label><div class="readonly-role">Client <span>Les comptes ajoutés sont clients</span></div></div></div><p class="admin-form-message" id="admin-add-message" role="status"></p><button class="button-primary" type="submit">Ajouter le client →</button></form>`;
  } else if (adminSection === "Modifier") {
    const user = selectedAdminUser();
    sectionContent = user ? `<form class="admin-form" id="admin-edit-form" novalidate><div class="admin-form-intro"><span class="admin-form-icon">✎</span><div><h2>Modifier un utilisateur</h2><p>Les scores, niveaux et progression sont conservés lors de la modification du profil.</p></div></div><div class="form-field"><label for="edit-user-select">UTILISATEUR SÉLECTIONNÉ</label><select id="edit-user-select">${allUsers().map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === user.id ? "selected" : ""}>${escapeHtml(item.displayName || item.name || item.email)} · ${userRole(item)}</option>`).join("")}</select></div><div class="admin-form-grid"><div class="form-field"><label for="edit-name">NOM COMPLET</label><input id="edit-name" name="name" maxlength="32" value="${escapeHtml(user.displayName || user.name || "")}" required /></div><div class="form-field"><label for="edit-email">ADRESSE E-MAIL</label><input id="edit-email" name="email" type="email" value="${escapeHtml(user.email || "")}" ${user.email === DEMO_ADMIN_EMAIL ? "disabled" : ""} required /></div><div class="form-field"><label>RÔLE</label><div class="readonly-role">${userRole(user)} <span>Le rôle est géré par la configuration du prototype.</span></div></div><div class="form-field"><label>SCORE ET PROGRESSION</label><div class="readonly-role">${Number(user.score || 0).toLocaleString()} pts · ${(user.completed || []).length} niveau(x) terminé(s)<span>Conservés automatiquement</span></div></div></div><p class="admin-form-message" id="admin-edit-message" role="status"></p><button class="button-primary" type="submit">Enregistrer les modifications →</button></form>` : `<div class="admin-empty-card">Aucun compte disponible pour modification. Ajoutez d'abord un client.</div>`;
  } else if (adminSection === "Supprimer") {
    const user = selectedAdminUser();
    sectionContent = user ? `<div class="admin-form"><div class="admin-form-intro"><span class="admin-form-icon admin-danger-icon">×</span><div><h2>Supprimer un client</h2><p>Cette action supprime définitivement le compte et sa progression enregistrée dans ce navigateur.</p></div></div><label class="form-field"><label for="delete-user-select">UTILISATEUR À SUPPRIMER</label><select id="delete-user-select">${allUsers().map((item) => `<option value="${escapeHtml(item.id)}" ${item.id === user.id ? "selected" : ""} ${userRole(item) === "Admin" ? "disabled" : ""}>${escapeHtml(item.displayName || item.name || item.email)} · ${userRole(item)}${userRole(item) === "Admin" ? " (protégé)" : ""}</option>`).join("")}</select></label><div class="delete-preview"><span class="mini-avatar">${escapeHtml(initials(user.displayName || user.name || user.email))}</span><div><strong>${escapeHtml(user.displayName || user.name || "Unnamed")}</strong><span>${escapeHtml(user.email || "—")} · ${Number(user.score || 0).toLocaleString()} pts</span></div><span class="role-badge ${userRole(user) === "Admin" ? "role-admin" : ""}">${userRole(user)}</span></div><p class="admin-form-message" id="admin-delete-message" role="status"></p><button class="button-primary danger-button" data-admin-delete ${userRole(user) === "Admin" ? "disabled" : ""}>Supprimer définitivement</button></div>` : `<div class="admin-empty-card">Aucun compte client à supprimer.</div>`;
  } else {
    const updates = allUsers().slice().sort((a, b) => new Date(b.updatedAt || b.joinedAt || 0) - new Date(a.updatedAt || a.joinedAt || 0));
    sectionContent = `<div class="update-list">${updates.map((user) => `<article class="update-item"><span class="update-dot"></span><div><strong>${escapeHtml(user.displayName || user.name || "Unnamed")}</strong><span>${escapeHtml(user.email || "—")} · ${userRole(user)}</span></div><time>${escapeHtml(formatDate(user.updatedAt))}</time></article>`).join("") || '<div class="admin-empty-card">Aucune mise à jour à afficher.</div>'}</div>`;
  }
  return `<section class="page-heading admin-page-heading"><div class="eyebrow"><span class="eyebrow-dot"></span> ESPACE ADMINISTRATEUR · PROTOTYPE LOCAL</div><h1>Back Office</h1><p>Gérez les comptes clients de cette démonstration locale.</p></section>
    <div class="admin-prototype-warning"><strong>Prototype uniquement</strong><span>Les rôles et données sont stockés dans votre navigateur. Ce panneau n'est pas un système d'administration sécurisé.</span></div>
    <nav class="admin-tabs" aria-label="Sections du Back Office">${sections.map((section) => `<button class="admin-tab ${adminSection === section ? "active" : ""}" data-admin-section="${section}">${section}</button>`).join("")}</nav>
    <section class="admin-panel"><div class="admin-panel-heading"><div><h2>${adminSection}</h2><p>${adminSection === "Affichage" ? "Liste des comptes enregistrés et de leur progression." : adminSection === "Ajouter" ? "Inscrire un nouveau client." : adminSection === "Modifier" ? "Mettre à jour les informations d'un compte." : adminSection === "Supprimer" ? "Supprimer un compte client après confirmation." : "Historique des dernières mises à jour de profil."}</p></div><span class="admin-panel-count">${allUsers().length} comptes</span></div>${sectionContent}</section>`;
}
async function addAdminClient(formData) {
  if (!hasAdminAccess()) return;
  const message = $("#admin-add-message");
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  if (name.length < 2) { message.textContent = "Le nom doit contenir au moins 2 caractères."; message.className = "admin-form-message error"; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { message.textContent = "Veuillez saisir une adresse e-mail valide."; message.className = "admin-form-message error"; return; }
  if (password.length < 8) { message.textContent = "Le mot de passe doit contenir au moins 8 caractères."; message.className = "admin-form-message error"; return; }
  if (email === DEMO_ADMIN_EMAIL) { message.textContent = "Cette adresse est réservée au compte administrateur."; message.className = "admin-form-message error"; return; }
  if (state.users[email]) { message.textContent = "Un compte utilise déjà cette adresse e-mail."; message.className = "admin-form-message error"; return; }
  try {
    const now = new Date().toISOString();
    const salt = crypto.randomUUID();
    state.users[email] = {
      id: createId(), displayName: name, name, email, role: "client",
      passwordSalt: salt, passwordHash: await hashPassword(password, salt),
      joinedAt: now, updatedAt: now, score: 0, completed: [], streak: 0, lastPlayed: null
    };
    selectedUserId = state.users[email].id;
    saveState();
    renderPage();
    showToast(`Le compte client de ${name} a été créé.`);
  } catch (error) {
    console.error("Mind Challenge could not create the client account.", error);
    if ($("#admin-add-message")) {
      $("#admin-add-message").textContent = error.message || "Impossible de créer le compte dans ce navigateur.";
      $("#admin-add-message").className = "admin-form-message error";
    }
  }
}
function editAdminClient(formData) {
  if (!hasAdminAccess()) return;
  const user = selectedAdminUser();
  const message = $("#admin-edit-message");
  if (!user) { message.textContent = "Sélectionnez un compte à modifier."; message.className = "admin-form-message error"; return; }
  const name = String(formData.get("name") || "").trim();
  const email = user.email === DEMO_ADMIN_EMAIL ? DEMO_ADMIN_EMAIL : String(formData.get("email") || "").trim().toLowerCase();
  if (name.length < 2) { message.textContent = "Le nom doit contenir au moins 2 caractères."; message.className = "admin-form-message error"; return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { message.textContent = "Veuillez saisir une adresse e-mail valide."; message.className = "admin-form-message error"; return; }
  if (email === DEMO_ADMIN_EMAIL && user.email !== DEMO_ADMIN_EMAIL) { message.textContent = "Cette adresse est réservée au compte administrateur."; message.className = "admin-form-message error"; return; }
  if (email !== user.email && state.users[email]) { message.textContent = "Un compte utilise déjà cette adresse e-mail."; message.className = "admin-form-message error"; return; }
  const oldEmail = user.email;
  user.displayName = name;
  user.name = name;
  user.email = email;
  user.updatedAt = new Date().toISOString();
  if (oldEmail !== email) {
    delete state.users[oldEmail];
    state.users[email] = user;
  }
  saveState();
  renderPage();
  showToast(`Le profil de ${name} a été mis à jour.`);
}
async function deleteAdminClient() {
  if (!hasAdminAccess()) return;
  const user = findUserById($("#delete-user-select")?.value || selectedUserId);
  if (!user) { showToast("Sélectionnez un compte client à supprimer."); return; }
  if (user.email === DEMO_ADMIN_EMAIL || userRole(user) === "Admin") {
    showToast("Le compte administrateur actuel ne peut pas être supprimé.");
    return;
  }
  const accepted = await confirmAction("Supprimer ce client ?", `Le compte de ${user.displayName || user.name || user.email}, son score et sa progression seront définitivement supprimés.`, "Supprimer le client");
  if (!accepted) return;
  delete state.users[user.email];
  selectedUserId = "";
  saveState();
  renderPage();
  showToast("Le compte client a été supprimé.");
}
function bindPageActions(root) {
  $$("[data-play]", root).forEach((element) => {
    element.addEventListener("click", () => openPuzzle(Number(element.dataset.play)));
    if (element.getAttribute("role") === "button") element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openPuzzle(Number(element.dataset.play)); }
    });
  });
  $$("[data-go]", root).forEach((element) => element.addEventListener("click", () => setPage(element.dataset.go)));
  $("[data-edit-profile]", root)?.addEventListener("click", openProfileEditor);
  $("[data-sign-out]", root)?.addEventListener("click", signOut);
  $("[data-auth-mode]", root)?.addEventListener("click", () => openAuth("register"));
  $("[data-delete-own-account]", root)?.addEventListener("click", deleteOwnAccount);
  $$("[data-admin-section]", root).forEach((button) => button.addEventListener("click", () => {
    adminSection = button.dataset.adminSection;
    renderPage();
  }));
  $$("[data-admin-select]", root).forEach((row) => {
    const select = () => {
      selectedUserId = row.dataset.adminSelect;
      adminSection = "Modifier";
      renderPage();
    };
    row.addEventListener("click", select);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(); }
    });
  });
  $("#admin-search", root)?.addEventListener("input", (event) => {
    adminSearch = event.target.value;
    renderPage();
    const input = $("#admin-search");
    input.focus();
    input.setSelectionRange(adminSearch.length, adminSearch.length);
  });
  $("#admin-role-filter", root)?.addEventListener("change", (event) => { adminRoleFilter = event.target.value; renderPage(); });
  $("[data-admin-refresh]", root)?.addEventListener("click", () => { renderPage(); showToast("La liste des utilisateurs a été actualisée."); });
  $("#admin-add-form", root)?.addEventListener("submit", (event) => { event.preventDefault(); addAdminClient(new FormData(event.currentTarget)); });
  $("#edit-user-select", root)?.addEventListener("change", (event) => { selectedUserId = event.target.value; renderPage(); });
  $("#admin-edit-form", root)?.addEventListener("submit", (event) => { event.preventDefault(); editAdminClient(new FormData(event.currentTarget)); });
  $("#delete-user-select", root)?.addEventListener("change", (event) => { selectedUserId = event.target.value; renderPage(); });
  $("[data-admin-delete]", root)?.addEventListener("click", deleteAdminClient);
}
function setPage(page) {
  if (page === "admin" && !hasAdminAccess()) { showToast("Connectez-vous avec le compte administrateur de démonstration."); return; }
  activePage = page;
  $("#sidebar").classList.remove("open");
  renderPage();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2600);
}
function confirmAction(title, message, confirmLabel = "Confirm") {
  if (confirmResolver) confirmResolver(false);
  $("#confirm-title").textContent = title;
  $("#confirm-message").textContent = message;
  $("#confirm-accept").textContent = confirmLabel;
  $("#confirm-backdrop").hidden = false;
  document.body.style.overflow = "hidden";
  return new Promise((resolve) => { confirmResolver = resolve; });
}
function closeConfirmation(accepted) {
  if (!confirmResolver) return;
  $("#confirm-backdrop").hidden = true;
  document.body.style.overflow = "";
  const resolve = confirmResolver;
  confirmResolver = null;
  resolve(accepted);
}
function openPuzzle(index) {
  if (!Number.isInteger(index) || !PUZZLES[index]) return;
  if (!isUnlocked(index)) { showToast("Solve the previous challenge to unlock this one."); return; }
  activePuzzleIndex = index; answered = false; hintShown = false; earnedPoints = 0;
  renderPuzzle();
  $("#game-backdrop").hidden = false;
  document.body.style.overflow = "hidden";
  $("[data-answer]")?.focus();
}
function renderPuzzle(result = "") {
  const puzzle = PUZZLES[activePuzzleIndex];
  const allDone = completedSet().size === PUZZLES.length;
  const resultMarkup = result ? `<div class="game-result"><div class="result-orb">${result === "correct" ? "✦" : "↗"}</div><div class="eyebrow" style="justify-content:center;margin-bottom:10px">${result === "correct" ? "A BRIGHT LITTLE WIN" : allDone ? "YOU DID IT" : "EVERY GOOD THINKER TRIES AGAIN"}</div><h2>${result === "correct" ? "Nicely reasoned." : allDone ? "Every puzzle, solved." : "Not quite — yet."}</h2><p>${result === "correct" ? `You got it. ${activePuzzleIndex < PUZZLES.length - 1 && !completedSet().has(activePuzzleIndex + 1) ? "A new challenge is waiting when you're ready." : "That's one more little win for your mind."}` : allDone ? "You've made your way through every challenge. What a lovely achievement." : "The best answers usually start with a second look. You can try this one again."}</p>${result === "correct" ? `<div class="result-points">+${earnedPoints} <span style="font-size:11px;color:var(--muted);font-weight:400">points</span></div>` : ""}<div class="result-actions">${result === "incorrect" && !allDone ? `<button class="button-secondary" data-retry>Try again</button>` : ""}<button class="button-primary" data-finish>${allDone ? "Lovely work" : result === "correct" && activePuzzleIndex < PUZZLES.length - 1 && isUnlocked(activePuzzleIndex + 1) ? "Next challenge →" : "Back to my space"}</button></div></div>` : "";
  const puzzleMarkup = `<div class="game-modal-head"><span class="game-modal-eyebrow">A MOMENT FOR YOUR MIND</span><button class="modal-close" data-close-game aria-label="Close puzzle">×</button></div>
    <div class="game-progress-meta"><span>CHALLENGE ${String(activePuzzleIndex + 1).padStart(2, "0")} OF ${String(PUZZLES.length).padStart(2, "0")}</span><span>${completedSet().size} solved so far</span></div>
    <div class="game-progress-track"><div class="game-progress-fill" style="width:${(activePuzzleIndex + 1) / PUZZLES.length * 100}%"></div></div>
    <div class="game-category"><span></span>${escapeHtml(puzzle.category)} &nbsp;·&nbsp; ${escapeHtml(puzzle.difficulty)}</div>
    <h2 class="game-title" id="game-title">${escapeHtml(puzzle.title)}</h2><p class="game-prompt">${escapeHtml(puzzle.prompt)}${puzzle.sequence ? `<br><br><strong style="color:#e1d5f7;letter-spacing:1px">${escapeHtml(puzzle.sequence).replace(/\n/g, "<br>")}</strong>` : ""}</p>
    <div class="answer-list">${puzzle.choices.map((choice, index) => `<button class="answer-option" data-answer="${index}" ${answered ? "disabled" : ""}><span class="answer-letter">${String.fromCharCode(65 + index)}</span>${escapeHtml(choice)}</button>`).join("")}</div>
    ${hintShown ? `<div class="hint-text">A little nudge: ${escapeHtml(puzzle.hint)}</div>` : ""}
    <div class="game-feedback ${answered ? (result === "correct" ? "success" : "error") : ""}" aria-live="polite">${answered ? result === "correct" ? "Exactly right. Trust that good instinct." : "Not this time. Take another look at the pattern." : "No timer, no pressure. Just you and a good question."}</div>
    <div class="game-footer"><span class="game-points">A correct answer earns <b>+${puzzle.points} points</b></span><button class="hint-button" data-hint ${hintShown || answered ? "disabled" : ""}>${hintShown ? "Hint revealed" : "Need a little nudge?"}</button></div>`;
  $("#game-modal-content").innerHTML = result ? resultMarkup : puzzleMarkup;
  $("[data-close-game]")?.addEventListener("click", closePuzzle);
  $$("[data-answer]").forEach((button) => button.addEventListener("click", () => chooseAnswer(Number(button.dataset.answer))));
  $("[data-hint]")?.addEventListener("click", () => { hintShown = true; renderPuzzle(); });
  $("[data-retry]")?.addEventListener("click", () => { answered = false; hintShown = false; renderPuzzle(); });
  $("[data-finish]")?.addEventListener("click", () => {
    if (result === "correct" && activePuzzleIndex < PUZZLES.length - 1 && isUnlocked(activePuzzleIndex + 1)) { activePuzzleIndex++; answered = false; hintShown = false; renderPuzzle(); }
    else { closePuzzle(); render(); }
  });
}
function chooseAnswer(choice) {
  if (answered) return;
  answered = true;
  const puzzle = PUZZLES[activePuzzleIndex];
  if (choice === puzzle.answer) {
    const data = player();
    const completed = new Set(data.completed || []);
    if (!completed.has(activePuzzleIndex)) {
      completed.add(activePuzzleIndex);
      data.completed = [...completed].sort((a, b) => a - b);
      data.score = (data.score || 0) + puzzle.points;
      earnedPoints = puzzle.points;
      if (state.currentEmail) data.updatedAt = new Date().toISOString();
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (data.lastPlayed !== today) data.streak = data.lastPlayed === yesterday ? (data.streak || 0) + 1 : 1;
      data.lastPlayed = today;
      saveState();
    }
    renderPuzzle("correct");
  } else {
    $$(".answer-option").forEach((button, index) => {
      if (index === choice) {
        button.disabled = true;
        button.classList.add("wrong-answer");
      }
    });
    const feedback = $(".game-feedback");
    feedback.classList.add("error");
    feedback.textContent = "Not quite. Try a different answer, or take another look at the pattern.";
    answered = false;
  }
}
function closePuzzle() {
  $("#game-backdrop").hidden = true;
  document.body.style.overflow = "";
  render();
}

function openAuth(mode = "login") {
  authMode = mode;
  renderAuth();
  $("#auth-backdrop").hidden = false;
  document.body.style.overflow = "hidden";
}
function renderAuth(message = "") {
  const isRegister = authMode === "register";
  $("#auth-content").innerHTML = `<h2 class="auth-heading" id="auth-title">${isRegister ? "A little space of your own." : "Lovely to see you again."}</h2><p class="auth-subtitle">${isRegister ? "Create an account to keep your profile and puzzle progress together on this device." : "Sign in to pick up where your curiosity left off."}</p>
    <div class="auth-tabs"><button class="auth-tab ${isRegister ? "" : "active"}" data-auth-tab="login">Sign in</button><button class="auth-tab ${isRegister ? "active" : ""}" data-auth-tab="register">Create account</button></div>
    <form id="auth-form" novalidate>${isRegister ? `<div class="form-field"><label for="auth-name">YOUR NAME</label><input id="auth-name" name="name" autocomplete="name" placeholder="How should we call you?" maxlength="32" required /></div>` : ""}
    <div class="form-field"><label for="auth-email">EMAIL ADDRESS</label><input id="auth-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required /></div>
    <div class="form-field"><label for="auth-password">PASSWORD</label><input id="auth-password" name="password" type="password" autocomplete="${isRegister ? "new-password" : "current-password"}" placeholder="${isRegister ? "At least 8 characters" : "Your password"}" minlength="8" required /></div>
    ${isRegister ? `<div class="form-field"><label for="auth-confirm">CONFIRM PASSWORD</label><input id="auth-confirm" name="confirm" type="password" autocomplete="new-password" placeholder="Type it once more" required /></div>` : ""}
    <button class="button-primary auth-submit" type="submit">${isRegister ? "Create my account →" : "Sign in →"}</button><p class="auth-message" role="alert">${escapeHtml(message)}</p></form>
    <p class="auth-note"><b>Prototype only:</b> accounts stay in this browser. Use a made-up password. Demo admin: <b>${DEMO_ADMIN_EMAIL}</b> · password: <b>${DEMO_ADMIN_PASSWORD}</b>. This public demo credential is not secure.</p>`;
  $$("[data-auth-tab]").forEach((button) => button.addEventListener("click", () => { authMode = button.dataset.authTab; renderAuth(); }));
  $("#auth-form").addEventListener("submit", (event) => { event.preventDefault(); submitAuth(new FormData(event.currentTarget)); });
  $("#auth-email")?.focus();
}
async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) throw new Error("Secure password hashing is unavailable in this browser. Please open this project in a modern browser.");
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: encoder.encode(salt), iterations: 120000, hash: "SHA-256" }, keyMaterial, 256);
  return [...new Uint8Array(bits)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
async function submitAuth(formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();
  const message = (text) => { $(".auth-message").textContent = text; };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { message("Please enter a valid email address."); return; }
  if (password.length < 8) { message("Your password needs at least 8 characters."); return; }
  if (authMode === "register") {
    if (name.length < 2) { message("Please enter a name with at least 2 characters."); return; }
    if (password !== formData.get("confirm")) { message("Those passwords don't match yet."); return; }
    if (email === DEMO_ADMIN_EMAIL) { message("This address is reserved for the demo administrator."); return; }
    if (state.users[email]) { message("An account with that email already exists on this device."); return; }
    try {
      const salt = crypto.randomUUID();
      const passwordHash = await hashPassword(password, salt);
      state.users[email] = {
        id: createId(),
        displayName: name,
        email,
        role: "client",
        passwordSalt: salt,
        passwordHash,
        joinedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        score: state.guest.score || 0,
        completed: Array.isArray(state.guest.completed) ? [...state.guest.completed] : [],
        streak: state.guest.streak || 0,
        lastPlayed: state.guest.lastPlayed || null
      };
      state.currentEmail = email;
      saveState();
      closeAuth();
      render();
      showToast(`Welcome to your space, ${name.split(" ")[0]} ✦`);
    } catch (error) {
      console.error("Mind Challenge account creation failed.", error);
      message(error.message || "We couldn't create your account in this browser.");
    }
    return;
  }
  if (email === DEMO_ADMIN_EMAIL) {
    if (password !== DEMO_ADMIN_PASSWORD) { message("The demo administrator credentials don't match."); return; }
    sessionStorage.setItem("mindspace-admin-session-active", "true");
    adminAuthenticated = true;
    state.users[email] ||= { id: "demo-admin-account", displayName: "Demo Administrator", email, role: "admin", joinedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), score: 0, completed: [], streak: 0, lastPlayed: null };
    state.users[email].role = "admin";
    saveState();
    closeAuth();
    showToast("Administrator verified! Opening Admin Dashboard...");
    setTimeout(() => {
      window.location.href = "admin.html";
    }, 450);
    return;
  }
  const account = state.users[email];
  if (!account) { message("We couldn't find an account on this device. Try creating one first."); return; }
  try {
    const attempt = await hashPassword(password, account.passwordSalt);
    if (attempt !== account.passwordHash) { message("That password doesn't match this account."); return; }
    adminAuthenticated = false;
    state.currentEmail = email;
    saveState();
    closeAuth();
    render();
    showToast(`Welcome back, ${(account.displayName || "friend").split(" ")[0]} ✦`);
  } catch (error) {
    console.error("Mind Challenge sign-in failed.", error);
    message(error.message || "We couldn't sign you in in this browser.");
  }
}
function closeAuth() {
  $("#auth-backdrop").hidden = true;
  document.body.style.overflow = "";
}
function openProfileEditor() {
  if (!state.currentEmail) { openAuth("register"); return; }
  const data = player();
  $("#auth-content").innerHTML = `<h2 class="auth-heading" id="auth-title">Make yourself at home.</h2><p class="auth-subtitle">Update the information shown on your profile.</p>
    <form id="profile-form" novalidate><div class="form-field"><label for="profile-name">DISPLAY NAME</label><input id="profile-name" name="name" maxlength="32" value="${escapeHtml(data.displayName || "")}" required /></div>
    <div class="form-field"><label for="profile-email">EMAIL ADDRESS</label><input id="profile-email" name="email" type="email" value="${escapeHtml(data.email)}" ${hasAdminAccess() ? "disabled" : ""} required /></div>
    <button class="button-primary auth-submit" type="submit">Save changes →</button><p class="auth-message" role="alert"></p></form>
    <p class="auth-note">Your updates are saved in this browser.</p>`;
  $("#auth-backdrop").hidden = false;
  document.body.style.overflow = "hidden";
  $("#profile-name").focus();
  $("#profile-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name") || "").trim();
    if (name.length < 2) { $(".auth-message").textContent = "Please enter a name with at least 2 characters."; return; }
    const formData = new FormData(event.currentTarget);
    const email = hasAdminAccess() ? data.email : String(formData.get("email") || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $(".auth-message").textContent = "Please enter a valid email address."; return; }
    if (email === DEMO_ADMIN_EMAIL && !hasAdminAccess()) { $(".auth-message").textContent = "This email address is reserved."; return; }
    if (email !== data.email && state.users[email]) { $(".auth-message").textContent = "An account with that email already exists."; return; }
    const oldEmail = data.email;
    data.displayName = name;
    data.name = name;
    data.email = email;
    data.updatedAt = new Date().toISOString();
    if (email !== oldEmail) {
      delete state.users[oldEmail];
      state.users[email] = data;
      state.currentEmail = email;
    }
    saveState();
    closeAuth();
    render();
    showToast("Your profile looks lovely ✦");
  });
}
async function deleteOwnAccount() {
  if (!state.currentEmail || hasAdminAccess()) {
    showToast("Le compte administrateur de démonstration est protégé.");
    return;
  }
  const email = state.currentEmail;
  const account = state.users[email];
  if (!account) { showToast("Ce compte n'existe plus sur cet appareil."); signOut(); return; }
  const accepted = await confirmAction("Supprimer votre compte ?", "Votre compte, score et progression seront supprimés définitivement de ce navigateur.", "Supprimer mon compte");
  if (!accepted) return;
  delete state.users[email];
  state.currentEmail = null;
  saveState();
  render();
  openAuth("login");
  showToast("Votre compte et vos données locales ont été supprimés.");
}
function signOut() {
  adminAuthenticated = false;
  state.currentEmail = null;
  saveState();
  activePage = "home";
  render();
  showToast("Signed out. Your progress is saved on this device.");
}

$$(".nav-link").forEach((button) => button.addEventListener("click", () => setPage(button.dataset.page)));
$("#auth-trigger").addEventListener("click", () => state.currentEmail ? setPage("profile") : openAuth("register"));
$("#theme-toggle").addEventListener("click", () => { state.theme = state.theme === "light" ? "dark" : "light"; saveState(); renderHeader(); });
$("#mobile-menu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
$$("[data-close-auth]").forEach((button) => button.addEventListener("click", closeAuth));
$("#auth-backdrop").addEventListener("click", (event) => { if (event.target === $("#auth-backdrop")) closeAuth(); });
$("#game-backdrop").addEventListener("click", (event) => { if (event.target === $("#game-backdrop")) closePuzzle(); });
$("#confirm-cancel").addEventListener("click", () => closeConfirmation(false));
$("#confirm-accept").addEventListener("click", () => closeConfirmation(true));
$("#confirm-backdrop").addEventListener("click", (event) => { if (event.target === $("#confirm-backdrop")) closeConfirmation(false); });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!$("#game-backdrop").hidden) closePuzzle();
    if (!$("#auth-backdrop").hidden) closeAuth();
    if (!$("#confirm-backdrop").hidden) closeConfirmation(false);
    $("#sidebar").classList.remove("open");
  }
});
window.addEventListener("storage", (event) => {
  if (event.key !== STORAGE_KEY) return;
  const activeEmail = state.currentEmail;
  const activeUserId = activeEmail ? state.users[activeEmail]?.id : null;
  const keepAdminSession = hasAdminAccess();
  state = loadState();
  if (keepAdminSession && state.users[DEMO_ADMIN_EMAIL]) {
    state.currentEmail = DEMO_ADMIN_EMAIL;
    adminAuthenticated = true;
  } else {
    const activeEntry = Object.entries(state.users).find(([, user]) => user.id === activeUserId);
    state.currentEmail = activeEntry ? activeEntry[0] : null;
    if (!activeEntry) adminAuthenticated = false;
  }
  render();
});
saveState();
render();
