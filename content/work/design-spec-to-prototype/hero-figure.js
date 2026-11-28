/**
 * Jig: a plate with three recesses cut to the shapes of a card, a button and
 * a field, and the loose parts lying askew in front of it. The pointer picks
 * a recess, or its part, and the part lifts, turns square and drops in flush;
 * the others go back out, staggered outwards from it. At rest the card hangs
 * square over its recess, about to drop in, and is bright. The slider is how
 * askew the loose parts lie.
 *
 * The pattern: discrete items that change depth order. Tweens, a stagger by
 * distance, and a hit test on each recess and each part's resting footprint.
 */
const {
  Cam, clamp, facing, fit, lerp, open, poly, proj, prism, rad, rings, ringAt, rrect, run, seg, unproj,
  tset, tval, tdone, tween, disposer, mk, place, pointer, put, register, solid,
} = HL;

const JW = 60, JD = 42, JH = 10, JR = 7, PT = 3.4, GAP = 1.2, FLY = JH + 6, STAG = 50;
// The card's progress at rest: squared up over its recess, its foot 4 above the jig's top.
const REST = 0.8 + (0.2 * (FLY - (JH + 4))) / (FLY - (JH - PT));
// Each part: its size and radius, its recess on the jig, where it lies loose, and which way it turns.
const PARTS = [
  { name: "card", w: 40, d: 30, r: 3, sx: -30, sy: -10, lx: -2, ly: 80, turn: -1, o: 0,
    marks: [["r", -16, -11, -2, 11, 2], ["s", 2, -7, 16, -7], ["s", 2, -2, 12, -2], ["s", 2, 3, 14, 3]] },
  { name: "button", w: 34, d: 12, r: 6, sx: 25, sy: -22, lx: 72, ly: 70, turn: 0.8, o: 1,
    marks: [["s", -8, 0, 8, 0]] },
  { name: "field", w: 56, d: 12, r: 1.2, sx: 14, sy: 20, lx: 94, ly: 8, turn: -1.2, o: 2,
    marks: [["s", -22, 0, -8, 0], ["s", -4, -3, -4, 3]] },
];

/** A ring of samples turned th degrees about the origin and moved to (cx, cy): normals turn with it. */
function turn(ring, cx, cy, th) {
  const c = Math.cos(rad(th)), s = Math.sin(rad(th));
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
}

