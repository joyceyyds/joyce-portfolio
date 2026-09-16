const imagePreloadCache = new Map();

function preloadImage(source) {
  if (imagePreloadCache.has(source)) {
    return imagePreloadCache.get(source);
  }

  const request = new Promise((resolve) => {
    const image = new Image();

    const finish = () => resolve(source);
    image.onload = () => {
      if (typeof image.decode === 'function') {
        image.decode().catch(() => {}).finally(finish);
        return;
      }
      finish();
    };
    image.onerror = finish;
    image.src = source;
  });

  imagePreloadCache.set(source, request);
  return request;
}

export function preloadImages(sources) {
  return Promise.all(sources.map(preloadImage));
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
