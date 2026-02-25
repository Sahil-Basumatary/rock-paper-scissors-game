"use client";

import { Bot } from "lucide-react";

interface OpponentDisplayProps {
  name: string;
  type: "AI" | "PLAYER";
}

export default function OpponentDisplay({ name, type }: OpponentDisplayProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-bronze-400/10 flex items-center justify-center">
        {type === "AI" ? (
          <Bot className="w-5 h-5 text-bronze-400" />
        ) : (
          <div className="w-5 h-5 rounded-full bg-bronze-400/30" />
        )}
      </div>
      <div>
        <p className="font-display text-sm text-foreground/80 tracking-wide">
          {name}
        </p>
        <p className="font-body text-xs text-foreground/40">
          {type === "AI" ? "AI Opponent" : "Human Opponent"}
        </p>
      </div>
    </div>
  );
}
