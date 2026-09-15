import fs from 'fs';
const path = 'src/main.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'function RouteLoading() {\n  return <div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;\n}',
  'function RouteLoading() {\n  return (\n    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/50 backdrop-blur-sm transition-opacity">\n      <div className="flex flex-col items-center gap-3">\n        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>\n        <div className="animate-pulse text-sm font-medium text-muted-foreground">در حال آماده‌سازی...</div>\n      </div>\n    </div>\n  );\n}'
);

fs.writeFileSync(path, content);
