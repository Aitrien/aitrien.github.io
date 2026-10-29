/**
 * Mould: a block with a card-shaped hollow, a fresh cast lifting out of it,
 * and four casts laid in an arc in front, each with the same thumbnail window,
 * title rule and three tag pips as the hollow they came from. The cast under
 * the pointer lifts, and the others lift less, staggered outwards from it.
 * Over the mould, its own cast lifts. At rest the fresh cast is bright: where
 * every copy starts. The slider is the lift.
 *
 * The pattern: discrete items at different heights. Tweens, a stagger by
 * distance, and a hit test on each part's own resting top, so a cast rising
 * from under the pointer cannot change the choice.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, proj, prism, rings, ringAt, rrect, run, seg, unproj,
  tset, tval, tdone, tween, disposer, mk, place, pointer, put, register, solid,
} = HL;

// A cast, in world units: CW along x, CD along y, CT thick.
const CW = 44, CD = 28, CT = 3.6, CR = 3.2, CB = 1.1;
// The mould: its hollow fits a cast with GAP to spare; MARGIN of block round the hollow; MH tall; the hollow DEEP.
const GAP = 1.4, MARGIN = 10, MH = 12, DEEP = CT + 0.8, MR = 6;
const FLOOR = MH - DEEP;
const REST_LIFT = 10, LIFT_FAR = 0.3, STAG = 45;

// Where the four casts lie, in an arc in front of the mould: [x, y] centres. `o` places each along the arc for the
// stagger; the mould sits in the middle of it.
const S2 = Math.SQRT1_2;
const ARC = [-1.5, -0.5, 0.5, 1.5].map((a) => {
  const along = a * 54, toward = 98 - a * a * 20;
  return [S2 * (along + toward), S2 * (toward - along)];
});
const PARTS = [
  { name: "spec", cx: 0, cy: 0, o: 1.5, mould: true },
  ...["hugo", "npm", "mcp", "showcase"].map((name, k) => ({ name, cx: ARC[k][0], cy: ARC[k][1], o: k })),
];

/** A run of points ordered left to right on screen. */
const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());

