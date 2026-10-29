/**
 * Mindspace Back Office — Administrator Dashboard (admin.js)
 * Manages registered clients, user data, progress tracking, and access permissions.
 */

const STORAGE_KEY = "mindspace-v1";
const ADMIN_SESSION_KEY = "mindspace-admin-session-active";
const DEMO_ADMIN_EMAIL = "admin@mindchallenge.demo";
const DEMO_ADMIN_PASSWORD = "MindChallengeAdmin2026!";

const PUZZLES = [
  { id: 0, title: "What comes next?", category: "NUMBER PATTERNS", difficulty: "Easy", points: 100 },
  { id: 1, title: "The switched labels", category: "LOGIC", difficulty: "Easy", points: 120 },
  { id: 2, title: "A clever crossing", category: "RIDDLE", difficulty: "Easy", points: 100 },
  { id: 3, title: "The missing square", category: "NUMBER PATTERNS", difficulty: "Medium", points: 150 },
  { id: 4, title: "Who said it?", category: "DEDUCTION", difficulty: "Medium", points: 160 },
  { id: 5, title: "Clockwork", category: "NUMBER PATTERNS", difficulty: "Medium", points: 160 },
  { id: 6, title: "The silent sequence", category: "PATTERN SPOTTING", difficulty: "Hard", points: 200 },
  { id: 7, title: "The last lantern", category: "LOGIC", difficulty: "Hard", points: 250 }
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function createId() {
  return globalThis.crypto?.randomUUID?.() || `client-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function initials(name = "Client") {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase() || "?";
}

function formatDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function formatDateTime(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

/* --------------------------------------------------------------------------
   Password Hashing (Web Crypto API)
   -------------------------------------------------------------------------- */
async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) {
    return `insecure-${password}-${salt}`;
  }
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: encoder.encode(salt), iterations: 120000, hash: "SHA-256" }, keyMaterial, 256);
  return [...new Uint8Array(bits)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

/* --------------------------------------------------------------------------
   Default Seed Clients (Realistic examples of clients who use Mindspace)
   -------------------------------------------------------------------------- */
function seedDefaultClients() {
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

/* --------------------------------------------------------------------------
   State Management & Synchronization
   -------------------------------------------------------------------------- */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    let state = parsed && typeof parsed === "object" ? parsed : { users: {}, currentEmail: null, guest: { score: 0, completed: [], streak: 0, lastPlayed: null, displayName: "Guest player" }, theme: "dark" };

    if (!state.users || typeof state.users !== "object") {
      state.users = {};
    }

    // Ensure demo admin exists
    if (!state.users[DEMO_ADMIN_EMAIL]) {
      state.users[DEMO_ADMIN_EMAIL] = {
        id: "demo-admin-account",
        displayName: "Demo Administrator",
        name: "Demo Administrator",
        email: DEMO_ADMIN_EMAIL,
        role: "admin",
        joinedAt: "2026-09-01T00:00:00.000Z",
        updatedAt: new Date().toISOString(),
        score: 0,
        completed: [],
        streak: 0,
        lastPlayed: null,
        notes: "Primary system administrator account (Protected)."
      };
    } else {
      state.users[DEMO_ADMIN_EMAIL].role = "admin";
    }

    // Seed default example clients if user list has no clients
    const clientCount = Object.values(state.users).filter((u) => u.email !== DEMO_ADMIN_EMAIL).length;
    if (clientCount === 0) {
      const seeds = seedDefaultClients();
      Object.assign(state.users, seeds);
    }

    // Normalize all user objects
    Object.entries(state.users).forEach(([email, user]) => {
      if (!user || typeof user !== "object") {
        delete state.users[email];
        return;
      }
      user.id ||= createId();
      user.email ||= email;
      user.role = email === DEMO_ADMIN_EMAIL ? "admin" : (user.role || "client");
      user.displayName ||= user.name || "Client";
      user.name ||= user.displayName;
      user.score = Number.isFinite(user.score) ? user.score : 0;
      user.streak = Number.isFinite(user.streak) ? user.streak : 0;
      user.completed = Array.isArray(user.completed) ? user.completed : [];
      user.joinedAt ||= new Date().toISOString();
      user.updatedAt ||= user.joinedAt;
      user.notes ||= "";
    });

    return state;
  } catch (err) {
    console.error("Admin Dashboard could not load state:", err);
    return { users: seedDefaultClients(), currentEmail: null, theme: "dark" };
  }
}

let state = loadState();
let activeTab = "directory";
let currentSearch = "";
let currentFilter = "all";
let selectedClientId = "";
let toastTimer = null;
let confirmResolver = null;

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Admin could not save state:", error);
    showToast("Storage quota exceeded or unavailable.", true);
  }
}

/* --------------------------------------------------------------------------
   Authentication & Permissions Guard
   -------------------------------------------------------------------------- */
function isAdminAuthenticated() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function setAdminSession(active) {
  if (active) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
  } else {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

function checkAccessPermissions() {
  const isAuth = isAdminAuthenticated();
  const guard = $("#admin-auth-guard");
  const shell = $("#admin-app-shell");

  if (!isAuth) {
    guard.hidden = false;
    shell.hidden = true;
    document.title = "Mindspace Admin — Sign in required";
    return false;
  }

  guard.hidden = true;
  shell.hidden = false;
  document.title = "Mindspace Back Office — Administrator Dashboard";
  return true;
}

/* --------------------------------------------------------------------------
   Data Helpers
   -------------------------------------------------------------------------- */
function getClients() {
  return Object.values(state.users)
    .filter((user) => user && typeof user === "object" && user.role !== "admin")
    .sort((a, b) => (b.score || 0) - (a.score || 0));
}

function getAllAccounts() {
  return Object.values(state.users).filter((u) => u && typeof u === "object");
}

function findUserById(id) {
  return getAllAccounts().find((u) => u.id === id);
}

function findUserByEmail(email) {
  return state.users[email.toLowerCase().trim()];
}

/* --------------------------------------------------------------------------
   UI Notifications & Confirmation Modals
   -------------------------------------------------------------------------- */
function showToast(message, isError = false) {
  const toast = $("#admin-toast");
  toast.textContent = message;
  toast.style.borderColor = isError ? "rgba(229,135,150,0.4)" : "rgba(167,139,250,0.3)";
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2800);
}

function confirmAdminAction(title, message, confirmText = "Confirm") {
  if (confirmResolver) confirmResolver(false);
  $("#admin-confirm-title").textContent = title;
  $("#admin-confirm-message").textContent = message;
  $("#admin-confirm-accept").textContent = confirmText;
  $("#admin-confirm-backdrop").hidden = false;
  document.body.style.overflow = "hidden";
  return new Promise((resolve) => {
    confirmResolver = resolve;
  });
}

function closeAdminConfirmation(accepted) {
  if (!confirmResolver) return;
  $("#admin-confirm-backdrop").hidden = true;
  document.body.style.overflow = "";
  const resolve = confirmResolver;
  confirmResolver = null;
  resolve(accepted);
}

/* --------------------------------------------------------------------------
   Render Topbar, KPIs & Navigation
   -------------------------------------------------------------------------- */
function renderHeader() {
  document.body.classList.toggle("light-theme", state.theme === "light");
  const clients = getClients();
  $("#client-count-badge").textContent = clients.length;

  const totalPoints = clients.reduce((acc, c) => acc + (c.score || 0), 0);
  const totalSolved = clients.reduce((acc, c) => acc + (c.completed?.length || 0), 0);
  const topPerformer = clients[0] || null;

  $("#kpi-total-clients").textContent = clients.length;
  $("#kpi-total-points").textContent = totalPoints.toLocaleString();
  $("#kpi-total-solved").textContent = totalSolved;

  if (topPerformer) {
    $("#kpi-top-client").textContent = topPerformer.displayName || topPerformer.name;
    $("#kpi-top-stats").textContent = `${(topPerformer.score || 0).toLocaleString()} pts · ${topPerformer.completed?.length || 0}/8 solved`;
  } else {
    $("#kpi-top-client").textContent = "—";
    $("#kpi-top-stats").textContent = "No clients yet";
  }
}

function switchTab(tabId) {
  activeTab = tabId;
  const labels = {
    directory: "Clients Directory (Affichage)",
    add: "Add Client (Ajouter)",
    edit: "Edit Client (Modifier)",
    update: "Update Data & Progress (Mise à jour)",
    delete: "Delete Client (Supprimer)",
    casestudy: "Client Usage Story (Example)"
  };
  $("#admin-breadcrumb-section").textContent = labels[tabId] || "Back Office";

  $$(".admin-nav-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });

  $$(".admin-tab-pane").forEach((pane) => {
    pane.classList.toggle("active", pane.id === `tab-${tabId}`);
  });

  if (tabId === "directory") renderDirectory();
  if (tabId === "add") renderAddPuzzles();
  if (tabId === "edit") populateEditForm();
  if (tabId === "update") populateUpdateForm();
  if (tabId === "delete") populateDeleteForm();
}

/* --------------------------------------------------------------------------
   1. Tab: Directory (Affichage)
   -------------------------------------------------------------------------- */
function renderDirectory() {
  const tbody = $("#directory-table-body");
  const clients = getClients();
  const query = currentSearch.trim().toLowerCase();

  const filtered = clients.filter((c) => {
    const matchesSearch = !query || [c.displayName, c.name, c.email, c.id].some((v) => String(v || "").toLowerCase().includes(query));
    if (!matchesSearch) return false;
    if (currentFilter === "active") return (c.score || 0) > 0;
    if (currentFilter === "masters") return (c.completed?.length || 0) >= 6;
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px; color: var(--muted)">
          No client accounts found matching the current search or filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map((client) => {
    const solvedCount = client.completed?.length || 0;
    return `
      <tr data-client-id="${escapeHtml(client.id)}">
        <td>
          <div class="client-name-cell">
            <span class="client-avatar">${escapeHtml(initials(client.displayName || client.name))}</span>
            <div class="client-name-text">
              <strong>${escapeHtml(client.displayName || client.name)}</strong>
              <small>ID: ${escapeHtml(client.id)}</small>
            </div>
          </div>
        </td>
        <td><code>${escapeHtml(client.email)}</code></td>
        <td>
          <span class="role-badge ${solvedCount >= 6 ? "role-admin" : ""}">
            ${solvedCount} / ${PUZZLES.length} solved
          </span>
        </td>
        <td><strong class="score-badge">${(client.score || 0).toLocaleString()} pts</strong></td>
        <td>
          <span class="streak-pill-mini">✦ ${client.streak || 0}d</span>
        </td>
        <td>${escapeHtml(formatDate(client.joinedAt))}</td>
        <td>${escapeHtml(formatDateTime(client.updatedAt))}</td>
        <td>
          <div class="actions-cell">
            <button class="btn-action" data-action="view" data-id="${escapeHtml(client.id)}" title="View complete client profile">
              View
            </button>
            <button class="btn-action btn-action-primary" data-action="edit" data-id="${escapeHtml(client.id)}" title="Edit user info">
              Edit
            </button>
            <button class="btn-action" data-action="update" data-id="${escapeHtml(client.id)}" title="Update score & puzzles">
              Progress
            </button>
            <button class="btn-action btn-action-danger" data-action="delete" data-id="${escapeHtml(client.id)}" title="Delete user">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  // Attach action listeners
  $$("[data-action]", tbody).forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const action = button.dataset.action;
      const id = button.dataset.id;
      handleClientAction(action, id);
    });
  });
}