/** Where a part is at progress t (0 loose, 1 set): it rises, travels and turns square, then drops in. */
function pose(p, t, askew) {
  const u = clamp((t - 0.1) / 0.7, 0, 1), e = u * u * (3 - 2 * u);
  const z = t < 0.8 ? lerp(0, FLY, clamp(t / 0.25, 0, 1)) : lerp(FLY, JH - PT, (t - 0.8) / 0.2);
  return { x: lerp(p.lx, p.sx, e), y: lerp(p.ly, p.sy, e), th: lerp(p.turn * askew, 0, e), z };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let askew = value;

  const C = Cam(45, 0.5, 1.72);
  const ext = [[-JW, -JD, 0], [JW, JD, 0], [-JW, JD, 0], [JW, -JD, FLY + PT]];
  for (const p of PARTS) for (const k of [-1, 1]) ext.push([p.lx + k * p.w * 0.55, p.ly + k * p.w * 0.3, 0], [p.lx + k * p.w * 0.55, p.ly - k * p.w * 0.3, 0]);
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const at = (p, q, u, v, z) => { const c = Math.cos(rad(q.th)), s = Math.sin(rad(q.th)); return P(q.x + u * c - v * s, q.y + u * s + v * c, z); };

  const g = mk("g", {}, svg);
  // The jig: its body, then each recess's rim and the floor line along its far walls, and two locating pins.
  const outer = rrect(-JW, -JD, JW, JD, JR, 6), top = rrect(-JW + 1.8, -JD + 1.8, JW - 1.8, JD - 1.8, JR - 1.8, 6);
  const jig = mk("g", {}, g);
  put(solid(jig), prism(P, front, outer, top, 0, JH));
  for (const [x, y] of [[-JW + 7, -JD + 7], [JW - 7, JD - 7]]) place(mk("circle", { r: 1.6, class: "dot off" }, jig), P(x, y, JH));

  const loose = mk("g", {}, g);
  const parts = PARTS.map((p, i) => {
    const slot = rrect(p.sx - p.w / 2 - GAP, p.sy - p.d / 2 - GAP, p.sx + p.w / 2 + GAP, p.sy + p.d / 2 + GAP, p.r + GAP * 0.6, 5);
    mk("path", { d: poly(ringAt(P, slot, JH)), class: "nf" }, jig);
    // the floor's far edge, trimmed at both ends, where it would show past the rim
    mk("path", { d: open(ringAt(P, run(slot, (q) => !front(q)), JH - PT).slice(2, -2)), class: "nf lo" }, jig);
    const [ring, inner] = rings(-p.w / 2, -p.d / 2, p.w / 2, p.d / 2, p.r, 1.1);
    const grp = mk("g", {}, g);
    const s = solid(grp);
    const r = mk("path", { class: "nf" }, grp), sg = mk("path", { class: "nf lo" }, grp);
    return { p, i, slot, ring, inner, grp, s, r, sg, t: tween(i === 0 ? REST : 0), drawn: NaN, set: null };
  });
  // Each recess's near wall, painted over its part once the part is down in it: the part's sides are hidden, its top flush.
  parts.slice().sort((a, b) => a.p.sx + a.p.sy - (b.p.sx + b.p.sy)).forEach((pt) => {
    const rim = ringAt(P, run(pt.slot, front), JH), foot = ringAt(P, run(pt.slot, front), JH - PT);
    pt.wall = mk("g", {}, g);
    mk("path", { d: poly(rim.concat(foot.reverse())), class: "fo" }, pt.wall);
    mk("path", { d: open(rim), class: "nf" }, pt.wall);
  });
  g.append(loose);

  function draw(pt, t) {
    if (t === pt.drawn) return;
    pt.drawn = t;
    const q = pose(pt.p, t, askew);
    put(pt.s, prism(P, front, turn(pt.ring, q.x, q.y, q.th), turn(pt.inner, q.x, q.y, q.th), q.z, q.z + PT));
    let r = "", s = "";
    for (const m of pt.p.marks) {
      if (m[0] === "r") r += poly(turn(rrect(m[1], m[2], m[3], m[4], m[5], 4), q.x, q.y, q.th).map((o) => P(o.u, o.v, q.z + PT)));
      else s += seg(at(pt.p, q, m[1], m[2], q.z + PT), at(pt.p, q, m[3], m[4], q.z + PT));
    }
    pt.r.setAttribute("d", r);
    pt.sg.setAttribute("d", s);
    // Down in its recess, the part goes under the recess's near wall; anywhere else, over the whole jig.
    const down = q.z < JH;
    if (down !== pt.set) { pt.set = down; if (down) pt.wall.before(pt.grp); else loose.append(pt.grp); }
  }
  const bright = (pt, on) => pt.s.sil.classList.toggle("hi", on);
  parts.forEach((pt) => bright(pt, pt.i === 0));
  // loose parts back to front
  parts.slice().sort((a, b) => a.p.lx + a.p.ly - (b.p.lx + b.p.ly)).forEach((pt) => loose.append(pt.grp));

  const L = register(stage, (_dt, now) => {
    let moving = false;
    parts.forEach((pt) => { draw(pt, tval(pt.t, now)); if (!tdone(pt.t, now)) moving = true; });
    return moving;
  });
  bag.add(L.unregister);

  /** The part whose recess, or whose loose footprint, holds the point. Both are where the part rests, never where it is. */
  function hit([sx, sy]) {
    const [jx, jy] = unproj(C, sx, sy, JH), [gx, gy] = unproj(C, sx, sy, PT);
    for (const { p } of parts) {
      if (Math.abs(jx - p.sx) <= p.w / 2 + 3 && Math.abs(jy - p.sy) <= p.d / 2 + 3) return p.o;
      const c = Math.cos(rad(-p.turn * askew)), s = Math.sin(rad(-p.turn * askew)), dx = gx - p.lx, dy = gy - p.ly;
      if (Math.abs(dx * c - dy * s) <= p.w / 2 + 3 && Math.abs(dx * s + dy * c) <= p.d / 2 + 3) return p.o;
    }
    return -1;
  }

  let act = -1;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    parts.forEach((pt) => {
      tset(pt.t, a < 0 ? (pt.i === 0 ? REST : 0) : pt.i === a ? 1 : 0, now, Math.abs(pt.p.o - PARTS[from].o) * STAG);
      bright(pt, a < 0 ? pt.i === 0 : pt.i === a);
    });
    read.textContent = a < 0 ? "rest" : PARTS[a].name;
    L.wake();
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { askew = v; parts.forEach((pt) => { pt.drawn = NaN; }); L.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "jig",
  means: "A jig cut to the shapes of a card, a button and a field: the part under the pointer turns square and drops in flush.",
  rules: [1, 2, 5, 6],
  range: [6, 14, 24],
  tour: [[192, 228], [182, 153], [165, 108], null],
  mount,
});
