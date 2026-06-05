const fs = require('fs');

const imageMap = {
  'photo-1592924357228-91a4daadcccf?w=400&h=400&fit=crop': 'photo-1592921870789-04563d55041c?w=500&h=500&fit=crop',
  'photo-1563621033406-be7bc20a26cb?w=400&h=400&fit=crop': 'photo-1508747703725-719777637510?w=500&h=500&fit=crop',
  'photo-1586985289688-cacf2b32b55f?w=400&h=400&fit=crop': 'photo-1586985289688-cacf2b32b55f?w=500&h=500&fit=crop',
  'photo-1574943320219-553eb213f72d?w=400&h=400&fit=crop': 'photo-1574943320219-553eb213f72d?w=500&h=500&fit=crop',
  'photo-1561181286-d3fee7d55364?w=400&h=400&fit=crop': 'photo-1625246333195-78d9c38ad576?w=500&h=500&fit=crop',
  'photo-1596195694269-f5033e338d1b?w=400&h=400&fit=crop': 'photo-1528825871115-3581a5387919?w=500&h=500&fit=crop',
  'photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop': 'photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop',
  'picsum.photos': 'images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=500&fit=crop',
};

const exts = ['.tsx', '.ts', '.js', '.jsx'];
const walk = (dir) => {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = dir + '/' + item;
    if (item === 'node_modules' || item === '.next') continue;
    if (fs.statSync(full).isDirectory()) { walk(full); continue; }
    if (!exts.some(e => item.endsWith(e))) continue;
    let content = fs.readFileSync(full, 'utf8');
    let changed = false;
    for (const [old, rep] of Object.entries(imageMap)) {
      if (content.includes(old)) {
        content = content.split(old).join(rep);
        changed = true;
      }
    }
    if (changed) { fs.writeFileSync(full, content, 'utf8'); console.log('Fixed: ' + full); }
  }
};
walk(process.cwd());
console.log('Image URLs fixed!');
