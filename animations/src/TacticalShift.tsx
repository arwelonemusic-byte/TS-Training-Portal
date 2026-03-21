import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

// ── Tree Component ───────────────────────────────────────────────────────────

const Tree: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x={-4} y={10} width={8} height={18} rx={2} fill="#5a8f6e" />
      <polygon points="0,-30 -18,5 18,5" fill="#74B08F" />
      <polygon points="0,-20 -15,10 15,10" fill="#74B08F" />
      <polygon points="0,-10 -12,15 12,15" fill="#6aa383" />
    </g>
  );
};

// ── Unit Marker ──────────────────────────────────────────────────────────────

const UnitMarker: React.FC<{
  x: number;
  y: number;
  label: string;
  rotation?: number;
  directionRotation?: number;
  /** Phase offset so soldiers don't all bounce in sync */
  bouncePhase?: number;
}> = ({ x, y, label, rotation = 0, directionRotation, bouncePhase = 0 }) => {
  const frame = useCurrentFrame();
  const arrowAngle = directionRotation ?? rotation;

  // Running bounce: quick sinusoidal bob. ~4 steps/sec at 30fps.
  const bounce = Math.abs(Math.sin((frame + bouncePhase) * 0.4)) * 4;

  // Shadow scales slightly when the marker is higher (further from ground).
  const shadowScaleX = interpolate(bounce, [0, 4], [14, 12]);
  const shadowScaleY = interpolate(bounce, [0, 4], [4, 3]);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Shadow stays at ground level */}
      <ellipse cx={0} cy={18} rx={shadowScaleX} ry={shadowScaleY} fill="rgba(45,78,117,0.2)" />
      {/* Marker bounces up */}
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

// ── RFL look-back rotation hook ──────────────────────────────────────────────
// Cycle: hold forward → turn 160° → hold looking back → turn back to forward
// 100-frame cycle (4 complete cycles in 400-frame composition).

function useRflLookBack(): number {
  const frame = useCurrentFrame();
  const BASE_ROTATION = 25; // RFL's normal forward angle
  const CYCLE = 100; // frames per full cycle (400 / 4)
  const TURN_DURATION = 13; // frames for the 160° sweep

  const t = frame % CYCLE;

  // 0–34:  facing forward (hold)
  // 34–47: turning to look back (+160°)
  // 47–67: facing back (hold)
  // 67–80: turning back to forward
  // 80–100: facing forward (hold)

  if (t < 34) return BASE_ROTATION;
  if (t < 34 + TURN_DURATION) {
    return BASE_ROTATION + interpolate(t - 34, [0, TURN_DURATION], [0, 160], {
      easing: Easing.inOut(Easing.cubic),
    });
  }
  if (t < 67) return BASE_ROTATION + 160;
  if (t < 67 + TURN_DURATION) {
    return BASE_ROTATION + 160 - interpolate(t - 67, [0, TURN_DURATION], [0, 160], {
      easing: Easing.inOut(Easing.cubic),
    });
  }
  return BASE_ROTATION;
}

// ── Waypoint Line ────────────────────────────────────────────────────────────

const WaypointLine: React.FC<{
  x: number;
  y1: number;
  y2: number;
  label: string;
}> = ({ x, y1, y2, label }) => {
  const midY = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke="#5996DC" strokeWidth={3} opacity={0.3} />
      <rect x={x - 10} y={midY - 10} width={20} height={20} rx={4} fill="#F3F3F3" />
      <text
        x={x}
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


// ── Tree positions ───────────────────────────────────────────────────────────
// Trees are defined in a tall strip that tiles vertically.
// The strip height determines the scroll loop period.

// Strip height must equal durationInFrames * scrollSpeed for seamless loop.
// 100 frames * 3 px/frame = 300px strip.
const STRIP_HEIGHT = 300;

const treeStrip: { x: number; y: number; scale: number }[] = [
  { x: 186, y: 15, scale: 0.9 },
  { x: 379, y: 30, scale: 1.0 },
  { x: 115, y: 60, scale: 0.85 },
  { x: 460, y: 75, scale: 0.75 },
  { x: 223, y: 95, scale: 0.9 },
  { x: 410, y: 115, scale: 0.95 },
  { x: 140, y: 135, scale: 0.8 },
  { x: 330, y: 150, scale: 0.85 },
  { x: 500, y: 165, scale: 0.7 },
  { x: 180, y: 185, scale: 0.9 },
  { x: 420, y: 200, scale: 0.85 },
  { x: 100, y: 220, scale: 0.95 },
  { x: 350, y: 235, scale: 0.8 },
  { x: 223, y: 255, scale: 0.9 },
  { x: 470, y: 275, scale: 0.75 },
  { x: 155, y: 290, scale: 0.85 },
];

// ── Main Composition ─────────────────────────────────────────────────────────

export const FileFormation: React.FC = () => {
  const frame = useCurrentFrame();
  const rflRotation = useRflLookBack();

  // scrollSpeed = STRIP_HEIGHT / durationInFrames = 300 / 100 = 3
  const scrollSpeed = 3;
  const scrollOffset = (frame * scrollSpeed) % STRIP_HEIGHT;

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

        {/* Scrolling trees — clipped to the background circle */}
        <defs>
          <clipPath id="circleClip">
            <circle cx={300} cy={300} r={248} />
          </clipPath>
        </defs>
        <g clipPath="url(#circleClip)">
          {/*
            Render two copies of the strip offset by STRIP_HEIGHT so that
            as one scrolls out the top/bottom the other fills in seamlessly.
          */}
          {[0, STRIP_HEIGHT, STRIP_HEIGHT * 2].map((copyOffset) => (
            <g
              key={copyOffset}
              transform={`translate(0, ${scrollOffset + copyOffset - STRIP_HEIGHT})`}
            >
              {treeStrip.map((t, i) => (
                <Tree key={i} x={t.x} y={t.y} scale={t.scale} />
              ))}
            </g>
          ))}
        </g>

        {/* Distance labels */}
        <DistanceLabel x={217} y={291} text="10m" />
        <DistanceLabel x={127} y={291} text="20m" />
        <DistanceLabel x={49} y={291} text="30m" />

        {/* Waypoint lines */}
        <WaypointLine x={300} y1={112} y2={171} label="1" />
        <WaypointLine x={300} y1={320} y2={379} label="2" />

        {/* Unit markers — static positions */}
        <UnitMarker x={300} y={90} label="FTL" rotation={0} bouncePhase={0} />
        <UnitMarker x={300} y={195} label="AR" rotation={37} bouncePhase={2} />
        <UnitMarker x={300} y={300} label="GR" rotation={-28} bouncePhase={5} />
        <UnitMarker x={300} y={403} label="RFL" rotation={25} directionRotation={rflRotation} bouncePhase={7} />

      </svg>
    </AbsoluteFill>
  );
};
