// game state and setup
const LANES = window.LANES || [];
const REDEMPTION = window.REDEMPTION || {};
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

// hud with signal light and road progress
function hud(redeem) {
    const lane = LANES[S.lane];
    const roads = LANES.map((item, i) => {
        const completed = i < S.lane;
        const active = i === S.lane;
        const progress = completed ? 88 : active ? 10 : 5;
        const obstacles = active ? [35, 60, 80].map((x, j) => `<div class="traffic" style="left:${x}%" title="${RIVALS[j].name}">${rivalCar(RIVALS[j])}</div>`).join("") : "";
        return `<div class="road ${completed ? 'done' : active ? 'active' : ''}"><span class="road-label">Lane ${i + 1} · ${["Very Easy", "Easy", "Medium", "Hard", "Very Hard"][i]}</span>${obstacles}${active ? `<div class="car" style="left:${progress}%">${LSU_CAR}</div>` : ""}${completed ? '<span class="road-check">✅</span>' : ''}<span class="flag">🏁</span></div>`;
    }).join("");
    return `<div class="panel"><div class="hud"><div>${lane.name}</div><div>Lane ${S.lane + 1} / ${LANES.length}</div><div class="traffic-status"><span>Lives: ${S.lives}/3</span><div class="traffic-signal"><span class="bulb red ${S.lives === 1 ? 'on' : ''}"></span><span class="bulb yellow ${S.lives === 2 ? 'on' : ''}"></span><span class="bulb green ${S.lives === 3 ? 'on' : ''}"></span></div></div></div><div class="highway">${roads}</div></div>`;
}

// display current active question
function showQuestion(redeem = false) {
    S.locked = false;
    const lane = LANES[S.lane];
    const q = redeem ? REDEMPTION : lane.qs[S.qi];
    S.cur = q; S.redeem = redeem;
    let body = `<div class="diff">${redeem ? "REDEMPTION" : lane.sub}</div><div class="q">${q.q}</div>`;
    if (q.table) {
        body += `<table class="tt"><tr>${q.table.h.map(h => `<th>${h}</th>`).join("")}</tr>` +
            q.table.r.map((row, ri) => `<tr>${row.map((c, ci) => c === "?" ? `<td><button class="tog" data-r="${ri}" data-c="${ci}" onclick="cycle(this)">?</button></td>` : `<td>${c}</td>`).join("")}</tr>`).join("") + `</table>`;
    }
    if (q.t === "circuit") {
        S.inputs = q.initial.slice();
        body += `<div class="circuit" id="circuit"></div><div class="center"><button class="btn" id="sub" onclick="submitCircuit()">Confirm</button></div>`;
    } else if (q.t === "mc") {
        q.order = shuffle(q.o.map((txt, i) => ({ txt, ok: i === q.a })));
        body += q.order.map((o, i) => `<button class="opt" onclick="pick(${i})"><b>${"ABCD"[i]}.</b> ${o.txt}</button>`).join("");
    } else {
        body += `<div class="center"><button class="btn" id="sub" onclick="submitFill()" disabled>Submit</button></div>`;
    }
    const screen = document.getElementById("screen");
    if (screen) screen.innerHTML = hud(redeem) + `<div class="panel ${redeem ? 'redeem' : ''}">${body}<div id="fb" aria-live="polite"></div></div>`;
    if (q.t === "circuit") drawCircuit();
}

// resolve answer outcome and rotate on failure
function resolve(ok) {
    const q = S.cur, fb = document.getElementById("fb");
    if (ok) {
        S.correct++;
        if (window.AudioManager) { try { window.AudioManager.playSFX("correct"); } catch (e) {} }
        if (fb) fb.innerHTML = `<div class="fb good"><b>Traffic clears!</b> ${q.why}</div><div class="center" style="margin-top:12px"><button class="btn" onclick="advance()">Step on the gas →</button></div>`;
        return;
    }
    S.mistakes++;
    if (window.AudioManager) { try { window.AudioManager.playSFX("collision"); } catch (e) {} }
    if (S.redeem) {
        if (fb) fb.innerHTML = `<div class="fb bad"><b>Redemption failed.</b> ${q.why}</div><div class="center" style="margin-top:12px"><button class="btn" onclick="showGameOver()">Continue</button></div>`;
        return;
    }
    S.lives--;
    if (S.lives <= 0) {
        if (fb) fb.innerHTML = `<div class="fb bad"><b>Out of lives!</b> ${q.why}</div><div class="center" style="margin-top:12px"><button class="btn" onclick="afterZero()">Continue</button></div>`;
    } else {
        const pool = [0, 1, 2].filter(i => !S.attemptedInLane.includes(i));
        const nextQ = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : [0, 1, 2].find(i => i !== S.qi);
        S.qi = nextQ;
        S.attemptedInLane.push(nextQ);
        if (fb) fb.innerHTML = `<div class="fb bad"><b>Gate collision! -1 life</b> ${q.why}</div><div class="center" style="margin-top:12px"><button class="btn" onclick="showQuestion()">Try another gate →</button></div>`;
    }
}

// advance lane after clearing challenge
function advance() {
    if (S.redeem) { S.lives = 1; S.redeem = false; showQuestion(); return; }
    const clearedLane = S.lane + 1;
    S.lane++;
    if (S.lane >= LANES.length) { showWin(); return; }
    const nextQ = Math.floor(Math.random() * 3);
    S.qi = nextQ;
    S.attemptedInLane = [nextQ];
    const screen = document.getElementById("screen");
    if (screen) screen.innerHTML = hud() + `<div class="panel center"><div class="big">🛣️</div><h2>Lane ${clearedLane} cleared!</h2><p>Merging into <b>${LANES[S.lane].name}</b>...</p><button class="btn" onclick="showQuestion()">Merge →</button></div>`;
}

// handle redemption round when lives hit zero
function afterZero() {
    if (S.usedRedemption) { showGameOver(); return; }
    S.usedRedemption = true;
    const screen = document.getElementById("screen");
    if (screen) screen.innerHTML = hud(true) + `<div class="panel redeem center"><div class="big">🆘</div><h2>Out of lives!</h2><p>You get one shot at redemption to earn back a life.</p><button class="btn" onclick="showQuestion(true)">Take Redemption question</button></div>`;
}

// victory screen with lsu tiger
function showWin() {
    S.lane = LANES.length - 1;
    const screen = document.getElementById("screen");
    if (!screen) return;
    screen.innerHTML = `<div class="panel center"><div class="big">🐯</div><h2>You made it!</h2><p style="font-size:1.15rem;font-weight:bold;color:var(--good)">Congratulations you survived Baton Rouge traffic and made it to LSU</p><p>Correct gates: ${S.correct} · Collisions: ${S.mistakes}${S.usedRedemption ? " · Redemption used" : ""}</p><button class="btn" onclick="showStart()">Drive again</button></div>`;
}

// gridlock game over screen
function showGameOver() {
    const screen = document.getElementById("screen");
    if (!screen) return;
    screen.innerHTML = `<div class="panel center"><div class="big">🚨</div><h2>Gridlock!</h2><p>You ran out of lives in <b>${LANES[Math.min(S.lane, LANES.length - 1)].name}</b>.</p><p>Correct: ${S.correct} · Mistakes: ${S.mistakes}</p><button class="btn" onclick="showStart()">Try again</button></div>`;
}

function showStart() {
    newGame();
    showQuestion();
}

window.showQuestion = showQuestion;
window.startGame = showStart;
