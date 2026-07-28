import { groups } from "./generators/index.js";

const groupsEl = document.getElementById("groups");

/** @type {Map<string, { output: HTMLElement, copyBtn: HTMLButtonElement, generator: object }>} */
const rows = new Map();

const copyResetTimers = new Map();

function fallbackCopy(value) {
  const ta = document.createElement("textarea");
  ta.value = value;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.append(ta);
  ta.select();
  document.execCommand("copy");
  ta.remove();
}

function resetCopyButton(id) {
  const row = rows.get(id);
  if (!row) return;
  row.copyBtn.textContent = "Kopírovat";
  row.copyBtn.classList.remove("is-copied");
}

async function copyValue(id) {
  const row = rows.get(id);
  if (!row) return;
  const value = row.output.textContent;
  if (!value) return;

  try {
    await navigator.clipboard.writeText(value);
  } catch {
    fallbackCopy(value);
  }

  row.copyBtn.textContent = "Zkopírováno";
  row.copyBtn.classList.add("is-copied");
  clearTimeout(copyResetTimers.get(id));
  copyResetTimers.set(
    id,
    setTimeout(() => resetCopyButton(id), 1600),
  );
}

function setOutput(id, value) {
  const row = rows.get(id);
  if (!row) return;
  row.output.textContent = value;
  resetCopyButton(id);
}

function regenerate(id) {
  const row = rows.get(id);
  if (!row) return;

  setOutput(id, row.generator.generate());

  for (const linkedId of row.generator.linkedIds ?? []) {
    const linked = rows.get(linkedId);
    if (linked && typeof linked.generator.getCached === "function") {
      setOutput(linkedId, linked.generator.getCached());
    }
  }
}

function createGeneratorRow(generator) {
  const article = document.createElement("article");
  article.className = "generator";
  article.id = generator.id;

  const head = document.createElement("div");
  head.className = "generator-head";

  const title = document.createElement("h3");
  title.className = "generator-title";
  title.textContent = generator.title;

  const desc = document.createElement("p");
  desc.className = "generator-desc";
  desc.textContent = generator.description;

  head.append(title, desc);

  const outputWrap = document.createElement("div");
  outputWrap.className = "output-wrap";

  const output = document.createElement("output");
  output.className = "output";
  output.setAttribute("aria-live", "polite");

  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "btn btn-ghost";
  copyBtn.title = "Kopírovat";
  copyBtn.textContent = "Kopírovat";
  copyBtn.addEventListener("click", () => copyValue(generator.id));

  const generateBtn = document.createElement("button");
  generateBtn.type = "button";
  generateBtn.className = "btn btn-primary";
  generateBtn.title = "Generovat znovu";
  generateBtn.textContent = "Znovu";
  generateBtn.addEventListener("click", () => regenerate(generator.id));

  outputWrap.append(output, copyBtn, generateBtn);
  article.append(head, outputWrap);

  rows.set(generator.id, { output, copyBtn, generator });
  return article;
}

function render() {
  groupsEl.replaceChildren();
  rows.clear();

  if (!groups.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "Zatím není zaregistrovaný žádný typ řetězce.";
    groupsEl.append(empty);
    return;
  }

  for (const group of groups) {
    const section = document.createElement("section");
    section.className = "group";
    section.setAttribute("aria-labelledby", `group-${group.id}`);

    const heading = document.createElement("h2");
    heading.className = "group-title";
    heading.id = `group-${group.id}`;
    heading.textContent = group.title;

    const list = document.createElement("div");
    list.className = "group-body";

    for (const generator of group.generators) {
      list.append(createGeneratorRow(generator));
    }

    section.append(heading, list);
    groupsEl.append(section);
  }

  const initialized = new Set();
  for (const [id, row] of rows) {
    if (initialized.has(id)) continue;

    setOutput(id, row.generator.generate());
    initialized.add(id);

    for (const linkedId of row.generator.linkedIds ?? []) {
      const linked = rows.get(linkedId);
      if (!linked || typeof linked.generator.getCached !== "function") continue;
      setOutput(linkedId, linked.generator.getCached());
      initialized.add(linkedId);
    }
  }
}
render();
