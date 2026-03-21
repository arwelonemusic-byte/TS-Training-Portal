import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

// ── Colors ───────────────────────────────────────────────────────────────────

const RED = "#E25A55";
const RED_LIGHT = "rgba(226,90,85,0.3)";

// ── Unit Marker (red variant) ────────────────────────────────────────────────

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
      <ellipse cx={0} cy={18} rx={shadowScaleX} ry={shadowScaleY} fill="rgba(120,50,48,0.2)" />
      <g transform={`translate(0, ${-bounce})`}>
        <g transform={`rotate(${arrowAngle})`}>
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
      </g>
    </g>
  );
};

// ── Connector Line (diagonal between buddy pairs) ───────────────────────────

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
      <rect x={midX - 10} y={midY - 10} width={20} height={20} rx={4} fill="#BEBEBE" />
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

// ── Road dashes ──────────────────────────────────────────────────────────────
// Tall strip of dashes that tiles vertically, same pattern as tree scrolling.

const ROAD_STRIP_HEIGHT = 600;
const DASH_HEIGHT = 40;
const DASH_GAP = 35; // 40+35=75, divides evenly into 600 (8 dashes per strip)

const RoadDashes: React.FC<{ scrollOffset: number }> = ({ scrollOffset }) => {
  const dashes: number[] = [];
  let y = 0;
  while (y < ROAD_STRIP_HEIGHT) {
    dashes.push(y);
    y += DASH_HEIGHT + DASH_GAP;
  }

  return (
    <>
      {[0, ROAD_STRIP_HEIGHT].map((copyOffset) => (
        <g
          key={copyOffset}
          transform={`translate(0, ${scrollOffset + copyOffset - ROAD_STRIP_HEIGHT})`}
        >
          {dashes.map((dy, i) => (
            <rect
              key={i}
              x={297}
              y={dy}
              width={6}
              height={DASH_HEIGHT}
              rx={3}
              fill="white"
            />
          ))}
        </g>
      ))}
    </>
  );
};

// ── RFL look-back rotation hook ──────────────────────────────────────────────
// Rotates counterclockwise 120° so the arrow points downward, then back.
// 100-frame cycle (2 complete cycles in 200-frame composition).

function useRflLookBack(): number {
  const frame = useCurrentFrame();
  const BASE_ROTATION = -51;
  const TURN_AMOUNT = -120; // counterclockwise
  const CYCLE = 100;
  const TURN_DURATION = 13;

  const t = frame % CYCLE;

  // 0–34:  facing forward (hold)
  // 34–47: turning counterclockwise 120°
  // 47–67: facing back (hold)
  // 67–80: turning back to forward
  // 80–100: facing forward (hold)

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

export const StaggeredColumn: React.FC = () => {
  const frame = useCurrentFrame();
  const rflRotation = useRflLookBack();

  // scrollSpeed = ROAD_STRIP_HEIGHT / durationInFrames = 600 / 200 = 3
  const scrollSpeed = 3;
  const scrollOffset = (frame * scrollSpeed) % ROAD_STRIP_HEIGHT;

  // Soldier positions — staggered on alternating sides of the road
  // Right side: FTL (top), GR (lower)
  // Left side: AR (upper), RFL (bottom)
  const ftl = { x: 370, y: 155 };
  const ar = { x: 220, y: 245 };
  const gr = { x: 370, y: 340 };
  const rfl = { x: 220, y: 430 };

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

        {/* Clip for road and dashes */}
        <defs>
          <clipPath id="circleClipRoad">
            <circle cx={300} cy={300} r={248} />
          </clipPath>
        </defs>

        {/* Road surface */}
        <g clipPath="url(#circleClipRoad)">
          {/* Asphalt strip */}
          <rect x={260} y={50} width={80} height={500} fill="#9E9E9E" />
          {/* Road edges */}
          <rect x={258} y={50} width={3} height={500} fill="#BDBDBD" />
          <rect x={339} y={50} width={3} height={500} fill="#BDBDBD" />

          {/* Scrolling center dashes */}
          <RoadDashes scrollOffset={scrollOffset} />
        </g>

        {/* Connector lines between buddy pairs */}
        <ConnectorLine x1={ftl.x} y1={ftl.y} x2={ar.x} y2={ar.y} label="1" />
        <ConnectorLine x1={gr.x} y1={gr.y} x2={rfl.x} y2={rfl.y} label="2" />

        {/* Soldiers — staggered column formation */}
        <UnitMarker x={ftl.x} y={ftl.y} label="FTL" rotation={26} bouncePhase={0} />
        <UnitMarker x={ar.x} y={ar.y} label="AR" rotation={-31} bouncePhase={3} />
        <UnitMarker x={gr.x} y={gr.y} label="GR" rotation={46} bouncePhase={5} />
        <UnitMarker x={rfl.x} y={rfl.y} label="RFL" rotation={-51} directionRotation={rflRotation} bouncePhase={8} />
      </svg>
    </AbsoluteFill>
  );
};
