import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";

// ── Duration plan ────────────────────────────────────────────────────────────
// 150 frames @ 30 fps = 5 seconds
// 0–40:   Hold File formation
// 40–100: Transition to Chevron
// 100–150: Hold Chevron
// AR is always centered at (300, 300)

const TRANSITION_START = 40;
const TRANSITION_END = 100;

// ── File positions (vertical column, shifted down so AR is at center) ────────
const file = {
  ftl: { x: 300, y: 195 },
  ar:  { x: 300, y: 300 },
  gr:  { x: 300, y: 405 },
  rfl: { x: 300, y: 508 },
};

// ── Chevron positions (V-shape, FTL stays in place, others form V around it) ─
// Original chevron offsets from FTL: AR(-95,+85), GR(+100,+85), RFL(+195,+160)
const chevron = {
  ftl: { x: 300, y: 195 },
  ar:  { x: 205, y: 280 },
  gr:  { x: 400, y: 280 },
  rfl: { x: 495, y: 355 },
};

// ── Rotations ────────────────────────────────────────────────────────────────
const fileRotations = { ftl: 0, ar: 37, gr: -28, rfl: 25 };
const chevronRotations = { ftl: 0, ar: -42, gr: 29, rfl: 47 };

// ── Unit Marker (blue, always bouncing) ──────────────────────────────────────

const UnitMarker: React.FC<{
  x: number;
  y: number;
  label: string;
  arrowAngle: number;
  bouncePhase: number;
}> = ({ x, y, label, arrowAngle, bouncePhase }) => {
  const frame = useCurrentFrame();

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

// ── Speech Bubble ────────────────────────────────────────────────────────────

const SpeechBubble: React.FC<{
  x: number;
  y: number;
  text: string;
  opacity: number;
}> = ({ x, y, text, opacity }) => {
  const lines = text.split(". ");
  const lineHeight = 18;
  const paddingX = 14;
  const paddingY = 10;
  const bubbleWidth = 170;
  const bubbleHeight = paddingY * 2 + lines.length * lineHeight;
  const tailSize = 8;

  return (
    <g opacity={opacity}>
      {/* Bubble body */}
      <rect
        x={x - bubbleWidth / 2}
        y={y - bubbleHeight}
        width={bubbleWidth}
        height={bubbleHeight}
        rx={10}
        fill="white"
        stroke="#DADADA"
        strokeWidth={1.5}
      />
      {/* Tail triangle */}
      <polygon
        points={`${x - tailSize},${y} ${x + tailSize},${y} ${x},${y + tailSize}`}
        fill="white"
        stroke="#DADADA"
        strokeWidth={1.5}
      />
      {/* Cover the stroke where tail meets bubble */}
      <rect
        x={x - tailSize}
        y={y - 2}
        width={tailSize * 2}
        height={3}
        fill="white"
      />
      {/* Text lines */}
      {lines.map((line, i) => (
        <text
          key={i}
          x={x}
          y={y - bubbleHeight + paddingY + (i + 1) * lineHeight - 3}
          textAnchor="middle"
          fontSize={14}
          fontFamily="Inter, sans-serif"
          fontWeight={600}
          fill="#1e1e1e"
        >
          {line}{i < lines.length - 1 ? "." : ""}
        </text>
      ))}
    </g>
  );
};

// ── Main Composition ─────────────────────────────────────────────────────────

export const FileToChevronAR: React.FC = () => {
  const frame = useCurrentFrame();

  // AR moves first, GR and RFL start 15 frames (0.5s) later
  const DELAY = 15;

  // Transition progress for AR (and FTL rotation)
  const progress = interpolate(frame, [TRANSITION_START, TRANSITION_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Delayed progress for GR and RFL
  const progressDelayed = interpolate(frame, [TRANSITION_START + DELAY, TRANSITION_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  // Interpolate positions
  const ftl = {
    x: file.ftl.x,
    y: file.ftl.y,
  };
  const ar = {
    x: interpolate(progress, [0, 1], [file.ar.x, chevron.ar.x]),
    y: interpolate(progress, [0, 1], [file.ar.y, chevron.ar.y]),
  };
  const gr = {
    x: interpolate(progressDelayed, [0, 1], [file.gr.x, chevron.gr.x]),
    y: interpolate(progressDelayed, [0, 1], [file.gr.y, chevron.gr.y]),
  };
  const rfl = {
    x: interpolate(progressDelayed, [0, 1], [file.rfl.x, chevron.rfl.x]),
    y: interpolate(progressDelayed, [0, 1], [file.rfl.y, chevron.rfl.y]),
  };

  // Speech bubble — appears just before transition, fades out as soldiers settle
  const bubbleOpacity = interpolate(frame,
    [TRANSITION_START - 10, TRANSITION_START, TRANSITION_END - 15, TRANSITION_END],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Interpolate rotations
  const ftlRotation = interpolate(progress, [0, 1], [fileRotations.ftl, chevronRotations.ftl]);
  const arRotation = interpolate(progress, [0, 1], [fileRotations.ar, chevronRotations.ar]);
  const grRotation = interpolate(progressDelayed, [0, 1], [fileRotations.gr, chevronRotations.gr]);
  const rflRotation = interpolate(progressDelayed, [0, 1], [fileRotations.rfl, chevronRotations.rfl]);


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

        {/* Buddy pair connector lines — follow soldiers throughout */}
        <ConnectorLine x1={ftl.x} y1={ftl.y} x2={ar.x} y2={ar.y} label="1" />
        <ConnectorLine x1={gr.x} y1={gr.y} x2={rfl.x} y2={rfl.y} label="2" />

        {/* Speech bubble above FTL */}
        <SpeechBubble x={ftl.x} y={ftl.y - 30} text="Шеврон. Пулемёт слева" opacity={bubbleOpacity} />

        {/* Soldiers */}
        <UnitMarker x={ftl.x} y={ftl.y} label="FTL" arrowAngle={ftlRotation} bouncePhase={0} />
        <UnitMarker x={ar.x} y={ar.y} label="AR" arrowAngle={arRotation} bouncePhase={2} />
        <UnitMarker x={gr.x} y={gr.y} label="GR" arrowAngle={grRotation} bouncePhase={5} />
        <UnitMarker x={rfl.x} y={rfl.y} label="RFL" arrowAngle={rflRotation} bouncePhase={7} />
      </svg>
    </AbsoluteFill>
  );
};
