"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import { getMatchWinner } from "@/lib/gameEngine";
import MoveSelector from "./MoveSelector";
import ScoreTracker from "./ScoreTracker";
import OpponentDisplay from "./OpponentDisplay";
import { MOVE_CONFIG } from "./MoveIcons";

const CLASH_DURATION_MS = 800;

export default function GameBoard() {
  const phase = useGameStore((s) => s.phase);
  const matchFormat = useGameStore((s) => s.matchFormat);
  const currentRound = useGameStore((s) => s.currentRound);
  const scores = useGameStore((s) => s.scores);
  const playerMove = useGameStore((s) => s.playerMove);
  const opponentMove = useGameStore((s) => s.opponentMove);
  const roundResult = useGameStore((s) => s.roundResult);
  const resolveRound = useGameStore((s) => s.resolveRound);
  const nextRound = useGameStore((s) => s.nextRound);
  const resetMatch = useGameStore((s) => s.resetMatch);

  useEffect(() => {
    if (phase !== "CLASHING") return;
    const timer = setTimeout(resolveRound, CLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [phase, resolveRound]);

  const playerConfig = playerMove ? MOVE_CONFIG[playerMove] : null;
  const opponentConfig = opponentMove ? MOVE_CONFIG[opponentMove] : null;
  const winner =
    phase === "MATCH_OVER" ? getMatchWinner(scores, matchFormat) : null;
  const resultText =
    roundResult === "DRAW"
      ? "Draw!"
      : roundResult === "PLAYER_ONE_WIN"
        ? "You Win!"
        : "You Lose!";
  const resultColor =
    roundResult === "DRAW"
      ? "text-foreground/60"
      : roundResult === "PLAYER_ONE_WIN"
        ? "text-gold-400"
        : "text-bronze-400";

  return (
    <div className="flex-1 flex flex-col px-4 py-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <OpponentDisplay name="Rookie Bot" type="AI" />
        <div className="text-right">
          <p className="font-score text-sm text-foreground/40 tracking-wide">
            <span className="text-gold-400">{matchFormat}</span>
            <span className="mx-1.5">·</span>
            Round {currentRound}
          </p>
          <p className="font-score text-2xl tracking-wide mt-0.5">
            <span className="text-gold-400">{scores.player}</span>
            <span className="text-foreground/25 mx-2">&ndash;</span>
            <span className="text-bronze-400">{scores.opponent}</span>
          </p>
        </div>
      </div>
      <div className="mt-4">
        <ScoreTracker
          playerWins={scores.player}
          opponentWins={scores.opponent}
          format={matchFormat}
        />
      </div>
      <div className="flex-1 flex items-center justify-center my-6">
        <div className="w-full min-h-[16rem] rounded-xl border border-arena-border bg-arena-card flex items-center justify-center py-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {phase === "SELECTING" && (
              <motion.div
                key="selecting"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <MoveSelector />
              </motion.div>
            )}
            {phase === "CLASHING" && playerConfig && opponentConfig && (
              <motion.div
                key="clashing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-10"
              >
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", damping: 14 }}
                  className="flex flex-col items-center gap-2"
                >
                  <playerConfig.Icon size={52} className="text-gold-400" />
                  <span className="font-body text-xs text-foreground/40">
                    {playerConfig.label}
                  </span>
                </motion.div>
                <motion.span
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15, type: "spring", damping: 10 }}
                  className="font-display text-2xl text-foreground/20"
                >
                  &#9876;
                </motion.span>
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", damping: 14 }}
                  className="flex flex-col items-center gap-2"
                >
                  <opponentConfig.Icon
                    size={52}
                    className="text-bronze-400"
                  />
                  <span className="font-body text-xs text-foreground/40">
                    {opponentConfig.label}
                  </span>
                </motion.div>
              </motion.div>
            )}
            {phase === "RESULT" && playerConfig && opponentConfig && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-5"
              >
                <div className="flex items-center gap-10">
                  <div className="flex flex-col items-center gap-2">
                    <playerConfig.Icon
                      size={52}
                      className={
                        roundResult === "PLAYER_ONE_WIN"
                          ? "text-gold-400"
                          : "text-foreground/25"
                      }
                    />
                    <span className="font-body text-xs text-foreground/40">
                      {playerConfig.label}
                    </span>
                  </div>
                  <span className="font-display text-lg text-foreground/15">
                    vs
                  </span>
                  <div className="flex flex-col items-center gap-2">
                    <opponentConfig.Icon
                      size={52}
                      className={
                        roundResult === "PLAYER_TWO_WIN"
                          ? "text-bronze-400"
                          : "text-foreground/25"
                      }
                    />
                    <span className="font-body text-xs text-foreground/40">
                      {opponentConfig.label}
                    </span>
                  </div>
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className={`font-display text-xl tracking-wide ${resultColor}`}
                >
                  {resultText}
                </motion.p>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  onClick={nextRound}
                  className="px-6 py-2 rounded-lg font-body text-sm text-foreground/60 border border-arena-border hover:border-gold-500/40 hover:text-gold-400 transition-colors"
                >
                  Next Round
                </motion.button>
              </motion.div>
            )}
            {phase === "MATCH_OVER" && (
              <motion.div
                key="match-over"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`font-display text-3xl tracking-widest ${
                    winner === "player" ? "text-gold-400" : "text-bronze-400"
                  }`}
                >
                  {winner === "player" ? "VICTORY" : "DEFEAT"}
                </motion.p>
                <p className="font-score text-lg text-foreground/50">
                  {scores.player} &ndash; {scores.opponent}
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={resetMatch}
                  className="mt-2 px-8 py-2.5 rounded-xl font-display text-sm tracking-wide bg-gold-500/10 text-gold-500 border border-gold-500/30 hover:bg-gold-500/20 transition-colors"
                >
                  Play Again
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <button
        onClick={resetMatch}
        className="self-start flex items-center gap-2 font-body text-sm text-foreground/40 hover:text-gold-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Lobby
      </button>
    </div>
  );
}
