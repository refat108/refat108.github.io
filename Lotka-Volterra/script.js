const defaults = {
  rx: 1.2,
  ry: 1.0,
  kx: 100,
  ky: 120,
  alpha: 0.6,
  beta: 0.5,
  gamma: 0.02,
  delta: 0.015,
  zeta: 0.4,
  eta: 0.35,
  hx: 0.05,
  hy: 0.04,
  hz: 0.02,
  x0: 20,
  y0: 30,
  z0: 10,
  tMax: 200
};

const parameterGroups = [
  {
    title: "Walleye Pollock Parameters",
    sliders: [
      ["rx", "r<sub>x</sub>", "Intrinsic growth rate of walleye pollock", "year<sup>-1</sup>", 0.05, 3.0, 0.01],
      ["kx", "k<sub>x</sub>", "Carrying capacity of walleye pollock", "metric tons", 10, 300, 1],
      ["hx", "h<sub>x</sub>", "Harvesting rate of walleye pollock", "year<sup>-1</sup>", 0, 0.5, 0.001],
      ["x0", "initial x", "Initial biomass of walleye pollock", "metric tons", 0.1, 150, 0.1]
    ]
  },
  {
    title: "Atka mackerel Parameters",
    sliders: [
      ["ry", "r<sub>y</sub>", "Intrinsic growth rate of Atka mackerel", "year<sup>-1</sup>", 0.05, 3.0, 0.01],
      ["ky", "k<sub>y</sub>", "Carrying capacity of Atka mackerel", "metric tons", 10, 300, 1],
      ["hy", "h<sub>y</sub>", "Harvesting rate of Atka mackerel", "year<sup>-1</sup>", 0, 0.5, 0.001],
      ["y0", "initial y", "Initial biomass of Atka mackerel", "metric tons", 0.1, 150, 0.1]
    ]
  },
  {
    title: "Steller Sea Lion Parameters",
    sliders: [
      ["hz", "h<sub>z</sub>", "Harvesting rate of Steller sea lions", "year<sup>-1</sup>", 0, 0.5, 0.001],
      ["z0", "initial z", "Initial biomass of Steller sea lions", "metric tons", 0.1, 100, 0.1]
    ]
  },
  {
    title: "Interaction and Conversion Parameters",
    sliders: [
      ["alpha", "&alpha;", "Effect of Atka mackerel competition on pollock", "dimensionless", 0, 3, 0.01],
      ["beta", "&beta;", "Effect of pollock competition on Atka mackerel", "dimensionless", 0, 3, 0.01],
      ["gamma", "&gamma;", "Predation rate of sea lions on pollock", "tonne<sup>-1</sup> year<sup>-1</sup>", 0.001, 0.1, 0.001],
      ["delta", "&delta;", "Predation rate of sea lions on Atka mackerel", "tonne<sup>-1</sup> year<sup>-1</sup>", 0.001, 0.1, 0.001],
      ["zeta", "&zeta;", "Conversion efficiency from pollock consumption to sea lion growth", "dimensionless", 0, 2, 0.01],
      ["eta", "&eta;", "Conversion efficiency from Atka mackerel consumption to sea lion growth", "dimensionless", 0, 2, 0.01]
    ]
  },
  {
    title: "Simulation Settings",
    sliders: [
      ["tMax", "time max", "Length of the simulated time interval", "years", 20, 500, 1]
    ]
  }
];
let params = { ...defaults };
let updateTimer = null;

function createSliders() {
  const grid = document.getElementById("sliderGrid");
  grid.innerHTML = "";

  for (const group of parameterGroups) {
    const groupEl = document.createElement("div");
    groupEl.className = "parameter-group";

    const heading = document.createElement("h3");
    heading.textContent = group.title;
    groupEl.appendChild(heading);

    const groupGrid = document.createElement("div");
    groupGrid.className = "parameter-group-grid";

    for (const [key, label, description, unit, min, max, step] of group.sliders) {
      const card = document.createElement("div");
      card.className = "slider-card";

      const labelEl = document.createElement("label");
      labelEl.innerHTML = `<span>${label}</span><span class="value" id="${key}Value">${params[key]}</span>`;

      const descriptionEl = document.createElement("p");
      descriptionEl.className = "slider-description";
      descriptionEl.textContent = description;

      const unitEl = document.createElement("p");
      unitEl.className = "slider-unit";
      unitEl.innerHTML = `<span>Unit:</span> ${unit}`;

      const input = document.createElement("input");
      input.type = "range";
      input.min = min;
      input.max = max;
      input.step = step;
      input.value = params[key];
      input.id = key;

      input.addEventListener("input", () => {
        params[key] = Number(input.value);
        document.getElementById(`${key}Value`).textContent = formatNumber(params[key]);
        scheduleUpdate();
      });

      card.appendChild(labelEl);
      card.appendChild(descriptionEl);
      card.appendChild(unitEl);
      card.appendChild(input);
      groupGrid.appendChild(card);
    }

    groupEl.appendChild(groupGrid);
    grid.appendChild(groupEl);
  }
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return "NaN";
  if (Math.abs(value) < 0.001 && value !== 0) return value.toExponential(2);
  return Number(value).toFixed(3).replace(/\.?0+$/, "");
}

