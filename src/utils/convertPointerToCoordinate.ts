const SIDEBAR_WIDTH = 290;

export function convertPointerToCoordinate(
  event: MouseEvent,
  domElement: HTMLCanvasElement
) {
  const x =
    ((event.clientX - SIDEBAR_WIDTH) / domElement.parentElement.clientWidth) *
      2 -
    1;
  const y = -(event.clientY / domElement.parentElement.clientHeight) * 2 + 1;

  return { x, y };
}
