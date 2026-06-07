/**
 * track-nav.js
 * Renders the track selection tabs at the top of the sidebar.
 */

import { curriculumService } from "./curriculum-service.js";
import { router } from "./router.js";

export class TrackNav extends HTMLElement {
  connectedCallback() {
    this._render();
    router.onChange((route) => this._updateActive(route));
  }

  _render() {
    const tracks = curriculumService.getTracks();
    this.innerHTML = `
      <nav class="track-nav" role="navigation" aria-label="Track selection">
        <div class="track-nav__label">Track</div>
        <div class="track-nav__tabs">
          ${tracks
            .map(
              (t) => `
            <button
              class="track-nav__tab"
              data-track="${t.id}"
              title="${t.description}"
            >
              <span class="track-nav__icon">${t.icon}</span>
              <span class="track-nav__title">${t.title}</span>
            </button>
          `
            )
            .join("")}
        </div>
      </nav>
    `;

    this.querySelectorAll(".track-nav__tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        const track = curriculumService.getTrack(btn.dataset.track);
        if (track) router.navigateToTrack(track);
      });
    });

    // Reflect current route
    const route = router.parse();
    if (route) this._updateActive(route);
  }

  _updateActive(route) {
    this.querySelectorAll(".track-nav__tab").forEach((btn) => {
      btn.classList.toggle(
        "track-nav__tab--active",
        btn.dataset.track === route?.trackId
      );
    });

    // Dispatch so module-nav knows to update
    this.dispatchEvent(
      new CustomEvent("track:selected", {
        bubbles: true,
        detail: { trackId: route?.trackId },
      })
    );
  }
}

customElements.define("track-nav", TrackNav);
