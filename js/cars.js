const LSU_CAR = `<svg viewBox="0 0 120 55" xmlns="http://www.w3.org/2000/svg" aria-label="LSU purple and gold formula race car" role="img"><g stroke="#24143c" stroke-width="1.5"><path d="M8 35 L19 30 L39 28 L51 17 L75 17 L86 29 L107 32 L116 38 L112 44 L8 44 Z" fill="#461d7c"/><path d="M16 34 L43 32 L53 21 L75 21 L83 32 L105 35 L107 39 L14 39 Z" fill="#592a91"/><path d="M47 30 L57 20 L73 20 L78 30 Z" fill="#25173d"/><path d="M25 35 L93 35 L102 39 L19 39 Z" fill="#fdd023" stroke="none"/><path d="M10 27 L24 27 L26 32 L7 32 Z" fill="#fdd023"/><path d="M99 29 L112 29 L115 34 L99 34 Z" fill="#fdd023"/><circle cx="32" cy="42" r="10" fill="#161616"/><circle cx="32" cy="42" r="4" fill="#777"/><circle cx="91" cy="42" r="10" fill="#161616"/><circle cx="91" cy="42" r="4" fill="#777"/></g><text x="59" y="34" font-size="10" font-family="Arial,sans-serif" font-weight="bold" text-anchor="middle" fill="#fdd023">LSU</text></svg>`;

const RIVALS = [
  {name:"Alabama", code:"BAMA", body:"#9e1b32", trim:"#ffffff", glass:"#29141e", text:"#ffffff"},
  {name:"Florida", code:"UF", body:"#fa4616", trim:"#0021a5", glass:"#152149", text:"#ffffff"},
  {name:"Texas A&M", code:"A&M", body:"#500000", trim:"#ffffff", glass:"#25191c", text:"#ffffff"}
];

function rivalCar(team){
  return LSU_CAR
    .replace('aria-label="LSU purple and gold formula race car"', `aria-label="${team.name} rival Formula race car"`)
    .replaceAll('#461d7c',team.body).replaceAll('#592a91',team.body)
    .replaceAll('#25173d',team.glass).replaceAll('#fdd023',team.trim)
    .replace('>LSU</text>',`>${team.code}</text>`)
    .replace('fill="'+team.trim+'">'+team.code+'</text>', 'fill="'+team.text+'">'+team.code+'</text>');
}
