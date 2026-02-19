"use client";

import { motion } from "framer-motion";
import type { Move } from "@/types/game";
import { MOVE_CONFIG } from "./MoveIcons";

interface MoveCardProps {
  move: Move;
  onSelect: () => void;
}

export default function MoveCard({ move, onSelect }: MoveCardProps) {
  const { label, description, Icon, Gesture } = MOVE_CONFIG[move];

  return (
    <motion.button
      onClick={onSelect}
      aria-label={`Select ${label}`}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.08, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex flex-col items-center justify-center w-28 h-40 sm:w-36 sm:h-48 rounded-xl border bg-arena-card border-arena-border hover:border-gold-500/40 hover:shadow-[0_0_20px_rgba(201,162,39,0.08)] cursor-pointer transition-colors duration-300"
    >
      <Icon
        size={40}
        className="text-foreground/60 group-hover:text-gold-400 transition-colors duration-300"
      />
      <div className="h-5 flex items-center justify-center mt-1">
        <Gesture
          size={16}
          className="opacity-0 group-hover:opacity-100 text-foreground/30 transition-opacity duration-300"
        />
      </div>
      <span className="font-display text-sm sm:text-base tracking-wide text-foreground/50 group-hover:text-foreground/80">
        {label}
      </span>
      <span className="mt-0.5 font-body text-[11px] text-transparent group-hover:text-foreground/30 transition-colors duration-300">
        {description}
      </span>
    </motion.button>
  );
}
