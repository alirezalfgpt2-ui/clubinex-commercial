import fs from 'fs';
const path = 'src/modules/landing/components/HeroSlider.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '<motion.div\n                key={current}\n                custom={direction}\n                variants={textVariants}\n                initial="enter"\n                animate="center"\n                exit="exit"\n                transition={{ duration: 0.5, ease: "easeInOut" }}\n              >',
  '<motion.div\n                key={current}\n                custom={direction}\n                variants={textVariants}\n                initial="enter"\n                animate="center"\n                exit="exit"\n                transition={{ duration: 0.5, ease: "easeInOut" }}\n                className="absolute inset-x-0 top-1/2 -translate-y-1/2"\n              >'
);

content = content.replace('className="absolute top-0 left-0 right-0 inline-flex items-center gap-2 rounded-full', 'className="inline-flex items-center gap-2 rounded-full');

fs.writeFileSync(path, content);
