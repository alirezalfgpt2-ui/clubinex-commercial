import fs from 'fs';
const path = 'src/modules/shared/layout/Sidebar.tsx';
let content = fs.readFileSync(path, 'utf8');

// Ensure backdrop-blur is added when glass themes are used
if (!content.includes('backdrop-blur-xl')) {
  content = content.replace('bg-[var(--sb-bg)] z-40', 'bg-[var(--sb-bg)] backdrop-blur-xl z-40');
}

fs.writeFileSync(path, content);
