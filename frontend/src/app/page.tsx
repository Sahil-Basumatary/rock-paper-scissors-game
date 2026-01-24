import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-arena-dark relative">
      <nav className="absolute top-6 right-6 flex items-center gap-4">
        <SignedOut>
          <Link
            href="/sign-in"
            className="font-body text-gold-500 hover:text-gold-400 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="font-body px-4 py-2 border border-gold-500/50 rounded-lg text-gold-500 hover:bg-gold-500/10 transition-colors"
          >
            Sign Up
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </SignedIn>
      </nav>
      <h1 className="font-display text-5xl md:text-7xl text-gold-500 tracking-wide">
        RPS Arena
      </h1>
      <p className="font-body text-lg md:text-xl text-foreground/70 mt-4">
        The ultimate competitive platform
      </p>
      <div className="mt-8 px-6 py-3 border border-gold-500/30 rounded-lg bg-arena-card">
        <span className="font-body text-bronze-400">Coming Soon</span>
      </div>
    </main>
  );
}
