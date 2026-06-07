/**
 * excalibur-playground.js
 * Responsive iframe wrapper for the ExcaliburJS playground.
 *
 * Usage:
 *   <excalibur-playground src="https://excaliburjs.com/playground?template=minimal"></excalibur-playground>
 */

export class ExcaliburPlayground extends HTMLElement {
  static get observedAttributes() {
    return ["src", "height", "label"];
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }

  _render() {
    const src = this.getAttribute("src") || "https://excaliburjs.com/playground?template=minimal";
    const height = this.getAttribute("height") || "500";
    const label = this.getAttribute("label") || "Excalibur Playground";

    this.innerHTML = `
      <div class="playground-container" role="region" aria-label="${label}">
        <div class="playground-toolbar">
          <span class="playground-toolbar__icon">⚔</span>
          <span class="playground-toolbar__label">${label}</span>
          <a
            class="playground-toolbar__open"
            href="${src}"
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new tab"
          >↗ Open</a>
        </div>
        <div class="playground-frame-wrapper" style="height: ${height}px">
          <div class="playground-loading" aria-live="polite">
            <div class="playground-loading__spinner"></div>
            <span>Loading playground…</span>
          </div>
          <iframe
            src="${src}"
            class="playground-frame"
            title="${label}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          ></iframe>
        </div>
      </div>
    `;

    const iframe = this.querySelector("iframe");
    const loading = this.querySelector(".playground-loading");

    iframe.addEventListener("load", () => {
      loading.style.display = "none";
      iframe.style.opacity = "1";
    });
  }
}

customElements.define("excalibur-playground", ExcaliburPlayground);
