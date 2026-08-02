type RevealCallback = () => void;

type ObserverConfig = {
  threshold: number;
  rootMargin: string;
};

const callbacks = new Map<Element, RevealCallback>();
const observers = new Map<string, IntersectionObserver>();

const configKey = ({ threshold, rootMargin }: ObserverConfig) =>
  `${threshold}|${rootMargin}`;

function getObserver(config: ObserverConfig): IntersectionObserver {
  const key = configKey(config);
  let observer = observers.get(key);

  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const callback = callbacks.get(entry.target);
          if (callback) {
            callback();
            observer!.unobserve(entry.target);
            callbacks.delete(entry.target);
          }
        }
      },
      { threshold: config.threshold, rootMargin: config.rootMargin },
    );
    observers.set(key, observer);
  }

  return observer;
}

export function observeScrollReveal(
  element: Element,
  callback: RevealCallback,
  config: ObserverConfig,
): () => void {
  callbacks.set(element, callback);
  getObserver(config).observe(element);

  return () => {
    callbacks.delete(element);
    getObserver(config).unobserve(element);
  };
}
