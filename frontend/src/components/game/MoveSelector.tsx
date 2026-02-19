"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import type { Move } from "@/types/game";
import { MOVES } from "@/types/game";
import { useGameStore } from "@/stores/gameStore";
import MoveCard from "./MoveCard";

export default function MoveSelector() {
  const phase = useGameStore((s) => s.phase);
  const selectMove = useGameStore((s) => s.selectMove);

  const handleSelect = useCallback(
    (move: Move) => {
      if (phase !== "SELECTING") return;
      selectMove(move);
    },
    [phase, selectMove],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center justify-center gap-3 sm:gap-5"
    >
      {MOVES.map((move) => (
        <MoveCard
          key={move}
          move={move}
          onSelect={() => handleSelect(move)}
        />
      ))}
    </motion.div>
  );
}
