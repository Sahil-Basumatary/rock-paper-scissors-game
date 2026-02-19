"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Swords, ArrowLeft } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import type { MatchFormat } from "@/types/game";
import MoveSelector from "@/components/game/MoveSelector";

const FORMATS: MatchFormat[] = ["BO1", "BO3", "BO5"];

export default function ArenaPage() {
  const { phase, matchFormat, currentRound, scores, startMatch, resetMatch } =
    useGameStore();
  const [selectedFormat, setSelectedFormat] = useState<MatchFormat>("BO3");

  if (phase !== "IDLE") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="font-score text-foreground/60 text-sm tracking-wide">
              <span className="text-gold-400">{matchFormat}</span>
              <span className="mx-2">·</span>
              <span>Round {currentRound}</span>
            </div>
            <div className="font-score text-xl tracking-wide">
              <span className="text-gold-400">{scores.player}</span>
              <span className="text-foreground/40 mx-2">-</span>
              <span className="text-bronze-400">{scores.opponent}</span>
            </div>
          </div>
          <div className="w-full min-h-[20rem] rounded-xl border border-arena-border bg-arena-card flex items-center justify-center py-8">
            {phase === "SELECTING" ? (
              <MoveSelector />
            ) : (
              <p className="font-body text-foreground/40">
                {phase === "CLASHING" ? "Clash!" : phase}
              </p>
            )}
          </div>
          <button
            onClick={resetMatch}
            className="mt-6 flex items-center gap-2 font-body text-sm text-foreground/50 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lobby
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-1 flex flex-col items-center justify-center px-4"
    >
      <h2 className="font-display text-3xl md:text-4xl text-gold-500 tracking-wide mb-10">
        Choose Your Battle
      </h2>
      <div className="w-full max-w-sm">
        <button
          className="w-full group rounded-xl border border-arena-border bg-arena-card p-6 text-left transition-all hover:border-gold-500/40 hover:shadow-[0_0_24px_rgba(201,162,39,0.08)]"
          onClick={() => startMatch(selectedFormat)}
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-11 h-11 rounded-lg bg-gold-500/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-gold-500" />
            </div>
            <div>
              <h3 className="font-display text-lg text-foreground tracking-wide">
                AI Practice
              </h3>
              <p className="font-body text-sm text-foreground/50">
                Sharpen your strategy against the machine
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4">
            <Swords className="w-3.5 h-3.5 text-foreground/30" />
            <span className="font-body text-xs text-foreground/30">
              AI_BATTLE · Instant match
            </span>
          </div>
        </button>
        <div className="mt-8">
          <p className="font-body text-sm text-foreground/50 mb-3 text-center">
            Match Format
          </p>
          <div className="flex items-center justify-center gap-2">
            {FORMATS.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-4 py-2 rounded-lg font-score text-sm tracking-wide transition-all ${
                  selectedFormat === fmt
                    ? "bg-gold-500/15 text-gold-400 border border-gold-500/40"
                    : "bg-arena-card text-foreground/50 border border-arena-border hover:border-foreground/20"
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => startMatch(selectedFormat)}
          className="mt-8 w-full py-3 rounded-xl font-display text-lg tracking-wide bg-gold-500/10 text-gold-500 border border-gold-500/30 hover:bg-gold-500/20 hover:border-gold-500/50 transition-colors"
        >
          Enter Arena
        </motion.button>
      </div>
    </motion.div>
  );
}
