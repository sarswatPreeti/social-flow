"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Home, Plus, Search, User } from "lucide-react"

const items = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/post", icon: Plus, label: "Post" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/profile", icon: User, label: "Profile" },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] md:w-[480px] bg-neutral-900/90 border border-white/10 backdrop-blur rounded-[28px] px-3 py-2 flex items-center justify-between">
      {items.map(({ href, icon: Icon, label }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`grid place-items-center h-12 w-12 rounded-full transition-colors ${
              active ? "bg-[#1E6CFF] text-white" : "text-white/75 hover:text-white hover:bg-white/5"
            }`}
            aria-label={label}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={22} />
          </Link>
        )
      })}
    </nav>
  )
}
