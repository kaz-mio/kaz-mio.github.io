const $ = (id) => document.getElementById(id);

const SQM_PER_TSUBO = 3.305785;
const SQM_PER_TATAMI = 1.62;
const STORAGE_KEY = "house-perspective-studio-v1";

const presetGroups = [
  {
    label: "家具",
    items: [
      { id: "sofa", name: "ソファ", kind: "furniture", w: 2.4, d: 0.9, h: 0.75, color: "#6f8fc7" },
      { id: "dining", name: "ダイニング", kind: "furniture", w: 1.8, d: 1.0, h: 0.72, color: "#a77843" },
      { id: "bed", name: "ベッド", kind: "furniture", w: 2.1, d: 1.4, h: 0.55, color: "#8f79b8" },
      { id: "kitchen", name: "キッチン", kind: "furniture", w: 2.7, d: 0.7, h: 0.9, color: "#6a7f7a" },
      { id: "fridge", name: "冷蔵庫", kind: "furniture", w: 0.75, d: 0.75, h: 1.8, color: "#9aa6ac" },
      { id: "desk", name: "デスク", kind: "furniture", w: 1.2, d: 0.7, h: 0.72, color: "#b58a55" },
      { id: "closet", name: "収納", kind: "furniture", w: 1.8, d: 0.65, h: 2.1, color: "#b7a17a" },
      { id: "toilet", name: "トイレ", kind: "furniture", w: 0.8, d: 1.1, h: 0.85, color: "#d7e5e8" },
      { id: "bath", name: "浴槽", kind: "furniture", w: 1.6, d: 1.2, h: 0.6, color: "#a9d1df" }
    ]
  },
  {
    label: "開口",
    items: [
      { id: "door", name: "ドア", kind: "opening", w: 0.9, d: 0.12, h: 2.0, color: "#6f4e37" },
      { id: "window", name: "窓", kind: "opening", w: 1.6, d: 0.1, h: 1.2, color: "#68a8c7" },
      { id: "sliding", name: "引き違い窓", kind: "opening", w: 2.4, d: 0.1, h: 1.9, color: "#72b3cd" }
    ]
  },
  {
    label: "外構",
    items: [
      { id: "parking", name: "駐車場", kind: "exterior", w: 5.0, d: 2.6, h: 0.08, color: "#c3c2b7" },
      { id: "car", name: "車", kind: "exterior", w: 4.4, d: 1.85, h: 1.45, color: "#52616d" },
      { id: "tree", name: "植栽", kind: "exterior", w: 1.2, d: 1.2, h: 3.0, color: "#4f9f68" },
      { id: "garden", name: "芝生", kind: "exterior", w: 3.0, d: 2.0, h: 0.05, color: "#83b86c" },
      { id: "path", name: "アプローチ", kind: "exterior", w: 1.2, d: 4.5, h: 0.05, color: "#b9b2a2" },
      { id: "deck", name: "ウッドデッキ", kind: "exterior", w: 3.2, d: 1.8, h: 0.22, color: "#b6783f" },
      { id: "fence", name: "フェンス", kind: "exterior", w: 4.0, d: 0.16, h: 1.35, color: "#7d8b83" },
      { id: "gate", name: "門柱", kind: "exterior", w: 0.55, d: 0.55, h: 1.7, color: "#9b8d7c" }
    ]
  }
];

const presets = Object.fromEntries(presetGroups.flatMap((group) => group.items.map((item) => [item.id, item])));

const el = {
  planCanvas: $("planCanvas"),
  perspectiveCanvas: $("perspectiveCanvas"),
  landWidthInput: $("landWidthInput"),
  landDepthInput: $("landDepthInput"),
  orientationInput: $("orientationInput"),
  regionInput: $("regionInput"),
  gridInput: $("gridInput"),
  simpleVersionBtn: $("simpleVersionBtn"),
  detailVersionBtn: $("detailVersionBtn"),
  selectModeBtn: $("selectModeBtn"),
  addModeBtn: $("addModeBtn"),
  addRoomBtn: $("addRoomBtn"),
  addObjectBtn: $("addObjectBtn"),
  presetSelect: $("presetSelect"),
  snapToggle: $("snapToggle"),
  dimToggle: $("dimToggle"),
  roofToggle: $("roofToggle"),
  inspector: $("inspector"),
  selectedBadge: $("selectedBadge"),
  roomList: $("roomList"),
  areaSqm: $("areaSqm"),
  areaTsubo: $("areaTsubo"),
  areaTatami: $("areaTatami"),
  landArea: $("landArea"),
  landTsuboSummary: $("landTsuboSummary"),
  landTsubo: $("landTsubo"),
  buildingSqm: $("buildingSqm"),
  buildingTsuboSummary: $("buildingTsuboSummary"),
  buildingTsubo: $("buildingTsubo"),
  roomCount: $("roomCount"),
  coverageBadge: $("coverageBadge"),
  recommendationBadge: $("recommendationBadge"),
  recommendedTsubo: $("recommendedTsubo"),
  recommendedRange: $("recommendedRange"),
  recommendationCards: $("recommendationCards"),
  recommendationFactors: $("recommendationFactors"),
  applyRecommendationBtn: $("applyRecommendationBtn"),
  perspectiveBadge: $("perspectiveBadge"),
  cameraAngleInput: $("cameraAngleInput"),
  depthScaleInput: $("depthScaleInput"),
  verticalScaleInput: $("verticalScaleInput"),
  wallThicknessInput: $("wallThicknessInput"),
  roofPitchInput: $("roofPitchInput"),
  wallOpacityInput: $("wallOpacityInput"),
  materialStyleInput: $("materialStyleInput"),
  renderQualityInput: $("renderQualityInput"),
  sunAngleInput: $("sunAngleInput"),
  shadowToggle: $("shadowToggle"),
  opening3dToggle: $("opening3dToggle"),
  textureToggle: $("textureToggle"),
  landscapeToggle: $("landscapeToggle"),
  cursorReadout: $("cursorReadout"),
  zoomReadout: $("zoomReadout"),
  zoomOutBtn: $("zoomOutBtn"),
  zoomInBtn: $("zoomInBtn"),
  fitBtn: $("fitBtn"),
  saveBtn: $("saveBtn"),
  loadBtn: $("loadBtn"),
  exportJsonBtn: $("exportJsonBtn"),
  importJsonBtn: $("importJsonBtn"),
  importFile: $("importFile"),
  planPngBtn: $("planPngBtn"),
  perspectivePngBtn: $("perspectivePngBtn"),
  hiResPngBtn: $("hiResPngBtn"),
  embedModeBtn: $("embedModeBtn"),
  copyEmbedBtn: $("copyEmbedBtn"),
  embedSnippet: $("embedSnippet"),
  sampleBtn: $("sampleBtn"),
  clearBtn: $("clearBtn"),
  projectSubtitle: $("projectSubtitle")
};

const ctx2d = el.planCanvas.getContext("2d");
const ctx3d = el.perspectiveCanvas.getContext("2d");

let nextId = 100;
let state = createSampleState();
let view = {
  mode: "select",
  zoom: 1,
  transform: null,
  dragging: null,
  selectedId: null
};

function createSampleState() {
  return {
    land: { width: 16, depth: 12, orientation: "north", region: "hokkaido" },
    settings: {
      version: "detail",
      grid: 0.5,
      snap: true,
      showDimensions: true,
      showRoof: true,
      cameraAngle: 42,
      depthScale: 0.34,
      verticalScale: 0.72,
      wallThickness: 0.16,
      roofPitch: 1.05,
      wallOpacity: 0.86,
      materialStyle: "snow",
      renderQuality: "high",
      sunAngle: 315,
      showShadows: true,
      showOpenings3d: true,
      showTextures: true,
      showLandscape: true,
      embedMode: false
    },
    rooms: [
      { id: "room-1", name: "LDK", x: 1.2, y: 1.2, w: 7.2, d: 4.8, h: 2.55, color: "#f2d1a0" },
      { id: "room-2", name: "主寝室", x: 8.4, y: 1.2, w: 4.0, d: 3.6, h: 2.45, color: "#d7dfc4" },
      { id: "room-3", name: "子ども室", x: 8.4, y: 4.8, w: 3.6, d: 3.2, h: 2.45, color: "#cfe0e8" },
      { id: "room-4", name: "水回り", x: 1.2, y: 6.0, w: 3.2, d: 2.4, h: 2.4, color: "#d9e8ec" },
      { id: "room-5", name: "玄関", x: 4.4, y: 6.0, w: 2.2, d: 2.4, h: 2.4, color: "#ead9bf" },
      { id: "room-6", name: "収納", x: 6.6, y: 6.0, w: 1.8, d: 2.4, h: 2.4, color: "#ded7c2" }
    ],
    objects: [
      makeObject("sofa", 2.0, 2.0, 0),
      makeObject("dining", 5.4, 2.0, 0),
      makeObject("kitchen", 1.7, 4.9, 0),
      makeObject("bed", 9.1, 1.8, 0),
      makeObject("desk", 9.0, 5.5, 0),
      makeObject("bath", 1.7, 6.7, 0),
      makeObject("toilet", 3.3, 6.8, 0),
      makeObject("door", 4.9, 8.34, 0),
      makeObject("sliding", 5.2, 1.08, 0),
      makeObject("parking", 10.0, 8.6, 0),
      makeObject("car", 10.3, 9.0, 0),
      makeObject("path", 5.0, 8.4, 0),
      makeObject("tree", 13.5, 1.2, 0),
      makeObject("garden", 12.2, 4.6, 0),
      makeObject("deck", 2.0, 8.6, 0),
      makeObject("fence", 0.7, 10.8, 0)
    ]
  };
}

function makeObject(presetId, x, y, rotation = 0) {
  const preset = presets[presetId];
  return {
    id: `${preset.kind}-${nextId++}`,
    preset: preset.id,
    kind: preset.kind,
    name: preset.name,
    x,
    y,
    w: preset.w,
    d: preset.d,
    h: preset.h,
    rotation,
    z: preset.z ?? openingBaseHeight(preset.id),
    color: preset.color
  };
}

function openingBaseHeight(presetId) {
  if (presetId === "window") return 0.85;
  if (presetId === "sliding") return 0.2;
  return 0;
}

