"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { RoleTier } from "@/data/training";

/* ── Icons ───────────────────────────────────────────────────────────── */

function LockIcon() {
  return (
    <svg className="h-8 w-8 shrink-0" viewBox="0 0 32 32" fill="none">
      <path d="M25.3406 15.3864C25.0223 15.0682 24.6361 14.9092 24.1813 14.9092H23.6362V11.6363C23.6362 9.5454 22.8864 7.75011 21.3863 6.2501C19.8864 4.75003 18.0913 4 16.0001 4C13.909 4 12.1135 4.75003 10.6137 6.25004C9.11361 7.75011 8.36381 9.54534 8.36381 11.6363V14.9092H7.81844C7.36405 14.9092 6.9776 15.0682 6.65938 15.3864C6.34117 15.7044 6.18213 16.0908 6.18213 16.5456V26.3637C6.18213 26.8181 6.34123 27.2047 6.65938 27.5229C6.9776 27.8408 7.36405 28 7.81844 28H24.1817C24.6365 28 25.0226 27.841 25.341 27.5229C25.6589 27.2047 25.8182 26.8181 25.8182 26.3637V16.5454C25.8185 16.091 25.6589 15.7046 25.3406 15.3864ZM20.3636 14.9092H11.6365V11.6363C11.6365 10.4318 12.0628 9.40331 12.915 8.55119C13.7674 7.69894 14.7957 7.27291 16.0003 7.27291C17.205 7.27291 18.2331 7.69888 19.0855 8.55119C19.9375 9.40325 20.3636 10.4318 20.3636 11.6363V14.9092Z" fill="white" fillOpacity="0.3"/>
    </svg>
  );
}

function UnlockIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="none">
      <path d="M5.3335 5.33331V4.76731C5.33295 4.17662 5.52854 3.60246 5.88958 3.13494C6.25062 2.66743 6.75667 2.33302 7.32831 2.1842C7.89995 2.03538 8.50483 2.08057 9.04801 2.31268C9.59119 2.54478 10.0419 2.95067 10.3295 3.46665L12.0748 2.48998C11.5711 1.58779 10.7823 0.878275 9.83195 0.47269C8.88161 0.0671053 7.82354 -0.0116104 6.82365 0.248886C5.82376 0.509382 4.9386 1.09436 4.30696 1.91209C3.67533 2.72981 3.33294 3.73405 3.3335 4.76731V5.33331H1.3335V14C1.3335 14.5304 1.54421 15.0391 1.91928 15.4142C2.29436 15.7893 2.80306 16 3.3335 16H12.6668C13.1973 16 13.706 15.7893 14.081 15.4142C14.4561 15.0391 14.6668 14.5304 14.6668 14V5.33331H5.3335ZM3.3335 14V7.33331H12.6668V14H3.3335Z" fill="#1E1E1E"/>
      <path d="M9.33317 9.3335H6.6665V11.3335H9.33317V9.3335Z" fill="#1E1E1E"/>
    </svg>
  );
}

function CompletedIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="none">
      <g clipPath="url(#clip-completed)">
        <path d="M10.2986 5.28717L11.7013 6.71317L8.17259 10.1845C7.85193 10.5058 7.42726 10.6672 7.00259 10.6672C6.57526 10.6672 6.14726 10.5045 5.82193 10.1792L3.97126 8.38584L5.36326 6.94984L6.99926 8.53517L10.2999 5.2885L10.2986 5.28717ZM15.7246 9.09384L13.0186 14.1365C12.6226 14.8745 11.8553 15.3332 11.0153 15.3332H4.99726C4.15926 15.3332 3.39259 14.8758 2.99593 14.1398L0.277262 9.09984C-0.0927382 8.41317 -0.0934049 7.59317 0.277262 6.90584L2.99593 1.8605C3.39259 1.1245 4.15993 0.666504 4.99726 0.666504H11.0153C11.8553 0.666504 12.6226 1.12517 13.0186 1.86317L15.7253 6.9065C16.0926 7.5905 16.0926 8.4085 15.7253 9.09317L15.7246 9.09384ZM13.9626 7.85317L11.2559 2.80917C11.2093 2.72117 11.1166 2.6665 11.0153 2.6665H4.99726C4.89593 2.6665 4.80326 2.72117 4.75593 2.80917L2.0366 7.8545C1.9866 7.94717 1.9866 8.05784 2.0366 8.1505L4.75526 13.1912C4.80259 13.2792 4.89459 13.3332 4.99659 13.3332H11.0153C11.1166 13.3332 11.2093 13.2785 11.2566 13.1905L13.9619 8.14784C14.0119 8.05517 14.0119 7.94584 13.9619 7.85384L13.9626 7.85317Z" fill="#76E176"/>
      </g>
      <defs>
        <clipPath id="clip-completed">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function GuideIcon() {
  return (
    <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#clip-guide)">
        <path d="M17 14C17 14.2652 16.8946 14.5196 16.7071 14.7071C16.5196 14.8947 16.2652 15 16 15H8C7.73478 15 7.48043 14.8947 7.29289 14.7071C7.10536 14.5196 7 14.2652 7 14C7 13.7348 7.10536 13.4805 7.29289 13.2929C7.48043 13.1054 7.73478 13 8 13H16C16.2652 13 16.5196 13.1054 16.7071 13.2929C16.8946 13.4805 17 13.7348 17 14ZM13 17H8C7.73478 17 7.48043 17.1054 7.29289 17.2929C7.10536 17.4805 7 17.7348 7 18C7 18.2652 7.10536 18.5196 7.29289 18.7071C7.48043 18.8947 7.73478 19 8 19H13C13.2652 19 13.5196 18.8947 13.7071 18.7071C13.8946 18.5196 14 18.2652 14 18C14 17.7348 13.8946 17.4805 13.7071 17.2929C13.5196 17.1054 13.2652 17 13 17ZM22 10.485V19C21.9984 20.3256 21.4711 21.5965 20.5338 22.5338C19.5964 23.4711 18.3256 23.9984 17 24H7C5.6744 23.9984 4.40356 23.4711 3.46622 22.5338C2.52888 21.5965 2.00159 20.3256 2 19V5.00002C2.00159 3.67443 2.52888 2.40358 3.46622 1.46624C4.40356 0.528905 5.6744 0.00161091 7 2.30487e-05H11.515C12.4346 -0.00234388 13.3456 0.177611 14.1952 0.529482C15.0449 0.881354 15.8163 1.39816 16.465 2.05002L19.949 5.53602C20.6012 6.18426 21.1184 6.95548 21.4704 7.805C21.8225 8.65451 22.0025 9.56545 22 10.485ZM15.051 3.46402C14.7363 3.15918 14.3829 2.89695 14 2.68402V7.00002C14 7.26524 14.1054 7.51959 14.2929 7.70713C14.4804 7.89467 14.7348 8.00002 15 8.00002H19.316C19.103 7.61721 18.8404 7.26417 18.535 6.95002L15.051 3.46402ZM20 10.485C20 10.32 19.968 10.162 19.953 10H15C14.2044 10 13.4413 9.68395 12.8787 9.12134C12.3161 8.55873 12 7.79567 12 7.00002V2.04702C11.838 2.03202 11.679 2.00002 11.515 2.00002H7C6.20435 2.00002 5.44129 2.31609 4.87868 2.8787C4.31607 3.44131 4 4.20437 4 5.00002V19C4 19.7957 4.31607 20.5587 4.87868 21.1213C5.44129 21.684 6.20435 22 7 22H17C17.7956 22 18.5587 21.684 19.1213 21.1213C19.6839 20.5587 20 19.7957 20 19V10.485Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip-guide">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="none">
      <g clipPath="url(#clip-play)">
        <path d="M3.40347 0.352788C1.96098 -0.474645 0.791504 0.203198 0.791504 1.86558V14.1332C0.791504 15.7973 1.96098 16.4743 3.40347 15.6476L14.126 9.4983C15.569 8.67057 15.569 7.32953 14.126 6.502L3.40347 0.352788Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip-play">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

function RepeatIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="none">
      <path d="M15.7817 11.2001C15.0995 12.1099 14.2915 12.9172 13.3817 13.6001C12.9933 13.891 12.4603 13.891 12.0719 13.6001C11.1621 12.9179 10.3548 12.1099 9.67189 11.2001C9.31043 10.7179 9.40861 10.0335 9.89007 9.67207C10.3737 9.31207 11.0566 9.4088 11.4181 9.89025C11.4864 9.98116 11.5643 10.0641 11.6355 10.1528C11.6341 7.9528 11.4595 5.83789 11.3555 4.77534C10.7853 4.63862 9.78825 4.45607 8.29443 4.36152C7.69298 4.32298 7.23625 3.80443 7.2748 3.20371C7.31334 2.60298 7.82171 2.14407 8.43261 2.18407C11.3512 2.36952 12.6406 2.86916 12.7781 2.92589C13.1439 3.07571 13.3992 3.41243 13.4472 3.80443C13.4617 3.92952 13.8166 6.90407 13.8181 10.1543C13.8893 10.0655 13.9679 9.98262 14.0362 9.89098C14.3984 9.40952 15.0821 9.3128 15.5642 9.6728C16.0457 10.0343 16.1439 10.7186 15.7824 11.2008L15.7817 11.2001ZM7.70534 11.6386C6.21152 11.5441 5.21443 11.3608 4.64425 11.2248C4.54025 10.1623 4.36571 8.04734 4.36425 5.84734C4.43552 5.93607 4.51407 6.01825 4.58171 6.10989C4.94534 6.59425 5.63116 6.68662 6.10971 6.32807C6.59116 5.96662 6.68934 5.28225 6.32789 4.80007C5.64571 3.89025 4.83771 3.08298 3.92789 2.40007C3.54025 2.10916 3.00571 2.10916 2.61807 2.40007C1.70825 3.08225 0.900978 3.89025 0.218069 4.80007C-0.143385 5.28225 -0.0452032 5.96662 0.436251 6.32807C0.91916 6.6888 1.6028 6.59207 1.96425 6.10989C2.03261 6.01825 2.11116 5.93534 2.18243 5.84661C2.18461 9.09607 2.5388 12.0706 2.55334 12.1964C2.60061 12.5884 2.85661 12.9252 3.22243 13.075C3.28207 13.1157 4.82752 13.6677 7.63698 13.8183C8.20789 13.8183 8.68789 13.3746 8.72498 12.7964C8.76352 12.1957 8.3068 11.6772 7.70534 11.6386Z" fill="white"/>
    </svg>
  );
}

