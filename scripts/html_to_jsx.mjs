import fs from 'fs';
import path from 'path';

function htmlToJsx(html) {
  let jsx = html;

  // 1. Remove HTML comments or convert to JSX comments
  jsx = jsx.replace(/<!--(.*?)-->/gs, '{/* $1 */}');

  // 2. class -> className
  jsx = jsx.replace(/\bclass\s*=/g, 'className=');

  // 3. for -> htmlFor
  jsx = jsx.replace(/\bfor\s*=/g, 'htmlFor=');

  // 4. Handle self-closing tags
  const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'embed', 'param', 'track', 'wbr'];
  selfClosingTags.forEach(tag => {
    const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
    jsx = jsx.replace(regex, `<${tag}$1 />`);
  });

  // 5. style="inline-style" -> style={{ inlineStyle }}
  jsx = jsx.replace(/style="([^"]*)"/g, (match, styleStr) => {
    const parts = styleStr.split(';').filter(p => p.trim());
    const styleObjParts = parts.map(part => {
      const [key, value] = part.split(':').map(s => s.trim());
      if (key && value) {
        const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
        return `${camelKey}: '${value}'`;
      }
      return null;
    }).filter(Boolean);
    return `style={{ ${styleObjParts.join(', ')} }}`;
  });

  // 6. Common attribute renames
  const attributeRenames = {
    tabindex: 'tabIndex',
    onclick: 'onClick',
    onchange: 'onChange',
    autoplay: 'autoPlay',
    maxlength: 'maxLength',
    readonly: 'readOnly',
    autofocus: 'autoFocus',
    srcset: 'srcSet',
    crossorigin: 'crossOrigin'
  };

  Object.entries(attributeRenames).forEach(([oldAttr, newAttr]) => {
    const regex = new RegExp(`\\b${oldAttr}\\s*=`, 'gi');
    jsx = jsx.replace(regex, `${newAttr}=`);
  });

  return jsx;
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.log('Usage: node html_to_jsx.mjs <input_file> [output_file]');
  process.exit(1);
}

const inputFile = args[0];
const outputFile = args[1] || inputFile.replace('.html', '.tsx');

try {
  const content = fs.readFileSync(inputFile, 'utf-8');
  let jsxContent = htmlToJsx(content);

  // Wrap in component if it looks like a full page
  if (jsxContent.includes('<body>')) {
    const bodyMatch = jsxContent.match(/<body>(.*?)<\/body>/s);
    if (bodyMatch) {
      const inner = bodyMatch[1].trim();
      const indented = inner.split('\n').map(line => '    ' + line).join('\n');
      jsxContent = `import React from 'react';\n\nexport default function Home() {\n  return (\n    <div className="min-h-screen bg-[#0e0e0e] text-white">\n${indented}\n    </div>\n  );\n}`;
    }
  } else {
    jsxContent = `import React from 'react';\n\nexport default function Component() {\n  return (\n    <>\n      ${jsxContent}\n    </>\n  );\n}`;
  }

  fs.writeFileSync(outputFile, jsxContent);
  console.log(`Successfully converted ${inputFile} to ${outputFile}`);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
