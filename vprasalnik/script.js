const NIKA_EMAIL = "nikadevstudio@gmail.com";
const STORAGE_KEY = "nika_vprasalnik_v2";

const form = document.getElementById("vform");
const progressFill = document.getElementById("progressFill");
const progressTxt = document.getElementById("progressTxt");
const result = document.getElementById("result");
const resultBox = document.getElementById("resultBox");
const resultDesc = document.getElementById("resultDesc");
const sendStatus = document.getElementById("sendStatus");
const sendBtn = document.getElementById("sendBtn");
const toast = document.getElementById("toast");

function val(name) {
  const el = document.querySelector(`[name="${name}"]`);
  return el ? el.value.trim() : "";
}

function getChecks(group) {
  return [...document.querySelectorAll(`.checks[data-group="${group}"] input:checked`)].map(
    (input) => input.value
  );
}

function syncCheckVisual(item) {
  const checkbox = item.querySelector('input[type="checkbox"]');
  item.classList.toggle("on", checkbox.checked);
}

function handleExclusiveOption(group, changedInput) {
  const exclusiveValue = group.dataset.exclusiveValue;
  if (!exclusiveValue) return;

  const inputs = [...group.querySelectorAll('input[type="checkbox"]')];
  const exclusive = inputs.find((input) => input.value === exclusiveValue);
  if (!exclusive) return;

  if (changedInput === exclusive && exclusive.checked) {
    inputs.forEach((input) => {
      if (input !== exclusive) input.checked = false;
    });
  } else if (changedInput !== exclusive && changedInput.checked) {
    exclusive.checked = false;
  }

  group.querySelectorAll(".check-item").forEach(syncCheckVisual);
}

function initCheckboxes() {
  document.querySelectorAll(".check-item").forEach((item) => {
    const checkbox = item.querySelector('input[type="checkbox"]');

    item.addEventListener("click", (event) => {
      if (event.target !== checkbox) {
        event.preventDefault();
        checkbox.checked = !checkbox.checked;
      }

      const group = item.closest(".checks");
      handleExclusiveOption(group, checkbox);
      syncCheckVisual(item);
      saveForm();
      updateProgress();
    });

    syncCheckVisual(item);
  });
}

function saveForm() {
  const data = { text: {}, checks: {} };

  form
    .querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea')
    .forEach((el) => {
      data.text[el.name] = el.value;
    });

  form.querySelectorAll(".checks").forEach((group) => {
    data.checks[group.dataset.group] = [...group.querySelectorAll("input:checked")].map(
      (input) => input.value
    );
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Shranjevanje vprašalnika ni uspelo.", error);
  }
}

function loadForm() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    if (data.text) {
      Object.entries(data.text).forEach(([name, value]) => {
        const el = document.querySelector(`[name="${name}"]`);
        if (el) el.value = value;
      });
    }

    if (data.checks) {
      Object.entries(data.checks).forEach(([groupName, values]) => {
        const group = document.querySelector(`.checks[data-group="${groupName}"]`);
        if (!group) return;

        group.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
          checkbox.checked = values.includes(checkbox.value);
          syncCheckVisual(checkbox.closest(".check-item"));
        });
      });
    }
  } catch (error) {
    console.warn("Obnovitev vprašalnika ni uspela.", error);
  }
}

function updateProgress() {
  const progressFields = [...form.querySelectorAll('[data-progress="true"]')];
  const progressGroups = [...form.querySelectorAll('[data-progress-group="true"]')];

  const total = progressFields.length + progressGroups.length;
  let filled = 0;

  progressFields.forEach((field) => {
    if (field.value.trim()) filled += 1;
  });

  progressGroups.forEach((group) => {
    if (group.querySelector("input:checked")) filled += 1;
  });

  const pct = total ? Math.round((filled / total) * 100) : 0;
  progressFill.style.width = `${pct}%`;
  progressTxt.textContent = `${pct} % izpolnjeno`;
}

function listOrDash(items) {
  return items.length ? items.map((item) => `• ${item}`).join("\n") : "—";
}