function ExpandButton({ open }: { open: boolean }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#2a2a2a] transition-transform duration-200 group-hover:scale-110">
      {open ? (
        <svg className="h-3 w-3" viewBox="0 0 12 2" fill="none">
          <rect width="12" height="2" rx="1" fill="white" />
        </svg>
      ) : (
        <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
          <rect x="5" y="0" width="2" height="12" rx="1" fill="white" />
          <rect x="0" y="5" width="12" height="2" rx="1" fill="white" />
        </svg>
      )}
    </div>
  );
}

function UnlockBadge() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <UnlockIcon />
      <span className="text-[13px] font-bold text-[#1e1e1e]">ДОСТУПНО</span>
    </div>
  );
}

function CompletedBadge() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <CompletedIcon />
      <span className="text-[13px] font-bold text-[#76e176]">ПРОЙДЕНО</span>
    </div>
  );
}

/* ── Animated collapse wrapper ───────────────────────────────────────── */

function AnimatedCollapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [renderChildren, setRenderChildren] = useState(open);
  const [style, setStyle] = useState<React.CSSProperties>(
    open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 },
  );
  const isInitial = useRef(true);

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }

    const el = contentRef.current;

    if (open) {
      setRenderChildren(true);
      setStyle({ height: 0, opacity: 0 });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (el) {
            setStyle({ height: el.scrollHeight, opacity: 1 });
          }
        });
      });
    } else {
      if (el) {
        setStyle({ height: el.scrollHeight, opacity: 1 });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setStyle({ height: 0, opacity: 0 });
          });
        });
      }
    }
  }, [open]);

  function handleTransitionEnd() {
    if (open) {
      setStyle({ height: "auto", opacity: 1 });
    } else {
      setRenderChildren(false);
    }
  }

  return (
    <div
      ref={contentRef}
      className="overflow-hidden transition-[height,opacity] duration-300 ease-in-out"
      style={style}
      onTransitionEnd={handleTransitionEnd}
    >
      {renderChildren && children}
    </div>
  );
}

/* ── ManualRow ───────────────────────────────────────────────────────── */

