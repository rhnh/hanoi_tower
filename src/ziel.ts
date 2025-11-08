type Vec2 = { x: number; y: number };

interface Box {
  id: string;
  x: number;
  y: number;
  el: HTMLDivElement | null;
}

const BOX_SIZE = 30;

const createBox = (x: number, y: number): Box => ({
  id: crypto.randomUUID(),
  x,
  y,
  el: null,
});

const createBoxes = (count: number): Box[] =>
  Array.from({ length: count }, (_, i) => createBox(40 * i, 40 * i));

/**
 * Render boxes into the container and assign the element to box.el (mutates boxes).
 */
const renderBoxes = (container: HTMLElement, boxes: Box[]): void => {
  container.innerHTML = "";
  for (const box of boxes) {
    const div = document.createElement("div");
    div.className = "box";
    div.dataset.id = box.id; // <- reliable mapping DOM -> box
    div.style.left = `${box.x}px`;
    div.style.top = `${box.y}px`;
    // avoid default touch actions (so pointer events work nicely)
    div.style.touchAction = "none";
    container.appendChild(div);
    box.el = div; // <-- IMPORTANT: mutate the original box
  }
};

/** find box from any event target (works if the target is a child inside the box) */
const findBoxFromTarget = (
  boxes: Box[],
  target: EventTarget | null
): Box | undefined => {
  if (!(target instanceof Element)) return undefined;
  const el = target.closest("[data-id]") as HTMLElement | null;
  if (!el) return undefined;
  const id = el.dataset.id;
  return boxes.find((b) => b.id === id);
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const init = (): void => {
  const container = document.getElementById("container")!;
  const boxes = createBoxes(5);
  renderBoxes(container, boxes);

  // application state (small, local)
  const state = {
    boxes,
    activeId: null as string | null,
    offset: { x: 0, y: 0 } as Vec2,
    mouse: { x: 0, y: 0 } as Vec2,
    dragging: false,
  };

  const getContainerRect = () => container.getBoundingClientRect();

  const onPointerDown = (e: PointerEvent) => {
    const box = findBoxFromTarget(state.boxes, e.target);
    if (!box || !box.el) return;
    // capture pointer so the element continues to receive events
    box.el.setPointerCapture?.(e.pointerId);

    const rect = box.el.getBoundingClientRect();
    const cRect = getContainerRect();

    state.offset = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    state.mouse = { x: e.clientX - cRect.left, y: e.clientY - cRect.top };
    state.activeId = box.id;
    state.dragging = true;
    box.el.classList.add("active");
    loop();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!state.dragging) return;
    const cRect = getContainerRect();
    state.mouse = { x: e.clientX - cRect.left, y: e.clientY - cRect.top };
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!state.dragging) return;
    const active = state.boxes.find((b) => b.id === state.activeId);
    if (active && active.el) {
      try {
        active.el.releasePointerCapture?.(e.pointerId);
      } catch {}
      active.el.classList.remove("active");
    }
    state.activeId = null;
    state.dragging = false;
  };

  // event listeners
  // use delegation for the down so new boxes would also be caught
  container.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  // animation loop (reads state, writes DOM)
  const loop = () => {
    if (state.dragging && state.activeId) {
      const active = state.boxes.find((b) => b.id === state.activeId);
      if (active && active.el) {
        const nextX = state.mouse.x - state.offset.x;
        const nextY = state.mouse.y - state.offset.y;

        const cRect = getContainerRect();
        const minX = 0;
        const minY = 0;
        const maxX = Math.max(0, cRect.width - BOX_SIZE);
        const maxY = Math.max(0, cRect.height - BOX_SIZE);

        active.x = clamp(nextX, minX, maxX);
        active.y = clamp(nextY, minY, maxY);

        active.el.style.left = `${active.x}px`;
        active.el.style.top = `${active.y}px`;
      }
    }
    requestAnimationFrame(loop);
  };
};

init();
