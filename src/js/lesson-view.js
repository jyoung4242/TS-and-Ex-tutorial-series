/**
 * lesson-view.js
 * Loads lesson HTML content and manages the main content area.
 */

import { curriculumService } from "./curriculum-service.js";
import { progressService } from "./progress-service.js";
import { router } from "./router.js";

export class LessonView extends HTMLElement {
  connectedCallback() {
    this._currentLesson = null;
    this._showWelcome();

    router.onChange(route => {
      if (route?.trackId && route?.moduleId && route?.lessonId) {
        this._loadLesson(route);
      } else {
        this._showWelcome();
      }
    });
  }

  _showWelcome() {
    this.innerHTML = `
      <div class="lesson-welcome">
        <div class="lesson-welcome__content">
          <div class="lesson-welcome__badge">⬡</div>
          <h1 class="lesson-welcome__title">Excalibur Labs</h1>
          <p class="lesson-welcome__subtitle">
            Learn TypeScript through the lens of game development with ExcaliburJS.
          </p>
          <div class="lesson-welcome__tracks">
            <div class="lesson-welcome__track">
              <div class="lesson-welcome__track-icon">⬡</div>
              <div>
                <strong>TypeScript</strong>
                <p>Core language concepts, types, and patterns</p>
              </div>
            </div>
            <div class="lesson-welcome__track">
              <div class="lesson-welcome__track-icon">⚔</div>
              <div>
                <strong>Excalibur</strong>
                <p>Game development with ExcaliburJS</p>
              </div>
            </div>
            <div class="lesson-welcome__track">
              <div class="lesson-welcome__track-icon">◈</div>
              <div>
                <strong>Projects</strong>
                <p>Complete games to reinforce your learning</p>
              </div>
            </div>
          </div>
          <p class="lesson-welcome__cta">← Select a track to begin</p>
        </div>
      </div>
    `;
  }

  async _loadLesson(route) {
    const { trackId, moduleId, lessonId } = route;

    const lesson = curriculumService.getLesson(trackId, moduleId, lessonId);
    if (!lesson) {
      this._showError("Lesson not found.");
      return;
    }

    this._currentLesson = { ...lesson, trackId, moduleId };
    progressService.setLastVisited(trackId, moduleId, lessonId);

    this._showLoading(lesson.title);

    try {
      const resp = await fetch(`src/tracks/${lesson.file}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const html = await resp.text();
      this._renderLesson(html, route, lesson);
    } catch (err) {
      this._showError(`Could not load lesson: ${err.message}`);
    }
  }

  _renderLesson(html, route, lesson) {
    const { trackId, moduleId, lessonId } = route;
    const track = curriculumService.getTrack(trackId);
    const mod = curriculumService.getModule(trackId, moduleId);
    const prev = curriculumService.getPreviousLesson(trackId, moduleId, lessonId);
    const next = curriculumService.getNextLesson(trackId, moduleId, lessonId);
    const isComplete = progressService.isComplete(trackId, moduleId, lessonId);

    this.innerHTML = `
      <article class="lesson-view" id="lesson-top">
        <header class="lesson-header">
          <nav class="lesson-breadcrumb" aria-label="Breadcrumb">
            <span>${track?.title}</span>
            <span class="lesson-breadcrumb__sep">›</span>
            <span>${mod?.title}</span>
            <span class="lesson-breadcrumb__sep">›</span>
            <span class="lesson-breadcrumb__current">${lesson.title}</span>
          </nav>

          <div class="lesson-meta">
            <span class="lesson-meta__badge lesson-meta__badge--${lesson.difficulty}">${lesson.difficulty}</span>
            <span class="lesson-meta__item">⏱ ${lesson.duration}</span>
          </div>

          <h1 class="lesson-title">${lesson.title}</h1>
        </header>

        <div class="lesson-content">
          ${html}
        </div>

        <footer class="lesson-footer">
          <div class="lesson-nav-controls">
            ${
              prev
                ? `<a href="#${prev.trackId}/${prev.moduleId}/${prev.id}" class="lesson-nav-btn lesson-nav-btn--prev">
                ← ${prev.title}
              </a>`
                : "<span></span>"
            }
            <button
            class="lesson-complete-btn ${isComplete ? "lesson-complete-btn--done" : ""}"
            data-track="${trackId}"
            data-module="${moduleId}"
            data-lesson="${lessonId}"
          >
            ${isComplete ? "✓ Completed" : "Mark Complete"}
          </button>
            ${
              next
                ? `<a href="#${next.trackId}/${next.moduleId}/${next.id}" class="lesson-nav-btn lesson-nav-btn--next">
                ${next.title} →
              </a>`
                : "<span></span>"
            }
          </div>
          
          <a href="#lesson-top" class="lesson-top-btn" aria-label="Back to top">↑ Top</a>
        </footer>
      </article>
    `;

    // Wire up complete button
    const completeBtn = this.querySelector(".lesson-complete-btn");
    completeBtn?.addEventListener("click", () => {
      progressService.toggle(trackId, moduleId, lessonId);
      const nowComplete = progressService.isComplete(trackId, moduleId, lessonId);
      completeBtn.textContent = nowComplete ? "✓ Completed" : "Mark Complete";
      completeBtn.classList.toggle("lesson-complete-btn--done", nowComplete);
    });

    // Initialize playground custom elements within loaded content
    this.querySelectorAll("excalibur-playground").forEach(el => {
      if (!customElements.get("excalibur-playground")) return;
      // Already defined, browser upgrades them automatically
    });

    // Syntax highlight code blocks if highlight.js is available
    if (window.hljs) {
      this.querySelectorAll("pre code").forEach(block => {
        window.hljs.highlightElement(block);
      });
    }
  }

  _showLoading(title) {
    this.innerHTML = `
      <div class="lesson-loading">
        <div class="lesson-loading__spinner"></div>
        <p>Loading ${title}…</p>
      </div>
    `;
  }

  _showError(msg) {
    this.innerHTML = `
      <div class="lesson-error">
        <p class="lesson-error__icon">⚠</p>
        <p>${msg}</p>
        <p class="lesson-error__hint">Make sure the lesson file exists in <code>src/tracks/</code></p>
      </div>
    `;
  }
}

customElements.define("lesson-view", LessonView);
