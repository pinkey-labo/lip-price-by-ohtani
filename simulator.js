// ── elements ──
const catSel     = document.getElementById('cat');
const colorSns   = document.getElementById('color-sns');
const colorKaisu = document.getElementById('color-kaisu');
const kusumiSns  = document.getElementById('kusumi-sns');
const shimiType  = document.getElementById('shimi-type');

const rowColorSns   = document.getElementById('row-color-sns');
const rowColorKaisu = document.getElementById('row-color-kaisu');
const rowKusumi     = document.getElementById('row-kusumi');
const rowShimi      = document.getElementById('row-shimi');

const alNoSameday = document.getElementById('al-no-sameday');
const alSameday   = document.getElementById('al-sameday');
const alSns       = document.getElementById('al-sns');

const totalEl = document.getElementById('total');
const s1      = document.getElementById('s1');
const s2      = document.getElementById('s2');
const s2label = document.getElementById('s2-label');
const s2sub   = document.getElementById('s2-sub');

// ── prices ──
const P = {
  color: {
    zengan: 49800,
    kuchi:  { shokai: 55000, '2nd-3m': 45000, '2nd-4m': 55000, other: 55000 },
    nashi:  70000,
  },
  kusumi: { kuchi: 40000, nashi: 45000 },
  shimi:  { set: 10000, solo: 30000 },
};

// ── helpers ──
function setAlert(el, show) { el.classList.toggle('show', show); }
function resetAlerts() { [alNoSameday, alSameday, alSns].forEach(a => setAlert(a, false)); }

function bumpTotal(val) {
  totalEl.classList.remove('bump');
  void totalEl.offsetWidth;
  totalEl.textContent = val !== null ? '¥ ' + val.toLocaleString() : '¥ —';
  if (val !== null) {
    totalEl.classList.add('bump');
    setTimeout(() => totalEl.classList.remove('bump'), 300);
  }
}

function hideAllSubs() {
  [rowColorSns, rowColorKaisu, rowKusumi, rowShimi].forEach(r => r.classList.remove('open'));
  colorSns.value = ''; colorKaisu.value = '';
  kusumiSns.value = ''; shimiType.value = '';
}

function syncStepStyle() {
  const has = !!catSel.value;
  s1.classList.toggle('active', !has);
  s1.classList.toggle('done',    has);
  s2.classList.toggle('active',  has);
  // STEP1選択直後だけpulse → STEP2操作したら止める
  if (has) {
    s2.classList.add('pulse');
  } else {
    s2.classList.remove('pulse');
  }
}

function stopPulse() { s2.classList.remove('pulse'); }

// ── events ──
catSel.addEventListener('change', () => {
  const cat = catSel.value;
  hideAllSubs(); resetAlerts(); bumpTotal(null); syncStepStyle();

  if (cat === 'color') {
    s2label.textContent = 'SNS掲載を選ぶ';
    s2sub.textContent   = '掲載範囲・条件を選択してください';
    rowColorSns.classList.add('open');
  } else if (cat === 'kusumi') {
    s2label.textContent = 'SNS掲載を選ぶ';
    s2sub.textContent   = '掲載範囲を選択してください';
    rowKusumi.classList.add('open');
    setAlert(alNoSameday, true);
  } else if (cat === 'shimi') {
    s2label.textContent = '施術パターンを選ぶ';
    s2sub.textContent   = '単独か、色入れとのセットか';
    rowShimi.classList.add('open');
  } else {
    s2label.textContent = '詳細を選ぶ';
    s2sub.textContent   = 'STEP 1 を選択してください';
  }
});

colorSns.addEventListener('change', () => {
  stopPulse();
  const v = colorSns.value;
  rowColorKaisu.classList.remove('open');
  colorKaisu.value = '';
  resetAlerts(); bumpTotal(null);

  if (v === 'zengan') {
    bumpTotal(P.color.zengan);
    setAlert(alSns, true);
  } else if (v === 'kuchi') {
    rowColorKaisu.classList.add('open');
    setAlert(alSns, true);
  } else if (v === 'nashi') {
    bumpTotal(P.color.nashi);
  }
});

colorKaisu.addEventListener('change', () => {
  stopPulse();
  const v = colorKaisu.value;
  if (!v) { bumpTotal(null); return; }
  bumpTotal(P.color.kuchi[v]);
});

kusumiSns.addEventListener('change', () => {
  stopPulse();
  const v = kusumiSns.value;
  resetAlerts();
  setAlert(alNoSameday, true);
  if (!v) { bumpTotal(null); return; }
  if (v === 'kuchi') setAlert(alSns, true);
  bumpTotal(P.kusumi[v]);
});

shimiType.addEventListener('change', () => {
  stopPulse();
  const v = shimiType.value;
  resetAlerts();
  if (!v) { bumpTotal(null); return; }
  if (v === 'set') setAlert(alSameday, true);
  bumpTotal(P.shimi[v]);
});

// ── init ──
syncStepStyle();
