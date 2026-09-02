const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('apps/web/src/app/**/*.tsx');
let modifiedFiles = [];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('<img ') || content.includes('<img\n') || content.includes('<img>')) {
    content = content.replace(/<img\b/g, '<Image');
    if (!content.includes('import Image from')) {
      content = "import Image from 'next/image';\n" + content;
    }
    content = content.replace(/<Image([^>]+)>/g, (match, p1) => {
        let newAttrs = p1;
        if (!newAttrs.includes('width=')) newAttrs += ' width={500}';
        if (!newAttrs.includes('height=')) newAttrs += ' height={500}';
        if (!newAttrs.includes('alt=')) newAttrs += ' alt="Image"';
        // Handle self-closing
        if (newAttrs.endsWith('/')) {
            newAttrs = newAttrs.slice(0, -1) + ' /';
        } else {
            newAttrs += ' /';
        }
        return '<Image' + newAttrs + '>';
    });
    // Replace <Image /> if it double closed
    content = content.replace(/\/ \/>/g, '/>');
    changed = true;
  }

  if (content.includes('<button ') || content.includes('<button\n') || content.includes('<button>')) {
    content = content.replace(/<button\b/g, '<Button');
    content = content.replace(/<\/button>/g, '</Button>');
    if (!content.includes('import { Button }')) {
      content = "import { Button } from '@/components/ui/button';\n" + content;
    }
    changed = true;
  }

  if (content.includes('<input ') || content.includes('<input\n') || content.includes('<input>')) {
    content = content.replace(/<input\b/g, '<Input');
    if (!content.includes('import { Input }')) {
      content = "import { Input } from '@/components/ui/input';\n" + content;
    }
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    modifiedFiles.push(file);
  }
});
console.log('Modified files:');
console.log(modifiedFiles.join('\n'));