function cloneState(input) {
  return JSON.parse(JSON.stringify(input));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, digits = 2) {
  const scale = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * scale) / scale;
}

function format(value, digits = 2) {
  return round(value, digits).toFixed(digits);
}

function snap(value) {
  if (!state.settings.snap) return value;
  const grid = state.settings.grid;
  return Math.round(value / grid) * grid;
}

function regionProfile(region) {
  const profiles = {
    hokkaido: {
      label: "北海道",
      targetCoverage: 0.36,
      minCoverage: 0.3,
      maxCoverage: 0.42,
      frontSetback: 1.8,
      sideSetback: 1.2,
      rearSetback: 1.4,
      snowRatio: 0.18,
      snowFrontDepth: 2.0,
      snowSideWidth: 1.5,
      parkingDepth: 5.5,
      parkingWidth: 2.8,
      notes: ["道路側に除雪後の一時置き場を確保", "屋根落雪方向と窓・玄関の干渉を避ける", "玄関から駐車場までの除雪動線を短くする"]
    },
    snowy: {
      label: "多雪地域",
      targetCoverage: 0.39,
      minCoverage: 0.32,
      maxCoverage: 0.46,
      frontSetback: 1.5,
      sideSetback: 1.0,
      rearSetback: 1.2,
      snowRatio: 0.13,
      snowFrontDepth: 1.6,
      snowSideWidth: 1.2,
      parkingDepth: 5.2,
      parkingWidth: 2.7,
      notes: ["雪庇・落雪の向きを考えて建物外周に余白を残す", "駐車場脇に雪寄せスペースを置く", "冬季の玄関動線を短くする"]
    },
    standard: {
      label: "標準地域",
      targetCoverage: 0.45,
      minCoverage: 0.36,
      maxCoverage: 0.52,
      frontSetback: 1.2,
      sideSetback: 0.8,
      rearSetback: 1.0,
      snowRatio: 0.04,
      snowFrontDepth: 0.7,
      snowSideWidth: 0.6,
      parkingDepth: 5.0,
      parkingWidth: 2.6,
      notes: ["採光と庭の奥行きを優先", "駐車場と玄関を近づける", "隣地側に設備点検スペースを残す"]
    },
    urban: {
      label: "都市部",
      targetCoverage: 0.52,
      minCoverage: 0.42,
      maxCoverage: 0.6,
      frontSetback: 0.8,
      sideSetback: 0.55,
      rearSetback: 0.75,
      snowRatio: 0.02,
      snowFrontDepth: 0.4,
      snowSideWidth: 0.35,
      parkingDepth: 5.0,
      parkingWidth: 2.5,
      notes: ["狭小地では2階利用を前提に建築面積を抑える", "採光面と隣地距離を優先", "駐車を優先する場合は1階面積を調整"]
    }
  };
  return profiles[region] || profiles.hokkaido;
}

function calculateRecommendation() {
  const profile = regionProfile(state.land.region);
  const landArea = state.land.width * state.land.depth;
  const landTsubo = landArea / SQM_PER_TSUBO;
  const compactBoost = landTsubo < 35 ? 0.05 : landTsubo > 70 ? -0.03 : 0;
  const targetCoverage = clamp(profile.targetCoverage + compactBoost, profile.minCoverage, profile.maxCoverage);
  const setbacks = {
    left: profile.sideSetback,
    right: profile.sideSetback + (profile.snowRatio > 0.08 ? profile.snowSideWidth * 0.45 : 0),
    top: profile.rearSetback,
    bottom: profile.frontSetback + (profile.snowRatio > 0.08 ? profile.snowFrontDepth * 0.4 : 0)
  };
  const buildable = {
    x: setbacks.left,
    y: setbacks.top,
    w: Math.max(0.8, state.land.width - setbacks.left - setbacks.right),
    d: Math.max(0.8, state.land.depth - setbacks.top - setbacks.bottom)
  };
  const buildableArea = buildable.w * buildable.d;
  const parkingCount = state.land.width >= 12 && landArea >= 120 ? 2 : 1;
  const parkingArea = parkingCount * profile.parkingWidth * profile.parkingDepth;
  const approachArea = Math.max(4.5, landArea * 0.035);
  const snowArea = Math.max(0, landArea * profile.snowRatio);
  const exteriorReserve = snowArea + parkingArea + approachArea;
  const areaFromCoverage = landArea * targetCoverage;
  const areaFromReserve = Math.max(landArea * profile.minCoverage, landArea - exteriorReserve);
  const recommendedArea = clamp(Math.min(areaFromCoverage, areaFromReserve, buildableArea), landArea * 0.22, Math.max(landArea * 0.24, buildableArea));
  const currentBuildingArea = rectUnionArea(state.rooms);
  const currentCoverage = landArea ? currentBuildingArea / landArea : 0;
  const snowZones = profile.snowRatio > 0.02 ? [
    { label: "雪置き場", x: 0.35, y: Math.max(0.2, state.land.depth - profile.snowFrontDepth), w: Math.max(1, state.land.width - 0.7), d: Math.min(profile.snowFrontDepth, state.land.depth * 0.32) },
    { label: "落雪余白", x: Math.max(0.2, state.land.width - profile.snowSideWidth), y: 0.35, w: Math.min(profile.snowSideWidth, state.land.width * 0.28), d: Math.max(1, state.land.depth - profile.snowFrontDepth - 0.7) }
  ] : [];
  const recommendedRect = fitRecommendedRect(buildable, recommendedArea);
  const planType = recommendedArea / SQM_PER_TSUBO >= 27 ? "3LDK + 玄関収納 + ランドリー" : recommendedArea / SQM_PER_TSUBO >= 21 ? "2-3LDK + 回遊水回り" : "2LDK compact";
  const factors = [
    `${profile.label}: 推奨建坪は土地の${format(targetCoverage * 100, 1)}%前後を目安`,
    `雪置き場目安 ${format(snowArea, 1)}m² (${format(snowArea / SQM_PER_TSUBO, 1)}坪)`,
    `駐車 ${parkingCount}台分と玄関アプローチを先に確保`,
    currentCoverage > profile.maxCoverage ? "現在の建坪は地域目安より大きめです" : "現在の建坪は地域目安内で調整しやすいです",
    "建ぺい率・条例・道路条件は実施設計時に確認",
    ...profile.notes
  ];
  return {
    profile,
    landArea,
    landTsubo,
    targetCoverage,
    recommendedArea,
    recommendedTsubo: recommendedArea / SQM_PER_TSUBO,
    minTsubo: (landArea * profile.minCoverage) / SQM_PER_TSUBO,
    maxTsubo: (landArea * profile.maxCoverage) / SQM_PER_TSUBO,
    currentBuildingArea,
    buildable,
    recommendedRect,
    snowArea,
    snowZones,
    parkingCount,
    parkingArea,
    approachArea,
    planType,
    factors
  };
}

function fitRecommendedRect(buildable, area) {
  const ratio = buildable.w >= buildable.d ? 1.35 : 0.85;
  let w = Math.sqrt(area * ratio);
  let d = area / Math.max(w, 0.1);
  if (w > buildable.w) {
    w = buildable.w;
    d = area / w;
  }
  if (d > buildable.d) {
    d = buildable.d;
    w = area / d;
  }
  w = clamp(w, Math.min(2.4, buildable.w), buildable.w);
  d = clamp(d, Math.min(2.4, buildable.d), buildable.d);
  return {
    x: buildable.x + Math.max(0, (buildable.w - w) * 0.35),
    y: buildable.y + Math.max(0, (buildable.d - d) * 0.32),
    w,
    d
  };
}

function getAllObjects() {
  return [...state.rooms.map((item) => ({ ...item, itemType: "room" })), ...state.objects.map((item) => ({ ...item, itemType: "object" }))];
}

function getSelected() {
  if (!view.selectedId) return null;
  const room = state.rooms.find((item) => item.id === view.selectedId);
  if (room) return { item: room, type: "room" };
  const object = state.objects.find((item) => item.id === view.selectedId);
  if (object) return { item: object, type: "object" };
  return null;
}

function setSelected(id) {
  view.selectedId = id;
  render();
}

function setMode(mode) {
  view.mode = mode;
  el.selectModeBtn.classList.toggle("active", mode === "select");
  el.addModeBtn.classList.toggle("active", mode === "add");
}

function setupPresetSelect() {
  el.presetSelect.innerHTML = "";
  presetGroups.forEach((group) => {
    const optgroup = document.createElement("optgroup");
    optgroup.label = group.label;
    group.items.forEach((preset) => {
      const option = document.createElement("option");
      option.value = preset.id;
      option.textContent = preset.name;
      optgroup.appendChild(option);
    });
    el.presetSelect.appendChild(optgroup);
  });
}

function syncControlsFromState() {
  el.landWidthInput.value = state.land.width;
  el.landDepthInput.value = state.land.depth;
  el.orientationInput.value = state.land.orientation;
  el.regionInput.value = state.land.region || "hokkaido";
  el.gridInput.value = String(state.settings.grid);
  el.cameraAngleInput.value = state.settings.cameraAngle;
  el.depthScaleInput.value = state.settings.depthScale;
  el.verticalScaleInput.value = state.settings.verticalScale;
  el.wallThicknessInput.value = state.settings.wallThickness;
  el.roofPitchInput.value = state.settings.roofPitch;
  el.wallOpacityInput.value = state.settings.wallOpacity;
  el.materialStyleInput.value = state.settings.materialStyle || "realistic";
  el.renderQualityInput.value = state.settings.renderQuality || "high";
  el.sunAngleInput.value = state.settings.sunAngle ?? 315;
  el.snapToggle.checked = state.settings.snap;
  el.dimToggle.checked = state.settings.showDimensions;
  el.roofToggle.checked = state.settings.showRoof;
  el.shadowToggle.checked = state.settings.showShadows;
  el.opening3dToggle.checked = state.settings.showOpenings3d;
  el.textureToggle.checked = state.settings.showTextures;
  el.landscapeToggle.checked = state.settings.showLandscape;
}

