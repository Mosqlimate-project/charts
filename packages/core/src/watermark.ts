declare const WATERMARK_DATA_URI: string;

export function applyWatermark(container: HTMLElement, themeBg?: string): void {
  const bgColor = themeBg || "#ffffff";
  container.style.backgroundImage = `url(${WATERMARK_DATA_URI})`;
  container.style.backgroundPosition = "top 30px right 30px";
  container.style.backgroundRepeat = "no-repeat";
  container.style.backgroundSize = "100px 100px";
  if (!container.style.backgroundColor) {
    container.dataset.wmBgColor = container.style.backgroundColor || "";
    container.style.backgroundColor = bgColor;
  }
}

export function removeWatermark(container: HTMLElement): void {
  container.style.backgroundImage = "";
  container.style.backgroundPosition = "";
  container.style.backgroundRepeat = "";
  container.style.backgroundSize = "";
  const origBg = container.dataset.wmBgColor;
  if (origBg !== undefined) {
    container.style.backgroundColor = origBg;
    delete container.dataset.wmBgColor;
  }
}
