"use client";

import { motion } from "framer-motion";

// ── Motion Constants ──────────────────────────────────────────
// Tune at: https://cubic-bezier.com or Framer spring playground
const OVERLAY_FADE_S = 0.3;
const CARD_SPRING = { type: "spring" as const, stiffness: 130, damping: 15 };
const LETTER_STAGGER_S = 0.055;
const LETTER_SPRING = { type: "spring" as const, stiffness: 160, damping: 14, mass: 0.8 };
const LETTER_INITIAL_Y = 24;
const LETTER_INITIAL_ROTATE_X = -90;
const SCORE_DELAY_S = 0.5;
const BUTTON_DELAY_S = 0.8;
const BUTTON_HOVER_SCALE = 1.04;

const VICTORY_GLOW = "rgba(201, 162, 39, 0.15)";
const DEFEAT_GLOW = "rgba(205, 127, 50, 0.1)";

interface MatchResultProps {
  winner: "player" | "opponent";
  scores: { player: number; opponent: number };
  onPlayAgain: () => void;
}

export default function MatchResult({
  winner,
  scores,
  onPlayAgain,
}: MatchResultProps) {
  const isVictory = winner === "player";
  const title = isVictory ? "VICTORY" : "DEFEAT";
  const titleColor = isVictory ? "text-gold-400" : "text-bronze-400";
  const glowColor = isVictory ? VICTORY_GLOW : DEFEAT_GLOW;
  const letters = title.split("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: OVERLAY_FADE_S }}
      className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm rounded-xl"
      style={{ backgroundColor: "rgba(13, 12, 10, 0.75)" }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={CARD_SPRING}
        className="flex flex-col items-center gap-6 px-12 py-10"
        style={{ boxShadow: `0 0 80px ${glowColor}` }}
      >
        <div className="flex" aria-label={title} role="heading" aria-level={2}>
          {letters.map((letter, i) => (
            <motion.span
              key={`${letter}-${i}`}
              initial={{
                opacity: 0,
                y: LETTER_INITIAL_Y,
                rotateX: LETTER_INITIAL_ROTATE_X,
              }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                delay: i * LETTER_STAGGER_S,
                ...LETTER_SPRING,
              }}
              className={`font-display text-4xl md:text-5xl tracking-[0.2em] ${titleColor}`}
              style={{ perspective: 600 }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: SCORE_DELAY_S }}
          className="font-score text-lg text-foreground/50"
        >
          {scores.player} &ndash; {scores.opponent}
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: BUTTON_DELAY_S }}
          whileHover={{ scale: BUTTON_HOVER_SCALE }}
          whileTap={{ scale: 0.97 }}
          onClick={onPlayAgain}
          className="mt-2 px-8 py-2.5 rounded-xl font-display text-sm tracking-wide bg-gold-500/10 text-gold-500 border border-gold-500/30 hover:bg-gold-500/20 transition-colors"
        >
          Play Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
