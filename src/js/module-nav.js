/**
 * module-nav.js
 * Renders the module/lesson tree in the sidebar.
 * Listens for track selection and route change events.
 */

import { curriculumService } from "./curriculum-service.js";
import { progressService } from "./progress-service.js";
import { router } from "./router.js";

export class ModuleNav extends HTMLElement {
  connectedCallback() {
    this._currentTrackId = null;
    this._render(null);

    // Listen for track selection from track-nav
    window.addEventListener("track:selected-global", e => {
      if (e.detail.trackId !== this._currentTrackId) {
        this._currentTrackId = e.detail.trackId;
        this._render(e.detail.trackId);
      }
    });

    // Re-render on progress change to refresh ✓/○ indicators
    window.addEventListener("progress:changed", () => {
      this._render(this._currentTrackId);
    });

    // On every route change: if the track changed, full re-render.
    // If only module/lesson changed (same track), do a lightweight DOM
    // update — highlight the new lesson AND ensure its module is open.
    router.onChange(route => {
      if (route?.trackId !== this._currentTrackId) {
        this._currentTrackId = route?.trackId;
        this._render(route?.trackId);
      } else {
        this._syncActiveLesson(route);
      }
    });

    const route = router.parse();
    if (route?.trackId) {
      this._currentTrackId = route.trackId;
      this._render(route.trackId);
    }
  }

  _render(trackId) {
    if (!trackId) {
      this.innerHTML = `<div class="module-nav__empty">Select a track to begin</div>`;
      return;
    }

    const track = curriculumService.getTrack(trackId);
    if (!track) {
      this.innerHTML = `<div class="module-nav__empty">Track not found</div>`;
      return;
    }

    const route = router.parse();

    this.innerHTML = `
      <nav class="module-nav" role="navigation" aria-label="Module navigation">
        ${track.modules
          .map(mod => {
            const isOpen = route ? mod.id === route.moduleId : false;
            return `
            <div class="module-nav__module ${isOpen ? "module-nav__module--open" : ""}">
              <button class="module-nav__module-header" data-module="${mod.id}" aria-expanded="${isOpen}">
                <span class="module-nav__module-title">${mod.title}</span>
                <span class="module-nav__chevron">›</span>
              </button>
              <ul class="module-nav__lessons" role="list">
                ${mod.lessons
                  .map(lesson => {
                    const complete = progressService.isComplete(trackId, mod.id, lesson.id);
                    const active = route?.lessonId === lesson.id && route?.moduleId === mod.id;
                    return `
                    <li class="module-nav__lesson ${active ? "module-nav__lesson--active" : ""}" role="listitem">
                      <a
                        href="#${trackId}/${mod.id}/${lesson.id}"
                        class="module-nav__lesson-link"
                        data-track="${trackId}"
                        data-module="${mod.id}"
                        data-lesson="${lesson.id}"
                      >
                        <span class="module-nav__check" aria-label="${complete ? "Completed" : "Not completed"}">
                          ${complete ? "✓" : "○"}
                        </span>
                        <span class="module-nav__lesson-title">${lesson.title}</span>
                        <span class="module-nav__duration">${lesson.duration}</span>
                      </a>
                    </li>
                  `;
                  })
                  .join("")}
              </ul>
            </div>
          `;
          })
          .join("")}
      </nav>
    `;

    // Wire expand/collapse clicks
    this.querySelectorAll(".module-nav__module-header").forEach(btn => {
      btn.addEventListener("click", () => {
        const mod = btn.closest(".module-nav__module");
        const open = mod.classList.toggle("module-nav__module--open");
        btn.setAttribute("aria-expanded", open);
      });
    });
  }

  /**
   * Lightweight DOM sync for same-track navigation.
   * - Removes active class from all lessons
   * - Adds active class to the new lesson
   * - Expands the new lesson's module (and optionally collapses others)
   */
  _syncActiveLesson(route) {
    if (!route?.moduleId || !route?.lessonId) return;

    // Update lesson active states
    this.querySelectorAll(".module-nav__lesson").forEach(li => {
      const link = li.querySelector(".module-nav__lesson-link");
      const isActive = link?.dataset.lesson === route.lessonId && link?.dataset.module === route.moduleId;
      li.classList.toggle("module-nav__lesson--active", isActive);
    });

    // Ensure the active lesson's module is expanded
    this.querySelectorAll(".module-nav__module").forEach(modEl => {
      const header = modEl.querySelector(".module-nav__module-header");
      const isActiveModule = header?.dataset.module === route.moduleId;

      if (isActiveModule) {
        modEl.classList.add("module-nav__module--open");
        header.setAttribute("aria-expanded", "true");
      } else {
        modEl.classList.remove("module-nav__module--open");
        header.setAttribute("aria-expanded", "false");
      }
    });

    // Scroll the active lesson into view within the sidebar
    const activeLink = this.querySelector(".module-nav__lesson--active .module-nav__lesson-link");
    activeLink?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
}

customElements.define("module-nav", ModuleNav);
