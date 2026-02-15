"use client";

import { UserButton } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ArenaNav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-arena-darker border-b border-arena-border">
      <Link
        href="/"
        className="flex items-center gap-2 text-foreground/70 hover:text-gold-400 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-body text-sm hidden sm:inline">Back</span>
      </Link>
      <h1 className="font-display text-xl text-gold-500 tracking-wide">
        RPS Arena
      </h1>
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-9 h-9",
          },
        }}
      />
    </nav>
  );
}
