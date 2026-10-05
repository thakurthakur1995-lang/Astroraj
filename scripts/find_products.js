const fs = require('fs');
const content = fs.readFileSync('lib/data/products.ts', 'utf8');

// Match each product block
const matches = [];
const lines = content.split('\n');
let currentProduct = null;

lines.forEach((line, i) => {
  if (line.includes('"id":')) {
    if (currentProduct) matches.push(currentProduct);
    currentProduct = { startLine: i + 1, text: line };
  } else if (currentProduct) {
    currentProduct.text += '\n' + line;
    if (line.includes('"origin":') || line.includes('"suitableZodiac":') || line.includes('"consecutive":')) {
      // nearing end
    }
  }
});
if (currentProduct) matches.push(currentProduct);

const targetKeywords = ['emerald', 'opal', 'firoza', 'billi', 'baglamukhi', 'bagalamukhi', 'lakshmi'];

matches.forEach(p => {
  const lower = p.text.toLowerCase();
  for (const k of targetKeywords) {
    if (lower.includes(k)) {
      const idMatch = p.text.match(/"id":\s*"([^"]+)"/);
      const nameMatch = p.text.match(/"name":\s*"([^"]+)"/);
      const slugMatch = p.text.match(/"slug":\s*"([^"]+)"/);
      const imagesMatch = p.text.match(/"images":\s*(\[[^\]]*\])/);
      console.log(`Line ${p.startLine}: ID=${idMatch ? idMatch[1] : ''}, Name=${nameMatch ? nameMatch[1] : ''}, Slug=${slugMatch ? slugMatch[1] : ''}`);
      if (imagesMatch) console.log(`Images: ${imagesMatch[1]}`);
      console.log('---');
      break;
    }
  }
});
