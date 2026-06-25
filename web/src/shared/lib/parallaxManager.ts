type ParallaxEntry = {
  element: HTMLElement;
  section: HTMLElement;
  speed: number;
  inView: boolean;
};

const entries = new Set<ParallaxEntry>();
let frame = 0;
let ticking = false;
let scrollListenerAttached = false;
let resizeListenerAttached = false;

const updateAll = () => {
  ticking = false;
  const vh = window.innerHeight || 1;

  for (const entry of entries) {
    if (!entry.inView) continue;

    const rect = entry.section.getBoundingClientRect();
    const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
    const y = -progress * entry.speed * 100;
    entry.element.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
  }
};

const scheduleUpdate = () => {
  if (ticking) return;
  ticking = true;
  frame = requestAnimationFrame(updateAll);
};

const onScroll = () => scheduleUpdate();

const onResize = () => scheduleUpdate();

const sectionObservers = new Map<HTMLElement, IntersectionObserver>();

function ensureSectionObserver(section: HTMLElement) {
  if (sectionObservers.has(section)) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      const inView = entry?.isIntersecting ?? false;
      for (const item of entries) {
        if (item.section === section) {
          item.inView = inView;
        }
      }
      if (inView) scheduleUpdate();
    },
    { rootMargin: "100px 0px" },
  );

  observer.observe(section);
  sectionObservers.set(section, observer);
}

function attachGlobalListeners() {
  if (!scrollListenerAttached) {
    window.addEventListener("scroll", onScroll, { passive: true });
    scrollListenerAttached = true;
  }
  if (!resizeListenerAttached) {
    window.addEventListener("resize", onResize, { passive: true });
    resizeListenerAttached = true;
  }
}

function detachGlobalListenersIfIdle() {
  if (entries.size > 0) return;
  if (scrollListenerAttached) {
    window.removeEventListener("scroll", onScroll);
    scrollListenerAttached = false;
  }
  if (resizeListenerAttached) {
    window.removeEventListener("resize", onResize);
    resizeListenerAttached = false;
  }
  cancelAnimationFrame(frame);
  ticking = false;
}

export function registerParallax(
  element: HTMLElement,
  section: HTMLElement,
  speed: number,
): () => void {
  const entry: ParallaxEntry = { element, section, speed, inView: false };
  entries.add(entry);
  element.style.willChange = "transform";

  ensureSectionObserver(section);
  attachGlobalListeners();
  scheduleUpdate();

  return () => {
    entries.delete(entry);
    element.style.willChange = "";
    element.style.transform = "";

    const sectionStillUsed = [...entries].some((item) => item.section === section);
    if (!sectionStillUsed) {
      sectionObservers.get(section)?.disconnect();
      sectionObservers.delete(section);
    }

    detachGlobalListenersIfIdle();
  };
}
