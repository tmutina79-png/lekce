<script>
  /**
  * examples: Array<{ id: string; title: string; assignment: string; hint?: string; steps?: string[]; images?: Array<{ label?: string; src: string; alt?: string }> }>
   */
  let { examples = [], sheetTitle = 'Příklady k tisku (PDF)' } = $props();

  let selected = $state(new Set());

  // Per-example revealed step count (step-by-step disclosure)
  let revealed = $state(
    Object.fromEntries(
      examples.map((ex) => [ex.id, Math.min(1, (ex.steps ?? []).length)])
    )
  );

  function toggleSelected(id) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    selected = next;
  }

  function selectAll() {
    selected = new Set(examples.map((e) => e.id));
  }

  function clearAll() {
    selected = new Set();
  }

  function totalCount(id) {
    return (examples.find((e) => e.id === id)?.steps ?? []).length;
  }

  function revealedCount(id) {
    return revealed[id] ?? 0;
  }

  function nextStep(id) {
    const total = totalCount(id);
    const current = revealedCount(id);
    const next = Math.min(total, current + 1);
    revealed = { ...revealed, [id]: next };
  }

  function resetSteps(id) {
    const total = totalCount(id);
    revealed = { ...revealed, [id]: Math.min(1, total) };
  }

  function openPrintableWindow(selectedIds) {
    const chosen = examples.filter((e) => selectedIds.includes(e.id));
    if (chosen.length === 0) return;

    const w = window.open('', '_blank');
    if (!w) {
      alert('Nepodařilo se otevřít okno pro tisk. Zkontroluj blokování vyskakovacích oken.');
      return;
    }

    const escapeHtml = (s) => String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

    const docTitle = 'Úměrnost – pracovní list';

    const imagesHtml = (imgs) => {
      if (!imgs || imgs.length === 0) return '';
      return `
        <div class="img-grid">
          ${imgs.map((img) => `
            <figure class="img-item">
              <img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt ?? '')}" />
              ${img.label ? `<figcaption>${escapeHtml(img.label)}</figcaption>` : ''}
            </figure>
          `).join('')}
        </div>
      `;
    };

    const itemsHtml = chosen.map((e, i) => `
      <section class="item">
        <h2>${i + 1}. ${escapeHtml(e.title)}</h2>
        <div class="label">Zadání</div>
        <p>${escapeHtml(e.assignment).replaceAll('\n', '<br/>')}</p>
        ${imagesHtml(e.images)}
      </section>
    `).join('\n');

    w.document.open();
    w.document.write(`<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${docTitle}</title>
<style>
  @page { size: A4; margin: 14mm; }
  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #0f172a; }
  h1 { font-size: 18px; margin: 0 0 10px; }
  .meta { font-size: 12px; color: #475569; margin-bottom: 16px; }
  .item { break-inside: avoid; margin: 0 0 14px; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 10px; }
  h2 { font-size: 14px; margin: 0 0 8px; }
  .label { font-size: 11px; font-weight: 700; color: #1e3a8a; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 6px; }
  p { margin: 0; font-size: 12.5px; line-height: 1.45; }

  .img-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
  .img-item { margin: 0; border: 1px solid #e2e8f0; border-radius: 10px; padding: 6px; }
  .img-item img { width: 100%; height: auto; display: block; }
  .img-item figcaption { font-size: 11px; color: #475569; margin-top: 4px; font-weight: 700; }
  .hintline { margin-top: 10px; font-size: 12px; color: #475569; }
  .line { display: block; border-bottom: 1px solid #e2e8f0; height: 18px; }
</style>
</head>
<body>
  <h1>${escapeHtml(docTitle)}</h1>
  <div class="meta">Vybrané příklady k procvičování (bez řešení) • ${new Date().toLocaleDateString('cs-CZ')}</div>
  ${itemsHtml}
  <div class="hintline">Poznámky:</div>
  <span class="line"></span>
  <span class="line"></span>
  <span class="line"></span>
</body>
</html>`);
    w.document.close();

    // Auto-open the print dialog after the new document is rendered.
    // Note: avoid writing a closing script-tag sequence inside this component's <script>.
    setTimeout(() => {
      try {
        w.focus();
        w.print();
      } catch {
        // ignore
      }
    }, 300);
  }

  function generatePdf() {
    openPrintableWindow(Array.from(selected));
  }
