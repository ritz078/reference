export function convertPointerToCoordinate(
  event: PointerEvent,
  domElement: HTMLCanvasElement
) {
  const SIDEBAR_WIDTH = window.screen.width < 620 ? 0 : 290;

  const x =
    ((event.clientX - SIDEBAR_WIDTH) / domElement.parentElement.clientWidth) *
      2 -
    1;
  const y = -(event.clientY / domElement.parentElement.clientHeight) * 2 + 1;

  return { x, y };
}