function derivatives(state, p) {
  const [x, y, z] = state;

  const dx =
    p.rx * x * (1 - x / p.kx - p.alpha * y / p.kx) -
    p.gamma * x * z -
    p.hx * x;

  const dy =
    p.ry * y * (1 - y / p.ky - p.beta * x / p.ky) -
    p.delta * y * z -
    p.hy * y;

  const dz =
    -p.gamma * z +
    p.zeta * p.gamma * x * z +
    p.eta * p.delta * y * z -
    p.hz * z;

  return [dx, dy, dz];
}

function rk4Step(state, dt, p) {
  const k1 = derivatives(state, p);
  const k2 = derivatives(state.map((v, i) => v + 0.5 * dt * k1[i]), p);
  const k3 = derivatives(state.map((v, i) => v + 0.5 * dt * k2[i]), p);
  const k4 = derivatives(state.map((v, i) => v + dt * k3[i]), p);

  return state.map((v, i) => {
    const next = v + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
    return Math.max(0, next);
  });
}

function simulate(p) {
  const steps = 1200;
  const dt = p.tMax / steps;
  let state = [p.x0, p.y0, p.z0];

  const t = [];
  const x = [];
  const y = [];
  const z = [];

  for (let i = 0; i <= steps; i++) {
    t.push(i * dt);
    x.push(state[0]);
    y.push(state[1]);
    z.push(state[2]);
    state = rk4Step(state, dt, p);
  }

  return { t, x, y, z };
}

function makeGrid(min, max, n) {
  const values = [];
  const step = (max - min) / (n - 1);
  for (let i = 0; i < n; i++) values.push(min + i * step);
  return values;
}

function buildIsoclines(p) {
  const n = 55;
  const xMax = Math.max(150, p.kx * 1.4);
  const yMax = Math.max(150, p.ky * 1.4);
  const zMax = 100;

  const xs = makeGrid(0.1, xMax, n);
  const ys = makeGrid(0.1, yMax, n);
  const zs = makeGrid(0.1, zMax, n);

  const X = [];
  const Y = [];
  const Zx = [];
  const Zy = [];

  for (let j = 0; j < n; j++) {
    const rowX = [];
    const rowY = [];
    const rowZx = [];
    const rowZy = [];

    for (let i = 0; i < n; i++) {
      const x = xs[i];
      const y = ys[j];

      const zx =
        (p.rx * (1 - x / p.kx - p.alpha * y / p.kx) - p.hx) / p.gamma;

      const zy =
        (p.ry * (1 - y / p.ky - p.beta * x / p.ky) - p.hy) / p.delta;

      rowX.push(x);
      rowY.push(y);
      rowZx.push(zx >= 0 && zx <= zMax ? zx : null);
      rowZy.push(zy >= 0 && zy <= zMax ? zy : null);
    }

    X.push(rowX);
    Y.push(rowY);
    Zx.push(rowZx);
    Zy.push(rowZy);
  }

  const Xz = [];
  const Yz = [];
  const Zz = [];

  for (let j = 0; j < n; j++) {
    const rowX = [];
    const rowY = [];
    const rowZ = [];

    for (let i = 0; i < n; i++) {
      const x = xs[i];
      const z = zs[j];

      let y =
        (p.gamma + p.hz - p.zeta * p.gamma * x) /
        (p.eta * p.delta);

      rowX.push(x);
      rowY.push(y >= 0 && y <= yMax ? y : null);
      rowZ.push(z);
    }

    Xz.push(rowX);
    Yz.push(rowY);
    Zz.push(rowZ);
  }

  return { X, Y, Zx, Zy, Xz, Yz, Zz, xMax, yMax, zMax };
}

