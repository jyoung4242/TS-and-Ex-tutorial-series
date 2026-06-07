/**
 * progress-service.js
 * Tracks lesson completion using localStorage.
 */

const STORAGE_KEY = "ts-academy-progress";

class ProgressService {
  constructor() {
    this._data = this._load();
  }

  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { completed: {}, lastVisited: null };
    } catch {
      return { completed: {}, lastVisited: null };
    }
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
    } catch (e) {
      console.warn("Could not save progress:", e);
    }
  }

  /** Generate a unique key for a lesson */
  _key(trackId, moduleId, lessonId) {
    return `${trackId}::${moduleId}::${lessonId}`;
  }

  /** Mark a lesson as complete */
  markComplete(trackId, moduleId, lessonId) {
    const key = this._key(trackId, moduleId, lessonId);
    this._data.completed[key] = { completedAt: Date.now() };
    this._save();
    window.dispatchEvent(
      new CustomEvent("progress:changed", {
        detail: { trackId, moduleId, lessonId, complete: true },
      })
    );
  }

  /** Mark a lesson as incomplete */
  markIncomplete(trackId, moduleId, lessonId) {
    const key = this._key(trackId, moduleId, lessonId);
    delete this._data.completed[key];
    this._save();
    window.dispatchEvent(
      new CustomEvent("progress:changed", {
        detail: { trackId, moduleId, lessonId, complete: false },
      })
    );
  }

  /** Toggle completion state */
  toggle(trackId, moduleId, lessonId) {
    if (this.isComplete(trackId, moduleId, lessonId)) {
      this.markIncomplete(trackId, moduleId, lessonId);
    } else {
      this.markComplete(trackId, moduleId, lessonId);
    }
  }

  /** Check if a lesson is complete */
  isComplete(trackId, moduleId, lessonId) {
    return !!this._data.completed[this._key(trackId, moduleId, lessonId)];
  }

  /** Returns all progress data */
  getProgress() {
    return { ...this._data };
  }

  /** Returns count of completed lessons */
  getCompletedCount() {
    return Object.keys(this._data.completed).length;
  }

  /** Record the last visited lesson */
  setLastVisited(trackId, moduleId, lessonId) {
    this._data.lastVisited = { trackId, moduleId, lessonId };
    this._save();
  }

  /** Returns the last visited lesson info */
  getLastVisited() {
    return this._data.lastVisited || null;
  }

  /** Clear all progress */
  reset() {
    this._data = { completed: {}, lastVisited: null };
    this._save();
    window.dispatchEvent(new CustomEvent("progress:reset"));
  }
}

export const progressService = new ProgressService();