function handleClientAction(action, clientId) {
  selectedClientId = clientId;
  if (action === "view") {
    openClientDetail(clientId);
  } else if (action === "edit") {
    switchTab("edit");
  } else if (action === "update") {
    switchTab("update");
  } else if (action === "delete") {
    switchTab("delete");
  }
}

/* --------------------------------------------------------------------------
   2. Tab: Add Client (Ajouter)
   -------------------------------------------------------------------------- */
function renderAddPuzzles() {
  const container = $("#new-client-puzzles");
  container.innerHTML = PUZZLES.map((puzzle) => `
    <label class="puzzle-checkbox-label">
      <input type="checkbox" name="puzzle-${puzzle.id}" value="${puzzle.id}" />
      <span class="puzzle-label-text">
        <strong>${escapeHtml(puzzle.title)}</strong>
        <span>${escapeHtml(puzzle.category)} · ${escapeHtml(puzzle.difficulty)}</span>
      </span>
      <span class="puzzle-label-points">+${puzzle.points} pts</span>
    </label>
  `).join("");
}

async function handleAddClient(formData) {
  const feedback = $("#add-client-feedback");
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const scoreInput = parseInt(formData.get("score") || "0", 10);
  const notes = String(formData.get("notes") || "").trim();

  // Selected puzzles
  const completed = [];
  PUZZLES.forEach((puzzle) => {
    if (formData.get(`puzzle-${puzzle.id}`)) {
      completed.push(puzzle.id);
    }
  });

  if (name.length < 2) {
    feedback.textContent = "Please provide a valid client name (at least 2 characters).";
    feedback.className = "admin-form-message error";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    feedback.textContent = "Please provide a valid email address.";
    feedback.className = "admin-form-message error";
    return;
  }
  if (password.length < 8) {
    feedback.textContent = "Password must be at least 8 characters long.";
    feedback.className = "admin-form-message error";
    return;
  }
  if (email === DEMO_ADMIN_EMAIL) {
    feedback.textContent = "This email address is reserved for the demo administrator.";
    feedback.className = "admin-form-message error";
    return;
  }
  if (state.users[email]) {
    feedback.textContent = "A user account with this email address already exists.";
    feedback.className = "admin-form-message error";
    return;
  }

  feedback.textContent = "Creating account and generating credentials...";
  feedback.className = "admin-form-message";

  try {
    const salt = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
    const passwordHash = await hashPassword(password, salt);
    const now = new Date().toISOString();

    // Auto-calculate score from completed puzzles if score was 0
    let finalScore = scoreInput;
    if (finalScore === 0 && completed.length > 0) {
      finalScore = completed.reduce((acc, pId) => acc + (PUZZLES[pId]?.points || 0), 0);
    }

    const newClient = {
      id: createId(),
      displayName: name,
      name,
      email,
      role: "client",
      passwordSalt: salt,
      passwordHash,
      joinedAt: now,
      updatedAt: now,
      score: finalScore,
      completed,
      streak: completed.length > 0 ? 1 : 0,
      lastPlayed: completed.length > 0 ? now.slice(0, 10) : null,
      notes
    };

    state.users[email] = newClient;
    saveState();

    feedback.textContent = `Client account for ${name} successfully created!`;
    feedback.className = "admin-form-message";
    showToast(`Client ${name} has been added to Mindspace ✦`);

    $("#add-client-form").reset();
    renderHeader();
    setTimeout(() => {
      switchTab("directory");
    }, 900);
  } catch (err) {
    console.error("Add client error:", err);
    feedback.textContent = "Failed to create client account. Please try again.";
    feedback.className = "admin-form-message error";
  }
}

