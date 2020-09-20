export function convertPointerToCoordinate(
  event: MouseEvent | TouchEvent,
  domElement: HTMLCanvasElement
) {
  const SIDEBAR_WIDTH = window.visualViewport.width < 620 ? 0 : 290;

  const clientX =
    event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;
  const clientY =
    event instanceof TouchEvent ? event.touches[0].clientY : event.clientY;

  const x =
    ((clientX - SIDEBAR_WIDTH) / domElement.parentElement.clientWidth) * 2 - 1;
  const y = -(clientY / domElement.parentElement.clientHeight) * 2 + 1;

  return { x, y };
}
