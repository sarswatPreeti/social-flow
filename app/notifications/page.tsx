import BottomNav from "@/components/nav/bottom-nav"

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-xl px-4 pb-32">
        <header className="py-4">
          <h1 className="text-lg font-semibold">Notifications</h1>
        </header>
        <div className="rounded-[28px] border border-white/10 bg-neutral-900 px-4 py-6 text-white/70">Nothing yet.</div>
      </div>
      <BottomNav />
    </main>
  )
}
