import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

// ── Unit Marker (blue) ──────────────────────────────────────────────────────

const UnitMarker: React.FC<{
  x: number;
  y: number;
  label: string;
  rotation?: number;
  directionRotation?: number;
  bouncePhase?: number;
}> = ({ x, y, label, rotation = 0, directionRotation, bouncePhase = 0 }) => {
  const frame = useCurrentFrame();
  const arrowAngle = directionRotation ?? rotation;

  const bounce = Math.abs(Math.sin((frame + bouncePhase) * 0.4)) * 4;
  const shadowScaleX = interpolate(bounce, [0, 4], [14, 12]);
  const shadowScaleY = interpolate(bounce, [0, 4], [4, 3]);

  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx={0} cy={18} rx={shadowScaleX} ry={shadowScaleY} fill="rgba(45,78,117,0.2)" />
      <g transform={`translate(0, ${-bounce})`}>
        <g transform={`rotate(${arrowAngle})`}>
          <polygon
            points="0,-28 -7,-12 7,-12"
            fill="#5996DC"
            stroke="white"
            strokeWidth={3}
          />
        </g>
        <circle cx={0} cy={0} r={16} fill="#5996DC" stroke="white" strokeWidth={3} />
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
      </g>
    </g>
  );
};

// ── Connector Line ───────────────────────────────────────────────────────────

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
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5996DC" strokeWidth={2} opacity={0.3} />
      <rect x={midX - 10} y={midY - 10} width={20} height={20} rx={4} fill="#F3F3F3" />
      <text
        x={midX}
        y={midY + 5}
        textAnchor="middle"
        fontSize={14}
        fontFamily="Inter, sans-serif"
        fontWeight={500}
        fill="#5996DC"
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

// ── RFL look-back ────────────────────────────────────────────────────────────
// RFL faces ~47°. Occasionally rotates clockwise a bit to glance back.
// 100-frame cycle (1 cycle in 100-frame composition).

function useRflLookBack(): number {
  const frame = useCurrentFrame();
  const BASE_ROTATION = 47;
  const TURN_AMOUNT = 115; // clockwise glance
  const CYCLE = 100;
  const TURN_DURATION = 13;

  const t = frame % CYCLE;

  // 0–34:  facing forward
  // 34–47: turn to look back
  // 47–67: hold looking back
  // 67–80: turn back to forward
  // 80–100: facing forward

  if (t < 34) return BASE_ROTATION;
  if (t < 34 + TURN_DURATION) {
    return BASE_ROTATION + interpolate(t - 34, [0, TURN_DURATION], [0, TURN_AMOUNT], {
      easing: Easing.inOut(Easing.cubic),
    });
  }
  if (t < 67) return BASE_ROTATION + TURN_AMOUNT;
  if (t < 67 + TURN_DURATION) {
    return BASE_ROTATION + TURN_AMOUNT - interpolate(t - 67, [0, TURN_DURATION], [0, TURN_AMOUNT], {
      easing: Easing.inOut(Easing.cubic),
    });
  }
  return BASE_ROTATION;
}

// ── Main Composition ─────────────────────────────────────────────────────────

export const Chevron: React.FC = () => {
  const rflRotation = useRflLookBack();

  // Soldier positions — V/chevron formation
  const ftl = { x: 200, y: 230 };
  const ar = { x: 105, y: 315 };
  const gr = { x: 300, y: 315 };
  const rfl = { x: 395, y: 390 };

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
        <ConnectorLine x1={ftl.x} y1={ftl.y} x2={ar.x} y2={ar.y} label="1" />
        <ConnectorLine x1={gr.x} y1={gr.y} x2={rfl.x} y2={rfl.y} label="2" />

        {/* Soldiers — chevron formation */}
        <UnitMarker x={ftl.x} y={ftl.y} label="FTL" rotation={0} bouncePhase={0} />
        <UnitMarker x={ar.x} y={ar.y} label="AR" rotation={-42} bouncePhase={3} />
        <UnitMarker x={gr.x} y={gr.y} label="GR" rotation={29} bouncePhase={5} />
        <UnitMarker x={rfl.x} y={rfl.y} label="RFL" rotation={47} directionRotation={rflRotation} bouncePhase={8} />
      </svg>
    </AbsoluteFill>
  );
};