function updateStateFromControls() {
  state.land.width = clamp(parseFloat(el.landWidthInput.value) || 16, 4, 80);
  state.land.depth = clamp(parseFloat(el.landDepthInput.value) || 12, 4, 80);
  state.land.orientation = el.orientationInput.value;
  state.land.region = el.regionInput.value;
  state.settings.grid = parseFloat(el.gridInput.value) || 0.5;
  state.settings.cameraAngle = clamp(parseFloat(el.cameraAngleInput.value) || 42, 20, 70);
  state.settings.depthScale = clamp(parseFloat(el.depthScaleInput.value) || 0.34, 0.22, 0.52);
  state.settings.verticalScale = clamp(parseFloat(el.verticalScaleInput.value) || 0.72, 0.45, 1.05);
  state.settings.wallThickness = clamp(parseFloat(el.wallThicknessInput.value) || 0.16, 0.08, 0.35);
  state.settings.roofPitch = clamp(parseFloat(el.roofPitchInput.value) || 1.05, 0.2, 2.4);
  state.settings.wallOpacity = clamp(parseFloat(el.wallOpacityInput.value) || 0.86, 0.45, 1);
  state.settings.materialStyle = el.materialStyleInput.value;
  state.settings.renderQuality = el.renderQualityInput.value;
  state.settings.sunAngle = clamp(parseFloat(el.sunAngleInput.value) || 315, 0, 360);
  state.settings.snap = el.snapToggle.checked;
  state.settings.showDimensions = el.dimToggle.checked;
  state.settings.showRoof = el.roofToggle.checked;
  state.settings.showShadows = el.shadowToggle.checked;
  state.settings.showOpenings3d = el.opening3dToggle.checked;
  state.settings.showTextures = el.textureToggle.checked;
  state.settings.showLandscape = el.landscapeToggle.checked;
  constrainAll();
  render();
}

function setVersion(version) {
  state.settings.version = version;
  if (version === "simple") {
    state.settings.showDimensions = false;
    state.settings.showRoof = false;
    state.settings.showOpenings3d = false;
  } else {
    state.settings.showDimensions = true;
    state.settings.showRoof = true;
    state.settings.showOpenings3d = true;
  }
  render();
}

function renderVersionState() {
  const simple = state.settings.version === "simple";
  document.body.classList.toggle("embed-mode", Boolean(state.settings.embedMode));
  document.body.classList.toggle("simple-version", simple);
  el.simpleVersionBtn.classList.toggle("active", simple);
  el.detailVersionBtn.classList.toggle("active", !simple);
  el.perspectiveBadge.textContent = simple ? "簡易" : "高精度";
  el.embedModeBtn.textContent = state.settings.embedMode ? "編集表示" : "公開表示";
}

function constrainAll() {
  state.rooms.forEach((item) => constrainRect(item));
  state.objects.forEach((item) => constrainRect(item));
}

function constrainRect(item) {
  item.w = clamp(Number(item.w) || 0.1, 0.1, state.land.width);
  item.d = clamp(Number(item.d) || 0.1, 0.1, state.land.depth);
  item.x = clamp(Number(item.x) || 0, 0, Math.max(0, state.land.width - item.w));
  item.y = clamp(Number(item.y) || 0, 0, Math.max(0, state.land.depth - item.d));
  item.h = clamp(Number(item.h) || 0.05, 0.01, 12);
  item.z = clamp(Number(item.z) || 0, 0, 8);
  if (typeof item.rotation !== "number") item.rotation = 0;
}

function resizeCanvas(canvas, ctx) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.floor(rect.width));
  const height = Math.max(1, Math.floor(rect.height));
  if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
  }
  canvas.dataset.cssWidth = width;
  canvas.dataset.cssHeight = height;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { width, height };
}

function getPlanTransform(width, height) {
  const margin = 42;
  const usableWidth = Math.max(1, width - margin * 2);
  const usableHeight = Math.max(1, height - margin * 2);
  const baseScale = Math.min(usableWidth / state.land.width, usableHeight / state.land.depth);
  const scale = clamp(baseScale * view.zoom, 12, 160);
  const originX = (width - state.land.width * scale) / 2;
  const originY = (height - state.land.depth * scale) / 2;
  return { scale, originX, originY };
}

function worldToScreen(x, y) {
  const t = view.transform;
  return { x: t.originX + x * t.scale, y: t.originY + y * t.scale };
}

function screenToWorld(x, y) {
  const t = view.transform;
  return { x: (x - t.originX) / t.scale, y: (y - t.originY) / t.scale };
}

function clear(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
}

function drawPlan() {
  const { width, height } = resizeCanvas(el.planCanvas, ctx2d);
  clear(ctx2d, width, height);
  view.transform = getPlanTransform(width, height);
  drawPlanGrid(ctx2d);
  drawLand(ctx2d);
  drawRecommendationOverlay(ctx2d);

  state.objects.filter((item) => ["garden", "path", "parking", "deck"].includes(item.preset)).forEach((item) => drawObjectPlan(ctx2d, item));
  state.rooms.forEach((room) => drawRoomPlan(ctx2d, room));
  state.objects.filter((item) => item.kind === "opening").forEach((item) => drawObjectPlan(ctx2d, item));
  state.objects.filter((item) => item.kind === "furniture").forEach((item) => drawObjectPlan(ctx2d, item));
  state.objects.filter((item) => item.kind === "exterior" && !["garden", "path", "parking", "deck"].includes(item.preset)).forEach((item) => drawObjectPlan(ctx2d, item));
  drawCompass(ctx2d, width, height);
}

function drawPlanGrid(ctx) {
  const t = view.transform;
  const start = worldToScreen(0, 0);
  const end = worldToScreen(state.land.width, state.land.depth);
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#edf1e8";
  ctx.beginPath();
  for (let x = 0; x <= state.land.width + 0.001; x += state.settings.grid) {
    const sx = t.originX + x * t.scale;
    ctx.moveTo(sx, start.y);
    ctx.lineTo(sx, end.y);
  }
  for (let y = 0; y <= state.land.depth + 0.001; y += state.settings.grid) {
    const sy = t.originY + y * t.scale;
    ctx.moveTo(start.x, sy);
    ctx.lineTo(end.x, sy);
  }
  ctx.stroke();

  ctx.strokeStyle = "#dce4d6";
  ctx.beginPath();
  for (let x = 0; x <= state.land.width + 0.001; x += 1) {
    const sx = t.originX + x * t.scale;
    ctx.moveTo(sx, start.y);
    ctx.lineTo(sx, end.y);
  }
  for (let y = 0; y <= state.land.depth + 0.001; y += 1) {
    const sy = t.originY + y * t.scale;
    ctx.moveTo(start.x, sy);
    ctx.lineTo(end.x, sy);
  }
  ctx.stroke();
  ctx.restore();
}

function drawLand(ctx) {
  const a = worldToScreen(0, 0);
  const b = worldToScreen(state.land.width, state.land.depth);
  ctx.save();
  ctx.fillStyle = "rgba(242, 246, 235, 0.55)";
  ctx.strokeStyle = "#4d6c62";
  ctx.lineWidth = 2;
  ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
  ctx.strokeRect(a.x, a.y, b.x - a.x, b.y - a.y);
  ctx.fillStyle = "#5f6e65";
  ctx.font = "700 12px Segoe UI, sans-serif";
  ctx.fillText(`${format(state.land.width, 1)} m`, (a.x + b.x) / 2 - 18, a.y - 12);
  ctx.save();
  ctx.translate(a.x - 28, (a.y + b.y) / 2 + 18);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(`${format(state.land.depth, 1)} m`, 0, 0);
  ctx.restore();
  ctx.restore();
}

function drawRecommendationOverlay(ctx) {
  const rec = calculateRecommendation();
  ctx.save();
  rec.snowZones.forEach((zone) => {
    const p = worldToScreen(zone.x, zone.y);
    const w = zone.w * view.transform.scale;
    const d = zone.d * view.transform.scale;
    ctx.fillStyle = "rgba(112, 169, 196, 0.22)";
    ctx.strokeStyle = "rgba(47, 102, 128, 0.55)";
    ctx.lineWidth = 1.4;
    ctx.fillRect(p.x, p.y, w, d);
    ctx.strokeRect(p.x, p.y, w, d);
    if (w > 54 && d > 22) {
      ctx.fillStyle = "#2d6278";
      ctx.font = "800 11px Segoe UI, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(zone.label, p.x + w / 2, p.y + d / 2);
    }
  });

  const buildable = rec.buildable;
  const b = worldToScreen(buildable.x, buildable.y);
  ctx.strokeStyle = "rgba(37, 111, 104, 0.52)";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 5]);
  ctx.strokeRect(b.x, b.y, buildable.w * view.transform.scale, buildable.d * view.transform.scale);
  ctx.setLineDash([]);

  const r = rec.recommendedRect;
  const p = worldToScreen(r.x, r.y);
  const w = r.w * view.transform.scale;
  const d = r.d * view.transform.scale;
  ctx.fillStyle = "rgba(183, 120, 35, 0.12)";
  ctx.strokeStyle = "rgba(183, 120, 35, 0.86)";
  ctx.lineWidth = 2;
  ctx.fillRect(p.x, p.y, w, d);
  ctx.strokeRect(p.x, p.y, w, d);
  if (w > 90 && d > 38) {
    ctx.fillStyle = "#8d5c1f";
    ctx.font = "800 12px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`推奨 ${format(rec.recommendedTsubo, 1)}坪`, p.x + w / 2, p.y + d / 2);
  }
  ctx.restore();
}

function drawRoomPlan(ctx, room) {
  const p = worldToScreen(room.x, room.y);
  const w = room.w * view.transform.scale;
  const d = room.d * view.transform.scale;
  const selected = view.selectedId === room.id;
  ctx.save();
  ctx.fillStyle = room.color;
  ctx.globalAlpha = selected ? 0.98 : 0.78;
  ctx.fillRect(p.x, p.y, w, d);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = selected ? "#173c39" : "#41544c";
  ctx.lineWidth = selected ? 3 : 2;
  ctx.strokeRect(p.x, p.y, w, d);
  ctx.fillStyle = "#1d2924";
  ctx.font = "800 12px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(room.name, p.x + w / 2, p.y + d / 2 - 8);
  ctx.font = "700 11px Segoe UI, sans-serif";
  ctx.fillStyle = "#52635a";
  ctx.fillText(`${format(room.w, 1)} x ${format(room.d, 1)} m`, p.x + w / 2, p.y + d / 2 + 9);
  if (d > 58) {
    ctx.fillText(`${format(room.w * room.d / SQM_PER_TATAMI, 1)}帖`, p.x + w / 2, p.y + d / 2 + 25);
  }
  if (state.settings.showDimensions && w > 74 && d > 54) {
    drawDimension(ctx, p.x, p.y - 11, p.x + w, p.y - 11, `${format(room.w, 2)}m`);
    drawDimension(ctx, p.x + w + 11, p.y, p.x + w + 11, p.y + d, `${format(room.d, 2)}m`);
  }
  ctx.restore();
}

