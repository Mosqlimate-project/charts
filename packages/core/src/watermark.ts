declare const WATERMARK_DATA_URI: string;

const WM_CLASS = "mosqlimate-watermark";

export function applyWatermark(container: HTMLElement, themeBg?: string): void {
  if (container.querySelector("." + WM_CLASS)) return;

  const bgColor = themeBg || "#ffffff";

  const wm = document.createElement("div");
  wm.className = WM_CLASS;
  wm.style.cssText =
    "position:absolute;top:30px;right:30px;width:100px;height:100px;" +
    `background-image:url(${WATERMARK_DATA_URI});` +
    "background-size:contain;background-repeat:no-repeat;" +
    "opacity:0.5;pointer-events:none;z-index:1";

  container.appendChild(wm);

  if (!container.style.backgroundColor) {
    container.dataset.wmBgColor = container.style.backgroundColor || "";
    container.style.backgroundColor = bgColor;
  }
}

export function removeWatermark(container: HTMLElement): void {
  const wm = container.querySelector("." + WM_CLASS);
  if (wm) wm.remove();
  const origBg = container.dataset.wmBgColor;
  if (origBg !== undefined) {
    container.style.backgroundColor = origBg;
    delete container.dataset.wmBgColor;
  }
}