/* --------------------------------------------------------------------------
   3. Tab: Edit Client Info (Modifier)
   -------------------------------------------------------------------------- */
function populateEditForm() {
  const select = $("#edit-client-select");
  const clients = getClients();

  if (clients.length === 0) {
    select.innerHTML = '<option value="">No clients available</option>';
    $("#edit-client-preview").innerHTML = '<div style="color:var(--muted)">No registered client accounts.</div>';
    $("#edit-client-form").hidden = true;
    return;
  }

  $("#edit-client-form").hidden = false;
  select.innerHTML = clients.map((c) => `
    <option value="${escapeHtml(c.id)}" ${c.id === selectedClientId ? "selected" : ""}>
      ${escapeHtml(c.displayName || c.name)} (${escapeHtml(c.email)}) — ${(c.score || 0).toLocaleString()} pts
    </option>
  `).join("");

  const targetId = select.value || clients[0].id;
  selectedClientId = targetId;
  const client = findUserById(targetId);

  if (client) {
    $("#edit-client-preview").innerHTML = `
      <span class="client-avatar" style="width:40px;height:40px;font-size:14px">${escapeHtml(initials(client.displayName || client.name))}</span>
      <div style="flex:1">
        <strong>${escapeHtml(client.displayName || client.name)}</strong>
        <span style="display:block;color:var(--muted);font-size:10px">${escapeHtml(client.email)} · Member since ${escapeHtml(formatDate(client.joinedAt))}</span>
      </div>
      <span class="role-badge">${client.completed?.length || 0} solved · ${(client.score || 0).toLocaleString()} pts</span>
    `;

    $("#edit-client-name").value = client.displayName || client.name || "";
    $("#edit-client-email").value = client.email || "";
    $("#edit-client-notes").value = client.notes || "";
    $("#edit-client-feedback").textContent = "";
  }
}

