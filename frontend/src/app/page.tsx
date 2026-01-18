export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-arena-dark">
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
