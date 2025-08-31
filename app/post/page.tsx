import CreatePost from "@/components/feed/create-post"
import BottomNav from "@/components/nav/bottom-nav"

export default function NewPostPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-xl px-4 pb-32">
        <header className="py-4">
          <h1 className="text-lg font-semibold">Create</h1>
        </header>
        <CreatePost />
      </div>
      <BottomNav />
    </main>
  )
}
