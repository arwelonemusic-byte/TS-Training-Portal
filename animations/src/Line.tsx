import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";

const RED = "#E25A55";

// ── Muzzle Flash ─────────────────────────────────────────────────────────────
// A starburst that flickers in the direction the soldier faces.

const MuzzleFlash: React.FC<{
  rotation: number;
  phase: number;
}> = ({ rotation, phase }) => {
  const frame = useCurrentFrame();

  // Each soldier fires in bursts: 3 rapid flashes, then a pause.
  // Cycle of 40 frames: flash at frames 0-2, 6-8, 12-14, then pause 15-39.
  const CYCLE = 40;
  const t = (frame + phase) % CYCLE;

  const isFlashing =
    (t >= 0 && t < 3) ||
    (t >= 6 && t < 9) ||
    (t >= 12 && t < 15);

  if (!isFlashing) return null;

  // Pulse scale within each flash
  const flashT = t % 6 < 3 ? t % 3 : 0;
  const scale = interpolate(flashT, [0, 1, 2], [0.6, 1, 0.7]);
  const opacity = interpolate(flashT, [0, 1, 2], [0.7, 1, 0.5]);

  // Position the flash at the tip of the arrow (28px from center in the rotation direction)
  const rad = (rotation - 90) * (Math.PI / 180);
  const dist = 36;
  const fx = Math.cos(rad) * dist;
  const fy = Math.sin(rad) * dist;

  return (
    <g transform={`translate(${fx}, ${fy}) scale(${scale})`} opacity={opacity}>
      {/* Core bright flash */}
      <circle cx={0} cy={0} r={7} fill="#E8700A" />
      <circle cx={0} cy={0} r={5} fill="#FF8C00" />
      <circle cx={0} cy={0} r={2.5} fill="#FFD040" />
      {/* Spikes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const aRad = angle * (Math.PI / 180);
        const len = angle % 90 === 0 ? 14 : 9;
        return (
          <line
            key={angle}
            x1={Math.cos(aRad) * 5}
            y1={Math.sin(aRad) * 5}
            x2={Math.cos(aRad) * len}
            y2={Math.sin(aRad) * len}
            stroke="#E8700A"
            strokeWidth={2}
            opacity={0.9}
          />
        );
      })}
    </g>
  );
};

// ── Unit Marker (red, static — no bounce) ────────────────────────────────────

const UnitMarker: React.FC<{
  x: number;
  y: number;
  label: string;
  rotation?: number;
  flashPhase: number;
}> = ({ x, y, label, rotation = 0, flashPhase }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx={0} cy={18} rx={14} ry={4} fill="rgba(120,50,48,0.2)" />
      <g transform={`rotate(${rotation})`}>
        <polygon
          points="0,-28 -7,-12 7,-12"
          fill={RED}
          stroke="white"
          strokeWidth={3}
        />
      </g>
      <circle cx={0} cy={0} r={16} fill={RED} stroke="white" strokeWidth={3} />
      <text
        x={0}
        y={5}
        textAnchor="middle"
        fontSize={12}
        fontFamily="Inter, sans-serif"
        fontWeight={800}
        fill="white"
      >
        {label}
      </text>
      {/* Muzzle flash in the direction of the arrow */}
      <MuzzleFlash rotation={rotation} phase={flashPhase} />
    </g>
  );
};

// ── Connector Line (horizontal between buddy pairs) ──────────────────────────

const ConnectorLine: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
}> = ({ x1, y1, x2, y2, label }) => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={RED} strokeWidth={2} opacity={0.3} />
      <rect x={midX - 10} y={midY - 10} width={20} height={20} rx={4} fill="#F3F3F3" />
      <text
        x={midX}
        y={midY + 5}
        textAnchor="middle"
        fontSize={14}
        fontFamily="Inter, sans-serif"
        fontWeight={500}
        fill={RED}
      >
        {label}
      </text>
    </g>
  );
};

// ── Distance Label ───────────────────────────────────────────────────────────

const DistanceLabel: React.FC<{ x: number; y: number; text: string }> = ({ x, y, text }) => (
  <g>
    <rect x={x - 16} y={y - 9} width={32} height={18} rx={4} fill="white" />
    <text
      x={x}
      y={y + 5}
      textAnchor="middle"
      fontSize={14}
      fontFamily="Inter, sans-serif"
      fontWeight={500}
      fill="#7b7b7b"
    >
      {text}
    </text>
  </g>
);

// ── Main Composition ─────────────────────────────────────────────────────────

export const Line: React.FC = () => {
  // Soldier positions — horizontal line across center
  const ar  = { x: 196, y: 300 };
  const ftl = { x: 300, y: 300 };
  const gr  = { x: 404, y: 300 };
  const rfl = { x: 508, y: 300 };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1e1e1e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={600} height={600} viewBox="0 0 600 600">
        {/* Background filled circle */}
        <circle cx={300} cy={300} r={250} fill="#F3F3F3" />

        {/* Range rings */}
        <circle cx={300} cy={300} r={250} fill="none" stroke="#DADADA" strokeWidth={2} />
        <circle cx={300} cy={300} r={173} fill="none" stroke="#DADADA" strokeWidth={2} />
        <circle cx={300} cy={300} r={84} fill="none" stroke="#DADADA" strokeWidth={2} />

        {/* Distance labels — along the top */}
        <DistanceLabel x={301} y={55} text="30m" />
        <DistanceLabel x={301} y={132} text="20m" />
        <DistanceLabel x={301} y={218} text="10m" />

        {/* Connector lines between buddy pairs */}
        <ConnectorLine x1={ar.x} y1={ar.y} x2={ftl.x} y2={ftl.y} label="1" />
        <ConnectorLine x1={gr.x} y1={gr.y} x2={rfl.x} y2={rfl.y} label="2" />

        {/* Soldiers — line formation, all facing roughly forward (upward/right) */}
        <UnitMarker x={ar.x}  y={ar.y}  label="AR"  rotation={0} flashPhase={0} />
        <UnitMarker x={ftl.x} y={ftl.y} label="FTL" rotation={0} flashPhase={10} />
        <UnitMarker x={gr.x}  y={gr.y}  label="GR"  rotation={0} flashPhase={22} />
        <UnitMarker x={rfl.x} y={rfl.y} label="RFL" rotation={0} flashPhase={33} />
      </svg>
    </AbsoluteFill>
  );
};