function drawDimension(ctx, x1, y1, x2, y2, label) {
  ctx.save();
  ctx.strokeStyle = "#8e9d93";
  ctx.fillStyle = "#53635b";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.font = "700 10px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const cx = (x1 + x2) / 2;
  const cy = (y1 + y2) / 2;
  if (Math.abs(x1 - x2) < 2) {
    ctx.save();
    ctx.translate(cx + 7, cy);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(label, 0, 0);
    ctx.restore();
  } else {
    ctx.fillText(label, cx, cy - 7);
  }
  ctx.restore();
}

function drawObjectPlan(ctx, item) {
  const t = view.transform;
  const cx = item.x + item.w / 2;
  const cy = item.y + item.d / 2;
  const p = worldToScreen(cx, cy);
  const w = item.w * t.scale;
  const d = item.d * t.scale;
  const selected = view.selectedId === item.id;

  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate((item.rotation * Math.PI) / 180);
  if (item.preset === "tree") {
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(w, d) / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#5b4631";
    ctx.fillRect(-3, -3, 6, 6);
  } else if (item.kind === "opening") {
    ctx.fillStyle = item.color;
    ctx.fillRect(-w / 2, -Math.max(5, d / 2), w, Math.max(5, d));
    ctx.strokeStyle = "#2f5360";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-w / 2, -Math.max(5, d / 2), w, Math.max(5, d));
  } else {
    ctx.fillStyle = item.color;
    ctx.globalAlpha = item.kind === "exterior" && item.h < 0.1 ? 0.68 : 0.88;
    ctx.fillRect(-w / 2, -d / 2, w, d);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = shade(item.color, -28);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-w / 2, -d / 2, w, d);
  }
  if (selected) {
    ctx.strokeStyle = "#173c39";
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(-w / 2 - 4, -d / 2 - 4, w + 8, d + 8);
    ctx.setLineDash([]);
  }
  if (w > 38 && d > 22) {
    ctx.fillStyle = "#16231f";
    ctx.font = "800 10px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(item.name, 0, 0);
  }
  ctx.restore();
}

function drawCompass(ctx, width, height) {
  const labels = { north: "N", east: "E", south: "S", west: "W" };
  ctx.save();
  ctx.translate(width - 48, 48);
  ctx.strokeStyle = "#275f58";
  ctx.fillStyle = "#275f58";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.lineTo(6, 2);
  ctx.lineTo(0, -2);
  ctx.lineTo(-6, 2);
  ctx.closePath();
  ctx.fill();
  ctx.font = "800 12px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(labels[state.land.orientation] || "N", 0, 34);
  ctx.restore();
}

function drawPerspective() {
  const size = resizeCanvas(el.perspectiveCanvas, ctx3d);
  const { width, height } = size;
  drawPerspectiveScene(ctx3d, width, height);
}

function drawPerspectiveScene(ctx, width, height) {
  clear(ctx, width, height);
  drawRenderBackdrop(ctx, width, height);
  const proj = createProjector(width, height);
  const detail = state.settings.version === "detail";

  drawPerspectiveGround(ctx, proj);
  const roomFloors = state.rooms.map((room) => ({ ...room, z: 0, h: 0.04, drawType: "floor" }));
  const roomWalls = detail ? state.rooms.flatMap((room) => wallSegments(room)) : [];
  const objects = state.objects
    .filter((item) => detail || item.kind !== "opening")
    .filter((item) => item.kind !== "opening" || state.settings.showOpenings3d)
    .map((item) => ({ ...item, drawType: perspectiveDrawType(item) }));
  const shapes = [...roomFloors, ...roomWalls, ...objects].sort((a, b) => shapeDepth(a, proj) - shapeDepth(b, proj));

  if (detail && state.settings.showShadows) {
    shapes
      .filter((shape) => shape.drawType !== "floor" && shape.drawType !== "opening")
      .forEach((shape) => drawShadow(ctx, proj, shape));
  }

  shapes.forEach((shape) => {
    if (shape.drawType === "floor") drawFlatBox(ctx, proj, shape, materialColor(shape, "floor"), 0.8);
    if (shape.drawType === "flat") drawFlatBox(ctx, proj, shape, materialColor(shape, "flat"), 0.86);
    if (shape.drawType === "wall") drawBox(ctx, proj, shape, materialColor(shape, "wall"), state.settings.wallOpacity, "wall");
    if (shape.drawType === "opening") drawOpeningPanel(ctx, proj, shape);
    if (shape.drawType === "car") drawCar(ctx, proj, shape);
    if (shape.drawType === "box") drawBox(ctx, proj, shape, materialColor(shape, "box"), detail ? 0.96 : 0.88, "object");
    if (shape.drawType === "tree") drawTree(ctx, proj, shape);
  });

  if (detail && state.settings.showRoof) {
    drawRoof(ctx, proj);
  }
  drawRenderVignette(ctx, width, height);
}

function perspectiveDrawType(item) {
  if (item.preset === "tree") return "tree";
  if (item.preset === "car") return "car";
  if (item.kind === "opening") return "opening";
  if (["garden", "path", "parking", "deck", "snow"].includes(item.preset) || item.h < 0.12) return "flat";
  return "box";
}

