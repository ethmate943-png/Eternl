const fs = require('fs');
const content = fs.readFileSync('/Users/blockchainBard/.gemini/antigravity/brain/3db5c782-d4b7-4ea7-84e2-68d7b563e2e7/.system_generated/logs/overview.txt', 'utf8');

const parts = content.split('<USER_REQUEST>');
const lastRequest = parts[parts.length - 1];
let svgMatch = lastRequest.match(/<svg[\s\S]*?<\/svg>/);
if(!svgMatch) process.exit(1);

let svg = svgMatch[0];

svg = svg.replace(/data-v-[a-z0-9]+=""/g, '');
svg = svg.replace(/class=/g, 'className=');
svg = svg.replace(/xmlns:xlink=/g, 'xmlnsXlink=');
svg = svg.replace(/xml:space=/g, 'xmlSpace=');
svg = svg.replace(/stop-color/g, 'stopColor');
svg = svg.replace(/stop-opacity/g, 'stopOpacity');

// add the pink/orange gradient def
const pinkOrangeGrad = `<linearGradient id="welcome-grad" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" stopColor="#ff4081" />
  <stop offset="100%" stopColor="#ff9800" />
</linearGradient>`;
svg = svg.replace('<svg', `<svg`);
svg = svg.replace('><g', `>\n<defs>\n${pinkOrangeGrad}\n</defs>\n<g`);

// color the keys
svg = svg.replace(/style="fill-rule:[^"]+"/g, 'fillRule="evenodd" clipRule="evenodd" fill="#808080"');

// color the character parts based on d="M..." strings from earlier analysis
// M739.57 = shirt
// M760.74, M766.55 = shoes
// M734.24, M747.35 = pants
// M740.9 = head/face
// M738.37 = hair
// M749.95 = arm/hand
// M733.83 = arm/hand

svg = svg.replace(/<path[^>]+d="M739\.57[^>]+>/g, m => m.replace(/style="[^"]+"/, 'fill="url(#welcome-grad)"').replace(/class="[^"]+"/, 'fill="url(#welcome-grad)"'));
svg = svg.replace(/<path[^>]+d="M76[06]\.[0-9]+[^>]+>/g, m => m.replace(/style="[^"]+"/, 'fill="url(#welcome-grad)"').replace(/class="[^"]+"/, 'fill="#ff4081"'));
svg = svg.replace(/<path[^>]+d="M7[34][47]\.[0-9]+[^>]+>/g, m => m.replace(/style="[^"]+"/, 'fill="#1a1a1a"').replace(/class="[^"]+"/, 'fill="#1a1a1a"'));
svg = svg.replace(/<path[^>]+d="M740\.9[^>]+>/g, m => m.replace(/style="[^"]+"/, 'fill="#fff"').replace(/class="[^"]+"/, 'fill="#fff"'));
svg = svg.replace(/<path[^>]+d="M738\.37[^>]+>/g, m => m.replace(/style="[^"]+"/, 'fill="#1a1a1a"').replace(/class="[^"]+"/, 'fill="#1a1a1a"'));
svg = svg.replace(/<path[^>]+d="M749\.95[^>]+>/g, m => m.replace(/style="[^"]+"/, 'fill="#fff"').replace(/class="[^"]+"/, 'fill="#fff"'));
svg = svg.replace(/<path[^>]+d="M733\.83[^>]+>/g, m => m.replace(/style="[^"]+"/, 'fill="#fff"').replace(/class="[^"]+"/, 'fill="#fff"'));


const code = `import React from 'react';

interface EternlWelcomeIllustrationProps extends React.SVGProps<SVGSVGElement> {}

export default function EternlWelcomeIllustration(props: EternlWelcomeIllustrationProps) {
  return (
    <div className="w-full h-full flex justify-center items-center pointer-events-none">
      ${svg}
    </div>
  );
}
`;

fs.writeFileSync('/Users/blockchainBard/eternl/components/onboarding/EternlWelcomeIllustration.tsx', code);
console.log('DONE');
