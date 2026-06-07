# TypeScript Academy

A curriculum-driven educational platform for learning **TypeScript through Game Development** with [ExcaliburJS](https://excaliburjs.com).

## Running Locally

This is a static site. No build step required for development — just serve the root directory with any static file server:

```bash
# Using Node.js (npx)
npx serve .

# Using Python
python3 -m http.server 8080

# Using VS Code Live Server
# Right-click index.html → "Open with Live Server"
```

Then open `http://localhost:3000` (or whatever port your server uses).

> **Note:** You must use a local server (not `file://`) because ES modules require HTTP to resolve imports.

## Deploying to GitHub Pages

1. Push the repo to GitHub
2. Go to **Settings → Pages**
3. Set Source to `Deploy from a branch` → `main` → `/ (root)`
4. The site will be live at `https://<username>.github.io/<repo>/`

## Project Structure

```
/
├── index.html                      # App shell
├── src/
│   ├── css/
│   │   ├── tokens.css              # Design tokens & CSS reset
│   │   ├── layout.css              # Two-column app layout
│   │   ├── navigation.css          # Sidebar navigation styles
│   │   ├── lesson.css              # Lesson content typography
│   │   └── playground.css          # Excalibur playground embed
│   ├── js/
│   │   ├── app.js                  # Bootstrap & event wiring
│   │   ├── curriculum-manifest.js  # ← The source of truth for all content
│   │   ├── curriculum-service.js   # Curriculum data access layer
│   │   ├── progress-service.js     # localStorage progress tracking
│   │   ├── router.js               # Hash-based navigation
│   │   ├── track-nav.js            # Track selector component
│   │   ├── module-nav.js           # Module/lesson tree component
│   │   ├── lesson-view.js          # Lesson content renderer
│   │   └── excalibur-playground.js # <excalibur-playground> custom element
│   └── tracks/
│       ├── lesson-template.html    # Template for new lessons
│       ├── TypeScript Track/
│       │   ├── Beginner - Getting Started/
│       │   ├── Beginner - Variables & Types/
│       │   └── Beginner - Functions/
│       ├── GameDev Track/
│       │   ├── Foundations/
│       │   └── Gameplay Systems/
│       └── Projects Track/
│           └── Beginner/
```

## Adding a New Lesson

### 1. Create the lesson file

Copy `src/tracks/lesson-template.html` to the correct track/module folder:

```bash
cp src/tracks/lesson-template.html \
   "src/tracks/TypeScript Track/Beginner - Objects/objects-intro.html"
```

### 2. Write the lesson content

Open the file and fill in:
- Learning objectives
- Content sections (use `<h2>` and `<h3>` for headings)
- Code examples (`<pre><code class="language-typescript">`)
- Callouts (`.callout--note`, `.callout--tip`, `.callout--warning`, `.callout--remember`)
- Optionally: `<excalibur-playground>` embed
- Exercise section
- Summary section

### 3. Register in the manifest

Open `src/js/curriculum-manifest.js` and add the lesson to the appropriate module:

```js
{
  id: "objects-intro",
  title: "Introduction to Objects",
  file: "TypeScript Track/Beginner - Objects/objects-intro.html",
  duration: "15 min",
  difficulty: "beginner",
}
```

That's it — the lesson will appear in the sidebar automatically.

## Adding a New Module

In `curriculum-manifest.js`, add a new module entry inside the track's `modules` array:

```js
{
  id: "objects",
  title: "Objects",
  level: "Beginner",
  lessons: [
    // ... lesson entries
  ],
}
```

Create the matching folder in `src/tracks/TypeScript Track/Beginner - Objects/`.

## Lesson Content Guidelines

### One concept per lesson

Each lesson teaches **one TypeScript concept**. Do not combine TypeScript and Excalibur concepts in the same lesson.

- ✅ Good: "Primitive Types" — teaches `string`, `number`, `boolean`
- ✅ Good: "Your First Game" — teaches the Excalibur Engine setup
- ❌ Bad: "Functions + Actors" — mixes TypeScript and Excalibur

### Excalibur playgrounds

Use `<excalibur-playground>` to reinforce the **TypeScript concept** in a game context — not to introduce new Excalibur APIs.

```html
<excalibur-playground
  src="https://excaliburjs.com/playground?template=minimal"
  label="Try It: Functions"
  height="500"
></excalibur-playground>
```

Attributes:
- `src` — the playground URL
- `label` — displayed in the toolbar
- `height` — iframe height in pixels (default: 500)

### Callout types

```html
<div class="callout callout--note">    <!-- ℹ Supplementary info -->
<div class="callout callout--tip">     <!-- 💡 Practical suggestion -->
<div class="callout callout--warning"> <!-- ⚠ Common mistake -->
<div class="callout callout--remember"><!-- 📌 Key rule to internalize -->
```

## Architecture

### Curriculum-driven navigation

Navigation is entirely driven by `curriculum-manifest.js`. The sidebar is built from this data at runtime — no nav HTML is hard-coded.

### Custom elements

The UI is built with vanilla Web Components (custom elements):
- `<track-nav>` — track selector tabs
- `<module-nav>` — collapsible module/lesson tree
- `<lesson-view>` — loads and renders lesson HTML
- `<excalibur-playground>` — responsive iframe wrapper

### Progress tracking

Lesson completion is stored in `localStorage` under the key `ts-academy-progress`. No backend required.

### Routing

Hash-based routing: `#trackId/moduleId/lessonId`

Example: `#typescript/variables-types/primitive-types`
