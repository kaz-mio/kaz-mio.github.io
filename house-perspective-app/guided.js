(function () {
  const api = window.HousePerspectiveStudio;
  if (!api) return;

  const get = (id) => document.getElementById(id);
  const controls = {
    landWidth: get("quickLandWidth"),
    landDepth: get("quickLandDepth"),
    region: get("quickRegion"),
    residents: get("quickResidents"),
    floors: get("quickFloors"),
    bedrooms: get("quickBedrooms"),
    parking: get("quickParking"),
    priority: get("quickPriority")
  };

  const resultElements = {
    grade: get("planGrade"),
    score: get("planScore"),
    ring: get("planScoreRing"),
    status: get("planStatus"),
    headline: get("planHeadline"),
    floorArea: get("guidedFloorArea"),
    coverage: get("guidedCoverage"),
    exterior: get("guidedExterior"),
    breakdown: get("scoreBreakdown"),
    checks: get("professionalChecks")
  };

  function syncForm() {
    const brief = api.getBrief();
    Object.entries(controls).forEach(([key, control]) => {
      if (control && brief[key] !== undefined) control.value = String(brief[key]);
    });
  }

  function readForm() {
    return {
      landWidth: Number(controls.landWidth.value),
      landDepth: Number(controls.landDepth.value),
      region: controls.region.value,
      residents: Number(controls.residents.value),
      floors: Number(controls.floors.value),
      bedrooms: Number(controls.bedrooms.value),
      parking: Number(controls.parking.value),
      priority: controls.priority.value
    };
  }

  function renderReport(result) {
    const assessment = result || api.getAssessment();
    resultElements.grade.textContent = assessment.grade;
    resultElements.score.textContent = assessment.overall;
    resultElements.ring.style.setProperty("--score", assessment.overall);
    resultElements.status.textContent = assessment.status;
    resultElements.headline.textContent = assessment.headline;
    resultElements.floorArea.textContent = assessment.totalFloorArea.toFixed(1);
    resultElements.coverage.textContent = assessment.coverage.toFixed(1);
    resultElements.exterior.textContent = assessment.exteriorArea.toFixed(1);
    resultElements.breakdown.replaceChildren();
    Object.entries(assessment.scores).forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "score-row";
      row.innerHTML = `<span>${label}</span><i style="--value:${value}"></i><b>${value}</b>`;
      resultElements.breakdown.appendChild(row);
    });
    resultElements.checks.replaceChildren();
    assessment.checks.forEach((check) => {
      const item = document.createElement("li");
      item.textContent = check;
      resultElements.checks.appendChild(item);
    });
    scheduleHeightMessage();
  }

  function createPlan() {
    const button = get("quickPlanBtn");
    button.disabled = true;
    button.textContent = "提案プランを作成中…";
    const result = api.applyGuidedBrief(readForm());
    syncForm();
    renderReport(result);
    window.setTimeout(() => {
      button.disabled = false;
      button.textContent = "この条件で提案プランを作る";
    }, 420);
  }

  function resetSample() {
    const result = api.resetSample();
    syncForm();
    renderReport(result);
  }

  async function copyReport() {
    const button = get("copyPlanReportBtn");
    const text = api.getReportText();
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "コピーしました";
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      button.textContent = "コピーしました";
    }
    window.setTimeout(() => { button.textContent = "提案メモをコピー"; }, 1200);
  }

  let heightTimer = 0;
  function scheduleHeightMessage() {
    window.clearTimeout(heightTimer);
    heightTimer = window.setTimeout(() => {
      if (window.parent === window) return;
      window.parent.postMessage({
        type: "kaz-mio-house-planner-height",
        height: Math.ceil(document.documentElement.scrollHeight)
      }, window.location.origin);
    }, 80);
  }

  get("quickPlanBtn").addEventListener("click", createPlan);
  get("quickSampleBtn").addEventListener("click", resetSample);
  get("copyPlanReportBtn").addEventListener("click", copyReport);
  get("printPlanReportBtn").addEventListener("click", () => window.print());
  window.addEventListener("house-planner-render", () => renderReport());
  window.addEventListener("resize", scheduleHeightMessage);
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(scheduleHeightMessage);
    observer.observe(document.body);
  }

  syncForm();
  renderReport();
  scheduleHeightMessage();
})();