function plotTimeSeries(sol) {
  const traces = [
    { x: sol.t, y: sol.x, mode: "lines", name: "x(t) - walleye pollock" },
    { x: sol.t, y: sol.y, mode: "lines", name: "y(t) - Atka mackerel" },
    { x: sol.t, y: sol.z, mode: "lines", name: "z(t) - Steller sea lion" }
  ];

  Plotly.react("timePlot", traces, {
    margin: { l: 55, r: 20, t: 10, b: 95 },
    xaxis: { title: "Time" },
    yaxis: { title: "Population" },
    legend: {
      orientation: "h",
      x: 0,
      y: -0.28,
      xanchor: "left",
      yanchor: "top"
    }
  }, { responsive: true });
}

function plotPhase(sol, iso, equilibria) {
  const eqStable = equilibria.filter(eq => eq.stability === "Stable");
  const eqUnstable = equilibria.filter(eq => eq.stability !== "Stable");

  const traces = [
    {
      type: "surface",
      x: iso.X,
      y: iso.Y,
      z: iso.Zx,
      opacity: 0.42,
      showscale: false,
      name: "Pollock isocline (dx/dt = 0)",
      colorscale: [[0, "#1d4ed8"], [1, "#60a5fa"]],
      hovertemplate: "Pollock isocline<br>dx/dt = 0<br>x=%{x:.2f}<br>y=%{y:.2f}<br>z=%{z:.2f}<extra></extra>"
    },
    {
      type: "surface",
      x: iso.X,
      y: iso.Y,
      z: iso.Zy,
      opacity: 0.42,
      showscale: false,
      name: "Atka mackerel isocline (dy/dt = 0)",
      colorscale: [[0, "#047857"], [1, "#6ee7b7"]],
      hovertemplate: "Atka mackerel isocline<br>dy/dt = 0<br>x=%{x:.2f}<br>y=%{y:.2f}<br>z=%{z:.2f}<extra></extra>"
    },
    {
      type: "surface",
      x: iso.Xz,
      y: iso.Yz,
      z: iso.Zz,
      opacity: 0.42,
      showscale: false,
      name: "Sea lion isocline (dz/dt = 0)",
      colorscale: [[0, "#b45309"], [1, "#fbbf24"]],
      hovertemplate: "Steller sea lion isocline<br>dz/dt = 0<br>x=%{x:.2f}<br>y=%{y:.2f}<br>z=%{z:.2f}<extra></extra>"
    },
    {
      type: "scatter3d",
      x: sol.x,
      y: sol.y,
      z: sol.z,
      mode: "lines",
      name: "trajectory",
      line: { width: 6 }
    },
    {
      type: "scatter3d",
      x: [sol.x[0]],
      y: [sol.y[0]],
      z: [sol.z[0]],
      mode: "markers",
      name: "initial state",
      marker: { size: 6 }
    },
    {
      type: "scatter3d",
      x: [sol.x[sol.x.length - 1]],
      y: [sol.y[sol.y.length - 1]],
      z: [sol.z[sol.z.length - 1]],
      mode: "markers",
      name: "final state",
      marker: { size: 6 }
    }
  ];

  if (eqStable.length > 0) {
    traces.push({
      type: "scatter3d",
      x: eqStable.map(e => e.x),
      y: eqStable.map(e => e.y),
      z: eqStable.map(e => e.z),
      mode: "markers",
      name: "stable equilibria",
      marker: { size: 7, symbol: "diamond" }
    });
  }

  if (eqUnstable.length > 0) {
    traces.push({
      type: "scatter3d",
      x: eqUnstable.map(e => e.x),
      y: eqUnstable.map(e => e.y),
      z: eqUnstable.map(e => e.z),
      mode: "markers",
      name: "unstable / boundary equilibria",
      marker: { size: 7, symbol: "circle-open" }
    });
  }

  Plotly.react("phasePlot", traces, {
    margin: { l: 0, r: 0, t: 10, b: 0 },
    scene: {
      xaxis: { title: "x - Walleye pollock", range: [0, iso.xMax] },
      yaxis: { title: "y - Atka mackerel", range: [0, iso.yMax] },
      zaxis: { title: "z - Steller sea lion", range: [0, iso.zMax] },
      camera: { eye: { x: 1.7, y: 1.7, z: 1.1 } }
    },
    legend: { x: 0, y: 1 }
  }, { responsive: true });
}

