const cacheStore = new Map<string, any>();

export const setOfflineCache = <T>(key: string, data: T): void => {
  cacheStore.set(key, { data, timestamp: Date.now() });
};

export const getOfflineCache = <T>(key: string): T | null => {
  const item = cacheStore.get(key);
  if (!item) return null;
  return item.data as T;
};

export const clearOfflineCache = (key?: string): void => {
  if (key) cacheStore.delete(key);
  else cacheStore.clear();
};