function drawRenderBackdrop(ctx, width, height) {
  const style = state.settings.materialStyle || "realistic";
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  if (style === "snow") {
    sky.addColorStop(0, "#e7f2f6");
    sky.addColorStop(0.48, "#f8fbfb");
    sky.addColorStop(1, "#e6ede9");
  } else if (style === "studio") {
    sky.addColorStop(0, "#f9faf7");
    sky.addColorStop(0.58, "#f3f4ee");
    sky.addColorStop(1, "#e8ebe2");
  } else {
    sky.addColorStop(0, "#dfeeea");
    sky.addColorStop(0.5, "#fbfbf3");
    sky.addColorStop(1, "#dfe6d7");
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);
  if (state.settings.showLandscape) {
    const angle = ((state.settings.sunAngle || 315) * Math.PI) / 180;
    const sx = width * (0.5 + Math.cos(angle) * 0.34);
    const sy = height * (0.24 + Math.sin(angle) * 0.12);
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, width * 0.22);
    glow.addColorStop(0, "rgba(255, 238, 180, 0.42)");
    glow.addColorStop(1, "rgba(255, 238, 180, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawRenderVignette(ctx, width, height) {
  const vignette = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.28, width / 2, height / 2, Math.max(width, height) * 0.72);
  vignette.addColorStop(0, "rgba(255,255,255,0)");
  vignette.addColorStop(1, "rgba(28,37,32,0.10)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

function materialColor(item, fallbackType) {
  const style = state.settings.materialStyle || "realistic";
  if (fallbackType === "wall") return style === "studio" ? "#ebe9df" : "#f0f2ec";
  if (item.preset === "garden") return style === "snow" ? "#c9e3e6" : "#82b66a";
  if (item.preset === "snow") return "#cde7f0";
  if (item.preset === "parking") return "#aeb3ad";
  if (item.preset === "path") return "#c5bead";
  if (item.preset === "deck") return "#b87a42";
  if (fallbackType === "floor") return style === "studio" ? "#e9ddc8" : item.color;
  return item.color || "#88948e";
}

function createProjector(width, height) {
  const angle = (state.settings.cameraAngle * Math.PI) / 180;
  const centerX = state.land.width / 2;
  const centerY = state.land.depth / 2;
  const maxRoomHeight = state.rooms.length ? Math.max(...state.rooms.map((room) => room.h || 2.4)) : 2.4;
  const maxObjectHeight = state.objects.length ? Math.max(...state.objects.map((item) => (item.z || 0) + (item.h || 0.1))) : 0.1;
  const maxZ = Math.max(maxRoomHeight + state.settings.roofPitch + 0.4, maxObjectHeight + 0.4);
  const depthScale = state.settings.depthScale;
  const verticalScale = state.settings.verticalScale;

  function raw(x, y, z = 0) {
    const dx = x - centerX;
    const dy = y - centerY;
    const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
    const ry = dx * Math.sin(angle) + dy * Math.cos(angle);
    return {
      u: rx,
      v: ry * depthScale - z * verticalScale,
      depth: ry + z * 0.18
    };
  }

  const boundsPoints = [
    [0, 0, 0],
    [state.land.width, 0, 0],
    [state.land.width, state.land.depth, 0],
    [0, state.land.depth, 0],
    [0, 0, maxZ],
    [state.land.width, 0, maxZ],
    [state.land.width, state.land.depth, maxZ],
    [0, state.land.depth, maxZ]
  ].map(([x, y, z]) => raw(x, y, z));
  const minU = Math.min(...boundsPoints.map((point) => point.u));
  const maxU = Math.max(...boundsPoints.map((point) => point.u));
  const minV = Math.min(...boundsPoints.map((point) => point.v));
  const maxV = Math.max(...boundsPoints.map((point) => point.v));
  const scale = Math.min((width * 1.08) / Math.max(1, maxU - minU), (height * 0.9) / Math.max(1, maxV - minV));
  const originX = width / 2 - ((minU + maxU) / 2) * scale;
  const originY = height / 2 - ((minV + maxV) / 2) * scale + height * 0.02;
  return {
    scale,
    originX,
    originY,
    raw,
    project(x, y, z = 0) {
      const point = raw(x, y, z);
      return {
        x: this.originX + point.u * this.scale,
        y: this.originY + point.v * this.scale,
        depth: point.depth
      };
    }
  };
}

function drawPerspectiveGround(ctx, proj) {
  const corners = [
    proj.project(0, 0, 0),
    proj.project(state.land.width, 0, 0),
    proj.project(state.land.width, state.land.depth, 0),
    proj.project(0, state.land.depth, 0)
  ];
  ctx.save();
  drawPoly(ctx, corners, state.settings.materialStyle === "snow" ? "#eef6f5" : "#e5ead8", "#a9b39e", 1.5);
  if (state.settings.showTextures) {
    drawGroundTexture(ctx, corners, proj.scale);
  }
  ctx.globalAlpha = 0.45;
  ctx.strokeStyle = "#c6d0bd";
  ctx.lineWidth = 1;
  for (let x = 0; x <= state.land.width; x += 1) {
    const a = proj.project(x, 0, 0);
    const b = proj.project(x, state.land.depth, 0);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  for (let y = 0; y <= state.land.depth; y += 1) {
    const a = proj.project(0, y, 0);
    const b = proj.project(state.land.width, y, 0);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawGroundTexture(ctx, corners, scale) {
  const xs = corners.map((point) => point.x);
  const ys = corners.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(corners[0].x, corners[0].y);
  corners.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.closePath();
  ctx.clip();
  const spacing = Math.max(6, scale * 0.22);
  ctx.globalAlpha = state.settings.materialStyle === "snow" ? 0.18 : 0.12;
  ctx.strokeStyle = state.settings.materialStyle === "snow" ? "#a8ccd4" : "#78906d";
  for (let x = minX - 80; x < maxX + 80; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, minY);
    ctx.lineTo(x + 70, maxY);
    ctx.stroke();
  }
  ctx.restore();
}

function wallSegments(room) {
  const thickness = state.settings.wallThickness;
  return [
    { drawType: "wall", x: room.x, y: room.y, w: room.w, d: thickness, h: room.h, z: 0, color: "#e8ece6" },
    { drawType: "wall", x: room.x, y: room.y + room.d - thickness, w: room.w, d: thickness, h: room.h, z: 0, color: "#e8ece6" },
    { drawType: "wall", x: room.x, y: room.y, w: thickness, d: room.d, h: room.h, z: 0, color: "#e8ece6" },
    { drawType: "wall", x: room.x + room.w - thickness, y: room.y, w: thickness, d: room.d, h: room.h, z: 0, color: "#e8ece6" }
  ];
}

function drawFlatBox(ctx, proj, item, color, alpha = 1) {
  const z = item.z || 0;
  const top = footprintCorners(item).map((point) => proj.project(point.x, point.y, z));
  ctx.save();
  ctx.globalAlpha = alpha;
  drawLitPoly(ctx, top, color, 8, shade(color, -18), 1);
  if (state.settings.showTextures && item.preset !== "path") {
    drawSurfaceGrain(ctx, top, color, item.preset === "snow" ? 0.28 : 0.16);
  }
  ctx.restore();
}

function drawBox(ctx, proj, item, color, alpha = 1, materialKind = "object") {
  const z = item.z || 0;
  const h = item.h || 0.1;
  const corners = footprintCorners(item);
  const base = corners.map((point) => proj.project(point.x, point.y, z));
  const top = corners.map((point) => proj.project(point.x, point.y, z + h));
  const sideFaces = [0, 1, 2, 3]
    .map((index) => {
      const next = (index + 1) % 4;
      const points = [base[index], base[next], top[next], top[index]];
      return {
        points,
        depth: points.reduce((sum, point) => sum + point.depth, 0) / points.length,
        shadeAmount: index % 2 === 0 ? -18 : -30
      };
    })
    .sort((a, b) => a.depth - b.depth);

  ctx.save();
  ctx.globalAlpha = alpha;
  sideFaces.forEach((face) => {
    drawLitPoly(ctx, face.points, color, face.shadeAmount, shade(color, face.shadeAmount - 22), 0.75);
    if (state.settings.showTextures && materialKind === "wall") drawFacadeLines(ctx, face.points, color);
  });
  drawLitPoly(ctx, top, color, 18, shade(color, -18), 0.95);
  if (state.settings.showTextures && materialKind === "object") drawSurfaceGrain(ctx, top, color, 0.12);
  if (view.selectedId === item.id) {
    ctx.globalAlpha = 1;
    drawPoly(ctx, top, "rgba(255,255,255,0)", "#173c39", 2.4);
  }
  ctx.restore();
}

function drawLitPoly(ctx, points, baseColor, amount, stroke, lineWidth = 1) {
  const box = polyBounds(points);
  const gradient = ctx.createLinearGradient(box.minX, box.minY, box.maxX, box.maxY);
  gradient.addColorStop(0, shade(baseColor, amount + 18));
  gradient.addColorStop(0.55, shade(baseColor, amount));
  gradient.addColorStop(1, shade(baseColor, amount - 24));
  drawPoly(ctx, points, gradient, stroke, lineWidth);
}

function polyBounds(points) {
  return {
    minX: Math.min(...points.map((point) => point.x)),
    maxX: Math.max(...points.map((point) => point.x)),
    minY: Math.min(...points.map((point) => point.y)),
    maxY: Math.max(...points.map((point) => point.y))
  };
}

function drawSurfaceGrain(ctx, points, color, alpha) {
  const quality = state.settings.renderQuality || "high";
  const count = quality === "ultra" ? 120 : quality === "high" ? 64 : 28;
  const box = polyBounds(points);
  let seed = Math.floor((box.minX + box.minY + box.maxX * 3 + box.maxY * 7) * 10);
  ctx.save();
  clipPoly(ctx, points);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = shade(color, state.settings.materialStyle === "snow" ? 30 : -20);
  for (let i = 0; i < count; i += 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const rx = seed / 233280;
    seed = (seed * 9301 + 49297) % 233280;
    const ry = seed / 233280;
    const x = box.minX + rx * (box.maxX - box.minX);
    const y = box.minY + ry * (box.maxY - box.minY);
    ctx.fillRect(x, y, 1.1, 1.1);
  }
  ctx.restore();
}

function drawFacadeLines(ctx, points, color) {
  const box = polyBounds(points);
  if (box.maxY - box.minY < 16) return;
  ctx.save();
  clipPoly(ctx, points);
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = shade(color, -48);
  ctx.lineWidth = 0.8;
  const spacing = Math.max(9, (box.maxY - box.minY) / 5);
  for (let y = box.minY + spacing; y < box.maxY; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(box.minX - 5, y);
    ctx.lineTo(box.maxX + 5, y);
    ctx.stroke();
  }
  ctx.restore();
}

function clipPoly(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.closePath();
  ctx.clip();
}

function drawOpeningPanel(ctx, proj, item) {
  const opening = {
    ...item,
    z: item.z ?? openingBaseHeight(item.preset),
    d: Math.max(item.d, state.settings.wallThickness * 0.8)
  };
  const color = item.preset === "door" ? "#7a5137" : "#6eb8d3";
  drawBox(ctx, proj, opening, color, item.preset === "door" ? 0.9 : 0.62, "glass");
  if (item.preset !== "door") {
    const z = opening.z;
    const top = footprintCorners(opening).map((point) => proj.project(point.x, point.y, z + opening.h));
    const base = footprintCorners(opening).map((point) => proj.project(point.x, point.y, z));
    const face = [base[0], base[1], top[1], top[0]];
    ctx.save();
    ctx.globalAlpha = 0.38;
    drawLitPoly(ctx, face, "#bde9f4", 26, "rgba(255,255,255,0.45)", 0.8);
    const box = polyBounds(face);
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(box.minX + (box.maxX - box.minX) * 0.18, box.maxY - 4);
    ctx.lineTo(box.maxX - 4, box.minY + 4);
    ctx.stroke();
    ctx.restore();
  }
}

function drawShadow(ctx, proj, item) {
  const h = item.h || 0;
  if (h < 0.12) return;
  const angle = ((state.settings.sunAngle || 315) * Math.PI) / 180;
  const offsetX = Math.cos(angle + Math.PI) * h * 0.55;
  const offsetY = Math.sin(angle + Math.PI) * h * 0.38;
  const shadow = footprintCorners({ ...item, x: item.x + offsetX, y: item.y + offsetY }).map((point) => proj.project(point.x, point.y, 0));
  ctx.save();
  ctx.globalAlpha = clamp(0.10 + h * 0.018, 0.09, 0.26);
  drawPoly(ctx, shadow, "#20332b", null, 0);
  ctx.restore();
}

function drawCar(ctx, proj, item) {
  const body = { ...item, h: Math.max(0.55, item.h * 0.55), z: item.z || 0 };
  drawBox(ctx, proj, body, item.color || "#52616d", 0.95, "object");
  const cabin = {
    ...item,
    x: item.x + item.w * 0.28,
    y: item.y + item.d * 0.12,
    w: item.w * 0.42,
    d: item.d * 0.76,
    h: Math.max(0.38, item.h * 0.32),
    z: body.h
  };
  drawBox(ctx, proj, cabin, "#9db4bd", 0.72, "glass");
  const wheelColor = "#252d31";
  [
    [item.x + item.w * 0.18, item.y + item.d * 0.07],
    [item.x + item.w * 0.72, item.y + item.d * 0.07],
    [item.x + item.w * 0.18, item.y + item.d * 0.86],
    [item.x + item.w * 0.72, item.y + item.d * 0.86]
  ].forEach(([x, y]) => {
    const p = proj.project(x, y, 0.12);
    ctx.save();
    ctx.fillStyle = wheelColor;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, Math.max(2, proj.scale * 0.08), Math.max(1.5, proj.scale * 0.045), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function footprintCorners(item) {
  const rotation = ((item.rotation || 0) * Math.PI) / 180;
  const cx = item.x + item.w / 2;
  const cy = item.y + item.d / 2;
  const local = [
    [-item.w / 2, -item.d / 2],
    [item.w / 2, -item.d / 2],
    [item.w / 2, item.d / 2],
    [-item.w / 2, item.d / 2]
  ];
  return local.map(([x, y]) => ({
    x: cx + x * Math.cos(rotation) - y * Math.sin(rotation),
    y: cy + x * Math.sin(rotation) + y * Math.cos(rotation)
  }));
}

function shapeDepth(item, proj) {
  const points = footprintCorners(item).map((point) => proj.project(point.x, point.y, item.z || 0));
  return points.reduce((sum, point) => sum + point.depth, 0) / points.length + (item.h || 0) * 0.08;
}

function drawTree(ctx, proj, item) {
  const cx = item.x + item.w / 2;
  const cy = item.y + item.d / 2;
  const base = proj.project(cx, cy, 0);
  const trunkTop = proj.project(cx, cy, Math.max(0.6, item.h * 0.34));
  const canopy = proj.project(cx, cy, item.h);
  ctx.save();
  ctx.strokeStyle = "#6a4a2f";
  ctx.lineWidth = Math.max(3, proj.scale * 0.08);
  ctx.beginPath();
  ctx.moveTo(base.x, base.y);
  ctx.lineTo(trunkTop.x, trunkTop.y);
  ctx.stroke();
  const radius = Math.max(12, proj.scale * item.w * 0.54);
  const gradient = ctx.createRadialGradient(canopy.x - radius * 0.25, canopy.y - radius * 0.2, 4, canopy.x, canopy.y, radius);
  gradient.addColorStop(0, "#94c987");
  gradient.addColorStop(1, item.color);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(canopy.x, canopy.y, radius, radius * 0.72, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = shade(item.color, -28);
  ctx.stroke();
  ctx.restore();
}

function drawRoof(ctx, proj) {
  if (!state.rooms.length) return;
  const minX = Math.min(...state.rooms.map((room) => room.x));
  const minY = Math.min(...state.rooms.map((room) => room.y));
  const maxX = Math.max(...state.rooms.map((room) => room.x + room.w));
  const maxY = Math.max(...state.rooms.map((room) => room.y + room.d));
  const maxH = Math.max(...state.rooms.map((room) => room.h));
  const eave = 0.25;
  const x = minX - eave;
  const y = minY - eave;
  const w = maxX - minX + eave * 2;
  const d = maxY - minY + eave * 2;
  const z = maxH + 0.15;
  const pitch = state.settings.roofPitch;
  const a = proj.project(x, y, z);
  const b = proj.project(x + w, y, z);
  const c = proj.project(x + w, y + d, z);
  const dpt = proj.project(x, y + d, z);
  ctx.save();
  const roofA = state.settings.materialStyle === "studio" ? "#9b745b" : "#7f543c";
  const roofB = state.settings.materialStyle === "snow" ? "#6e4d3a" : "#8a5a3d";
  if (w >= d) {
    const ridge = [
      proj.project(x, y + d / 2, z + pitch),
      proj.project(x + w, y + d / 2, z + pitch)
    ];
    drawRoofFace(ctx, [a, b, ridge[1], ridge[0]], roofB, 8);
    drawRoofFace(ctx, [dpt, c, ridge[1], ridge[0]], roofA, -8);
    drawRoofFace(ctx, [a, dpt, ridge[0]], roofA, -4);
    drawRoofFace(ctx, [b, c, ridge[1]], roofA, -16);
    drawRidgeCap(ctx, ridge[0], ridge[1]);
  } else {
    const ridge = [
      proj.project(x + w / 2, y, z + pitch),
      proj.project(x + w / 2, y + d, z + pitch)
    ];
    drawRoofFace(ctx, [a, dpt, ridge[1], ridge[0]], roofB, 8);
    drawRoofFace(ctx, [b, c, ridge[1], ridge[0]], roofA, -8);
    drawRoofFace(ctx, [a, b, ridge[0]], roofA, -4);
    drawRoofFace(ctx, [dpt, c, ridge[1]], roofA, -16);
    drawRidgeCap(ctx, ridge[0], ridge[1]);
  }
  ctx.restore();
}

function drawRoofFace(ctx, points, color, light) {
  drawLitPoly(ctx, points, color, light, shade(color, -34), 1.1);
  if (!state.settings.showTextures) return;
  const box = polyBounds(points);
  ctx.save();
  clipPoly(ctx, points);
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = shade(color, -42);
  ctx.lineWidth = 0.9;
  const quality = state.settings.renderQuality || "high";
  const rows = quality === "ultra" ? 9 : quality === "high" ? 7 : 5;
  for (let i = 1; i < rows; i += 1) {
    const y = box.minY + ((box.maxY - box.minY) * i) / rows;
    ctx.beginPath();
    ctx.moveTo(box.minX - 12, y);
    ctx.lineTo(box.maxX + 12, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawRidgeCap(ctx, a, b) {
  ctx.save();
  ctx.strokeStyle = "rgba(67, 44, 34, 0.72)";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(a.x, a.y - 1.5);
  ctx.lineTo(b.x, b.y - 1.5);
  ctx.stroke();
  ctx.restore();
}

function drawPoly(ctx, points, fill, stroke, lineWidth = 1) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function shade(hex, amount) {
  const source = String(hex || "#88948e").trim();
  const rgb = source.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgb) {
    const r = clamp(Number(rgb[1]) + amount, 0, 255);
    const g = clamp(Number(rgb[2]) + amount, 0, 255);
    const b = clamp(Number(rgb[3]) + amount, 0, 255);
    return `rgb(${r}, ${g}, ${b})`;
  }
  if (!/^#?[0-9a-f]{3}([0-9a-f]{3})?$/i.test(source)) {
    return "rgb(136, 148, 142)";
  }
  const clean = source.replace("#", "");
  const value = parseInt(clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean, 16);
  const r = clamp((value >> 16) + amount, 0, 255);
  const g = clamp(((value >> 8) & 0xff) + amount, 0, 255);
  const b = clamp((value & 0xff) + amount, 0, 255);
  return `rgb(${r}, ${g}, ${b})`;
}

function renderMetrics() {
  const roomArea = state.rooms.reduce((sum, room) => sum + room.w * room.d, 0);
  const buildingArea = rectUnionArea(state.rooms);
  const landArea = state.land.width * state.land.depth;
  const coverage = landArea > 0 ? (buildingArea / landArea) * 100 : 0;
  el.areaSqm.textContent = format(roomArea, 2);
  el.areaTsubo.textContent = format(roomArea / SQM_PER_TSUBO, 2);
  el.areaTatami.textContent = format(roomArea / SQM_PER_TATAMI, 1);
  el.landArea.textContent = format(landArea, 2);
  el.landTsuboSummary.textContent = `${format(landArea / SQM_PER_TSUBO, 2)}坪`;
  el.landTsubo.textContent = format(landArea / SQM_PER_TSUBO, 2);
  el.buildingSqm.textContent = format(buildingArea, 2);
  el.buildingTsuboSummary.textContent = `${format(buildingArea / SQM_PER_TSUBO, 2)}坪`;
  el.buildingTsubo.textContent = format(buildingArea / SQM_PER_TSUBO, 2);
  el.roomCount.textContent = state.rooms.length;
  el.coverageBadge.textContent = `建ぺい率 ${format(coverage, 1)}%`;
}

function renderRecommendationPanel() {
  const rec = calculateRecommendation();
  el.recommendationBadge.textContent = rec.profile.label;
  el.recommendedTsubo.textContent = `${format(rec.recommendedTsubo, 2)}坪`;
  el.recommendedRange.textContent = `目安 ${format(rec.minTsubo, 1)} - ${format(rec.maxTsubo, 1)}坪 / ${rec.planType}`;
  const cards = [
    ["土地", `${format(rec.landTsubo, 2)}坪`],
    ["推奨建築面積", `${format(rec.recommendedArea, 1)}m²`],
    ["雪置き場", `${format(rec.snowArea, 1)}m²`],
    ["駐車", `${rec.parkingCount}台`]
  ];
  el.recommendationCards.innerHTML = cards.map(([label, value]) => (
    `<div class="recommendation-card"><span>${label}</span><strong>${value}</strong></div>`
  )).join("");
  el.recommendationFactors.innerHTML = rec.factors.slice(0, 6).map((factor) => (
    `<div class="factor-item">${escapeHtml(factor)}</div>`
  )).join("");
}

function rectUnionArea(rects) {
  if (!rects.length) return 0;
  const xs = Array.from(new Set(rects.flatMap((rect) => [rect.x, rect.x + rect.w]))).sort((a, b) => a - b);
  let area = 0;
  for (let i = 0; i < xs.length - 1; i += 1) {
    const x1 = xs[i];
    const x2 = xs[i + 1];
    const width = x2 - x1;
    if (width <= 0) continue;
    const intervals = rects
      .filter((rect) => rect.x < x2 && rect.x + rect.w > x1)
      .map((rect) => [rect.y, rect.y + rect.d])
      .sort((a, b) => a[0] - b[0]);
    let coveredDepth = 0;
    let currentStart = null;
    let currentEnd = null;
    intervals.forEach(([start, end]) => {
      if (currentStart === null) {
        currentStart = start;
        currentEnd = end;
      } else if (start <= currentEnd) {
        currentEnd = Math.max(currentEnd, end);
      } else {
        coveredDepth += currentEnd - currentStart;
        currentStart = start;
        currentEnd = end;
      }
    });
    if (currentStart !== null) coveredDepth += currentEnd - currentStart;
    area += width * coveredDepth;
  }
  return area;
}

function renderRoomList() {
  const selected = view.selectedId;
  const entries = [
    ...state.rooms.map((item) => ({ item, type: "room", subtitle: `${format(item.w * item.d, 2)} m² / ${format((item.w * item.d) / SQM_PER_TATAMI, 1)} 帖 / ${format((item.w * item.d) / SQM_PER_TSUBO, 2)} 坪` })),
    ...state.objects.map((item) => ({ item, type: item.kind, subtitle: `${format(item.w, 2)} x ${format(item.d, 2)} m` }))
  ];
  el.roomList.innerHTML = "";
  entries.forEach(({ item, type, subtitle }) => {
    const row = document.createElement("div");
    row.className = `list-item${selected === item.id ? " active" : ""}`;
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<span class="list-title">${item.name}</span><span class="list-sub">${typeLabel(type)} - ${subtitle}</span>`;
    button.addEventListener("click", () => setSelected(item.id));
    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.background = item.color;
    row.append(button, swatch);
    el.roomList.appendChild(row);
  });
}

function typeLabel(type) {
  return {
    room: "部屋",
    furniture: "家具",
    opening: "開口",
    exterior: "外構",
    object: "配置"
  }[type] || type;
}

function renderInspector() {
  const selected = getSelected();
  if (!selected) {
    el.selectedBadge.textContent = "未選択";
    el.inspector.className = "inspector-empty";
    el.inspector.innerHTML = "平面図上の部屋、家具、開口、外構を選択してください。";
    return;
  }

  const item = selected.item;
  const area = item.w * item.d;
  el.selectedBadge.textContent = typeLabel(selected.type === "room" ? "room" : item.kind);
  el.inspector.className = "inspector-form";
  el.inspector.innerHTML = `
    <div class="field">
      <label><span>名称</span><input data-prop="name" type="text" value="${escapeHtml(item.name)}"></label>
    </div>
    <div class="field inline">
      <label><span>X m</span><input data-prop="x" type="number" step="0.05" value="${format(item.x, 2)}"></label>
      <label><span>Y m</span><input data-prop="y" type="number" step="0.05" value="${format(item.y, 2)}"></label>
    </div>
    <div class="field inline">
      <label><span>幅 m</span><input data-prop="w" type="number" min="0.1" step="0.05" value="${format(item.w, 2)}"></label>
      <label><span>奥行 m</span><input data-prop="d" type="number" min="0.1" step="0.05" value="${format(item.d, 2)}"></label>
    </div>
    <div class="field inline detail-only">
      <label><span>高さ m</span><input data-prop="h" type="number" min="0.01" step="0.05" value="${format(item.h, 2)}"></label>
      <label><span>床上 m</span><input data-prop="z" type="number" min="0" step="0.05" value="${format(item.z || 0, 2)}" ${selected.type === "room" ? "disabled" : ""}></label>
    </div>
    <div class="field detail-only">
      <label><span>回転 deg</span><input data-prop="rotation" type="number" step="15" value="${format(item.rotation || 0, 0)}" ${selected.type === "room" ? "disabled" : ""}></label>
    </div>
    <div class="color-field detail-only">
      <label><span>色</span><input data-prop="color" type="text" value="${item.color}"></label>
      <input data-prop="color" type="color" value="${item.color}">
    </div>
    <div class="metric-grid">
      <div><span>面積</span><strong>${format(area, 2)}</strong><small>m²</small></div>
      <div><span>畳数</span><strong>${format(area / SQM_PER_TATAMI, 1)}</strong><small>帖</small></div>
      <div><span>坪数</span><strong>${format(area / SQM_PER_TSUBO, 2)}</strong><small>坪</small></div>
    </div>
    <div class="inspector-actions">
      <button id="duplicateSelectedBtn" class="small-button">複製</button>
      <button id="rotateSelectedBtn" class="small-button">回転</button>
      <button id="deleteSelectedBtn" class="small-button danger">削除</button>
    </div>
  `;

  el.inspector.querySelectorAll("[data-prop]").forEach((input) => {
    input.addEventListener("input", () => {
      const prop = input.dataset.prop;
      if (prop === "name" || prop === "color") {
        item[prop] = input.value;
      } else {
        item[prop] = parseFloat(input.value) || 0;
      }
      constrainRect(item);
      drawPlan();
      drawPerspective();
      renderMetrics();
      renderRoomList();
    });
    input.addEventListener("change", render);
  });
  $("duplicateSelectedBtn").addEventListener("click", duplicateSelected);
  $("rotateSelectedBtn").addEventListener("click", rotateSelected);
  $("deleteSelectedBtn").addEventListener("click", deleteSelected);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function addRoomAt(x = state.land.width * 0.15, y = state.land.depth * 0.15) {
  const index = state.rooms.length + 1;
  const room = {
    id: `room-${Date.now()}-${index}`,
    name: `部屋 ${index}`,
    x: snap(clamp(x, 0, state.land.width - 3)),
    y: snap(clamp(y, 0, state.land.depth - 2.4)),
    w: 3.6,
    d: 2.7,
    h: 2.45,
    color: nextRoomColor(index)
  };
  constrainRect(room);
  state.rooms.push(room);
  setSelected(room.id);
}

function nextRoomColor(index) {
  const colors = ["#f2d1a0", "#d7dfc4", "#cfe0e8", "#ead9bf", "#d8d0e6", "#e3dac6", "#d3e2d6"];
  return colors[index % colors.length];
}

function addObjectAt(presetId, x, y) {
  const preset = presets[presetId];
  const item = makeObject(preset.id, snap(x - preset.w / 2), snap(y - preset.d / 2), 0);
  constrainRect(item);
  state.objects.push(item);
  setSelected(item.id);
}

function addObjectAtSelection() {
  const selected = getSelected();
  if (selected) {
    const item = selected.item;
    addObjectAt(el.presetSelect.value, item.x + item.w / 2, item.y + item.d / 2);
  } else {
    addObjectAt(el.presetSelect.value, state.land.width / 2, state.land.depth / 2);
  }
}

function applyRecommendedLayout() {
  const rec = calculateRecommendation();
  const r = rec.recommendedRect;
  const x = r.x;
  const y = r.y;
  const w = r.w;
  const d = r.d;
  const topD = d * 0.56;
  const bottomD = d - topD;
  const leftW = w * 0.58;
  const rightW = w - leftW;
  const lowerA = w * 0.28;
  const lowerB = w * 0.24;
  const lowerC = w * 0.22;
  const lowerD = w - lowerA - lowerB - lowerC;
  state.rooms = [
    makeRoom("LDK", x, y, leftW, topD, "#f2d1a0"),
    makeRoom("主寝室", x + leftW, y, rightW, topD * 0.58, "#d7dfc4"),
    makeRoom(rec.recommendedTsubo >= 24 ? "子ども室" : "書斎", x + leftW, y + topD * 0.58, rightW, topD * 0.42, "#cfe0e8"),
    makeRoom("水回り", x, y + topD, lowerA, bottomD, "#d9e8ec"),
    makeRoom("玄関", x + lowerA, y + topD, lowerB, bottomD, "#ead9bf"),
    makeRoom("収納", x + lowerA + lowerB, y + topD, lowerC, bottomD, "#ded7c2"),
    makeRoom("予備室", x + lowerA + lowerB + lowerC, y + topD, lowerD, bottomD, "#d8d0e6")
  ].filter((room) => room.w >= 0.8 && room.d >= 0.8);

  const parkingW = Math.min(state.land.width * 0.42, rec.parkingCount * rec.profile.parkingWidth + 0.8);
  const parkingD = Math.min(rec.profile.parkingDepth, state.land.depth * 0.32);
  const parkingX = clamp(state.land.width - parkingW - 0.8, 0.4, state.land.width - parkingW);
  const parkingY = clamp(state.land.depth - parkingD - 0.8, 0.4, state.land.depth - parkingD);
  state.objects = [
    configuredObject("sofa", x + 0.55, y + 0.75, Math.min(2.4, leftW * 0.42), 0.9, 0),
    configuredObject("dining", x + leftW * 0.58, y + 0.75, 1.8, 1.0, 0),
    configuredObject("kitchen", x + 0.45, y + Math.max(0.8, topD - 0.95), Math.min(2.8, leftW * 0.55), 0.7, 0),
    configuredObject("bed", x + leftW + 0.4, y + 0.45, Math.min(2.1, rightW - 0.8), 1.4, 0),
    configuredObject("bath", x + 0.35, y + topD + 0.35, Math.min(1.6, lowerA - 0.5), 1.2, 0),
    configuredObject("toilet", x + lowerA * 0.56, y + topD + 0.35, 0.8, 1.1, 0),
    configuredObject("door", x + lowerA + lowerB * 0.35, y + d - 0.08, 0.9, 0.12, 0),
    configuredObject("sliding", x + Math.max(0.8, leftW * 0.45), y - 0.05, Math.min(2.4, leftW * 0.5), 0.1, 0),
    configuredObject("parking", parkingX, parkingY, parkingW, parkingD, 0),
    configuredObject("car", parkingX + 0.3, parkingY + 0.35, Math.min(4.4, parkingW - 0.6), 1.85, 0),
    configuredObject("path", x + lowerA + lowerB * 0.35, Math.min(y + d, state.land.depth - 4.5), 1.2, Math.min(4.5, state.land.depth - (y + d) + 0.4), 0),
    configuredObject("tree", Math.max(0.6, state.land.width - 2.2), Math.max(0.6, y - 0.1), 1.2, 1.2, 0),
    configuredObject("garden", Math.max(0.5, parkingX - 3.2), parkingY - 1.8, 3.0, 1.6, 0)
  ];
  rec.snowZones.forEach((zone, index) => {
    state.objects.push({
      id: `snow-${Date.now()}-${index}`,
      preset: "snow",
      kind: "exterior",
      name: zone.label,
      x: zone.x,
      y: zone.y,
      w: zone.w,
      d: zone.d,
      h: 0.04,
      z: 0,
      rotation: 0,
      color: "#b9d9e6"
    });
  });
  constrainAll();
  view.selectedId = null;
  render();
}

function makeRoom(name, x, y, w, d, color) {
  return {
    id: `room-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name,
    x: snap(x),
    y: snap(y),
    w: Math.max(0.8, snap(w)),
    d: Math.max(0.8, snap(d)),
    h: 2.45,
    z: 0,
    color
  };
}

function configuredObject(presetId, x, y, w, d, rotation) {
  const item = makeObject(presetId, snap(x), snap(y), rotation);
  item.w = Math.max(0.1, snap(w));
  item.d = Math.max(0.1, snap(d));
  return item;
}

function duplicateSelected() {
  const selected = getSelected();
  if (!selected) return;
  const item = cloneState(selected.item);
  item.id = `${selected.type}-${Date.now()}`;
  item.name = `${item.name} コピー`;
  item.x = snap(item.x + 0.5);
  item.y = snap(item.y + 0.5);
  constrainRect(item);
  if (selected.type === "room") {
    state.rooms.push(item);
  } else {
    state.objects.push(item);
  }
  setSelected(item.id);
}

function rotateSelected() {
  const selected = getSelected();
  if (!selected || selected.type === "room") return;
  selected.item.rotation = ((selected.item.rotation || 0) + 90) % 360;
  render();
}

function deleteSelected() {
  if (!view.selectedId) return;
  state.rooms = state.rooms.filter((item) => item.id !== view.selectedId);
  state.objects = state.objects.filter((item) => item.id !== view.selectedId);
  view.selectedId = null;
  render();
}

function hitTest(world) {
  for (let i = state.objects.length - 1; i >= 0; i -= 1) {
    const item = state.objects[i];
    if (containsRotatedRect(item, world.x, world.y)) return { item, type: "object" };
  }
  for (let i = state.rooms.length - 1; i >= 0; i -= 1) {
    const item = state.rooms[i];
    if (world.x >= item.x && world.x <= item.x + item.w && world.y >= item.y && world.y <= item.y + item.d) {
      return { item, type: "room" };
    }
  }
  return null;
}

function containsRotatedRect(item, x, y) {
  const cx = item.x + item.w / 2;
  const cy = item.y + item.d / 2;
  const angle = -((item.rotation || 0) * Math.PI) / 180;
  const dx = x - cx;
  const dy = y - cy;
  const rx = dx * Math.cos(angle) - dy * Math.sin(angle);
  const ry = dx * Math.sin(angle) + dy * Math.cos(angle);
  return Math.abs(rx) <= item.w / 2 && Math.abs(ry) <= item.d / 2;
}

function pointerWorld(event) {
  const rect = el.planCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return screenToWorld(x, y);
}

function handlePointerDown(event) {
  el.planCanvas.setPointerCapture(event.pointerId);
  const world = pointerWorld(event);
  if (view.mode === "add") {
    addObjectAt(el.presetSelect.value, clamp(world.x, 0, state.land.width), clamp(world.y, 0, state.land.depth));
    return;
  }
  const hit = hitTest(world);
  if (!hit) {
    setSelected(null);
    return;
  }
  view.selectedId = hit.item.id;
  view.dragging = {
    id: hit.item.id,
    offsetX: world.x - hit.item.x,
    offsetY: world.y - hit.item.y
  };
  render();
}

function handlePointerMove(event) {
  const world = pointerWorld(event);
  el.cursorReadout.textContent = `${format(clamp(world.x, 0, state.land.width), 2)} m, ${format(clamp(world.y, 0, state.land.depth), 2)} m`;
  if (!view.dragging) return;
  const selected = getSelected();
  if (!selected) return;
  const item = selected.item;
  item.x = snap(world.x - view.dragging.offsetX);
  item.y = snap(world.y - view.dragging.offsetY);
  constrainRect(item);
  render();
}

function handlePointerUp(event) {
  view.dragging = null;
  try {
    el.planCanvas.releasePointerCapture(event.pointerId);
  } catch {
    // Pointer capture may already be released by the browser.
  }
}

function handleKeyboard(event) {
  if (event.target && ["INPUT", "SELECT", "TEXTAREA"].includes(event.target.tagName)) return;
  if (event.key === "Delete" || event.key === "Backspace") deleteSelected();
  if (event.key.toLowerCase() === "r") rotateSelected();
  if (event.key.toLowerCase() === "a") setMode("add");
  if (event.key === "Escape") setMode("select");
}

function render() {
  renderVersionState();
  syncControlsFromState();
  drawPlan();
  drawPerspective();
  renderMetrics();
  renderRecommendationPanel();
  renderRoomList();
  renderInspector();
  renderEmbedSnippet();
  el.zoomReadout.textContent = `${Math.round(view.zoom * 100)}%`;
}

function renderEmbedSnippet() {
  const path = window.location.href.split("#")[0];
  const url = `${path}#embed`;
  el.embedSnippet.value = `<iframe src="${url}" width="100%" height="820" loading="lazy" style="border:0;border-radius:12px;max-width:1440px;"></iframe>`;
}

function saveLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  flashSubtitle("保存しました");
}

function loadLocal() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    flashSubtitle("保存データがありません");
    return;
  }
  try {
    state = normalizeState(JSON.parse(saved));
    view.selectedId = null;
    view.zoom = 1;
    render();
    flashSubtitle("復元しました");
  } catch {
    flashSubtitle("復元に失敗しました");
  }
}

function normalizeState(input) {
  const base = createSampleState();
  const normalized = {
    land: { ...base.land, ...(input.land || {}) },
    settings: { ...base.settings, ...(input.settings || {}) },
    rooms: Array.isArray(input.rooms) ? input.rooms : [],
    objects: Array.isArray(input.objects) ? input.objects : []
  };
  normalized.rooms.forEach((room, index) => {
    room.id ||= `room-import-${index}`;
    room.name ||= `部屋 ${index + 1}`;
    room.color ||= nextRoomColor(index);
    room.h ||= 2.4;
    constrainRectWithLand(room, normalized.land);
  });
  normalized.objects.forEach((item, index) => {
    item.id ||= `object-import-${index}`;
    item.name ||= presets[item.preset]?.name || `配置 ${index + 1}`;
    item.kind ||= presets[item.preset]?.kind || "furniture";
    item.color ||= presets[item.preset]?.color || "#88948e";
    item.h ||= presets[item.preset]?.h || 0.8;
    item.z ??= presets[item.preset]?.z ?? openingBaseHeight(item.preset);
    item.rotation ||= 0;
    constrainRectWithLand(item, normalized.land);
  });
  return normalized;
}

function constrainRectWithLand(item, land) {
  item.w = clamp(Number(item.w) || 0.1, 0.1, land.width);
  item.d = clamp(Number(item.d) || 0.1, 0.1, land.depth);
  item.x = clamp(Number(item.x) || 0, 0, Math.max(0, land.width - item.w));
  item.y = clamp(Number(item.y) || 0, 0, Math.max(0, land.depth - item.d));
  item.h = clamp(Number(item.h) || 0.05, 0.01, 12);
  item.z = clamp(Number(item.z) || 0, 0, 8);
}

function flashSubtitle(message) {
  const previous = "実寸平面図と外構パース";
  el.projectSubtitle.textContent = message;
  window.clearTimeout(flashSubtitle.timer);
  flashSubtitle.timer = window.setTimeout(() => {
    el.projectSubtitle.textContent = previous;
  }, 1300);
}

function exportJson() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    ...state
  };
  download("house-plan.json", JSON.stringify(payload, null, 2), "application/json");
}

function importJson(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      state = normalizeState(JSON.parse(reader.result));
      view.selectedId = null;
      view.zoom = 1;
      render();
      flashSubtitle("JSONを読み込みました");
    } catch {
      flashSubtitle("JSONを確認してください");
    }
  });
  reader.readAsText(file);
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadCanvas(canvas, filename) {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function downloadHighResPerspective() {
  const quality = state.settings.renderQuality || "high";
  const width = quality === "ultra" ? 3600 : 2800;
  const height = quality === "ultra" ? 2400 : 1860;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  drawPerspectiveScene(ctx, width, height);
  downloadCanvas(canvas, "house-perspective-hires.png");
}

async function copyEmbedSnippet() {
  renderEmbedSnippet();
  el.embedSnippet.select();
  try {
    await navigator.clipboard.writeText(el.embedSnippet.value);
    flashSubtitle("埋込コードをコピーしました");
  } catch {
    document.execCommand("copy");
    flashSubtitle("埋込コードを選択しました");
  }
}

function toggleEmbedMode() {
  state.settings.embedMode = !state.settings.embedMode;
  render();
}

function clearProject() {
  if (!window.confirm("現在の図面を全削除しますか？")) return;
  state.rooms = [];
  state.objects = [];
  view.selectedId = null;
  render();
}

function bindEvents() {
  [
    el.landWidthInput,
    el.landDepthInput,
    el.orientationInput,
    el.regionInput,
    el.gridInput,
    el.cameraAngleInput,
    el.depthScaleInput,
    el.verticalScaleInput,
    el.wallThicknessInput,
    el.roofPitchInput,
    el.wallOpacityInput,
    el.materialStyleInput,
    el.renderQualityInput,
    el.sunAngleInput,
    el.snapToggle,
    el.dimToggle,
    el.roofToggle,
    el.shadowToggle,
    el.opening3dToggle,
    el.textureToggle,
    el.landscapeToggle
  ].forEach((control) => {
    control.addEventListener("input", updateStateFromControls);
    control.addEventListener("change", updateStateFromControls);
  });

  el.simpleVersionBtn.addEventListener("click", () => setVersion("simple"));
  el.detailVersionBtn.addEventListener("click", () => setVersion("detail"));
  el.selectModeBtn.addEventListener("click", () => setMode("select"));
  el.addModeBtn.addEventListener("click", () => setMode("add"));
  el.addRoomBtn.addEventListener("click", () => addRoomAt());
  el.addObjectBtn.addEventListener("click", addObjectAtSelection);
  el.applyRecommendationBtn.addEventListener("click", applyRecommendedLayout);
  el.zoomOutBtn.addEventListener("click", () => {
    view.zoom = clamp(view.zoom - 0.12, 0.45, 2.4);
    render();
  });
  el.zoomInBtn.addEventListener("click", () => {
    view.zoom = clamp(view.zoom + 0.12, 0.45, 2.4);
    render();
  });
  el.fitBtn.addEventListener("click", () => {
    view.zoom = 1;
    render();
  });
  el.saveBtn.addEventListener("click", saveLocal);
  el.loadBtn.addEventListener("click", loadLocal);
  el.exportJsonBtn.addEventListener("click", exportJson);
  el.importJsonBtn.addEventListener("click", () => el.importFile.click());
  el.importFile.addEventListener("change", () => importJson(el.importFile.files[0]));
  el.planPngBtn.addEventListener("click", () => downloadCanvas(el.planCanvas, "floor-plan.png"));
  el.perspectivePngBtn.addEventListener("click", () => downloadCanvas(el.perspectiveCanvas, "perspective.png"));
  el.hiResPngBtn.addEventListener("click", downloadHighResPerspective);
  el.embedModeBtn.addEventListener("click", toggleEmbedMode);
  el.copyEmbedBtn.addEventListener("click", copyEmbedSnippet);
  el.sampleBtn.addEventListener("click", () => {
    state = createSampleState();
    view.selectedId = null;
    view.zoom = 1;
    render();
  });
  el.clearBtn.addEventListener("click", clearProject);

  el.planCanvas.addEventListener("pointerdown", handlePointerDown);
  el.planCanvas.addEventListener("pointermove", handlePointerMove);
  el.planCanvas.addEventListener("pointerup", handlePointerUp);
  el.planCanvas.addEventListener("pointerleave", handlePointerUp);
  window.addEventListener("keydown", handleKeyboard);
  window.addEventListener("resize", render);
}

setupPresetSelect();
if (isEmbedUrl()) {
  state.settings.embedMode = true;
}
syncControlsFromState();
bindEvents();
render();

function isEmbedUrl() {
  return window.location.hash === "#embed" || window.location.href.includes("#embed");
}
