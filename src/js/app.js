/**
 * app.js
 * Application bootstrap and global event wiring.
 */

import "./track-nav.js";
import "./module-nav.js";
import "./lesson-view.js";
import "./excalibur-playground.js";
import { router } from "./router.js";
import { curriculumService } from "./curriculum-service.js";
import { progressService } from "./progress-service.js";

// Bridge: when track-nav fires track:selected, re-broadcast globally
// so module-nav (which may not be in the same DOM subtree) can hear it
document.addEventListener("track:selected", (e) => {
  window.dispatchEvent(
    new CustomEvent("track:selected-global", { detail: e.detail })
  );
});

// Header progress counter
function updateProgressCounter() {
  const all = curriculumService.getAllLessons();
  const done = progressService.getCompletedCount();
  const el = document.getElementById("progress-count");
  if (el) el.textContent = `${done} / ${all.length} lessons`;
}

window.addEventListener("progress:changed", updateProgressCounter);
window.addEventListener("progress:reset", updateProgressCounter);

// Sidebar toggle for mobile
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("sidebar-overlay");

menuToggle?.addEventListener("click", () => {
  sidebar?.classList.toggle("sidebar--open");
  overlay?.classList.toggle("sidebar-overlay--visible");
});

overlay?.addEventListener("click", () => {
  sidebar?.classList.remove("sidebar--open");
  overlay?.classList.remove("sidebar-overlay--visible");
});

// Close sidebar on lesson nav (mobile UX)
window.addEventListener("hashchange", () => {
  sidebar?.classList.remove("sidebar--open");
  overlay?.classList.remove("sidebar-overlay--visible");
});

// Boot
router.init();
updateProgressCounter();