/** The marks a cast carries on its top, at (cx, cy, z): a thumbnail window, a title rule and three tag pips. */
function marks(P, cx, cy, z) {
  const x0 = cx - CW / 2, y0 = cy - CD / 2;
  const win = rrect(x0 + 4, y0 + 4, x0 + 17, y0 + CD - 4, 2, 4);
  return {
    win: poly(ringAt(P, win, z)),
    rule: seg(P(x0 + 21, y0 + 7, z), P(x0 + CW - 5, y0 + 7, z)) + seg(P(x0 + 21, y0 + 12, z), P(x0 + CW - 12, y0 + 12, z)),
    pips: [0, 1, 2].map((k) => P(x0 + 23 + k * 6, y0 + CD - 7, z)),
  };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  // Fitted with every cast lifted as far as the slider allows, so nothing leaves the frame.
  const C = Cam(45, 0.5, 1.72);
  const ext = [];
  for (const p of PARTS) {
    const hw = p.mould ? CW / 2 + GAP + MARGIN : CW / 2, hd = p.mould ? CD / 2 + GAP + MARGIN : CD / 2;
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) ext.push([p.cx + sx * hw, p.cy + sy * hd, 0], [p.cx + sx * hw, p.cy + sy * hd, (p.mould ? FLOOR : 0) + CT + 24]);
  }
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);

  // The mould, which never moves. Its far half goes before its cast, its near half after, so the hollow holds it.
  const hx = CW / 2 + GAP, hy = CD / 2 + GAP, ox = hx + MARGIN, oy = hy + MARGIN;
  const outer = rrect(-ox, -oy, ox, oy, MR, 6), inner = rrect(-hx, -hy, hx, hy, CR + GAP * 0.6, 5);
  const mouldFar = mk("g", {}, g);
  mk("path", { d: poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, MH)))), class: "sil" }, mouldFar);
  mk("path", { d: poly(ringAt(P, inner, MH)), class: "nf" }, mouldFar);
  mk("path", { d: open(ringAt(P, run(inner, (q) => !front(q)), FLOOR)), class: "nf lo" }, mouldFar);
  // the hollow's floor carries the thumbnail window the casts take from it
  const fm = marks(P, 0, 0, FLOOR);
  mk("path", { d: fm.win, class: "nf lo" }, mouldFar);

  const casts = PARTS.map((p, i) => {
    const grp = mk("g", {}, g);
    const s = solid(grp);
    const win = mk("path", { class: "nf" }, grp), rule = mk("path", { class: "nf lo" }, grp);
    const pips = [0, 1, 2].map(() => mk("circle", { r: 1.5, class: "dot m" }, grp));
    const [ring, crease] = rings(p.cx - CW / 2, p.cy - CD / 2, p.cx + CW / 2, p.cy + CD / 2, CR, CB);
    return { p, i, s, win, rule, pips, ring, crease, base: p.mould ? FLOOR : 0, z: tween(p.mould ? REST_LIFT : 0), drawn: NaN };
  });

  // The mould's near half, painted over its cast: one opaque piece from the hollow's front rim down to the block's foot.
  const iF = LR(ringAt(P, run(inner, front), MH)), oT = LR(ringAt(P, run(outer, front), MH)), oB = LR(ringAt(P, run(outer, front), 0));
  const mouldNear = mk("g", {}, g);
  mk("path", { d: poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]), class: "fo" }, mouldNear);
  mk("path", { d: open(oT), class: "nf lo" }, mouldNear);
  mk("path", { d: open(iF), class: "nf" }, mouldNear);
  mk("path", { d: open([oT[0], ...oB, oT[oT.length - 1]]), class: "nf sil" }, mouldNear);
  // the mould's cast, and the block in front of it, come before the casts in the arc
  mouldFar.after(casts[0].s.g.parentNode);
  casts[0].s.g.parentNode.after(mouldNear);
  // the arc back to front: the ends of the arc lie farther than its middle
  casts.slice(1).sort((a, b) => a.p.cx + a.p.cy - (b.p.cx + b.p.cy)).forEach((c) => g.append(c.s.g.parentNode));

  function draw(c, dz) {
    if (dz === c.drawn) return;
    c.drawn = dz;
    const z0 = c.base + dz;
    put(c.s, prism(P, front, c.ring, c.crease, z0, z0 + CT));
    const m = marks(P, c.p.cx, c.p.cy, z0 + CT);
    c.win.setAttribute("d", m.win);
    c.rule.setAttribute("d", m.rule);
    c.pips.forEach((el, k) => place(el, m.pips[k]));
  }

  /** A cast bright or not: its silhouette and its pips, one thing. */
  function bright(c, on) {
    c.s.sil.classList.toggle("hi", on);
    c.pips.forEach((el) => el.classList.toggle("m", !on));
  }

  casts.forEach((c) => bright(c, c.i === 0));

  const B = register(stage, (_dt, now) => {
    let moving = false;
    casts.forEach((c) => { draw(c, tval(c.z, now)); if (!tdone(c.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  /** The part whose resting top holds the point: each is tested on its own plane, and the nearest centre wins. */
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    PARTS.forEach((p, i) => {
      const z = p.mould ? MH : CT;
      const hw = p.mould ? ox : CW / 2, hd = p.mould ? oy : CD / 2;
      const [x, y] = unproj(C, sx, sy, z);
      const dd = Math.max(Math.abs(x - p.cx) / (hw + 3), Math.abs(y - p.cy) / (hd + 3));
      if (dd <= 1 && dd < bd) { bd = dd; best = i; }
    });
    return best;
  }

  let act = -1;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    casts.forEach((c) => {
      const n = Math.abs(c.p.o - PARTS[from].o);
      const target = a < 0 ? (c.i === 0 ? REST_LIFT : 0) : c.i === a ? lift : clamp((lift * LIFT_FAR) / Math.max(n, 1), 0, lift);
      tset(c.z, target, now, n * STAG);
      bright(c, a < 0 ? c.i === 0 : c.i === a);
    });
    read.textContent = a < 0 ? "rest" : PARTS[a].name;
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { lift = v; if (act >= 0) { const a = act; act = -1; setActive(a); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "mould",
  means: "One mould and the casts taken from it, each with the same window, rule and pips: the one under the pointer lifts, the others less.",
  rules: [1, 2, 4, 5],
  range: [10, 16, 24],
  tour: [[200, 95], [120, 200], [280, 200], null],
  mount,
});
