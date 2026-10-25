// Source of this case study's hero: a Hairline figure (https://hairline.lucasmarkes.com, MIT, by Lucas Marques),
// built with its /hairline-create skill and rendered at rest in MotifSpec's light colours. Not published with the site.
/**
 * Funnel: a report lying on a board, the way an analytics funnel reads. At
 * the back, three bars stand in steps, each shorter than the last, and a
 * dashed outline above each later bar reaches up to the one before it: the
 * people who dropped out. At the front, a table of the same three steps, each
 * row numbered in dots and carrying a flat bar of its size. A step is its bar
 * and its row: the one under the pointer lifts off the board, the others less,
 * staggered outwards. At rest the last step is bright. The slider is the lift.
 *
 * The pattern: discrete items at different heights. Tweens, a stagger by
 * distance, and a hit test that never reads the pose on screen: over the
 * chart, each bar's resting outline, nearest bar first; over the table, the
 * board's top plane, read by row.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, proj, prism, rings, ringAt, rrect, seg, unproj,
  tset, tval, tdone, tween, disposer, mk, place, pointer, put, register, solid,
} = HL;

// The board, in world units: x runs across the steps, left to right on screen; y from the chart at the back to the table at the front.
const BX0 = -8, BX1 = 116, BY0 = -50, BY1 = 50, BT = 4, BR = 8;
// Three steps: the share of the first step's people that reached each.
const STEPS = [{ share: 1, name: "views" }, { share: 0.52, name: "apply" }, { share: 0.2, name: "enrol" }];
const H = 64, BW = 24, GAP = 7, CX0 = 4, CX1 = 30;
const ROW0 = 50, ROWH = 18, PILL = 62, STAG = 45, LIFT_FAR = 0.3;

const colY = (i) => -((STEPS.length * BW + (STEPS.length - 1) * GAP) / 2) + i * (BW + GAP);
const rowX = (i) => ROW0 + 8 + i * ROWH;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;

  const C = Cam(45, 0.5, 1.72);
  fit(C, [[BY0, BX0, 0], [BY1, BX1, 0], [BY1, BX0, 0], [BY0, BX1, 0], [colY(0), CX0, BT + H + 22], [colY(2) + BW, CX1, BT + H + 22]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the board: one thin plate, its thickness a second line
  const [bring, binner] = rings(BY0, BX0, BY1, BX1, BR, 2);
  put(solid(g), prism(P, front, bring, binner, 0, BT));
  // the table's rules, drawn on the board: a header line, then a rule under each row
  const rules = mk("path", { class: "nf lo" }, g);
  const ry0 = BY0 + 8, ry1 = BY1 - 8;
  rules.setAttribute("d", [ROW0, ...STEPS.map((_, i) => rowX(i) + ROWH - 8)].map((x) => seg(P(ry0, x, BT), P(ry1, x, BT))).join(""));

  const steps = STEPS.map((s, i) => {
    const h = H * s.share, y0 = colY(i), y1 = y0 + BW;
    const [ring, inner] = rings(y0, CX0, y1, CX1, 3, 1.2);
    // the drop-off: a dashed outline from this bar's top to the last bar's, painted before the bar
    const ghost = i > 0 ? mk("path", { class: "dash nf" }, g) : null;
    const bar = solid(g);
    // the row: dots for the step's number, and a flat bar of its size
    const rowG = mk("g", {}, g);
    const pill = mk("path", { class: "nf" }, rowG);
    const dots = STEPS.map((_, k) => (k <= i ? mk("circle", { r: 1.5, class: "dot m" }, rowG) : null)).filter(Boolean);
    return { i, h, y0, y1, ring, inner, ghost, bar, pill, dots, z: tween(0), drawn: NaN };
  });

  function draw(st, dz) {
    if (dz === st.drawn) return;
    st.drawn = dz;
    const z0 = BT + dz;
    put(st.bar, prism(P, front, st.ring, st.inner, z0, z0 + st.h));
    if (st.ghost) {
      const prev = steps[st.i - 1].h, top = rrect(st.y0, CX0, st.y1, CX1, 3, 4);
      const a = ringAt(P, top, z0 + st.h), b = ringAt(P, top, z0 + prev);
      const L = a.reduce((m, p, k) => (p[0] < a[m][0] ? k : m), 0), R = a.reduce((m, p, k) => (p[0] > a[m][0] ? k : m), 0);
      st.ghost.setAttribute("d", poly(b) + seg(a[L], b[L]) + seg(a[R], b[R]));
    }
    const x = rowX(st.i), len = PILL * STEPS[st.i].share;
    st.pill.setAttribute("d", poly(ringAt(P, rrect(BY0 + 26, x, BY0 + 26 + len, x + 7, 2.5, 4), z0 + 0.4)));
    st.dots.forEach((el, k) => place(el, P(BY0 + 10 + k * 4.5, x + 3.5, z0 + 0.4)));
  }

  /** Step st bright or not: its bar, its row's bar and its row's dots, one thing. */
  function bright(st, on) {
    st.bar.sil.classList.toggle("hi", on);
    st.pill.classList.toggle("hi", on);
    st.dots.forEach((el) => el.classList.toggle("m", !on));
  }
  const REST = STEPS.length - 1;
  steps.forEach((st) => bright(st, st.i === REST));

  const B = register(stage, (_dt, now) => {
    let moving = false;
    steps.forEach((st) => { draw(st, tval(st.z, now)); if (!tdone(st.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  /** Whether a screen point is inside a convex polygon of screen points. */
  const inside = (pt, poly) => poly.every((a, k) => {
    const b = poly[(k + 1) % poly.length];
    return (b[0] - a[0]) * (pt[1] - a[1]) - (b[1] - a[1]) * (pt[0] - a[0]) >= 0;
  });
  // each bar's outline at rest, from the board to the top of its drop-off: fixed, so a lifting bar can't move it
  const outlines = steps.map((st) => {
    const top = st.i > 0 ? steps[st.i - 1].h : st.h, pts = hull(ringAt(P, st.ring, BT).concat(ringAt(P, st.ring, BT + top)));
    return inside(pts.reduce((m, p) => [m[0] + p[0] / pts.length, m[1] + p[1] / pts.length], [0, 0]), pts) ? pts : pts.slice().reverse();
  });

  /** The step under the point: a bar's resting outline, the nearest bar first, or else a row of the table. */
  function hit(pt) {
    for (let i = STEPS.length - 1; i >= 0; i--) if (inside(pt, outlines[i])) return i;
    const [u, v] = unproj(C, pt[0], pt[1], BT);
    if (u < BY0 || u > BY1 || v < ROW0 || v > BX1) return -1;
    return clamp(Math.floor((v - ROW0) / ROWH), 0, STEPS.length - 1);
  }

  let act = -1;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    steps.forEach((st) => {
      const n = Math.abs(st.i - from);
      tset(st.z, a < 0 ? 0 : st.i === a ? lift : clamp((lift * LIFT_FAR) / n, 0, lift), now, n * STAG);
      bright(st, a < 0 ? st.i === REST : st.i === a);
    });
    read.textContent = a < 0 ? "rest" : STEPS[a].name;
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
  name: "funnel",
  means: "A funnel report on a board: three bars step down above a table of the same steps; the step under the pointer lifts.",
  rules: [1, 2, 4, 10],
  range: [6, 12, 20],
  tour: [[160, 120], [200, 150], [250, 220], null],
  mount,
});
