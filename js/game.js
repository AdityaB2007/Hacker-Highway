// game state and setup
const MAX_LIVES = 3;
let S;
const shuffle = a => { a = a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };

function newGame() {
    const firstQ = Math.floor(Math.random() * 3);
    S = {
        lane: 0,
        qi: firstQ,
        lives: MAX_LIVES,
        usedRedemption: false,
        mistakes: 0,
        correct: 0,
        locked: false,
        attemptedInLane: [firstQ]
    };
}

// logic gate output evaluation
function gateOutput(g, a, b) {
    if (g === "AND") return a & b;
    if (g === "OR") return a | b;
    if (g === "XNOR") return Number(a === b);
    if (g === "NAND") return Number(!(a & b));
    if (g === "NOR") return Number(!(a | b));
    return 0;
}

// draw circuit svg diagram
function drawCircuit() {
    const q = S.cur, [a, b] = S.inputs, color = "#9dc6ff";
    const isAnd = q.gate === "AND" || q.gate === "NAND";
    const gate = isAnd ? '<path d="M112 35 H147 A45 45 0 0 1 147 125 H112 Z"/>' : '<path d="M112 35 Q143 35 188 80 Q143 125 112 125 Q137 80 112 35 Z"/>';
    const bubble = ["NAND", "NOR", "XNOR"].includes(q.gate) ? '<circle cx="198" cy="80" r="6" fill="#0c142b" stroke="#9dc6ff" stroke-width="3"/>' : '';
    const el = document.getElementById("circuit");
    if (!el) return;
    el.innerHTML = `<div class="note">Click switches to set A and B. Target output: <b>${q.target}</b>.</div>
    <div class="switches"><button class="switch ${a ? 'on' : ''}" onclick="toggleInput(0)">A = ${a}</button><button class="switch ${b ? 'on' : ''}" onclick="toggleInput(1)">B = ${b}</button></div>
    <svg viewBox="0 0 360 160" role="img" aria-label="${q.gate} logic gate">
    <path d="M48 56 H112 M48 104 H112" fill="none" stroke="#9dc6ff" stroke-width="4"/>
    <g fill="#28466f" stroke="#9dc6ff" stroke-width="3">${gate}</g>${bubble}
    <path d="M${bubble ? 204 : 193} 80 H305" stroke="${color}" stroke-width="5"/>
    <text x="15" y="61" fill="white" font-size="20">${a}</text><text x="15" y="109" fill="white" font-size="20">${b}</text>
    <text x="149" y="86" fill="white" font-size="15" text-anchor="middle">${q.gate}</text>
    <circle cx="315" cy="80" r="20" fill="${color}"/><text x="315" y="87" fill="#071321" font-size="22" font-weight="bold" text-anchor="middle">?</text>
    </svg><div class="output">Press Confirm to check your circuit.</div>`;
}

// toggle circuit switches
function toggleInput(i) {
    if (S.locked) return;
    S.inputs[i] = 1 - S.inputs[i];
    drawCircuit();
    const fb = document.getElementById("fb");
    if (fb) fb.innerHTML = "";
}

// submit circuit and penalize wrong gate
function submitCircuit() {
    if (S.locked) return;
    const q = S.cur;
    S.locked = true;
    const sub = document.getElementById("sub");
    if (sub) sub.disabled = true;
    const ok = gateOutput(q.gate, ...S.inputs) === q.target;
    resolve(ok);
}

// cycle truth table cell between 0 and 1
function cycle(btn) {
    if (S.locked) return;
    btn.textContent = btn.textContent === "1" ? "0" : "1";
    btn.classList.add("set");
    const sub = document.getElementById("sub");
    if (sub) sub.disabled = ![...document.querySelectorAll(".tog")].every(b => b.textContent !== "?");
}

// check truth table fill
function submitFill() {
    if (S.locked) return;
    S.locked = true;
    const q = S.cur, togs = [...document.querySelectorAll(".tog")];
    let ok = true;
    togs.forEach((b, i) => {
        const good = Number(b.textContent) === q.ans[i];
        b.classList.add(good ? "right" : "wrong");
        if (!good) ok = false;
    });
    const sub = document.getElementById("sub");
    if (sub) sub.disabled = true;
    resolve(ok);
}

// handle multiple choice pick
function pick(i) {
    if (S.locked) return;
    S.locked = true;
    const q = S.cur, btns = document.querySelectorAll(".opt");
    const ok = q.order[i].ok;
    btns.forEach((b, j) => {
        b.disabled = true;
        if (q.order[j].ok) b.classList.add("right");
    });
    if (!ok) btns[i].classList.add("wrong");
    resolve(ok);
}