function handleEditClient(formData) {
  const feedback = $("#edit-client-feedback");
  const client = findUserById(selectedClientId);

  if (!client) {
    feedback.textContent = "Please select a client to edit.";
    feedback.className = "admin-form-message error";
    return;
  }

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const notes = String(formData.get("notes") || "").trim();

  if (name.length < 2) {
    feedback.textContent = "Name must contain at least 2 characters.";
    feedback.className = "admin-form-message error";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    feedback.textContent = "Please enter a valid email address.";
    feedback.className = "admin-form-message error";
    return;
  }
  if (email === DEMO_ADMIN_EMAIL && client.email !== DEMO_ADMIN_EMAIL) {
    feedback.textContent = "This email is reserved for the demo administrator.";
    feedback.className = "admin-form-message error";
    return;
  }
  if (email !== client.email && state.users[email]) {
    feedback.textContent = "Another account already uses this email address.";
    feedback.className = "admin-form-message error";
    return;
  }

  const oldEmail = client.email;
  client.displayName = name;
  client.name = name;
  client.email = email;
  client.notes = notes;
  client.updatedAt = new Date().toISOString();

  if (oldEmail !== email) {
    delete state.users[oldEmail];
    state.users[email] = client;
  }

  saveState();
  renderHeader();
  populateEditForm();

  feedback.textContent = `Client information for ${name} updated successfully!`;
  feedback.className = "admin-form-message";
  showToast(`Profile of ${name} updated.`);
}

