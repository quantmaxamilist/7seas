// Shared controller for a self-playing "wow" section.
// impl: { play(): Promise|void, finish(): void, reset(): void, highlight(slug|null): void, pause?(), resume?() }
export function mountWow(section, impl) {
  if (!section) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const list = section.querySelector('[data-sl]');
  const replay = section.querySelector('[data-replay]');
  let state = 'idle'; // idle | playing | done
  let timer = 0;

  const done = () => { state = 'done'; section.classList.add('done'); impl.finish(); };
  const play = async () => {
    state = 'playing';
    section.classList.remove('done');
    impl.reset();
    await impl.play();
    if (state === 'playing') done();
  };

  if (reduce) { impl.reset(); done(); }
  else {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && e.intersectionRatio >= 0.5 && state === 'idle') play();
      if (e.isIntersecting) impl.resume?.(); else impl.pause?.();
    }, { threshold: [0, 0.5] });
    io.observe(section.querySelector('[data-stage]') || section);
  }
  replay?.addEventListener('click', () => { clearTimeout(timer); play(); });

  // list <-> model highlight
  const items = [...section.querySelectorAll('.sl__item')];
  const setHl = (slug) => {
    if (state !== 'done') return;
    items.forEach((li) => li.classList.toggle('hl', li.dataset.part === slug));
    section.dataset.hl = slug || '';
    impl.highlight(slug);
  };
  items.forEach((li) => {
    li.addEventListener('pointerenter', () => setHl(li.dataset.part));
    li.addEventListener('pointerleave', () => setHl(null));
    li.addEventListener('focusin', () => setHl(li.dataset.part));
    li.addEventListener('focusout', () => setHl(null));
  });
  section.querySelectorAll('[data-pin]').forEach((pin) => {
    pin.addEventListener('pointerenter', () => setHl(pin.dataset.pin));
    pin.addEventListener('pointerleave', () => setHl(null));
  });
  return { setHl, isDone: () => state === 'done', list };
}
