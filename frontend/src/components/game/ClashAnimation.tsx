"use client";

import { motion } from "framer-motion";
import type { Move } from "@/types/game";
import ArenaScene from "./arena3d/ArenaScene";

interface ClashAnimationProps {
  playerMove: Move;
  opponentMove: Move;
  onComplete: () => void;
}

export default function ClashAnimation({
  playerMove,
  opponentMove,
  onComplete,
}: ClashAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="w-full h-full absolute inset-0"
    >
      <ArenaScene
        playerMove={playerMove}
        opponentMove={opponentMove}
        onComplete={onComplete}
      />
    </motion.div>
  );
}
