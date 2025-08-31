"use client"

import type React from "react"

import { Home, MessageCircle, Heart, User } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Active = "home" | "chat" | "likes" | "profile"

export function BottomNav({ active = "home" }: { active?: Active }) {
  return (
    <nav className="fixed bottom-4 left-0 right-0 z-30">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="rounded-full bg-neutral-900/80 backdrop-blur border border-neutral-800 px-3 py-2 flex items-center justify-between">
          <Item href="#" icon={<Home className="h-5 w-5" />} active={active === "home"} />
          <Item href="#" icon={<MessageCircle className="h-5 w-5" />} active={active === "chat"} />
          <Item href="#" icon={<Heart className="h-5 w-5" />} active={active === "likes"} />
          <Item href="#" icon={<User className="h-5 w-5" />} active={active === "profile"} />
        </div>
      </div>
    </nav>
  )
}

function Item({
  href,
  icon,
  active,
}: {
  href: string
  icon: React.ReactNode
  active?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "h-11 w-11 rounded-full grid place-items-center text-white/80 transition",
        active ? "bg-blue-600 text-white" : "hover:bg-neutral-800",
      )}
      aria-current={active ? "page" : undefined}
    >
      {icon}
    </Link>
  )
}
