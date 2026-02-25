"use client";

import { motion } from "framer-motion";
import type { MatchFormat } from "@/types/game";
import { WINS_NEEDED } from "@/types/game";

interface ScoreTrackerProps {
  playerWins: number;
  opponentWins: number;
  format: MatchFormat;
}

function Pip({
  filled,
  color,
}: {
  filled: boolean;
  color: "gold" | "bronze";
}) {
  const filledBg =
    color === "gold" ? "rgb(201, 162, 39)" : "rgb(205, 127, 50)";
  const emptyBg =
    color === "gold"
      ? "rgba(201, 162, 39, 0.15)"
      : "rgba(205, 127, 50, 0.15)";
  return (
    <motion.div
      initial={false}
      animate={{
        scale: filled ? [1, 1.4, 1] : 1,
        backgroundColor: filled ? filledBg : emptyBg,
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-2.5 h-2.5 rounded-full"
    />
  );
}

export default function ScoreTracker({
  playerWins,
  opponentWins,
  format,
}: ScoreTrackerProps) {
  const winsNeeded = WINS_NEEDED[format];
  return (
    <div className="flex items-center justify-center gap-5">
      <div className="flex items-center gap-2">
        <span className="font-body text-xs text-foreground/40">You</span>
        <div className="flex gap-1.5">
          {Array.from({ length: winsNeeded }).map((_, i) => (
            <Pip key={`p-${i}`} filled={i < playerWins} color="gold" />
          ))}
        </div>
      </div>
      <span className="font-score text-foreground/25 text-xs">vs</span>
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          {Array.from({ length: winsNeeded }).map((_, i) => (
            <Pip key={`o-${i}`} filled={i < opponentWins} color="bronze" />
          ))}
        </div>
        <span className="font-body text-xs text-foreground/40">Bot</span>
      </div>
    </div>
  );
}
