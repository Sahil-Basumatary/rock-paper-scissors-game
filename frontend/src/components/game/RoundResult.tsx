"use client";

import { motion } from "framer-motion";
import type { Move, RoundResult as RoundResultType } from "@/types/game";
import { MOVE_CONFIG } from "./MoveIcons";

// ── Motion Constants ──────────────────────────────────────────
// Tune at: https://cubic-bezier.com or Framer spring playground
const ENTER_SPRING = { type: "spring" as const, stiffness: 200, damping: 18 };
const WINNER_SCALE = 1.15;
const LOSER_OPACITY = 0.2;
const ICON_SIZE = 56;
const DRAW_PULSE_DURATION_S = 0.55;
const TEXT_DELAY_S = 0.18;
const TEXT_SPRING = { type: "spring" as const, stiffness: 180, damping: 14 };
const BUTTON_DELAY_S = 0.42;

const RESULT_LABEL: Record<RoundResultType, string> = {
  PLAYER_ONE_WIN: "You Win!",
  PLAYER_TWO_WIN: "You Lose!",
  DRAW: "Draw!",
};

const RESULT_COLOR: Record<RoundResultType, string> = {
  PLAYER_ONE_WIN: "text-gold-400",
  PLAYER_TWO_WIN: "text-bronze-400",
  DRAW: "text-foreground/60",
};

interface RoundResultProps {
  playerMove: Move;
  opponentMove: Move;
  result: RoundResultType;
  onNextRound: () => void;
}

export default function RoundResult({
  playerMove,
  opponentMove,
  result,
  onNextRound,
}: RoundResultProps) {
  const player = MOVE_CONFIG[playerMove];
  const opponent = MOVE_CONFIG[opponentMove];
  const isDraw = result === "DRAW";
  const playerWon = result === "PLAYER_ONE_WIN";
  const opponentWon = result === "PLAYER_TWO_WIN";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={ENTER_SPRING}
      className="flex flex-col items-center gap-5"
    >
      <div className="flex items-center gap-10">
        <motion.div
          animate={{
            scale: playerWon ? WINNER_SCALE : 1,
            opacity: opponentWon ? LOSER_OPACITY : 1,
          }}
          transition={ENTER_SPRING}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            animate={isDraw ? { opacity: [1, 0.4, 1] } : {}}
            transition={isDraw ? { duration: DRAW_PULSE_DURATION_S, repeat: 1 } : {}}
          >
            <player.Icon
              size={ICON_SIZE}
              className={
                playerWon
                  ? "text-gold-400 drop-shadow-[0_0_8px_rgba(201,162,39,0.5)]"
                  : isDraw
                    ? "text-foreground/50"
                    : "text-foreground/25"
              }
            />
          </motion.div>
          <span className="font-body text-xs text-foreground/40">
            {player.label}
          </span>
        </motion.div>
        <span className="font-display text-lg text-foreground/15">vs</span>
        <motion.div
          animate={{
            scale: opponentWon ? WINNER_SCALE : 1,
            opacity: playerWon ? LOSER_OPACITY : 1,
          }}
          transition={ENTER_SPRING}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            animate={isDraw ? { opacity: [1, 0.4, 1] } : {}}
            transition={isDraw ? { duration: DRAW_PULSE_DURATION_S, repeat: 1 } : {}}
          >
            <opponent.Icon
              size={ICON_SIZE}
              className={
                opponentWon
                  ? "text-bronze-400 drop-shadow-[0_0_8px_rgba(205,127,50,0.5)]"
                  : isDraw
                    ? "text-foreground/50"
                    : "text-foreground/25"
              }
            />
          </motion.div>
          <span className="font-body text-xs text-foreground/40">
            {opponent.label}
          </span>
        </motion.div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: TEXT_DELAY_S, ...TEXT_SPRING }}
        className={`font-display text-xl tracking-wide ${RESULT_COLOR[result]}`}
      >
        {RESULT_LABEL[result]}
      </motion.p>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: BUTTON_DELAY_S }}
        onClick={onNextRound}
        className="px-6 py-2 rounded-lg font-body text-sm text-foreground/60 border border-arena-border hover:border-gold-500/40 hover:text-gold-400 transition-colors"
      >
        Next Round
      </motion.button>
    </motion.div>
  );
}
