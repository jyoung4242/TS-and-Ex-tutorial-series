/**
 * Curriculum Manifest
 * Central source of truth for all tracks, modules, and lessons.
 * Adding entries here automatically drives navigation.
 */

export const CURRICULUM = {
  tracks: [
    {
      id: "typescript",
      title: "TypeScript",
      icon: "⬡",
      description: "Master TypeScript from the ground up",
      modules: [
        {
          id: "getting-started",
          title: "Getting Started",
          level: "Beginner",
          lessons: [
            {
              id: "welcome",
              title: "Welcome",
              file: "TypeScript Track/Beginner - Getting Started/welcome.html",
              duration: "5 min",
              difficulty: "beginner",
            },
            {
              id: "why-typescript",
              title: "Why TypeScript?",
              file: "TypeScript Track/Beginner - Getting Started/why-typescript.html",
              duration: "10 min",
              difficulty: "beginner",
            },
            {
              id: "ts-vs-js",
              title: "TypeScript vs JavaScript",
              file: "TypeScript Track/Beginner - Getting Started/ts-vs-js.html",
              duration: "12 min",
              difficulty: "beginner",
            },
          ],
        },
        {
          id: "variables-types",
          title: "Variables & Types",
          level: "Beginner",
          lessons: [
            {
              id: "primitive-types",
              title: "Primitive Types",
              file: "TypeScript Track/Beginner - Variables & Types/primitive-types.html",
              duration: "15 min",
              difficulty: "beginner",
            },
            {
              id: "type-inference",
              title: "Type Inference",
              file: "TypeScript Track/Beginner - Variables & Types/type-inference.html",
              duration: "12 min",
              difficulty: "beginner",
            },
            {
              id: "const-let-var",
              title: "const, let, and var",
              file: "TypeScript Track/Beginner - Variables & Types/const-let-var.html",
              duration: "10 min",
              difficulty: "beginner",
            },
          ],
        },
        {
          id: "functions",
          title: "Functions",
          level: "Beginner",
          lessons: [
            {
              id: "function-basics",
              title: "Function Basics",
              file: "TypeScript Track/Beginner - Functions/function-basics.html",
              duration: "15 min",
              difficulty: "beginner",
            },
            {
              id: "return-types",
              title: "Return Types",
              file: "TypeScript Track/Beginner - Functions/return-types.html",
              duration: "12 min",
              difficulty: "beginner",
            },
            {
              id: "optional-params",
              title: "Optional Parameters",
              file: "TypeScript Track/Beginner - Functions/optional-params.html",
              duration: "10 min",
              difficulty: "beginner",
            },
          ],
        },
      ],
    },
    {
      id: "excalibur",
      title: "Excalibur",
      icon: "⚔",
      description: "Build games with ExcaliburJS",
      modules: [
        {
          id: "foundations",
          title: "Foundations",
          level: "Beginner",
          lessons: [
            {
              id: "your-first-game",
              title: "Your First Game",
              file: "GameDev Track/Foundations/your-first-game.html",
              duration: "20 min",
              difficulty: "beginner",
            },
            {
              id: "actors-and-scenes",
              title: "Actors & Scenes",
              file: "GameDev Track/Foundations/actors-and-scenes.html",
              duration: "20 min",
              difficulty: "beginner",
            },
          ],
        },
        {
          id: "gameplay-systems",
          title: "Gameplay Systems",
          level: "Intermediate",
          lessons: [
            {
              id: "input-handling",
              title: "Input Handling",
              file: "GameDev Track/Gameplay Systems/input-handling.html",
              duration: "18 min",
              difficulty: "intermediate",
            },
          ],
        },
      ],
    },
    {
      id: "projects",
      title: "Projects",
      icon: "◈",
      description: "Build real games from scratch",
      modules: [
        {
          id: "beginner-projects",
          title: "Beginner Projects",
          level: "Beginner",
          lessons: [
            {
              id: "catch-the-star",
              title: "Catch the Star",
              file: "Projects Track/Beginner/catch-the-star.html",
              duration: "45 min",
              difficulty: "beginner",
            },
          ],
        },
      ],
    },
  ],
};
