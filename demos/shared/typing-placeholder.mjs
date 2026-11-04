/** Decorative suggestions never change the input value or Composer state. */
export function typingPlaceholder(textarea, { phrases, active, observe }) {
  const fallback = textarea.placeholder;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  let stopped = Boolean(textarea.value);
  let running = false;
  let phrase = 0;
  let cursor = 0;
  let deleting = false;

  function cancel() { clearTimeout(timer); timer = undefined; }
  function schedule(callback, delay) { cancel(); timer = setTimeout(callback, delay); }
  function eligible() { return !stopped && !textarea.value && active() && !document.hidden; }
  function tick() {
    if (!eligible() || reducedMotion.matches) { update(); return; }
    const text = phrases[phrase];
    cursor += deleting ? -1 : 1;
    textarea.placeholder = text.slice(0, cursor) || ' ';
    if (!deleting && cursor === text.length) {
      deleting = true;
      schedule(tick, 1600);
    } else if (deleting && cursor === 0) {
      deleting = false;
      phrase = (phrase + 1) % phrases.length;
      schedule(tick, 450);
    } else {
      schedule(tick, deleting ? 24 : 45);
    }
  }
  function update() {
    if (textarea.value) stopped = true;
    if (!eligible()) {
      cancel(); running = false; textarea.placeholder = fallback;
      return;
    }
    if (reducedMotion.matches) {
      cancel(); running = false; textarea.placeholder = phrases[0];
      return;
    }
    if (running) return;
    running = true; phrase = 0; cursor = 0; deleting = false;
    textarea.placeholder = fallback;
    schedule(tick, 800);
  }
  function stop() { stopped = true; update(); }
  function pause() { cancel(); running = false; }
  const observer = new MutationObserver(update);
  for (const node of observe) observer.observe(node, { attributes: true, attributeFilter: ['class', 'data-state', 'hidden'] });
  textarea.addEventListener('beforeinput', stop);
  textarea.addEventListener('compositionstart', stop);
  textarea.addEventListener('input', stop);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('popstate', update);
  window.addEventListener('hashchange', update);
  window.addEventListener('pagehide', pause);
  window.addEventListener('pageshow', update);
  reducedMotion.addEventListener('change', update);
  update();
  return {
    destroy() {
      pause(); observer.disconnect(); textarea.placeholder = fallback;
      textarea.removeEventListener('beforeinput', stop);
      textarea.removeEventListener('compositionstart', stop);
      textarea.removeEventListener('input', stop);
      document.removeEventListener('visibilitychange', update);
      window.removeEventListener('popstate', update);
      window.removeEventListener('hashchange', update);
      window.removeEventListener('pagehide', pause);
      window.removeEventListener('pageshow', update);
      reducedMotion.removeEventListener('change', update);
    }
  };
}
