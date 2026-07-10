const STORAGE_KEY = "narra-gem-levels";
const listeners = new Set<() => void>();

type GemLevels = Record<string, number>;

const EMPTY: GemLevels = {};

let cacheRaw: string | null = null;
let cache: GemLevels = EMPTY;

function read(): GemLevels {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      cache = raw ? (JSON.parse(raw) as GemLevels) : EMPTY;
    } catch {
      cache = EMPTY;
    }
  }
  return cache;
}

function getSnapshot(): GemLevels {
  return read();
}

function getServerSnapshot(): GemLevels {
  return EMPTY;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

// Cumulative, never decreases on delete — repeatedly deleting and re-saving
// the same subject is how a gem levels up (see GemIcon).
function increment(subject: string) {
  const current = read();
  const next = { ...current, [subject]: (current[subject] ?? 0) + 1 };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  cacheRaw = null;
  listeners.forEach((listener) => listener());
}

export const gemLevelStore = { getSnapshot, getServerSnapshot, subscribe, increment };