function plotProjection(elementId, title, xData, yData, xLabel, yLabel, equilibria, eqXKey, eqYKey) {
  const eqStable = equilibria.filter(eq => eq.stability === "Stable");
  const eqUnstable = equilibria.filter(eq => eq.stability !== "Stable");

  const traces = [
    {
      x: xData,
      y: yData,
      mode: "lines",
      name: "trajectory",
      line: { color: "#2563eb", width: 3 }
    },
    {
      x: [xData[0]],
      y: [yData[0]],
      mode: "markers",
      name: "initial state",
      marker: { color: "#111827", size: 8 }
    },
    {
      x: [xData[xData.length - 1]],
      y: [yData[yData.length - 1]],
      mode: "markers",
      name: "final state",
      marker: { color: "#dc2626", size: 8 }
    }
  ];

  if (eqStable.length > 0) {
    traces.push({
      x: eqStable.map(eq => eq[eqXKey]),
      y: eqStable.map(eq => eq[eqYKey]),
      mode: "markers",
      name: "stable equilibria",
      marker: { color: "#047857", size: 9, symbol: "diamond" }
    });
  }

  if (eqUnstable.length > 0) {
    traces.push({
      x: eqUnstable.map(eq => eq[eqXKey]),
      y: eqUnstable.map(eq => eq[eqYKey]),
      mode: "markers",
      name: "unstable / boundary equilibria",
      marker: { color: "#b91c1c", size: 9, symbol: "circle-open" }
    });
  }

  Plotly.react(elementId, traces, {
    margin: { l: 55, r: 16, t: 28, b: 48 },
    title: { text: title, font: { size: 13 } },
    xaxis: { title: xLabel, zeroline: false },
    yaxis: { title: yLabel, zeroline: false },
    legend: { orientation: "h", x: 0, y: -0.28, xanchor: "left", yanchor: "top" }
  }, { responsive: true });
}

function plot2DProjections(sol, equilibria) {
  plotProjection(
    "xyPlot",
    "Pollock vs Atka mackerel",
    sol.x,
    sol.y,
    "x - Walleye pollock",
    "y - Atka mackerel",
    equilibria,
    "x",
    "y"
  );

  plotProjection(
    "yzPlot",
    "Atka mackerel vs Steller sea lion",
    sol.y,
    sol.z,
    "y - Atka mackerel",
    "z - Steller sea lion",
    equilibria,
    "y",
    "z"
  );

  plotProjection(
    "zxPlot",
    "Steller sea lion vs pollock",
    sol.z,
    sol.x,
    "z - Steller sea lion",
    "x - Walleye pollock",
    equilibria,
    "z",
    "x"
  );
}

function solveLinear(A, b) {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(M[row][col]) > Math.abs(M[pivot][col])) pivot = row;
    }

    if (Math.abs(M[pivot][col]) < 1e-10) return null;

    [M[col], M[pivot]] = [M[pivot], M[col]];

    const div = M[col][col];
    for (let j = col; j <= n; j++) M[col][j] /= div;

    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = M[row][col];
      for (let j = col; j <= n; j++) M[row][j] -= factor * M[col][j];
    }
  }

  return M.map(row => row[n]);
}

function jacobian(eq, p) {
  const { x, y, z } = eq;

  const A =
    p.rx * (1 - x / p.kx - p.alpha * y / p.kx) -
    p.gamma * z -
    p.hx;

  const B =
    p.ry * (1 - y / p.ky - p.beta * x / p.ky) -
    p.delta * z -
    p.hy;

  const C =
    -p.gamma +
    p.zeta * p.gamma * x +
    p.eta * p.delta * y -
    p.hz;

  return [
    [
      A + x * (-p.rx / p.kx),
      x * (-p.rx * p.alpha / p.kx),
      x * (-p.gamma)
    ],
    [
      y * (-p.ry * p.beta / p.ky),
      B + y * (-p.ry / p.ky),
      y * (-p.delta)
    ],
    [
      z * (p.zeta * p.gamma),
      z * (p.eta * p.delta),
      C
    ]
  ];
}

function det3(M) {
  return (
    M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) -
    M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) +
    M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0])
  );
}

