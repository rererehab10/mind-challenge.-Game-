# Mindspace (Mind Challenge)

Mindspace is a responsive, browser-based cognitive logic puzzle platform built with vanilla HTML, modern CSS, and JavaScript. The application features **two distinct, separated spaces** with independent permissions:

1. **User Interface (`index.html`):** The client space where regular players solve bite-sized logic puzzles, track streaks, unlock levels, view their leaderboard rank, and manage their profiles. Regular users never see or access the Admin Dashboard.
2. **Admin Dashboard (`admin.html`):** A private administrator Back Office protected by an Access Guard. Here, an administrator can manage client accounts (display, add, edit, update progress/scores, and delete accounts) and review client usage case studies.

---

## 🚀 How to Run the Application

There are no dependencies, packages, or build steps required. Simply open the files in any modern web browser:

- **Client Game Space:** Open `index.html`
- **Admin Dashboard (Back Office):** Open `admin.html`

Both spaces share and synchronize state in the browser's `localStorage` (`mindspace-v1`), so changes made in the Admin Back Office immediately reflect in the client interface in real time.

---

## 🛡️ The Two Distinct Spaces

### 1. User Interface (`index.html`)
The main client-facing portal, preserved with its dark cosmic violet design and light mode option:
- **Challenge Paths:** 8 progressively unlocked puzzles spanning number patterns, deduction, logic, and riddles.
- **Scoring & Streaks:** Earn points once per solved challenge, build daily streaks, and view dynamic completion stats.
- **Leaderboard:** Ranks active client accounts based on puzzle mastery and earned points.
- **Player Profile:** Customize display name, track badges ("First Spark", "Mind in Motion", "Full Circle"), or sign out.
- **Strict Client Separation:** The Admin Back Office is completely hidden from regular users, keeping their experience clean and focused.

### 2. Admin Dashboard (`admin.html`)
The executive management space with restricted access:
- **Access Guard (Auth Gate):** Unauthenticated users must provide administrator credentials. Features one-click demo credentials autofill.
- **KPI Metrics Bar:** Real-time summary of Total Clients, Total Puzzles Solved, Aggregate Logic Points, and Top Performer.
- **Clients Directory (Affichage):** Interactive data table with live search by name, email, or ID, status filtering (Active, Master Solvers), and quick actions.
- **Add Client (Ajouter):** Register new client accounts with custom initial puzzle completion and score allocations.
- **Edit Info (Modifier):** Update client display names, email addresses, and internal administrator notes.
- **Update Data & Progress (Mise à jour):** Fine-tune client scores (+/- step controls), modify streaks, toggle completed status for any of the 8 individual puzzles, or reset client passwords.
- **Delete Account (Supprimer):** Remove accounts with safe confirmation modals. The Demo Administrator account is protected from deletion.
- **Client Portal Quick-Link:** Fast header button to switch over to `index.html` in a new tab.

---

## 🌟 Real-World Client Usage Example

To demonstrate how clients actually interact with Mindspace, the Admin Dashboard includes a dedicated **Client Usage Story** spotlighting **Sarah Jenkins**:

- **Client Profile:** Sarah Jenkins (`sarah.j@example.com`), UX Designer & Researcher.
- **Usage Routine:** Morning mental warm-up. Sarah spends 3–5 minutes on Mindspace each weekday before starting work, tackling one puzzle per day to stimulate deduction and focus.
- **Current Performance:**
  - 6 of 8 challenges solved (75% completion rate).
  - 1,180 points earned with an ongoing 5-day streak.
  - High accuracy in logic and riddles (used only 1 hint on "Clockwork").
- **Activity Log & Feedback:** Detailed timeline documenting when each challenge was cracked, time taken, and client feedback (*"Solving one bite-sized riddle gives my mind clarity without the stress of typical phone games."*).
- **Other Pre-Seeded Clients:**
  - **Lucas Moreau** (`lucas.m@studio-logic.com`): Master solver who completed all 8 challenges (1,430 pts, 12-day streak).
  - **Camille Martin** (`camille.m@mindspace.demo`): Consistent student client focusing on number patterns (880 pts, 4 completed).
  - **Elena Rostova** (`elena.r@academ.org`): New logic learner with 3 solved challenges (520 pts, 2-day streak).

---

## 🔑 Demonstration Credentials

### Administrator Account (Admin Back Office):
- **Email:** `admin@mindchallenge.demo`
- **Password:** `MindChallengeAdmin2026!`
- *Tip:* On `admin.html`, click **"Autofill credentials"** on the guard screen to test instantly.

### Client Account (User Interface):
- Anyone can play as a **Guest player** immediately, or register a new account on `index.html`.
- You can also sign in as any registered client (e.g., Sarah Jenkins or newly added clients) or create one via the Back Office.

---

## 🔒 Prototype Security Note
This project runs entirely on the front-end using Web Crypto PBKDF2 password hashing and `localStorage`. In a production environment, authorization checks and database management should be enforced on a secure backend server with session cookies or JWTs.
