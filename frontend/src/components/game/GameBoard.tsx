"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import { getMatchWinner } from "@/lib/gameEngine";
import MoveSelector from "./MoveSelector";
import ScoreTracker from "./ScoreTracker";
import OpponentDisplay from "./OpponentDisplay";
import ClashAnimation from "./ClashAnimation";
import RoundResult from "./RoundResult";
import MatchResult from "./MatchResult";

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
  const winner = phase === "MATCH_OVER" ? getMatchWinner(scores, matchFormat) : null;

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
            {phase === "CLASHING" && playerMove && opponentMove && (
              <ClashAnimation
                key="clashing"
                playerMove={playerMove}
                opponentMove={opponentMove}
                onComplete={resolveRound}
              />
            )}
            {phase === "RESULT" && playerMove && opponentMove && roundResult && (
              <RoundResult
                key="result"
                playerMove={playerMove}
                opponentMove={opponentMove}
                result={roundResult}
                onNextRound={nextRound}
              />
            )}
            {phase === "MATCH_OVER" && winner && (
              <MatchResult
                key="match-over"
                winner={winner}
                scores={scores}
                onPlayAgain={resetMatch}
              />
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