function routhHurwitz(J) {
  const tr = J[0][0] + J[1][1] + J[2][2];

  const J2trace =
    J[0][0] * J[0][0] + J[1][1] * J[1][1] + J[2][2] * J[2][2] +
    2 * (J[0][1] * J[1][0] + J[0][2] * J[2][0] + J[1][2] * J[2][1]);

  const a1 = -tr;
  const a2 = 0.5 * (tr * tr - J2trace);
  const a3 = -det3(J);
  const margin = a1 * a2 - a3;

  const stable = a1 > 1e-8 && a2 > 1e-8 && a3 > 1e-8 && margin > 1e-8;

  return {
    a1,
    a2,
    a3,
    margin,
    stability: stable ? "Stable" : "Unstable"
  };
}

function residual(eq, p) {
  return derivatives([eq.x, eq.y, eq.z], p).map(Math.abs).reduce((a, b) => Math.max(a, b), 0);
}

function findEquilibria(p) {
  const equations = [
    {
      variable: "x",
      coeffs: [p.rx / p.kx, p.rx * p.alpha / p.kx, p.gamma],
      rhs: p.rx - p.hx
    },
    {
      variable: "y",
      coeffs: [p.ry * p.beta / p.ky, p.ry / p.ky, p.delta],
      rhs: p.ry - p.hy
    },
    {
      variable: "z",
      coeffs: [p.zeta * p.gamma, p.eta * p.delta, 0],
      rhs: p.gamma + p.hz
    }
  ];

  const found = [];

  for (let mask = 0; mask < 8; mask++) {
    const active = [];
    for (let i = 0; i < 3; i++) {
      if (mask & (1 << i)) active.push(i);
    }

    const unknowns = active;
    let candidate = [0, 0, 0];

    if (active.length === 0) {
      candidate = [0, 0, 0];
    } else {
      const A = [];
      const b = [];

      for (const eqIndex of active) {
        const row = unknowns.map(varIndex => equations[eqIndex].coeffs[varIndex]);
        A.push(row);
        b.push(equations[eqIndex].rhs);
      }

      const solution = solveLinear(A, b);
      if (!solution) continue;

      for (let i = 0; i < unknowns.length; i++) {
        candidate[unknowns[i]] = solution[i];
      }
    }

    if (candidate.some(v => !Number.isFinite(v) || v < -1e-6)) continue;

    const eq = {
      x: Math.max(0, candidate[0]),
      y: Math.max(0, candidate[1]),
      z: Math.max(0, candidate[2])
    };

    if (residual(eq, p) > 1e-5) continue;

    const duplicate = found.some(e =>
      Math.abs(e.x - eq.x) < 1e-5 &&
      Math.abs(e.y - eq.y) < 1e-5 &&
      Math.abs(e.z - eq.z) < 1e-5
    );
    if (duplicate) continue;

    const rh = routhHurwitz(jacobian(eq, p));
    found.push({ ...eq, ...rh });
  }

  found.sort((a, b) => a.x - b.x || a.y - b.y || a.z - b.z);
  return found;
}

function renderEquilibria(equilibria) {
  const tbody = document.getElementById("equilibriaBody");
  tbody.innerHTML = "";

  if (equilibria.length === 0) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="9">No biologically feasible equilibria found for the current parameter values.</td>`;
    tbody.appendChild(tr);
    return;
  }

  equilibria.forEach((eq, index) => {
    const tr = document.createElement("tr");
    const stabilityClass = eq.stability === "Stable" ? "stable" : "unstable";

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${formatNumber(eq.x)}</td>
      <td>${formatNumber(eq.y)}</td>
      <td>${formatNumber(eq.z)}</td>
      <td>${formatNumber(eq.a1)}</td>
      <td>${formatNumber(eq.a2)}</td>
      <td>${formatNumber(eq.a3)}</td>
      <td>${formatNumber(eq.margin)}</td>
      <td class="${stabilityClass}">${eq.stability}</td>
    `;

    tbody.appendChild(tr);
  });
}

function updateAll() {
  const sol = simulate(params);
  const iso = buildIsoclines(params);
  const equilibria = findEquilibria(params);

  plotTimeSeries(sol);
  plotPhase(sol, iso, equilibria);
  plot2DProjections(sol, equilibria);
  renderEquilibria(equilibria);
}

function scheduleUpdate() {
  clearTimeout(updateTimer);
  updateTimer = setTimeout(updateAll, 120);
}

document.getElementById("resetBtn").addEventListener("click", () => {
  params = { ...defaults };
  createSliders();
  updateAll();
});

createSliders();
updateAll();
