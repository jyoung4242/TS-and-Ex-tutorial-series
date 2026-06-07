/**
 * curriculum-service.js
 * Provides access to curriculum data, navigation, and lesson lookup.
 */

import { CURRICULUM } from "./curriculum-manifest.js";

class CurriculumService {
  constructor() {
    this._data = CURRICULUM;
  }

  /** Returns all tracks */
  getTracks() {
    return this._data.tracks;
  }

  /** Returns a single track by id */
  getTrack(trackId) {
    return this._data.tracks.find((t) => t.id === trackId) || null;
  }

  /** Returns a module within a track */
  getModule(trackId, moduleId) {
    const track = this.getTrack(trackId);
    if (!track) return null;
    return track.modules.find((m) => m.id === moduleId) || null;
  }

  /** Returns a lesson within a module */
  getLesson(trackId, moduleId, lessonId) {
    const mod = this.getModule(trackId, moduleId);
    if (!mod) return null;
    return mod.lessons.find((l) => l.id === lessonId) || null;
  }

  /** Returns a flat list of all lessons across the entire curriculum */
  getAllLessons() {
    const lessons = [];
    for (const track of this._data.tracks) {
      for (const mod of track.modules) {
        for (const lesson of mod.lessons) {
          lessons.push({
            ...lesson,
            trackId: track.id,
            trackTitle: track.title,
            moduleId: mod.id,
            moduleTitle: mod.title,
          });
        }
      }
    }
    return lessons;
  }

  /** Returns the lesson after the current one, or null */
  getNextLesson(trackId, moduleId, lessonId) {
    const all = this.getAllLessons();
    const idx = all.findIndex(
      (l) =>
        l.trackId === trackId &&
        l.moduleId === moduleId &&
        l.id === lessonId
    );
    return idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  }

  /** Returns the lesson before the current one, or null */
  getPreviousLesson(trackId, moduleId, lessonId) {
    const all = this.getAllLessons();
    const idx = all.findIndex(
      (l) =>
        l.trackId === trackId &&
        l.moduleId === moduleId &&
        l.id === lessonId
    );
    return idx > 0 ? all[idx - 1] : null;
  }

  /** Resolve a lesson from a file path */
  getLessonByFile(filePath) {
    return this.getAllLessons().find((l) => l.file === filePath) || null;
  }

  /**
   * Generate navigation tree for sidebar.
   * Returns structure optimized for rendering.
   */
  getNavTree() {
    return this._data.tracks.map((track) => ({
      id: track.id,
      title: track.title,
      icon: track.icon,
      modules: track.modules.map((mod) => ({
        id: mod.id,
        title: mod.title,
        level: mod.level,
        lessons: mod.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          file: lesson.file,
          duration: lesson.duration,
          difficulty: lesson.difficulty,
          trackId: track.id,
          moduleId: mod.id,
        })),
      })),
    }));
  }
}

export const curriculumService = new CurriculumService();