/* --------------------------------------------------------------------------
   4. Tab: Update User Data & Progress (Mise à jour)
   -------------------------------------------------------------------------- */
function populateUpdateForm() {
  const select = $("#update-client-select");
  const clients = getClients();

  if (clients.length === 0) {
    select.innerHTML = '<option value="">No clients available</option>';
    $("#update-data-form").hidden = true;
    return;
  }

  $("#update-data-form").hidden = false;
  select.innerHTML = clients.map((c) => `
    <option value="${escapeHtml(c.id)}" ${c.id === selectedClientId ? "selected" : ""}>
      ${escapeHtml(c.displayName || c.name)} — ${(c.score || 0).toLocaleString()} pts · ${c.completed?.length || 0}/8 solved
    </option>
  `).join("");

  const targetId = select.value || clients[0].id;
  selectedClientId = targetId;
  const client = findUserById(targetId);

  if (client) {
    $("#update-score").value = client.score || 0;
    $("#update-streak").value = client.streak || 0;
    $("#update-new-password").value = "";
    $("#update-data-feedback").textContent = "";

    const completedSet = new Set(client.completed || []);
    const grid = $("#update-puzzles-grid");
    grid.innerHTML = PUZZLES.map((puzzle) => {
      const isDone = completedSet.has(puzzle.id);
      return `
        <label class="puzzle-checkbox-label">
          <input type="checkbox" name="update-puzzle" value="${puzzle.id}" ${isDone ? "checked" : ""} />
          <span class="puzzle-label-text">
            <strong>${escapeHtml(puzzle.title)}</strong>
            <span>${escapeHtml(puzzle.category)} · ${escapeHtml(puzzle.difficulty)}</span>
          </span>
          <span class="puzzle-label-points">+${puzzle.points} pts</span>
        </label>
      `;
    }).join("");
  }
}

