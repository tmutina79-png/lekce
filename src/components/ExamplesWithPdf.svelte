<script>
  /**
   * examples: Array<{ id: string; title: string; assignment: string; hint?: string; steps?: string[]; images?: Array<{ label?: string; src: string; alt?: string }> }>
   */
  let { examples = [] } = $props();

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
    if (chosen.length === 0) {
      alert('Vyber alespoň jeden příklad!');
      return;
    }

    const w = window.open('', '_blank');
    if (!w) {
      alert('Nepodařilo se otevřít okno pro tisk.');
      return;
    }

    const escapeHtml = (s) => String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

    // Build absolute base URL so images load in the blank print window
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    const origin = window.location.origin;
    const toAbsUrl = (src) => {
      if (/^https?:\/\//.test(src)) return src;
      // src starts with '/' – prepend origin + base
      return origin + base + src;
    };

    const docTitle = 'Úměrnost – Pracovní list';
    const singleClass = chosen.length === 1 ? 'single-problem' : '';

    const imagesHtml = (imgs) => {
      if (!imgs || imgs.length === 0) return '';
      return `
        <div class="img-grid">
          ${imgs.map((img) => `
            <figure class="img-fig">
              <img src="${escapeHtml(toAbsUrl(img.src))}" alt="${escapeHtml(img.alt ?? '')}" />
              ${img.label ? `<figcaption>${escapeHtml(img.label)}</figcaption>` : ''}
            </figure>
          `).join('')}
        </div>
      `;
    };

    const problemsHtml = chosen.map((e, i) => `
      <div class="problem">
        <h3>Příklad ${i + 1}: ${escapeHtml(e.title)}</h3>
        <p>${escapeHtml(e.assignment).replaceAll('\n', '<br/>')}</p>
        ${imagesHtml(e.images)}
        <div class="workspace">
          <p class="ws-label">Místo pro řešení:</p>
          <div class="ws-space"></div>
        </div>
      </div>
    `).join('\n');

    w.document.open();
    w.document.write(`<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8" />
<title>${docTitle}</title>
<style>
  @page { size: A4; margin: 2cm; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; line-height: 1.6; }
  h1 { text-align: center; color: #1e3a8a; font-size: 22px; margin-bottom: 12px; }
  .student-info {
    display: flex; justify-content: space-between;
    border-bottom: 2px solid #dbeafe; padding-bottom: 10px; margin-bottom: 20px;
    font-size: 13px; color: #1e293b;
  }
  .student-info span { border-bottom: 1px solid #1e293b; min-width: 180px; display: inline-block; margin-left: 6px; }
  .problem {
    page-break-inside: avoid; margin-bottom: 14px;
    border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px;
    display: flex; flex-direction: column;
  }
  .problem:last-child { margin-bottom: 0; }
  h3 { color: #1e3a8a; font-size: 15px; margin: 0 0 8px; border-bottom: 2px solid #dbeafe; padding-bottom: 6px; }
  p { margin: 0 0 8px; font-size: 14px; }
  .workspace { margin-top: 10px; display: flex; flex-direction: column; flex: 1; }
  .ws-label { font-size: 11px; color: #94a3b8; margin-bottom: 4px; }
  .ws-space { min-height: 5cm; border: 1px solid #e2e8f0; border-radius: 6px; flex: 1; }
  .single-problem .ws-space { min-height: 12cm; }
  .img-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 8px 0; }
  .img-fig { margin: 0; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px; }
  .img-fig img { width: 100%; height: auto; display: block; }
  .img-fig figcaption { font-size: 11px; color: #475569; margin-top: 4px; font-weight: 700; }
</style>
</head>
<body class="${singleClass}">
  <h1>${escapeHtml(docTitle)}</h1>
  <div class="student-info">
    <div>Příjmení a jméno žáka: <span>&nbsp;</span></div>
    <div>Datum: <span>&nbsp;</span></div>
  </div>
  ${problemsHtml}
</body>
</html>`);
    w.document.close();

    setTimeout(() => {
      try { w.focus(); w.print(); } catch { /* ignore */ }
    }, 500);
  }

  function generatePdf() {
    openPrintableWindow(Array.from(selected));
  }
</script>

<div class="examples">
  <div class="pdf-jump">
    <a href="#pdf" class="pdf-jump-link">🖨️ Vygenerovat PDF s příklady ↓</a>
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

  <!-- PDF generator section (reference design) -->
  <section id="pdf" class="pdf-gen">
    <div class="pdf-header">
      <div class="pdf-icon">🖨️</div>
      <div>
        <h3 class="pdf-gen-title">Pracovní list k tisku</h3>
        <p class="pdf-gen-sub">Vyber si příklady a vygeneruj si PDF pracovní list, který si můžeš vytisknout a řešit na papíře.</p>
      </div>
    </div>

    <div class="pdf-list">
      {#each examples as ex}
        <label class="pdf-item" class:pdf-item-selected={selected.has(ex.id)}>
          <input
            type="checkbox"
            checked={selected.has(ex.id)}
            onchange={() => toggleSelected(ex.id)}
          />
          <div class="pdf-item-content">
            <span class="pdf-item-title">{ex.title}</span>
            <span class="pdf-item-text">{ex.assignment}</span>
          </div>
        </label>
      {/each}
    </div>

    <div class="pdf-actions">
      <button type="button" class="pdf-btn-all" onclick={selectAll}>☑️ Vybrat vše</button>
      <button type="button" class="pdf-btn-gen" onclick={generatePdf} disabled={selected.size===0}>
        🖨️ Vygenerovat příklady do PDF ({selected.size})
      </button>
    </div>
  </section>
</div>

<style>
  .examples {
    margin: 18px 0 0;
  }

  /* Jump link */
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

  /* Example cards */
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

  /* ===== PDF Generator section (reference design) ===== */
  .pdf-gen {
    background: #f8fafc;
    border: 2px solid #e2e8f0;
    border-radius: 14px;
    padding: 1.5rem;
    margin: 1.5rem 0;
  }

  .pdf-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .pdf-icon {
    font-size: 2rem;
  }

  .pdf-gen-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e3a8a;
    margin: 0;
  }

  .pdf-gen-sub {
    font-size: 0.8rem;
    color: #64748b;
    margin: 0;
  }

  .pdf-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .pdf-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
    transition: all 0.15s;
  }

  .pdf-item:hover {
    border-color: #93c5fd;
  }

  .pdf-item-selected {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  .pdf-item input[type="checkbox"] {
    margin-top: 3px;
    accent-color: #3b82f6;
  }

  .pdf-item-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .pdf-item-title {
    font-weight: 700;
    color: #1e3a8a;
    font-size: 0.9rem;
  }

  .pdf-item-text {
    font-size: 0.8rem;
    color: #64748b;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .pdf-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .pdf-btn-all {
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    border: none;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
    background: #e2e8f0;
    color: #334155;
  }

  .pdf-btn-all:hover {
    background: #cbd5e1;
  }

  .pdf-btn-gen {
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    border: none;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
    background: #3b82f6;
    color: #fff;
  }

  .pdf-btn-gen:hover {
    background: #2563eb;
  }

  .pdf-btn-gen:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
</style>
