import { button, iconButton, inputField, switchControl, card, badge, avatar, controlIcon, mount } from '../src/index.mjs';

const $ = selector => document.querySelector(selector);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const chapters = [
  { name: 'Components', caption: 'Thoughtful details. Ready to compose.', link: '../site/Design%20system.html', cta: 'Explore components ↗' },
  { name: 'Dashboard', caption: 'From all your orders to the one that matters.', link: '../demos/Orders.html', cta: 'Open dashboard ↗' },
  { name: 'AI workspace', caption: 'A conversation becomes a place to work.', link: '../demos/AI%20agents%20demo.html', cta: 'Open AI workspace ↗' }
];
$('#header-controls').innerHTML = `<a href="../site/Design%20system.html">Documentation ↗</a>${iconButton({ icon: 'sun', accessibleLabel: 'Toggle color theme', attributes: 'id="theme"' })}`;
$('#chapters').innerHTML = chapters.map((c, i) => button({ label: `0${i + 1}  ${c.name}`, variant: i ? 'ghost' : 'secondary', attributes: `data-chapter="${i}" aria-pressed="${i === 0}"` })).join('');
$('#playback-controls').innerHTML = button({ label: 'Pause', variant: 'outline', attributes: 'id="play" aria-label="Pause demo"' }) + button({ label: 'Replay', variant: 'ghost', attributes: 'id="replay" aria-label="Replay chapter"' });
$('#settings').innerHTML = card({ header: `<div class="demo-form-heading">${avatar({ name: 'Sesama team', size: 32 })}<div><strong>Make room for your team.</strong><p>Your workspace, your way.</p></div></div>`, content: `<div class="demo-form">${inputField({ id: 'workspace-name', label: 'Workspace name', value: 'Design workspace' })}${switchControl({ id: 'invite', label: 'Allow team invitations', checked: true })}</div>`, footer: button({ id: 'save-workspace', label: 'Save workspace', variant: 'primary' }) });
$('#receipt').innerHTML = card({ content: `<div class="demo-receipt-content">${badge({ label: 'Saved', tone: 'success', icon: 'check' })}<div><strong>A shared space, ready.</strong><p>Bring your next idea to life.</p></div></div>` });
// Use the library's own pointer icon rather than a hand-drawn cursor.
$('#cursor').innerHTML = '<img src="../assets/rune-icons/pointer.svg" width="24" height="28" alt="">';
mount(document.body);