async function handleUpdateData() {
  const feedback = $("#update-data-feedback");
  const client = findUserById(selectedClientId);

  if (!client) {
    feedback.textContent = "Please select a client to update.";
    feedback.className = "admin-form-message error";
    return;
  }

  const newScore = parseInt($("#update-score").value, 10);
  const newStreak = parseInt($("#update-streak").value, 10);
  const newPassword = $("#update-new-password").value.trim();

  // Completed puzzles checkboxes
  const checkboxes = $$('input[name="update-puzzle"]', $("#update-puzzles-grid"));
  const newCompleted = checkboxes.filter((cb) => cb.checked).map((cb) => parseInt(cb.value, 10));

  client.score = Number.isFinite(newScore) ? Math.max(0, newScore) : client.score;
  client.streak = Number.isFinite(newStreak) ? Math.max(0, newStreak) : client.streak;
  client.completed = newCompleted.sort((a, b) => a - b);
  client.updatedAt = new Date().toISOString();

  if (newPassword.length > 0) {
    if (newPassword.length < 8) {
      feedback.textContent = "New password must be at least 8 characters.";
      feedback.className = "admin-form-message error";
      return;
    }
    const salt = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
    client.passwordSalt = salt;
    client.passwordHash = await hashPassword(newPassword, salt);
  }

  saveState();
  renderHeader();
  populateUpdateForm();

  feedback.textContent = `Progress and game data for ${client.displayName || client.name} successfully updated!`;
  feedback.className = "admin-form-message";
  showToast(`Data updated for ${client.displayName || client.name} ✦`);
}

/* --------------------------------------------------------------------------
   5. Tab: Delete Client (Supprimer)
   -------------------------------------------------------------------------- */
function populateDeleteForm() {
  const select = $("#delete-client-select");
  const clients = getClients();

  if (clients.length === 0) {
    select.innerHTML = '<option value="">No clients available to delete</option>';
    $("#delete-preview-card").innerHTML = '<div style="color:var(--muted)">No registered client accounts.</div>';
    $("#btn-trigger-delete").disabled = true;
    return;
  }

  $("#btn-trigger-delete").disabled = false;
  select.innerHTML = clients.map((c) => `
    <option value="${escapeHtml(c.id)}" ${c.id === selectedClientId ? "selected" : ""}>
      ${escapeHtml(c.displayName || c.name)} (${escapeHtml(c.email)}) — ${(c.score || 0).toLocaleString()} pts
    </option>
  `).join("");

  const targetId = select.value || clients[0].id;
  selectedClientId = targetId;
  const client = findUserById(targetId);

  if (client) {
    $("#delete-preview-card").innerHTML = `
      <div style="display:flex;align-items:center;gap:14px">
        <span class="client-avatar" style="width:44px;height:44px;font-size:16px">${escapeHtml(initials(client.displayName || client.name))}</span>
        <div style="flex:1">
          <strong style="font-size:13px">${escapeHtml(client.displayName || client.name)}</strong>
          <span style="display:block;color:var(--muted);font-size:10px">${escapeHtml(client.email)}</span>
          <span style="display:block;color:var(--faint);font-size:9px">ID: ${escapeHtml(client.id)}</span>
        </div>
        <div style="text-align:right">
          <strong class="score-badge" style="font-size:14px">${(client.score || 0).toLocaleString()} pts</strong>
          <span style="display:block;color:var(--green);font-size:10px">${client.completed?.length || 0} solved challenges</span>
        </div>
      </div>
    `;
    $("#delete-feedback").textContent = "";
  }
}

async function handleDeleteClient() {
  const client = findUserById($("#delete-client-select").value);
  if (!client) {
    showToast("Please select a valid client to delete.", true);
    return;
  }

  if (client.email === DEMO_ADMIN_EMAIL || client.role === "admin") {
    showToast("The administrator account is protected and cannot be deleted.", true);
    return;
  }

  const name = client.displayName || client.name || client.email;
  const confirmed = await confirmAdminAction(
    `Delete ${name}?`,
    `Are you sure you want to delete the account for ${name}? Their ${client.score || 0} points, solved puzzles history, and daily streak will be permanently removed.`,
    "Permanently Delete Client"
  );

  if (!confirmed) return;

  delete state.users[client.email];
  selectedClientId = "";
  saveState();
  renderHeader();
  populateDeleteForm();

  showToast(`Account for ${name} has been deleted.`);
  $("#delete-feedback").textContent = `The account for ${name} was deleted.`;
  $("#delete-feedback").className = "admin-form-message";
}

