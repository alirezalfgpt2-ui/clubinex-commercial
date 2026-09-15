import fs from 'fs';
const path = 'src/config/themes.ts';
let content = fs.readFileSync(path, 'utf8');

// Replace standard darkVars for all standard themes
const professionalDarkVars = {
  "--primary": "oklch(0.65 0.18 265)", // Keep primary accent as is (depends on theme)
  "--primary-foreground": "oklch(0.98 0 0)",
  "--accent": "oklch(0.70 0.18 300)",
  "--accent-foreground": "oklch(0.98 0 0)",
  
  // Professional Dark mode base (Zinc/Slate style)
  "--background": "oklch(0.13 0.01 265)", // Very deep gray/blue
  "--foreground": "oklch(0.95 0.01 265)", // Off-white, not pure white
  "--card": "oklch(0.16 0.01 265)", // Slightly lighter than bg
  "--card-foreground": "oklch(0.95 0.01 265)",
  "--muted": "oklch(0.22 0.01 265)", // Distinct but dark muted
  "--muted-foreground": "oklch(0.70 0.01 265)", // Soft gray for text
  "--border": "oklch(0.22 0.01 265)", // Subtle borders
  "--input": "oklch(0.22 0.01 265)",
  "--ring": "oklch(0.65 0.18 265)",
  "--sidebar": "oklch(0.10 0.01 265)", // Even darker sidebar
};

// We will use a regex to replace darkVars objects
content = content.replace(/darkVars:\s*\{[\s\S]*?\},/g, (match) => {
  // Extract primary colors to keep the theme's uniqueness
  const primaryMatch = match.match(/"--primary":\s*"([^"]+)"/);
  const ringMatch = match.match(/"--ring":\s*"([^"]+)"/);
  const accentMatch = match.match(/"--accent":\s*"([^"]+)"/);
  
  const primary = primaryMatch ? primaryMatch[1] : "oklch(0.65 0.18 265)";
  const ring = ringMatch ? ringMatch[1] : "oklch(0.65 0.18 265)";
  const accent = accentMatch ? accentMatch[1] : "oklch(0.70 0.18 300)";
  
  // Create professional sleek dark vars
  return `darkVars: {
      "--primary": "${primary}",
      "--primary-foreground": "oklch(0.98 0.01 0)",
      "--accent": "${accent}",
      "--accent-foreground": "oklch(0.98 0.01 0)",
      "--background": "oklch(0.14 0.005 270)", 
      "--foreground": "oklch(0.92 0.005 270)",
      "--card": "oklch(0.17 0.005 270)",
      "--card-foreground": "oklch(0.92 0.005 270)",
      "--muted": "oklch(0.23 0.01 270)",
      "--muted-foreground": "oklch(0.65 0.01 270)",
      "--border": "oklch(0.23 0.01 270)",
      "--input": "oklch(0.23 0.01 270)",
      "--ring": "${ring}",
      "--sidebar": "oklch(0.11 0.005 270)",
    },`;
});

fs.writeFileSync(path, content);