let chapter = 0, elapsed = 0, playing = !reduced.matches, last = 0;
const duration = 6500;
const fired = new Set();
const frameReady = new Map();
function themeFrame(frame) { if (frame.contentDocument?.body) frame.contentDocument.body.setAttribute('data-sui-theme', document.body.dataset.suiTheme); }
function ensureFrame(index) {
  const frame = $(`#scene-${index} iframe`);
  if (!frame) return;
  if (!frameReady.has(index)) {
    frameReady.set(index, false);
    frame.addEventListener('load', () => { frameReady.set(index, true); themeFrame(frame); if (chapter === index) $('#loading').hidden = true; });
    frame.src = frame.dataset.src;
  }
  $('#loading').hidden = frameReady.get(index);
}
function playback() {
  $('#play').innerHTML = playing ? 'Pause' : 'Play';
  $('#play').setAttribute('aria-label', playing ? 'Pause demo' : 'Play demo');
  document.getAnimations().forEach(a => { if (a.id === 'tour-cursor') playing ? a.play() : a.pause(); });
}
function select(index, autoplay = playing) {
  chapter = index; elapsed = 0; fired.clear(); playing = autoplay;
  $('#cursor').removeAttribute('data-visible');
  $('#receipt').removeAttribute('data-visible');
  $('#workspace-name').value = 'Design workspace';
  $('#loading').hidden = true;
  document.querySelectorAll('.demo-scene').forEach((scene, i) => { scene.hidden = i !== index; });
  document.querySelectorAll('[data-chapter]').forEach((b, i) => { b.setAttribute('aria-pressed', String(i === index)); b.classList.toggle('secondary', i === index); b.classList.toggle('ghost', i !== index); });
  $('#chapter-count').textContent = `0${index + 1} / 03`;
  $('#caption').textContent = chapters[index].caption;
  $('#explore').href = chapters[index].link; $('#explore').textContent = chapters[index].cta;
  if (index) ensureFrame(index);
  if (!autoplay && !index) $('#receipt').setAttribute('data-visible', '');
  playback();
}
function target(selector) {
  const frame = $(`#scene-${chapter} iframe`);
  return frame ? frame.contentDocument?.querySelector(selector) : $(selector);
}
function point(element) {
  const r = element.getBoundingClientRect(), stage = $('#stage').getBoundingClientRect();
  const frame = $(`#scene-${chapter} iframe`), fr = frame?.getBoundingClientRect();
  return { x: r.x + r.width * .65 + (fr?.x || 0) - stage.x, y: r.y + r.height * .6 + (fr?.y || 0) - stage.y };
}
function move(selector) {
  const el = target(selector); if (!el) return;
  const p = point(el), cursor = $('#cursor');
  cursor.setAttribute('data-visible', '');
  const animation = cursor.animate([{ transform: getComputedStyle(cursor).transform === 'none' ? `translate(${p.x - 70}px,${p.y + 40}px)` : getComputedStyle(cursor).transform }, { transform: `translate(${p.x}px,${p.y}px)` }], { duration: reduced.matches ? 0 : 600, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' });
  animation.id = 'tour-cursor';
}
function input(selector, value) {
  const el = target(selector); if (!el) return;
  el.value = value; el.dispatchEvent(new el.ownerDocument.defaultView.Event('input', { bubbles: true }));
}
function beat(key, time, callback) { if (elapsed >= time && !fired.has(key)) { fired.add(key); callback(); } }
function actions() {
  if (chapter === 0) {
    beat('move', 500, () => move('#workspace-name'));
    beat('name', 1300, () => input('#workspace-name', 'Product studio'));
    beat('save', 2000, () => move('#save-workspace'));
    beat('saved', 2800, () => { $('#save-workspace').click(); $('#cursor').removeAttribute('data-visible'); });
  } else if (chapter === 1) {
    beat('reset', 0, () => input('#order-search', ''));
    beat('move', 600, () => move('#order-search'));
    const word = 'Amelia';
    for (let i = 1; i <= word.length; i++) beat(`type${i}`, 1400 + i * 120, () => input('#order-search', word.slice(0, i)));
    beat('rest', 2800, () => $('#cursor').removeAttribute('data-visible'));
  } else {
    beat('move', 700, () => move('textarea'));
    const phrase = 'Help me plan our next product launch.';
    for (let i = 1; i <= phrase.length; i++) beat(`type${i}`, 1300 + i * 40, () => input('textarea', phrase.slice(0, i)));
    // Keep the draft visible: this chapter demonstrates Composer, not a real AI service.
    beat('rest', 3400, () => { $('#cursor').removeAttribute('data-visible'); $('#caption').textContent = 'Messages, tools, and context. Ready for your agent.'; });
  }
}
$('#save-workspace').addEventListener('click', () => $('#receipt').setAttribute('data-visible', ''));
$('#play').addEventListener('click', () => { playing = !playing; playback(); });
$('#replay').addEventListener('click', () => select(chapter, true));
$('#chapters').addEventListener('click', e => { const b = e.target.closest('[data-chapter]'); if (b) select(Number(b.dataset.chapter)); });
$('#theme').addEventListener('click', () => { document.body.dataset.suiTheme = document.body.dataset.suiTheme === 'dark' ? 'light' : 'dark'; document.querySelectorAll('iframe').forEach(themeFrame); });
reduced.addEventListener('change', () => { if (reduced.matches) { playing = false; playback(); } });
document.addEventListener('visibilitychange', () => { last = 0; });
function tick(now) {
  const delta = last ? Math.min(now - last, 100) : 0; last = now;
  if (playing && !document.hidden && (chapter === 0 || frameReady.get(chapter))) {
    elapsed += delta; actions();
    if (elapsed >= duration) {
      if (chapter === chapters.length - 1) { playing = false; playback(); } else select(chapter + 1, true);
    }
  }
  const progress = Math.min(100, elapsed / duration * 100);
  $('#progress').style.transform = `scaleX(${progress / 100})`;
  $('.demo-progress').setAttribute('aria-valuenow', String(Math.round(progress)));
  requestAnimationFrame(tick);
}
select(0); requestAnimationFrame(tick);

