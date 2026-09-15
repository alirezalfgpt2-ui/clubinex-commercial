import fs from 'fs';
const path = 'src/config/themes.ts';
let content = fs.readFileSync(path, 'utf8');

// replace some theme presets with more vibrant and distinct ones
content = content.replace(
  '    id: "royal-indigo",\n    name: "Royal Indigo",\n    nameFa: "نیلی سلطنتی",\n    preview: "oklch(0.50 0.18 270)",\n    accentPreview: "oklch(0.65 0.18 300)",\n    layout: "default",\n    cardStyle: "default",\n    vars: {\n      "--primary": "oklch(0.50 0.18 270)",\n      "--primary-foreground": "oklch(0.98 0 0)",\n      "--accent": "oklch(0.65 0.18 300)",\n      "--accent-foreground": "oklch(0.98 0 0)",\n      "--background": "oklch(0.98 0.01 270)",\n      "--foreground": "oklch(0.15 0.02 270)",\n      "--card": "oklch(1.0 0 0)",\n      "--card-foreground": "oklch(0.15 0.02 270)",\n      "--muted": "oklch(0.96 0.01 270)",\n      "--muted-foreground": "oklch(0.45 0.02 270)",\n      "--border": "oklch(0.92 0.01 270)",\n      "--input": "oklch(0.92 0.01 270)",\n      "--ring": "oklch(0.50 0.18 270)",\n      "--destructive": "oklch(0.55 0.22 25)",\n      "--sidebar": "oklch(0.98 0.01 270)",\n    },\n    darkVars: {\n      "--primary": "oklch(0.65 0.18 270)",\n      "--primary-foreground": "oklch(0.10 0.03 270)",\n      "--accent": "oklch(0.70 0.18 300)",\n      "--accent-foreground": "oklch(0.10 0.03 300)",\n      "--background": "oklch(0.15 0.02 270)",\n      "--foreground": "oklch(0.98 0.01 270)",\n      "--card": "oklch(0.18 0.02 270)",\n      "--card-foreground": "oklch(0.98 0.01 270)",\n      "--muted": "oklch(0.22 0.02 270)",\n      "--muted-foreground": "oklch(0.60 0.02 270)",\n      "--border": "oklch(0.25 0.02 270)",\n      "--input": "oklch(0.25 0.02 270)",\n      "--ring": "oklch(0.65 0.18 270)",\n      "--sidebar": "oklch(0.12 0.02 270)",\n    },\n  }',
  `    id: "royal-indigo",
    name: "Royal Indigo",
    nameFa: "نیلی سلطنتی",
    preview: "oklch(0.50 0.18 270)",
    accentPreview: "oklch(0.65 0.18 300)",
    layout: "default",
    cardStyle: "default",
    vars: {
      "--primary": "oklch(0.45 0.15 265)",
      "--primary-foreground": "oklch(0.99 0 0)",
      "--accent": "oklch(0.65 0.18 300)",
      "--accent-foreground": "oklch(0.99 0 0)",
      "--background": "oklch(0.98 0.005 265)",
      "--foreground": "oklch(0.15 0.02 265)",
      "--card": "oklch(1.0 0 0)",
      "--card-foreground": "oklch(0.15 0.02 265)",
      "--muted": "oklch(0.95 0.01 265)",
      "--muted-foreground": "oklch(0.40 0.02 265)",
      "--border": "oklch(0.92 0.01 265)",
      "--input": "oklch(0.92 0.01 265)",
      "--ring": "oklch(0.45 0.15 265)",
      "--destructive": "oklch(0.55 0.22 25)",
      "--sidebar": "oklch(0.98 0.005 265)",
    },
    darkVars: {
      "--primary": "oklch(0.65 0.18 265)",
      "--primary-foreground": "oklch(0.10 0.03 265)",
      "--accent": "oklch(0.70 0.18 300)",
      "--accent-foreground": "oklch(0.10 0.03 300)",
      "--background": "oklch(0.12 0.015 265)",
      "--foreground": "oklch(0.98 0.01 265)",
      "--card": "oklch(0.16 0.015 265)",
      "--card-foreground": "oklch(0.98 0.01 265)",
      "--muted": "oklch(0.20 0.015 265)",
      "--muted-foreground": "oklch(0.65 0.02 265)",
      "--border": "oklch(0.22 0.015 265)",
      "--input": "oklch(0.22 0.015 265)",
      "--ring": "oklch(0.65 0.18 265)",
      "--sidebar": "oklch(0.10 0.015 265)",
    },
  }`
);

fs.writeFileSync(path, content);