</script>

<div class="examples">
  <div class="pdf-jump">
    <a href="#pdf" class="pdf-jump-link">🖨️ Vygenerovat příklady do PDF ↓</a>
    <span class="pdf-jump-sub">Vyber příklady a vytiskni si je</span>
  </div>

  {#each examples as ex, i}
    <section class="ex-card" id={ex.id}>
      <h2 class="ex-title">Příklad {i + 1}: {ex.title}</h2>

      <div class="ex-block">
        <div class="ex-label">📝 Zadání</div>
        <div class="ex-text">{ex.assignment}</div>
      </div>

      {#if ex.images && ex.images.length}
        <div class="img-grid">
          {#each ex.images as img}
            <figure class="img-item">
              <img class="img" src={img.src} alt={img.alt ?? ''} loading="lazy" />
              {#if img.label}
                <figcaption class="img-cap">{img.label}</figcaption>
              {/if}
            </figure>
          {/each}
        </div>
      {/if}

      {#if ex.hint}
        <details class="ex-details">
          <summary class="ex-summary">💡 Nápověda</summary>
          <div class="ex-details-body">{ex.hint}</div>
        </details>
      {/if}

      {#if ex.steps && ex.steps.length}
        <details class="ex-details">
          <summary class="ex-summary">📝 Postup řešení ({revealedCount(ex.id)}/{totalCount(ex.id)} kroků)</summary>

          <ol class="steps">
            {#each ex.steps.slice(0, revealedCount(ex.id)) as step}
              <li class="step"><span class="step-text">{step}</span></li>
            {/each}
          </ol>

          <div class="step-actions">
            <button
              type="button"
              class="step-btn"
              onclick={() => nextStep(ex.id)}
              disabled={revealedCount(ex.id) >= totalCount(ex.id)}
            >
              ➕ Další krok
            </button>
            <button
              type="button"
              class="step-btn step-btn-secondary"
              onclick={() => resetSteps(ex.id)}
              disabled={revealedCount(ex.id) <= 1}
            >
              ↩︎ Zpět na 1. krok
            </button>
          </div>
        </details>
      {/if}
    </section>
  {/each}

  <section id="pdf" class="pdf-card">
    <h2 class="pdf-title">🖨️ {sheetTitle}</h2>
    <p class="pdf-sub">Vyber si příklady, které chceš vytisknout, a klikni na tlačítko pro vygenerování PDF.</p>

    <div class="pdf-actions">
      <button type="button" class="pdf-link" onclick={selectAll}>☑️ Vybrat vše</button>
      <button type="button" class="pdf-link" onclick={clearAll}>⬜ Zrušit výběr</button>
    </div>

    <div class="pdf-list">
      {#each examples as ex}
        <label class="pdf-item">
          <input
            type="checkbox"
            checked={selected.has(ex.id)}
            onchange={() => toggleSelected(ex.id)}
          />
          <span>{ex.title}</span>
        </label>
      {/each}
    </div>

    <button type="button" class="pdf-btn" onclick={generatePdf} disabled={selected.size===0}>
      🖨️ Vygenerovat příklady do PDF ({selected.size})
    </button>

    <p class="pdf-note">Tip: pokud prohlížeč nabídne tisk, zvol „Uložit jako PDF“.</p>
  </section>
</div>

<style>
  .examples {
    margin: 18px 0 0;
  }

  .pdf-jump {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    padding: 12px 14px;
    border: 1px solid var(--color-primary-200);
    border-radius: 14px;
    background: var(--color-primary-50);
    margin: 12px 0 18px;
  }
  .pdf-jump-link {
    font-weight: 800;
    color: var(--color-primary-700);
    text-decoration: none;
  }
  .pdf-jump-link:hover {
    text-decoration: underline;
  }
  .pdf-jump-sub {
    color: var(--color-primary-600);
    font-size: 12px;
  }

  .ex-card {
    background: #fff;
    border: 1px solid var(--color-primary-200);
    border-radius: 18px;
    padding: 16px;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
    margin: 0 0 14px;
  }
  .ex-title {
    margin: 0 0 10px;
    font-size: 18px;
    font-weight: 800;
    color: var(--color-primary-700);
  }

  .ex-block {
    border: 1px solid var(--color-primary-200);
    background: var(--color-primary-50);
    border-radius: 14px;
    padding: 12px 12px;
  }

  .img-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin: 10px 0 0;
  }

  .img-item {
    margin: 0;
    border: 1px solid var(--color-primary-200);
    border-radius: 14px;
    background: #fff;
    padding: 8px;
  }

  .img {
    width: 100%;
    height: auto;
    display: block;
  }

  .img-cap {
    margin-top: 6px;
    font-size: 12px;
    font-weight: 900;
    color: var(--color-primary-700);
  }
  .ex-label {
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-primary-700);
    margin-bottom: 6px;
  }
  .ex-text {
    color: var(--color-primary-900);
    font-weight: 600;
    line-height: 1.55;
    white-space: pre-line;
  }

  .ex-details {
    margin-top: 10px;
    border: 1px solid var(--color-primary-200);
    border-radius: 14px;
    overflow: hidden;
    background: #fff;
  }
  .ex-summary {
    cursor: pointer;
    padding: 10px 12px;
    font-weight: 800;
    color: var(--color-primary-700);
    background: var(--color-primary-50);
    list-style: none;
  }
  .ex-summary::-webkit-details-marker { display: none; }
  .ex-details-body {
    padding: 10px 12px;
    color: var(--color-primary-900);
    line-height: 1.55;
    white-space: pre-line;
  }

  .steps {
    margin: 0;
    padding: 10px 14px 12px 30px;
  }
  .step { margin: 0 0 6px; }
  .step-text { color: var(--color-primary-900); line-height: 1.5; }

  .step-actions {
    display: flex;
    gap: 10px;
    padding: 0 12px 12px;
    flex-wrap: wrap;
  }

  .step-btn {
    border-radius: 12px;
    padding: 8px 12px;
    border: 1px solid var(--color-primary-200);
    background: #fff;
    color: var(--color-primary-800);
    font-weight: 800;
    cursor: pointer;
  }

  .step-btn:hover {
    border-color: var(--color-primary-400);
    background: var(--color-primary-50);
  }

  .step-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .step-btn-secondary {
    color: var(--color-primary-700);
  }

  .pdf-card {
    background: #fff;
    border: 1px solid var(--color-primary-200);
    border-radius: 18px;
    padding: 16px;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
    margin: 18px 0 0;
  }
  .pdf-title {
    margin: 0 0 6px;
    font-size: 18px;
    font-weight: 900;
    color: var(--color-primary-700);
  }
  .pdf-sub { margin: 0 0 12px; color: var(--color-primary-800); }

  .pdf-actions {
    display: flex;
    gap: 12px;
    margin-bottom: 10px;
    flex-wrap: wrap;
  }

  .pdf-link {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-weight: 800;
    color: var(--color-accent);
    text-decoration: underline;
  }

  .pdf-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
    margin: 10px 0 14px;
  }

  .pdf-item {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 10px 12px;
    border: 1px solid var(--color-primary-200);
    border-radius: 12px;
    background: var(--color-primary-50);
    font-weight: 700;
    color: var(--color-primary-900);
  }

  .pdf-btn {
    width: 100%;
    border-radius: 14px;
    padding: 12px 14px;
    border: 1px solid var(--color-primary-700);
    background: var(--color-primary-700);
    color: #fff;
    font-weight: 900;
    cursor: pointer;
  }
  .pdf-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .pdf-note {
    margin: 10px 0 0;
    color: var(--color-primary-600);
    font-size: 12px;
  }
</style>