function ManualRow({
  title,
  href,
  passed,
  score,
  total,
}: {
  title: string;
  href: string;
  passed: boolean;
  score?: number;
  total?: number;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[10px] bg-[#2a2a2a] py-3 pl-4 pr-3 transition-colors duration-150 hover:bg-[#333333] sm:flex-row sm:items-center sm:gap-4">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <GuideIcon />
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-white" style={{ fontFamily: "'Roboto Slab', serif" }}>
            {title}
          </p>
          <p className={`text-sm ${passed ? "text-[#76e176]" : "text-white/60"}`}>
            {passed && score !== undefined && total !== undefined
              ? `Результаты теста: ${score}/${total}`
              : "Результаты теста: пока не пройден."}
          </p>
        </div>
      </div>
      {passed ? (
        <Link
          href={href}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#404040] px-4 py-3.5 text-[13px] font-black text-white transition-all duration-150 hover:bg-[#505050] hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:shrink-0"
        >
          <RepeatIcon />
          Повторить
        </Link>
      ) : (
        <Link
          href={href}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-red px-4 py-3.5 text-[13px] font-black text-white transition-all duration-150 hover:bg-[#ff3a50] hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:shrink-0"
        >
          <PlayIcon />
          Изучить
        </Link>
      )}
    </div>
  );
}

/* ── RoleCard ────────────────────────────────────────────────────────── */

type TierStatus = "locked" | "available" | "completed";

export default function RoleCard({
  tier,
  status,
  manualResults,
  defaultOpen = false,
}: {
  tier: RoleTier;
  status: TierStatus;
  manualResults: Record<string, { passed: boolean; score?: number; total?: number }>;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const isAvailable = status === "available";
  const hasContent = tier.manuals.length > 0 || tier.description;
  const isExpandable = !isLocked && hasContent;

  if (isLocked) {
    return (
      <div className="flex items-center gap-4 rounded-2xl bg-[#2a2a2a] px-5 py-5 transition-all duration-200 hover:bg-[#303030]">
        <div className="flex h-8 w-8 items-center justify-center">
          <LockIcon />
        </div>
        <p
          className="text-2xl font-bold text-white/30"
          style={{ fontFamily: "'Roboto Slab', serif" }}
        >
          {tier.title}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-2xl transition-shadow duration-300 ${
        isAvailable
          ? "bg-[#FFCA4F]"
          : "border border-[#76e176]"
      }`}
    >
      {/* Header */}
      <button
        onClick={() => isExpandable && setOpen((o) => !o)}
        className={`group flex w-full flex-col gap-3 px-5 py-5 text-left transition-colors duration-150 sm:flex-row sm:items-center sm:gap-4 ${
          isExpandable ? "cursor-pointer" : "cursor-default"
        } ${
          isAvailable ? "hover:bg-[#ffd36b]" : "hover:bg-white/[0.04]"
        } ${
          open
            ? isAvailable
              ? "border-b border-[#2a2a2a]/12"
              : "border-b border-white/12"
            : ""
        }`}
      >
        <div className="flex flex-1 items-center gap-4">
          {isExpandable && <ExpandButton open={open} />}
          <p
            className={`flex-1 text-2xl font-bold ${
              isAvailable ? "text-[#1e1e1e]" : "text-white"
            }`}
            style={{ fontFamily: "'Roboto Slab', serif" }}
          >
            {tier.title}
          </p>
        </div>
        {isAvailable ? <UnlockBadge /> : <CompletedBadge />}
      </button>

      {/* Animated expand/collapse */}
      <AnimatedCollapse open={open}>
        {/* Description */}
        {tier.description && (
          <div className="px-5 py-5">
            <p
              className={`text-base font-medium leading-relaxed ${
                isAvailable ? "text-[#1e1e1e]" : "text-white/60"
              }`}
            >
              {tier.description}
            </p>
          </div>
        )}

        {/* Manual rows */}
        {tier.manuals.length > 0 && (
          <div className="flex flex-col gap-2 px-2 pb-2">
            {tier.manuals.map((manual) => {
              const result = manualResults[manual.id] ?? { passed: false };
              return (
                <ManualRow
                  key={manual.id}
                  title={manual.title}
                  href={manual.href}
                  passed={result.passed}
                  score={result.score}
                  total={result.total}
                />
              );
            })}
          </div>
        )}
      </AnimatedCollapse>
    </div>
  );
}
