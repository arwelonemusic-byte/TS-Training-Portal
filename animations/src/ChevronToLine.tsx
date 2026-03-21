import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";

// ── Duration plan ────────────────────────────────────────────────────────────
// 150 frames @ 30 fps = 5 seconds
// 0–40:   Hold Chevron (bounce, RFL lookback)
// 40–100: Transition to Line (smooth interpolation)
// 100–150: Hold Line (no bounce, all face forward)

const TRANSITION_START = 40;
const TRANSITION_END = 100;

// ── Chevron positions ────────────────────────────────────────────────────────
const chevron = {
  ftl: { x: 200, y: 230 },
  ar:  { x: 105, y: 315 },
  gr:  { x: 300, y: 315 },
  rfl: { x: 395, y: 390 },
};

// ── Line positions (centered, 100px spacing) ────────────────────────────────
const line = {
  ar:  { x: 150, y: 300 },
  ftl: { x: 250, y: 300 },
  gr:  { x: 350, y: 300 },
  rfl: { x: 450, y: 300 },
};

// ── Chevron rotations ────────────────────────────────────────────────────────
const chevronRotations = {
  ftl: 0,
  ar: -42,
  gr: 29,
  rfl: 47,
};

// ── Unit Marker (blue, animated) ─────────────────────────────────────────────

const UnitMarker: React.FC<{
  x: number;
  y: number;
  label: string;
  arrowAngle: number;
  bounceAmount: number;
  bouncePhase: number;
}> = ({ x, y, label, arrowAngle, bounceAmount, bouncePhase }) => {
  const frame = useCurrentFrame();

  const bounce = Math.abs(Math.sin((frame + bouncePhase) * 0.4)) * bounceAmount;
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

// ── Main Composition ─────────────────────────────────────────────────────────

export const ChevronToLine: React.FC = () => {
  const frame = useCurrentFrame();

  // Transition progress 0→1
  const progress = interpolate(frame, [TRANSITION_START, TRANSITION_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Bounce continues until soldiers reach line formation, then fades out
  const bounceAmount = interpolate(frame, [TRANSITION_END - 10, TRANSITION_END], [4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Interpolate positions
  const ftl = {
    x: interpolate(progress, [0, 1], [chevron.ftl.x, line.ftl.x]),
    y: interpolate(progress, [0, 1], [chevron.ftl.y, line.ftl.y]),
  };
  const ar = {
    x: interpolate(progress, [0, 1], [chevron.ar.x, line.ar.x]),
    y: interpolate(progress, [0, 1], [chevron.ar.y, line.ar.y]),
  };
  const gr = {
    x: interpolate(progress, [0, 1], [chevron.gr.x, line.gr.x]),
    y: interpolate(progress, [0, 1], [chevron.gr.y, line.gr.y]),
  };
  const rfl = {
    x: interpolate(progress, [0, 1], [chevron.rfl.x, line.rfl.x]),
    y: interpolate(progress, [0, 1], [chevron.rfl.y, line.rfl.y]),
  };

  // Interpolate rotations
  const ftlRotation = interpolate(progress, [0, 1], [chevronRotations.ftl, 0]);
  const arRotation = interpolate(progress, [0, 1], [chevronRotations.ar, 0]);
  const grRotation = interpolate(progress, [0, 1], [chevronRotations.gr, 0]);
  const rflRotation = interpolate(progress, [0, 1], [chevronRotations.rfl, 0]);

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

        {/* Distance labels */}
        <DistanceLabel x={301} y={55} text="30m" />
        <DistanceLabel x={301} y={132} text="20m" />
        <DistanceLabel x={301} y={218} text="10m" />

        {/* Connector lines between buddy pairs */}
        <ConnectorLine x1={ftl.x} y1={ftl.y} x2={ar.x} y2={ar.y} label="1" />
        <ConnectorLine x1={gr.x} y1={gr.y} x2={rfl.x} y2={rfl.y} label="2" />

        {/* Soldiers */}
        <UnitMarker x={ftl.x} y={ftl.y} label="FTL" arrowAngle={ftlRotation} bounceAmount={bounceAmount} bouncePhase={0} />
        <UnitMarker x={ar.x} y={ar.y} label="AR" arrowAngle={arRotation} bounceAmount={bounceAmount} bouncePhase={3} />
        <UnitMarker x={gr.x} y={gr.y} label="GR" arrowAngle={grRotation} bounceAmount={bounceAmount} bouncePhase={5} />
        <UnitMarker x={rfl.x} y={rfl.y} label="RFL" arrowAngle={rflRotation} bounceAmount={bounceAmount} bouncePhase={8} />

      </svg>
    </AbsoluteFill>
  );
};
