import {VISUAL_ASSET_MANIFEST} from './visualAssetManifest';

const MAX_CONCURRENT_IMAGES = 4;
const imagePreloadCache = new Map();
const modulePreloadCache = new Map();
const preloadQueue = [];
let activePreloads = 0;

function startTask(task) {
  activePreloads += 1;
  task().finally(() => {
    activePreloads -= 1;
    runQueue();
  });
}

function runQueue() {
  while (activePreloads < MAX_CONCURRENT_IMAGES && preloadQueue.length > 0) {
    startTask(preloadQueue.shift());
  }
}

function preloadImage(source) {
  if (imagePreloadCache.has(source)) {
    return imagePreloadCache.get(source);
  }

  const request = new Promise((resolve) => {
    preloadQueue.push(() => new Promise((finishTask) => {
      const image = new Image();
      const finish = () => {
        resolve(source);
        finishTask();
      };

      image.onload = () => {
        if (typeof image.decode === 'function') {
          image.decode().catch(() => {}).finally(finish);
          return;
        }
        finish();
      };
      image.onerror = finish;
      image.src = source;
    }));
    runQueue();
  });

  imagePreloadCache.set(source, request);
  return request;
}

export function preloadImages(sources) {
  return Promise.all([...new Set(sources)].map(preloadImage));
}

export function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export function preloadImagesWithTimeout(sources, timeout = 4500) {
  return Promise.race([
    preloadImages(sources),
    wait(timeout),
  ]);
}

export function preloadVisualModule(moduleName) {
  if (modulePreloadCache.has(moduleName)) {
    return modulePreloadCache.get(moduleName);
  }

  const sources = VISUAL_ASSET_MANIFEST[moduleName] || [];
  const request = preloadImages(sources);
  modulePreloadCache.set(moduleName, request);
  return request;
}

export function preloadVisualModuleWithTimeout(moduleName, timeout = 1500) {
  return Promise.race([
    preloadVisualModule(moduleName),
    wait(timeout),
  ]);
}

function scheduleIdle(callback) {
  if (typeof window.requestIdleCallback === 'function') {
    return window.requestIdleCallback(callback, {timeout: 1200});
  }
  return window.setTimeout(callback, 120);
}

export function preloadModulesInIdle(moduleNames) {
  const names = [...moduleNames];

  const scheduleNext = () => {
    const moduleName = names.shift();
    if (!moduleName) return;

    scheduleIdle(() => {
      preloadVisualModule(moduleName).finally(scheduleNext);
    });
  };

  scheduleNext();
}
