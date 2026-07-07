import type { SavedAsset } from "@/lib/types";

const STORAGE_KEY = "narra-saved-assets";
const listeners = new Set<() => void>();

const EMPTY: SavedAsset[] = [];

let cacheRaw: string | null = null;
let cache: SavedAsset[] = EMPTY;

function getSnapshot(): SavedAsset[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      cache = raw ? (JSON.parse(raw) as SavedAsset[]) : EMPTY;
    } catch {
      cache = EMPTY;
    }
  }
  return cache;
}

function getServerSnapshot(): SavedAsset[] {
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

function write(next: SavedAsset[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

export const savedAssetsStore = { getSnapshot, getServerSnapshot, subscribe, write };