/* --------------------------------------------------------------------------
   6. Client Detail Modal
   -------------------------------------------------------------------------- */
function openClientDetail(clientId) {
  const client = findUserById(clientId);
  if (!client) return;

  const content = $("#client-detail-content");
  const completedSet = new Set(client.completed || []);

  content.innerHTML = `
    <div class="admin-modal-head">
      <span class="admin-modal-avatar">${escapeHtml(initials(client.displayName || client.name))}</span>
      <div>
        <h2 id="client-detail-name" style="margin:0 0 4px;font:600 18px 'Outfit',sans-serif">${escapeHtml(client.displayName || client.name)}</h2>
        <span style="color:var(--muted);font-size:11px">${escapeHtml(client.email)} · Role: <b style="color:var(--purple)">${escapeHtml(client.role)}</b></span>
      </div>
    </div>

    <div class="modal-detail-grid">
      <div class="modal-detail-item">
        <span>ACCOUNT ID</span>
        <code style="font-size:10px;color:#cfc8dc">${escapeHtml(client.id)}</code>
      </div>
      <div class="modal-detail-item">
        <span>CURRENT SCORE</span>
        <strong>${(client.score || 0).toLocaleString()} points</strong>
      </div>
      <div class="modal-detail-item">
        <span>CURRENT STREAK</span>
        <strong>✦ ${client.streak || 0} consecutive days</strong>
      </div>
      <div class="modal-detail-item">
        <span>CHALLENGES SOLVED</span>
        <strong>${completedSet.size} of ${PUZZLES.length} puzzles</strong>
      </div>
      <div class="modal-detail-item">
        <span>REGISTRATION DATE</span>
        <strong>${escapeHtml(formatDate(client.joinedAt))}</strong>
      </div>
      <div class="modal-detail-item">
        <span>LAST ACTIVITY</span>
        <strong>${escapeHtml(formatDateTime(client.updatedAt))}</strong>
      </div>
    </div>

    ${client.notes ? `
      <div style="margin-bottom:20px;padding:12px 14px;border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,0.015)">
        <span style="display:block;font-size:8.5px;font-weight:700;letter-spacing:1px;color:#8f889d;margin-bottom:4px">CLIENT USAGE NOTES</span>
        <p style="margin:0;font-size:11px;color:#d5d0e3;line-height:1.5">${escapeHtml(client.notes)}</p>
      </div>
    ` : ""}

    <h3 style="font:600 13px 'Outfit',sans-serif;margin:0 0 8px;color:var(--text)">Puzzle Catalog & Mastery Status</h3>
    <div class="modal-puzzle-list">
      ${PUZZLES.map((puzzle) => {
        const isDone = completedSet.has(puzzle.id);
        return `
          <div class="modal-puzzle-row ${isDone ? "is-done" : ""}">
            <span>${isDone ? "✓" : "◇"} &nbsp;<strong>${escapeHtml(puzzle.title)}</strong> (${escapeHtml(puzzle.category)})</span>
            <span>${isDone ? `<b style="color:var(--green)">+${puzzle.points} pts</b>` : `<span style="color:var(--muted)">Locked / Unsolved</span>`}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;

  $("#client-detail-backdrop").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeClientDetail() {
  $("#client-detail-backdrop").hidden = true;
  document.body.style.overflow = "";
}

/* --------------------------------------------------------------------------
   Initialization & Event Listeners
   -------------------------------------------------------------------------- */
function init() {
  // Check auth first
  if (!checkAccessPermissions()) {
    initAuthGuardEvents();
    return;
  }

  renderHeader();
  switchTab("directory");

  // Nav tabs
  $$(".admin-nav-tab").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  // Directory search & filter
  $("#directory-search")?.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderDirectory();
  });

  $("#filter-status")?.addEventListener("change", (e) => {
    currentFilter = e.target.value;
    renderDirectory();
  });

  $("#btn-directory-refresh")?.addEventListener("click", () => {
    state = loadState();
    renderHeader();
    renderDirectory();
    showToast("Client list refreshed.");
  });

  $("#btn-quick-add-client")?.addEventListener("click", () => switchTab("add"));

  // Add client form
  $("#add-client-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    handleAddClient(new FormData(e.currentTarget));
  });

  // Edit client events
  $("#edit-client-select")?.addEventListener("change", (e) => {
    selectedClientId = e.target.value;
    populateEditForm();
  });

  $("#edit-client-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    handleEditClient(new FormData(e.currentTarget));
  });

  // Update client data events
  $("#update-client-select")?.addEventListener("change", (e) => {
    selectedClientId = e.target.value;
    populateUpdateForm();
  });

  $$(".btn-step").forEach((button) => {
    button.addEventListener("click", () => {
      const step = parseInt(button.dataset.step, 10);
      const input = $("#update-score");
      input.value = Math.max(0, (parseInt(input.value || "0", 10) + step));
    });
  });

  $$(".btn-step-streak").forEach((button) => {
    button.addEventListener("click", () => {
      const step = parseInt(button.dataset.step, 10);
      const input = $("#update-streak");
      input.value = Math.max(0, (parseInt(input.value || "0", 10) + step));
    });
  });

  $("#update-data-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    handleUpdateData();
  });

  // Delete client events
  $("#delete-client-select")?.addEventListener("change", (e) => {
    selectedClientId = e.target.value;
    populateDeleteForm();
  });

  $("#btn-trigger-delete")?.addEventListener("click", handleDeleteClient);

  // Case study button
  $("#btn-inspect-sarah")?.addEventListener("click", () => {
    const sarah = findUserByEmail("sarah.j@example.com");
    if (sarah) {
      openClientDetail(sarah.id);
    } else {
      showToast("Sarah Jenkins record not found.", true);
    }
  });

  // Modals & Confirmation
  $("#btn-close-detail")?.addEventListener("click", closeClientDetail);
  $("#client-detail-backdrop")?.addEventListener("click", (e) => {
    if (e.target === $("#client-detail-backdrop")) closeClientDetail();
  });

  $("#admin-confirm-cancel")?.addEventListener("click", () => closeAdminConfirmation(false));
  $("#admin-confirm-accept")?.addEventListener("click", () => closeAdminConfirmation(true));
  $("#admin-confirm-backdrop")?.addEventListener("click", (e) => {
    if (e.target === $("#admin-confirm-backdrop")) closeAdminConfirmation(false);
  });

  // Sign out
  $("#admin-logout-btn")?.addEventListener("click", () => {
    setAdminSession(false);
    showToast("Administrator signed out.");
    checkAccessPermissions();
    initAuthGuardEvents();
  });

  // Theme Toggle
  $("#admin-theme-toggle")?.addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    saveState();
    renderHeader();
  });

  // Keyboard escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!$("#client-detail-backdrop").hidden) closeClientDetail();
      if (!$("#admin-confirm-backdrop").hidden) closeAdminConfirmation(false);
    }
  });
}

function initAuthGuardEvents() {
  const form = $("#guard-login-form");
  const autofill = $("#guard-autofill");
  const emailInput = $("#guard-email");
  const passInput = $("#guard-password");
  const errorMsg = $("#guard-error");

  autofill?.addEventListener("click", () => {
    emailInput.value = DEMO_ADMIN_EMAIL;
    passInput.value = DEMO_ADMIN_PASSWORD;
    errorMsg.textContent = "";
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const password = passInput.value;

    if (email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
      setAdminSession(true);
      errorMsg.textContent = "";
      showToast("Administrator credentials verified. Welcome!");
      init();
    } else {
      errorMsg.textContent = "Invalid administrator credentials. Please check your email or password.";
    }
  });
}

// Multi-tab storage sync
window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY) {
    state = loadState();
    if (isAdminAuthenticated()) {
      renderHeader();
      if (activeTab === "directory") renderDirectory();
      if (activeTab === "edit") populateEditForm();
      if (activeTab === "update") populateUpdateForm();
      if (activeTab === "delete") populateDeleteForm();
    }
  }
});

// Run on load
document.addEventListener("DOMContentLoaded", init);
