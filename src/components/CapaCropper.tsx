import { useEffect, useRef, useState } from "react";

export type CapaPos = { x: number; y: number };

export function parseCapaPos(raw?: string | null): CapaPos {
  if (!raw) return { x: 50, y: 50 };
  const m = raw.match(/(-?\d+(?:\.\d+)?)\s*%\s+(-?\d+(?:\.\d+)?)\s*%/);
  if (!m) return { x: 50, y: 50 };
  const x = Math.max(0, Math.min(100, parseFloat(m[1])));
  const y = Math.max(0, Math.min(100, parseFloat(m[2])));
  return { x, y };
}

export function formatCapaPos(p: CapaPos): string {
  const x = Math.round(Math.max(0, Math.min(100, p.x)) * 10) / 10;
  const y = Math.round(Math.max(0, Math.min(100, p.y)) * 10) / 10;
  return `${x}% ${y}%`;
}

type Props = {
  src: string;
  alt?: string;
  value: CapaPos;
  onChange: (p: CapaPos) => void;
};

export function CapaCropper({ src, alt, value, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setNatural(null);
    const img = new Image();
    img.onload = () => setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = src;
  }, [src]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current || !natural) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const cw = rect.width;
    const ch = rect.height;
    const scale = Math.max(cw / natural.w, ch / natural.h);
    const dispW = natural.w * scale;
    const dispH = natural.h * scale;
    const overflowX = Math.max(0, dispW - cw);
    const overflowY = Math.max(0, dispH - ch);
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...value };
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(true);

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const dPctX = overflowX > 0 ? (-dx / overflowX) * 100 : 0;
      const dPctY = overflowY > 0 ? (-dy / overflowY) * 100 : 0;
      onChange({
        x: Math.max(0, Math.min(100, startPos.x + dPctX)),
        y: Math.max(0, Math.min(100, startPos.y + dPctY)),
      });
    };
    const onUp = () => {
      setDragging(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div>
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          borderRadius: 6,
          background: "#F5F3F0",
          position: "relative",
          cursor: dragging ? "grabbing" : "grab",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <img
          src={src}
          alt={alt || ""}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${value.x}% ${value.y}%`,
            display: "block",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.4)",
            pointerEvents: "none",
          }}
        />
      </div>
      <div style={{ fontSize: 12, color: "#818181", marginTop: 6 }}>
        Arraste a imagem para escolher o enquadramento (16:9) que será publicado.
      </div>
    </div>
  );
}
