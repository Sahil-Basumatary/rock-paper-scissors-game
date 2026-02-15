import ArenaNav from "@/components/ui/ArenaNav";

export default function ArenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-arena-dark">
      <ArenaNav />
      {children}
    </div>
  );
}
