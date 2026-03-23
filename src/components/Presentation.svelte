<script>
  /** @type {{ slides: { title: string; content: string; image?: string; note?: string }[] }} */
  let { slides = [] } = $props();

  let current = $state(0);
  let total = $derived(slides.length);
  let progress = $derived(((current + 1) / total) * 100);

  function next() {
    if (current < total - 1) current++;
  }
  function prev() {
    if (current > 0) current--;
  }
  function goTo(i) {
    current = i;
  }

  function handleKey(e) {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    if (e.key === 'Home') { e.preventDefault(); current = 0; }
    if (e.key === 'End') { e.preventDefault(); current = total - 1; }
  }

  let fullscreen = $state(false);
  function toggleFullscreen() {
    fullscreen = !fullscreen;
  }
</script>

<svelte:window onkeydown={handleKey} />

<div
  class="presentation-wrapper"
  class:fullscreen
  role="application"
  aria-label="Prezentace"
>
  <!-- Progress bar -->
  <div class="progress-bar">
    <div class="progress-fill" style="width: {progress}%"></div>
  </div>

  <!-- Slide -->
  <div class="slide-container">
    {#each slides as slide, i}
      {#if i === current}
        <div class="slide" aria-label="Snímek {i + 1} z {total}">
          <div class="slide-number">{i + 1} / {total}</div>

          {#if slide.image}
            <div class="slide-with-image">
              <div class="slide-text-side">
                <h2 class="slide-title">{@html slide.title}</h2>
                <div class="slide-content">{@html slide.content}</div>
              </div>
              <div class="slide-image-side">
                <img src={slide.image} alt={slide.title} />
              </div>
            </div>
          {:else}
            <h2 class="slide-title">{@html slide.title}</h2>
            <div class="slide-content">{@html slide.content}</div>
          {/if}

          {#if slide.note}
            <div class="slide-note">💡 {slide.note}</div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>

  <!-- Controls -->
  <div class="controls">
    <button onclick={prev} disabled={current === 0} aria-label="Předchozí snímek" class="ctrl-btn">
      ◀
    </button>

    <div class="dot-nav">
      {#each slides as _, i}
        <button
          onclick={() => goTo(i)}
          class="dot"
          class:active={i === current}
          aria-label="Přejít na snímek {i + 1}"
        ></button>
      {/each}
    </div>

    <button onclick={next} disabled={current === total - 1} aria-label="Další snímek" class="ctrl-btn">
      ▶
    </button>

    <button onclick={toggleFullscreen} aria-label="Celá obrazovka" class="ctrl-btn fullscreen-btn">
      {fullscreen ? '✕' : '⛶'}
    </button>
  </div>
</div>

<style>
  .presentation-wrapper {
    position: relative;
    background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    margin: 1rem 0;
    transition: all 0.3s ease;
  }
  .presentation-wrapper.fullscreen {
    position: fixed;
    inset: 0;
    z-index: 9999;
    border-radius: 0;
    margin: 0;
  }

  .progress-bar {
    height: 4px;
    background: rgba(255,255,255,0.1);
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    transition: width 0.4s ease;
    border-radius: 0 2px 2px 0;
  }

  .slide-container {
    min-height: 480px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 3rem 1.5rem;
  }
  .fullscreen .slide-container {
    min-height: calc(100vh - 80px);
    padding: 3rem 5rem 2rem;
  }

  .slide {
    width: 100%;
    max-width: 900px;
    animation: fadeIn 0.4s ease;
    position: relative;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .slide-number {
    position: absolute;
    top: -1.5rem;
    right: 0;
    font-size: 0.75rem;
    color: rgba(255,255,255,0.35);
    font-variant-numeric: tabular-nums;
  }

  .slide-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #e0edff;
    margin-bottom: 1.25rem;
    line-height: 1.3;
  }
  .fullscreen .slide-title {
    font-size: 2.25rem;
  }

  .slide-content {
    font-size: 1.1rem;
    color: #cbd5e1;
    line-height: 1.8;
  }
  .fullscreen .slide-content {
    font-size: 1.3rem;
  }

  /* rich HTML inside content */
  .slide-content :global(ul) {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0;
  }
  .slide-content :global(li) {
    padding: 0.35rem 0;
    padding-left: 1.5rem;
    position: relative;
  }
  .slide-content :global(li::before) {
    content: '▸';
    position: absolute;
    left: 0;
    color: #60a5fa;
  }
  .slide-content :global(strong) {
    color: #93c5fd;
  }
  .slide-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }
  .slide-content :global(th) {
    text-align: left;
    padding: 0.5rem 0.75rem;
    color: #93c5fd;
    border-bottom: 2px solid rgba(96,165,250,0.3);
    font-weight: 600;
  }
  .slide-content :global(td) {
    padding: 0.45rem 0.75rem;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    color: #cbd5e1;
  }
  .slide-content :global(tr:last-child td) {
    border-bottom: none;
  }
  .slide-content :global(code) {
    background: rgba(255,255,255,0.1);
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    font-size: 0.95em;
    color: #93c5fd;
  }
  .slide-content :global(.highlight) {
    background: rgba(59,130,246,0.15);
    border-left: 3px solid #3b82f6;
    padding: 0.75rem 1rem;
    border-radius: 0 8px 8px 0;
    margin: 1rem 0;
  }

  .slide-with-image {
    display: flex;
    gap: 2rem;
    align-items: center;
  }
  .slide-text-side { flex: 1.2; }
  .slide-image-side {
    flex: 0.8;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .slide-image-side img {
    max-width: 100%;
    max-height: 320px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }

  .slide-note {
    margin-top: 1.5rem;
    padding: 0.75rem 1rem;
    background: rgba(37, 99, 235, 0.15);
    border-radius: 10px;
    color: #93c5fd;
    font-size: 0.95rem;
    border: 1px solid rgba(59,130,246,0.2);
  }

  /* Controls */
  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem 2rem 1.5rem;
  }
  .ctrl-btn {
    background: rgba(255,255,255,0.1);
    color: #93c5fd;
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ctrl-btn:hover:not(:disabled) {
    background: rgba(59,130,246,0.3);
    color: #fff;
  }
  .ctrl-btn:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }
  .fullscreen-btn {
    margin-left: 1rem;
    font-size: 1.3rem;
  }

  .dot-nav {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: none;
    background: rgba(255,255,255,0.2);
    cursor: pointer;
    transition: all 0.2s;
    padding: 0;
  }
  .dot.active {
    background: #3b82f6;
    transform: scale(1.3);
    box-shadow: 0 0 8px rgba(59,130,246,0.5);
  }
  .dot:hover:not(.active) {
    background: rgba(255,255,255,0.4);
  }

  @media (max-width: 640px) {
    .slide-container { padding: 2rem 1.5rem 1rem; min-height: 400px; }
    .slide-title { font-size: 1.35rem; }
    .slide-content { font-size: 1rem; }
    .slide-with-image { flex-direction: column; }
  }
</style>
