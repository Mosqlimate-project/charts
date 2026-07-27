declare const WATERMARK_DATA_URI: string;

const WATERMARK_CLASS = "mosqlimate-watermark";

export function createWatermarkElement(): HTMLElement {
  const el = document.createElement("div");
  el.className = WATERMARK_CLASS;
  el.setAttribute("aria-hidden", "true");
  el.style.cssText =
    "position:absolute;top:30px;right:30px;width:100px;height:100px;" +
    "background:no-repeat center/contain;opacity:0.3;z-index:0;pointer-events:none;";
  el.style.backgroundImage = `url(${WATERMARK_DATA_URI})`;
  return el;
}

export function removeWatermarkElement(container: HTMLElement): void {
  const el = container.querySelector(`.${WATERMARK_CLASS}`);
  el?.remove();
}