function generateSummary() {
  const lines = [];

  lines.push("VPRAŠALNIK ZA SPLETNO STRAN — Nika Dev Studio");
  lines.push("═══════════════════════════════════════");
  lines.push("");

  lines.push("▸ O PODJETJU");
  lines.push(`Podjetje: ${val("ime_podjetja") || "—"}`);
  lines.push(`Kontaktna oseba: ${val("kontakt_oseba") || "—"}`);
  lines.push(`Telefon: ${val("telefon") || "—"}`);
  lines.push(`E-pošta: ${val("email") || "—"}`);
  lines.push(`Naslov / lokacija: ${val("naslov") || "—"}`);
  lines.push("");

  lines.push("▸ DEJAVNOST");
  lines.push(`Opis: ${val("dejavnost") || "—"}`);
  lines.push(`Glavne storitve / izdelki: ${val("storitve") || "—"}`);
  lines.push(`Stranke: ${val("stranke") || "—"}`);
  lines.push("");

  lines.push("▸ CILJI SPLETNE STRANI");
  lines.push(listOrDash(getChecks("cilji")));
  lines.push("");

  lines.push("▸ VSEBINA STRANI");
  lines.push(listOrDash(getChecks("vsebina")));
  lines.push(`Delovni čas: ${val("delovni_cas") || "—"}`);
  lines.push("");

  lines.push("▸ IZDELKI IN SPLETNA PRODAJA");
  lines.push(listOrDash(getChecks("izdelki")));
  lines.push(`Približno število izdelkov: ${val("st_izdelkov") || "—"}`);
  lines.push(`Kako pogosto se ponudba spreminja: ${val("pogostost") || "—"}`);
  lines.push("");

  lines.push("▸ GRADIVO");
  lines.push(listOrDash(getChecks("gradivo")));
  lines.push(`Fotografije: ${listOrDash(getChecks("fotografije"))}`);
  lines.push(`Fotografije trgovine / delavnice / izdelave: ${val("dodatne_foto") || "—"}`);
  lines.push(`Domena / obstoječa stran: ${val("domena") || "—"}`);
  lines.push("");

  lines.push("▸ JEZIKI");
  lines.push(listOrDash(getChecks("jeziki")));
  lines.push(`Drug jezik: ${val("drugi_jezik") || "—"}`);
  lines.push("");

  lines.push("▸ VIDEZ IN STIL");
  lines.push(`Stil: ${val("stil") || "—"}`);
  lines.push(`Želeni občutek: ${val("obcutek") || "—"}`);
  lines.push(`Barve: ${val("barve") || "—"}`);
  lines.push(`Primeri strani: ${val("primeri") || "—"}`);
  lines.push("");

  lines.push("▸ TISK NA TEKSTIL");
  lines.push(listOrDash(getChecks("tisk")));
  lines.push(`Približna količina: ${val("tisk_kolicina") || "—"}`);
  lines.push(`Logotip / motiv: ${val("tisk_motiv") || "—"}`);
  lines.push("");

  lines.push("▸ DODATNO");
  lines.push(`Posebne želje / opombe: ${val("opombe") || "—"}`);
  lines.push(`Želeni rok: ${val("rok") || "—"}`);

  const text = lines.join("\n");
  resultBox.textContent = text;
  result.classList.add("show");
  return text;
}

function validateForSending() {
  if (!val("ime_podjetja") && !val("kontakt_oseba")) {
    showToast("Vpišite ime podjetja ali kontaktno osebo.", "error");
    document.getElementById("ime_podjetja").focus();
    return false;
  }

  if (!val("email") && !val("telefon")) {
    showToast("Vpišite e-pošto ali telefonsko številko.", "error");
    document.getElementById("telefon").focus();
    return false;
  }

  return true;
}

async function createAndSendSummary() {
  if (!validateForSending()) return;

  const text = generateSummary();
  const company = val("ime_podjetja") || val("kontakt_oseba") || "novo povpraševanje";
  const payload = new FormData();

  payload.append("_subject", `Nov vprašalnik za spletno stran — ${company}`);
  payload.append("_template", "table");
  payload.append("Podjetje", company);
  payload.append("Kontaktna oseba", val("kontakt_oseba") || "—");
  payload.append("E-pošta", val("email") || "—");
  payload.append("Telefon", val("telefon") || "—");
  payload.append("Povzetek", text);

  if (val("email")) payload.append("_replyto", val("email"));

  sendBtn.disabled = true;
  sendBtn.textContent = "Pošiljanje ...";
  sendStatus.className = "send-status sending";
  sendStatus.textContent = "Povzetek se pošilja ...";

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${NIKA_EMAIL}`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: payload,
    });

    if (!response.ok) throw new Error("Pošiljanje ni uspelo.");

    sendStatus.className = "send-status success";
    sendStatus.textContent = "Hvala! Vaši odgovori so bili uspešno poslani na Nika Dev Studio.";
    resultDesc.textContent = "Povzetek je bil poslan — spodaj ga lahko tudi pregledate";
    localStorage.removeItem(STORAGE_KEY);
    showToast("Vprašalnik je bil poslan! ✦");
  } catch (error) {
    console.error(error);
    sendStatus.className = "send-status error";
    sendStatus.textContent =
      "Pošiljanje trenutno ni uspelo. Vaši odgovori niso izgubljeni — spodaj jih lahko kopirate ali odprete v e-pošti.";
    resultDesc.textContent = "Povzetek vaših odgovorov";
    showToast("Pošiljanje ni uspelo. Poskusite znova.", "error");
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Ustvari in pošlji povzetek ✦";
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

async function copyResult() {
  const text = resultBox.textContent;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    showToast();
  } catch {
    const range = document.createRange();
    range.selectNode(resultBox);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("copy");
    selection.removeAllRanges();
    showToast();
  }
}

function sendEmail() {
  const text = resultBox.textContent || "";
  const company = val("ime_podjetja") || "novo povpraševanje";
  const subject = encodeURIComponent(`Vprašalnik za spletno stran — ${company}`);
  const body = encodeURIComponent(text);
  window.location.href = `mailto:${NIKA_EMAIL}?subject=${subject}&body=${body}`;
}

function showToast(message = "Besedilo kopirano! ✦", type = "success") {
  toast.textContent = message;
  toast.classList.toggle("error", type === "error");
  toast.classList.add("show");
  window.setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.remove("error");
  }, 2600);
}

form.addEventListener("input", () => {
  saveForm();
  updateProgress();
});

sendBtn.addEventListener("click", createAndSendSummary);
document.getElementById("copyBtn").addEventListener("click", copyResult);
document.getElementById("emailBtn").addEventListener("click", sendEmail);

initCheckboxes();
loadForm();
updateProgress();
