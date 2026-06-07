/**
 * router.js
 * Hash-based router for navigating between lessons.
 * URL format: #track/module/lesson
 */

class Router {
  constructor() {
    this._listeners = [];
    window.addEventListener("hashchange", () => this._emit());
  }

  /** Parse current URL hash into route segments */
  parse() {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return null;
    const parts = hash.split("/");
    return {
      trackId: parts[0] || null,
      moduleId: parts[1] || null,
      lessonId: parts[2] || null,
      raw: hash,
    };
  }

  /** Navigate to a lesson */
  navigate(trackId, moduleId, lessonId) {
    window.location.hash = `${trackId}/${moduleId}/${lessonId}`;
  }

  /** Navigate using a lesson object */
  navigateToLesson(lesson) {
    this.navigate(lesson.trackId, lesson.moduleId, lesson.id);
  }

  /** Navigate to a track (first module, first lesson) */
  navigateToTrack(track) {
    const mod = track.modules[0];
    if (mod && mod.lessons[0]) {
      this.navigate(track.id, mod.id, mod.lessons[0].id);
    }
  }

  /** Register a route change listener */
  onChange(fn) {
    this._listeners.push(fn);
  }

  _emit() {
    const route = this.parse();
    this._listeners.forEach((fn) => fn(route));
  }

  /** Navigate to current hash on init */
  init() {
    this._emit();
  }
}

export const router = new Router();
