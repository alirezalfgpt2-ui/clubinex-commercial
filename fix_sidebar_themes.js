import fs from 'fs';
const path = 'src/config/sidebar-themes.ts';
let content = fs.readFileSync(path, 'utf8');

// replace some sidebar themes presets with more distinct ones
const newContent = content
  .replace('const DARK: SidebarThemeVars = {\n  "--sb-bg": "linear-gradient(180deg, #0f172a, #1e293b)",', 'const DARK: SidebarThemeVars = {\n  "--sb-bg": "#0f172a",')
  .replace('"--sb-logo-bg": "linear-gradient(135deg, #6366f1, #8b5cf6)",\n  "--sb-logo-text": "#ffffff",', '"--sb-logo-bg": "#1e293b",\n  "--sb-logo-text": "#818cf8",');

const glass = `
/** تم شیشه‌ای — روشن با افکت Blur */
const GLASS: SidebarThemeVars = {
  "--sb-bg": "rgba(255, 255, 255, 0.7)",
  "--sb-text": "#1f2937",
  "--sb-text-muted": "#6b7280",
  "--sb-border": "rgba(0, 0, 0, 0.05)",
  "--sb-search-bg": "rgba(0, 0, 0, 0.03)",
  "--sb-search-text": "#6b7280",
  "--sb-group-label": "#9ca3af",
  "--sb-active-bg": "rgba(15, 23, 42, 0.06)",
  "--sb-active-text": "#111827",
  "--sb-hover-bg": "rgba(0, 0, 0, 0.03)",
  "--sb-logo-bg": "#000000",
  "--sb-logo-text": "#ffffff",
  "--sb-scrollbar": "rgba(0, 0, 0, 0.1)",
  "--sb-scroll-bg": "transparent",
  "--sb-item-radius": "0.75rem",
  "--sb-item-padding": "0.5rem 0.75rem",
  "--sb-item-gap": "0.125rem",
};

/** تم شیشه‌ای تاریک */
const GLASS_DARK: SidebarThemeVars = {
  "--sb-bg": "rgba(15, 23, 42, 0.7)",
  "--sb-text": "#f1f5f9",
  "--sb-text-muted": "#94a3b8",
  "--sb-border": "rgba(255, 255, 255, 0.05)",
  "--sb-search-bg": "rgba(255, 255, 255, 0.05)",
  "--sb-search-text": "#cbd5e1",
  "--sb-group-label": "#64748b",
  "--sb-active-bg": "rgba(255, 255, 255, 0.1)",
  "--sb-active-text": "#ffffff",
  "--sb-hover-bg": "rgba(255, 255, 255, 0.05)",
  "--sb-logo-bg": "#ffffff",
  "--sb-logo-text": "#0f172a",
  "--sb-scrollbar": "rgba(255, 255, 255, 0.1)",
  "--sb-scroll-bg": "transparent",
  "--sb-item-radius": "0.75rem",
  "--sb-item-padding": "0.5rem 0.75rem",
  "--sb-item-gap": "0.125rem",
};
`;

let content2 = newContent.replace('export const SIDEBAR_THEMES: SidebarThemeDef[] = [', glass + '\nexport const SIDEBAR_THEMES: SidebarThemeDef[] = [');

content2 = content2.replace('  {\n    id: "sidebar-gradient",', '  {\n    id: "sidebar-glass",\n    label: "شیشه‌ای",\n    labelEn: "Glass",\n    desc: "سایدبار با افکت مات",\n    accent: "#6b7280",\n    vars: GLASS,\n  },\n  {\n    id: "sidebar-glass-dark",\n    label: "شیشه‌ای تاریک",\n    labelEn: "Glass Dark",\n    desc: "سایدبار تاریک مات",\n    accent: "#f1f5f9",\n    vars: GLASS_DARK,\n  },\n  {\n    id: "sidebar-gradient",');

content2 = content2.replace('"sidebar-gradient": { bg: "linear-gradient(160deg, #4f46e5, #7c3aed, #9333ea)", text: "rgba(255,255,255,0.9)", search: "rgba(255,255,255,0.12)", active: "rgba(255,255,255,0.18)", border: "rgba(255,255,255,0.1)", group: "rgba(255,255,255,0.35)", itemRadius: "0.75rem" },', '"sidebar-gradient": { bg: "linear-gradient(160deg, #4f46e5, #7c3aed, #9333ea)", text: "rgba(255,255,255,0.9)", search: "rgba(255,255,255,0.12)", active: "rgba(255,255,255,0.18)", border: "rgba(255,255,255,0.1)", group: "rgba(255,255,255,0.35)", itemRadius: "0.75rem" },\n  "sidebar-glass": { bg: "rgba(255, 255, 255, 0.7)", text: "#1f2937", search: "rgba(0, 0, 0, 0.03)", active: "rgba(15, 23, 42, 0.06)", border: "rgba(0, 0, 0, 0.05)", group: "#9ca3af", itemRadius: "0.75rem" },\n  "sidebar-glass-dark": { bg: "rgba(15, 23, 42, 0.7)", text: "#f1f5f9", search: "rgba(255, 255, 255, 0.05)", active: "rgba(255, 255, 255, 0.1)", border: "rgba(255, 255, 255, 0.05)", group: "#64748b", itemRadius: "0.75rem" },');

fs.writeFileSync(path, content2);
